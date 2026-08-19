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
import { useParams } from "react-router-dom";
import { useUpdateProject } from "../hooks/useUpdateProject";
import { Textarea } from "@/components/ui/textarea";

type EditProjectValues = z.infer<typeof editProjectSchema>;

const editProjectSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters.").optional(),
  slug: z.string().min(2, "Slug must be at least 2 characters.").optional(),
  description: z
    .string()
    .max(500, "Description cannot exceed 500 characters")
    .optional(),
});

interface EditProjectFormProps {
  name: string;
  description: string;
  projectSlug: string;
  onClose: () => void;
}

const EditProjectForm = ({
  name,
  description,
  projectSlug,
  onClose,
}: EditProjectFormProps) => {
  const [isEditingSlug, setIsEditingSlug] = useState(false);
  const { orgSlug, workspaceSlug } = useParams<{
    orgSlug: string;
    workspaceSlug: string;
  }>();
  const {
    mutate: editProject,
    isPending,
    error,
  } = useUpdateProject(orgSlug!, workspaceSlug!, projectSlug);

  const form = useForm<EditProjectValues>({
    resolver: zodResolver(editProjectSchema),
    defaultValues: { name, slug: projectSlug, description },
  });

  useEffect(() => {
    form.reset({ name, description });
  }, [name, description, form]);

  const slugValue = form.watch("slug");

  function onSubmit(data: EditProjectValues) {
    const payload: { name?: string; slug?: string } = {};

    if (form.formState.dirtyFields.name) payload.name = data.name;
    if (isEditingSlug && form.formState.dirtyFields.slug)
      payload.slug = data.slug;

    editProject(data, {
      onSuccess: () => {
        onClose();
        setIsEditingSlug(false);
        toast.add({
          type: "success",
          title: "Project updated",
        });
      },
      onError: (err: ApiError) => {
        if (err.code === ERROR_CODES.VALIDATION && err.details) {
          Object.entries(err.details).forEach(([field, messages]) =>
            form.setError(field as keyof EditProjectValues, {
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
              <FieldLabel htmlFor="project-name" className="font-semibold">
                Name
              </FieldLabel>
              <Input
                {...field}
                id="project-name"
                aria-invalid={fieldState.invalid}
                placeholder="Payments Platform"
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
                <FieldLabel htmlFor="project-slug" className="font-semibold">
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
                    <span className="text-muted-foreground">/projects/</span>
                    <Input
                      {...field}
                      id="project-slug"
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
                  /projects/{slugValue}
                </p>
              )}

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="description"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                htmlFor="project-description"
                className="font-semibold"
              >
                Description
              </FieldLabel>
              <Textarea
                {...field}
                id="project-description"
                aria-invalid={fieldState.invalid}
                placeholder="What is this project about?"
              />
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

export default EditProjectForm;
