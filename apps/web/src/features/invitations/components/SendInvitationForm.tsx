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
import { useSendInvitation } from "../hooks/useSendInvitation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ROLE_OPTIONS } from "@/constants";

type SendInvitationValues = z.infer<typeof sendInvitationSchema>;

const sendInvitationSchema = z.object({
  email: z.string().email("Invalid email address."),
  role: z.enum(["ADMIN", "MEMBER"]).default("MEMBER"),
});

interface SendInvitationFormProps {
  orgSlug: string;
  onClose: () => void;
}

const SendInvitationForm = ({ orgSlug, onClose }: SendInvitationFormProps) => {
  const {
    mutate: sendInvitation,
    isPending,
    error,
  } = useSendInvitation(orgSlug);

  const form = useForm<
    z.input<typeof sendInvitationSchema>,
    unknown,
    SendInvitationValues
  >({
    resolver: zodResolver(sendInvitationSchema),
    defaultValues: {
      email: "",
      role: "MEMBER",
    },
  });

  function onSubmit(data: SendInvitationValues) {
    sendInvitation(data, {
      onSuccess: (data) => {
        form.reset();
        onClose();
        toast.add({
          type: "success",
          title: `✓ Invite sent to ${data.email}`,
        });
      },
      onError: (err: ApiError) => {
        if (err.code === ERROR_CODES.VALIDATION && err.details) {
          Object.entries(err.details).forEach(([field, messages]) =>
            form.setError(field as keyof SendInvitationValues, {
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
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="email" className="font-semibold">
                Email
              </FieldLabel>
              <Input
                {...field}
                id="email"
                aria-invalid={fieldState.invalid}
                placeholder="teammate@company.com"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="role"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="task-status" className="font-semibold">
                Status
              </FieldLabel>
              <Select
                id="role"
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {ROLE_OPTIONS.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
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
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
              </>
            ) : (
              "Send invite"
            )}
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
};

export default SendInvitationForm;
