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
import { useCreateProject } from "../hooks/useCreateProject";
import { Textarea } from "@/components/ui/textarea";

type CreateProjectValues = z.infer<typeof createProjectSchema>;

const createProjectSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  description: z
    .string()
    .max(500, "Description must not exceed 500 chracters.")
    .optional(),
});

interface CreateProjectFormProps {
  orgSlug: string;
  workspaceSlug: string;
  onClose: () => void;
}

const CreateProjectForm = ({
  orgSlug,
  workspaceSlug,
  onClose,
}: CreateProjectFormProps) => {
  const {
    mutate: createProject,
    isPending,
    error,
  } = useCreateProject(orgSlug, workspaceSlug);

  const form = useForm<CreateProjectValues>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  function onSubmit(data: CreateProjectValues) {
    createProject(data, {
      onSuccess: () => {
        form.reset();
        onClose();
        toast.add({
          type: "success",
          title: "Project created",
        });
      },
      onError: (err: ApiError) => {
        if (err.code === ERROR_CODES.VALIDATION && err.details) {
          Object.entries(err.details).forEach(([field, messages]) =>
            form.setError(field as keyof CreateProjectValues, {
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
                className="min-h-25"
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

        <div className="flex gap-2 justify-end">
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
              "Create project"
            )}
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
};

export default CreateProjectForm;
