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
import { useUpdateOrganization } from "../hooks/useUpdateOrganization";
import { useEffect, useState } from "react";
import { useOrgStore } from "@/stores/orgStore";
import { sanitizeSlugInput } from "@/lib/utils";

type EditOrgValues = z.infer<typeof editOrgSchema>;

const editOrgSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  slug: z.string().min(2, "Slug must be at least 2 characters."),
});

interface EditOrganizationFormProps {
  slug: string;
  name: string;
  onClose: () => void;
}

const EditOrganizationForm = ({
  slug,
  name,
  onClose,
}: EditOrganizationFormProps) => {
  const [isEditingSlug, setIsEditingSlug] = useState(false);
  const setActiveOrgSlug = useOrgStore((s) => s.setActiveOrgSlug);
  const activeOrgSlug = useOrgStore((s) => s.activeOrgSlug);
  const {
    mutate: editOrganization,
    isPending,
    error,
  } = useUpdateOrganization(slug);

  const form = useForm<EditOrgValues>({
    resolver: zodResolver(editOrgSchema),
    defaultValues: { name, slug },
  });

  useEffect(() => {
    form.reset({ name });
  }, [name, form]);

  const slugValue = form.watch("slug");

  function onSubmit(data: EditOrgValues) {
    const payload: { name?: string; slug?: string } = {};

    if (form.formState.dirtyFields.name) payload.name = data.name;
    if (isEditingSlug && form.formState.dirtyFields.slug)
      payload.slug = data.slug;

    editOrganization(data, {
      onSuccess: (updated) => {
        if (activeOrgSlug === slug && updated.slug !== slug) {
          setActiveOrgSlug(updated.slug);
        }
        onClose();
        setIsEditingSlug(false);
        toast.add({
          type: "success",
          title: "Organization updated",
        });
      },
      onError: (err: ApiError) => {
        if (err.code === ERROR_CODES.VALIDATION && err.details) {
          Object.entries(err.details).forEach(([field, messages]) =>
            form.setError(field as keyof EditOrgValues, {
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
              <FieldLabel htmlFor="org-name" className="font-semibold">
                Name
              </FieldLabel>
              <Input
                {...field}
                id="org-name"
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
                <FieldLabel htmlFor="org-slug" className="font-semibold">
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
                <div className="flex items-center gap-1 text-sm">
                  <span className="text-muted-foreground">/organizations/</span>
                  <Input
                    {...field}
                    id="org-slug"
                    aria-invalid={fieldState.invalid}
                    onChange={(e) =>
                      form.setValue("slug", sanitizeSlugInput(e.target.value), {
                        shouldDirty: true,
                      })
                    }
                    className="h-8"
                  />
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  /organizations/{slugValue}
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

export default EditOrganizationForm;
