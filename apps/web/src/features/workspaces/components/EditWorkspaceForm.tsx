import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { ApiError } from "@/lib/api/client";
import { ERROR_CODES } from "@/lib/api/constatnts";
import { toast } from "@/components/ui/toast";
import { Loader2, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { sanitizeSlugInput } from "@/lib/utils";
import { useUpdateWorkspace } from "../hooks/useUpdateWorkspace";
import { useWorkspaceStore } from "@/stores/workspaceStore";
import { useParams } from "react-router-dom";

type EditWorkspaceValues = z.infer<typeof editWorkspaceSchema>;

const editWorkspaceSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters.").optional(),
  slug: z.string().min(2, "Slug must be at least 2 characters.").optional(),
});

interface EditWorkspaceFormProps {
  name: string;
  workspaceSlug: string;
  onClose: () => void;
}

const EditWorkspaceForm = ({
  workspaceSlug,
  name,
  onClose,
}: EditWorkspaceFormProps) => {
  const [isEditingSlug, setIsEditingSlug] = useState(false);
  const { orgSlug } = useParams<{ orgSlug: string }>();
  const setActiveWorkspaceSlug = useWorkspaceStore(
    (s) => s.setActiveWorkspaceSlug,
  );
  const activeWorkspaceSlug = useWorkspaceStore((s) => s.activeWorkspaceSlug);
  const {
    mutate: editWorkspace,
    isPending,
    error,
  } = useUpdateWorkspace(orgSlug!, workspaceSlug);

  const form = useForm<EditWorkspaceValues>({
    resolver: zodResolver(editWorkspaceSchema),
    defaultValues: { name, slug: workspaceSlug },
  });

  useEffect(() => {
    form.reset({ name });
  }, [name, form]);

  const slugValue = form.watch("slug");

  function onSubmit(data: EditWorkspaceValues) {
    console.log("SUBMIT FIRED:", data);
    const payload: { name?: string; slug?: string } = {};

    if (form.formState.dirtyFields.name) payload.name = data.name;
    if (isEditingSlug && form.formState.dirtyFields.slug)
      payload.slug = data.slug;

    editWorkspace(data, {
      onSuccess: (updated) => {
        if (
          activeWorkspaceSlug === workspaceSlug &&
          updated.slug !== workspaceSlug
        ) {
          setActiveWorkspaceSlug(updated.slug);
        }
        onClose();
        setIsEditingSlug(false);
        toast.add({
          type: "success",
          title: "Workspace updated",
        });
      },
      onError: (err: ApiError) => {
        if (err.code === ERROR_CODES.VALIDATION && err.details) {
          Object.entries(err.details).forEach(([field, messages]) =>
            form.setError(field as keyof EditWorkspaceValues, {
              message: messages[0],
            }),
          );
        }
      },
    });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="workspace-name" className="font-semibold">
                Name
              </FieldLabel>
              <Input
                {...field}
                id="workspace-name"
                aria-invalid={fieldState.invalid}
                placeholder="Vanguard HQ"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="slug"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <div className="flex items-center justify-between">
                <FieldLabel htmlFor="workspace-slug" className="font-semibold">
                  URL
                </FieldLabel>
                {!isEditingSlug && (
                  <button
                    type="button"
                    onClick={() => setIsEditingSlug(true)}
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                  >
                    <Pencil className="h-3 w-3" />
                    Edit
                  </button>
                )}
              </div>

              {isEditingSlug ? (
                <>
                  <div className="flex items-center gap-1 text-sm">
                    <span className="text-muted-foreground">/workspaces/</span>
                    <Input
                      {...field}
                      id="workspace-slug"
                      aria-invalid={fieldState.invalid}
                      onChange={(e) =>
                        form.setValue(
                          "slug",
                          sanitizeSlugInput(e.target.value),
                          { shouldDirty: true },
                        )
                      }
                      className="h-8"
                    />
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  /workspaces/{slugValue}
                </p>
              )}

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {error && error.code !== ERROR_CODES.VALIDATION && (
          <div className="rounded-lg bg-destructive/10 p-3 text-sm font-medium text-destructive">
            {error.message || "An unexpected error occurred."}
          </div>
        )}

        <div className="flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
              </>
            ) : (
              "Save changes"
            )}
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
};

export default EditWorkspaceForm;
