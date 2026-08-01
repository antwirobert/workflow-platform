import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRegister } from "../hooks/useRegister";
import type { ApiError } from "@/lib/api/client";
import { toast } from "@/components/ui/toast";
import { useNavigate } from "react-router-dom";
import { ERROR_CODES } from "@/lib/api/constatnts";

type RegisterFormValues = z.infer<typeof registerSchema>;

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Email is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

const RegisterForm = () => {
  const navigate = useNavigate();
  const { mutate: register, isPending, error } = useRegister();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(data: RegisterFormValues) {
    register(data, {
      onSuccess: (data) => {
        toast.add({
          type: "success",
          description: `Account created - Welcome ${data.user.name}`,
        });
        navigate("/dashboard");
      },
      onError: (err: ApiError) => {
        if (err.code === ERROR_CODES.VALIDATION && err.details) {
          Object.entries(err.details).forEach(([field, messages]) =>
            form.setError(field as keyof RegisterFormValues, {
              message: messages[0],
            }),
          );
        }
      },
    });
  }

  return (
    <form className="mt-2" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="full-name" className="font-semibold">
                Full name
              </FieldLabel>
              <Input
                {...field}
                id="full-name"
                aria-invalid={fieldState.invalid}
                placeholder="Jordan Smith"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="email" className="font-semibold">
                Work email
              </FieldLabel>
              <Input
                {...field}
                type="email"
                id="email"
                aria-invalid={fieldState.invalid}
                placeholder="you@company.com"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="password" className="font-semibold">
                Password
              </FieldLabel>
              <Input
                {...field}
                type="password"
                id="password"
                aria-invalid={fieldState.invalid}
                placeholder="••••••••"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="confirmPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="confirm-password" className="font-semibold">
                Confirm password
              </FieldLabel>
              <Input
                {...field}
                type="password"
                id="confirm-password"
                aria-invalid={fieldState.invalid}
                placeholder="••••••••"
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

        <Button size="lg" type="submit" disabled={isPending}>
          {isPending ? "Creating..." : "Create account"}
        </Button>
      </FieldGroup>
    </form>
  );
};

export default RegisterForm;
