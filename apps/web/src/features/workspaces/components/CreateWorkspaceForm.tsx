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
import { useCreateWorkspace } from "../hooks/useCreateWorkspace";

type CreateWorkspaceValues = z.infer<typeof createWorkspaceSchema>;

const createWorkspaceSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
});

interface CreateWorkspaceFormProps {
  orgSlug: string;
  onClose: () => void;
}

const CreateWorkspaceForm = ({
  orgSlug,
  onClose,
}: CreateWorkspaceFormProps) => {
  const {
    mutate: createWorkspace,
    isPending,
    error,
  } = useCreateWorkspace(orgSlug);

  const form = useForm<CreateWorkspaceValues>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: {
      name: "",
    },
  });

  function onSubmit(data: CreateWorkspaceValues) {
    createWorkspace(data, {
      onSuccess: () => {
        form.reset();
        onClose();
        toast.add({
          type: "success",
          title: "Workspace created",
        });
      },
      onError: (err: ApiError) => {
        if (err.code === ERROR_CODES.VALIDATION && err.details) {
          Object.entries(err.details).forEach(([field, messages]) =>
            form.setError(field as keyof CreateWorkspaceValues, {
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
                placeholder="Growth"
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

        <div className="flex items-center justify-between">
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
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...
              </>
            ) : (
              "Create workspace"
            )}
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
};

export default CreateWorkspaceForm;
