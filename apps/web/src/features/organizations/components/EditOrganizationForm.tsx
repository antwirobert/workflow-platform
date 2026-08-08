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
import { Loader2 } from "lucide-react";
import { useUpdateOrganization } from "../hooks/useUpdateOrganization";
import { useEffect } from "react";

type EditOrgValues = z.infer<typeof editOrgSchema>;

const editOrgSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
});

interface EditOrganizationFormProps {
  id: string;
  name: string;
  onClose: () => void;
}

const EditOrganizationForm = ({
  id,
  name,
  onClose,
}: EditOrganizationFormProps) => {
  const {
    mutate: editOrganization,
    isPending,
    error,
  } = useUpdateOrganization(id);

  const form = useForm<EditOrgValues>({
    resolver: zodResolver(editOrgSchema),
    defaultValues: { name },
  });

  useEffect(() => {
    form.reset({ name });
  }, [name, form]);

  function onSubmit(data: EditOrgValues) {
    editOrganization(data, {
      onSuccess: () => {
        onClose();
        toast.add({
          type: "success",
          description: "Organization updated",
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
                Organization name
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
