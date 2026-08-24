import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Textarea } from "@/components/ui/textarea";
import {
  DEFAULT_PAGE,
  PRIORITY,
  SELECT_ITEMS_LIMIT,
  TASK_STATUSES,
} from "@/constants";
import { useCreateTask } from "../hooks/useCreateTask";
import { Select } from "@/components/ui/select";
import { useOrganizationMembers } from "@/features/organizations/hooks/useOrganizationMembers";
import DatePicker from "./DatePicker";
import { TASK_PRIORITY_OPTIONS, TASK_STATUS_OPTIONS } from "../constants";

const createTaskSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters."),
  description: z
    .string()
    .max(1000, "Description cannot exceed 1000 chracters.")
    .optional(),
  status: z.enum(TASK_STATUSES).default("TODO"),
  priority: z.enum(PRIORITY).default("MEDIUM"),
  assigneeId: z
    .string()
    .uuid("Invalid assigneeId format")
    .or(z.literal(""))
    .transform((val) => (val === "" ? undefined : val))
    .optional(),
  dueDate: z.coerce.date().optional(),
});

type CreateTaskFormInput = z.input<typeof createTaskSchema>;
type CreateTaskValues = z.output<typeof createTaskSchema>;

interface CreateTaskFormProps {
  orgSlug: string;
  workspaceSlug: string;
  projectSlug: string;
  onClose: () => void;
}

const CreateTaskForm = ({
  orgSlug,
  workspaceSlug,
  projectSlug,
  onClose,
}: CreateTaskFormProps) => {
  const {
    mutate: createTask,
    isPending,
    error,
  } = useCreateTask(orgSlug, workspaceSlug, projectSlug);

  const {
    data: members,
    isLoading,
    isError,
  } = useOrganizationMembers(orgSlug ?? null, {
    page: DEFAULT_PAGE,
    limit: SELECT_ITEMS_LIMIT,
  });

  const form = useForm<CreateTaskFormInput, unknown, CreateTaskValues>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "TODO",
      priority: "MEDIUM",
      assigneeId: "",
      dueDate: undefined,
    },
  });

  function onSubmit(data: CreateTaskValues) {
    createTask(data, {
      onSuccess: () => {
        form.reset({
          title: "",
          description: "",
          status: "TODO",
          priority: "MEDIUM",
          assigneeId: "",
          dueDate: undefined,
        });
        onClose();
        toast.add({
          type: "success",
          title: "Task created",
        });
      },
      onError: (err: ApiError) => {
        if (err.code === ERROR_CODES.VALIDATION && err.details) {
          Object.entries(err.details).forEach(([field, messages]) =>
            form.setError(field as keyof CreateTaskValues, {
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
          name="title"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="task-title" className="font-semibold">
                Title
              </FieldLabel>
              <Input
                {...field}
                id="task-title"
                aria-invalid={fieldState.invalid}
                placeholder="Add rate limiting to /invitations"
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
              <FieldLabel htmlFor="task-description" className="font-semibold">
                Description
              </FieldLabel>
              <Textarea
                {...field}
                id="task-description"
                aria-invalid={fieldState.invalid}
                placeholder="What needs to happen? Add context, links, and acceptance criteria"
                className="min-h-25"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <div className="flex justify-between gap-2">
          <Controller
            name="status"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="task-status" className="font-semibold">
                  Status
                </FieldLabel>
                <Select
                  id="task-status"
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className="w-full max-w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {TASK_STATUS_OPTIONS.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="priority"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="task-priority" className="font-semibold">
                  Priority
                </FieldLabel>
                <Select
                  id="task-priority"
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className="w-full max-w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {TASK_PRIORITY_OPTIONS.map((priority) => (
                        <SelectItem key={priority.value} value={priority.value}>
                          {priority.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>

        <div className="flex justify-between gap-2">
          <Controller
            name="assigneeId"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="task-assignee" className="font-semibold">
                  Assignee
                </FieldLabel>
                <Select
                  id="task-assignee"
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isLoading || isError}
                >
                  <SelectTrigger className="w-full max-w-48">
                    <SelectValue>
                      {field.value
                        ? members?.data.find((m) => m.user.id === field.value)
                            ?.user.name
                        : "Select a member"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {isLoading && (
                        <div className="p-2 text-sm text-muted-foreground">
                          Loading members...
                        </div>
                      )}

                      {isError && (
                        <div className="p-2 text-sm text-destructive">
                          Error loading members
                        </div>
                      )}

                      {!isError &&
                        (members?.data.length ?? 0) > 0 &&
                        members?.data.map((member) => (
                          <SelectItem
                            key={member.user.id}
                            value={member.user.id}
                          >
                            {member.user.name}
                          </SelectItem>
                        ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="dueDate"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="due-date" className="font-semibold">
                  Due Date
                </FieldLabel>

                <DatePicker
                  value={field.value as Date | undefined}
                  onChange={field.onChange}
                />

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>

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
              "Create task"
            )}
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
};

export default CreateTaskForm;
