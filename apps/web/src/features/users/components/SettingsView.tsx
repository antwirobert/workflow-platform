import TextAvatar from "@/components/TextAvatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useActiveOrganization } from "@/features/organizations/hooks/useActiveOrganization";
import { cn, getIdentityColor } from "@/lib/utils";
import { Loader2, Palette, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useMe } from "../hooks/useMe";
import z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUpdateProfile } from "../hooks/useUpdateUser";
import { toast } from "@/components/ui/toast";
import type { ApiError } from "@/lib/api/client";
import { ERROR_CODES } from "@/lib/api/constatnts";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTheme, type Theme } from "@/providers/theme-provider";

type SettingsTab = "profile" | "appearance";

const navItems: {
  id: SettingsTab;
  label: string;
  icon: typeof User;
}[] = [
  { id: "profile", label: "Profile", icon: User },
  { id: "appearance", label: "Appearance", icon: Palette },
];

type UpdateUserSchema = z.infer<typeof updateUserSchema>;

const updateUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters.").optional(),
  email: z.string().email("Invalid email address").optional(),
});

const items = [
  { label: "System", value: "system" },
  { label: "Light", value: "light" },
  { label: "Dark", value: "dark" },
];

const SettingsView = () => {
  const { theme, setTheme } = useTheme();
  const { data: user } = useMe();
  const { mutate: updateUserProfile, isPending, error } = useUpdateProfile();
  const { activeOrganization } = useActiveOrganization();
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");

  const color = user ? getIdentityColor(user.id) : null;

  const form = useForm<UpdateUserSchema>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
    },
  });

  useEffect(() => {
    form.reset({
      name: user?.name ?? "",
      email: user?.email ?? "",
    });
  }, [form, user]);

  function onSubmit(data: UpdateUserSchema) {
    updateUserProfile(data, {
      onSuccess: () => {
        toast.add({
          type: "success",
          title: "Profile saved",
        });
      },
      onError: (err: ApiError) => {
        if (err.code === ERROR_CODES.VALIDATION && err.details) {
          Object.entries(err.details).forEach(([field, messages]) =>
            form.setError(field as keyof UpdateUserSchema, {
              message: messages[0],
            }),
          );
        }
      },
    });
  }

  return (
    <div className="flex min-h-105 gap-6">
      <nav className="w-44 shrink-0 space-y-0.5 border-r border-border/60 pr-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
              )}
            >
              <Icon className="size-3.5 shrink-0 opacity-70" />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="min-w-0 flex-1">
        {activeTab === "profile" && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h3 className="text-sm font-semibold tracking-tight text-foreground">
                Profile
              </h3>
              <p className="text-sm text-muted-foreground">
                How you appear across {activeOrganization?.name}.
              </p>
            </div>

            <div className="flex items-center gap-4">
              {user && color && (
                <TextAvatar
                  name={user.name}
                  colorClass={color.bg}
                  textClass={color.text}
                  className="size-14 shrink-0 rounded-full text-base font-semibold"
                />
              )}
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FieldGroup>
                <Controller
                  name="name"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="name" className="font-semibold">
                        Name
                      </FieldLabel>
                      <Input
                        {...field}
                        id="name"
                        aria-invalid={fieldState.invalid}
                        placeholder="Robert Antwi"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="email"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="email" className="font-semibold">
                        Name
                      </FieldLabel>
                      <Input
                        {...field}
                        id="email"
                        type="email"
                        aria-invalid={fieldState.invalid}
                        placeholder="robert@vanguard.co"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                {error && error.code !== ERROR_CODES.VALIDATION && (
                  <div className="rounded-lg bg-destructive/10 p-3 text-sm font-medium text-destructive">
                    {error.message || "An unexpected error occurred."}
                  </div>
                )}

                <Button type="submit" disabled={isPending} className="self-end">
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                      Saving...
                    </>
                  ) : (
                    "Save changes"
                  )}
                </Button>
              </FieldGroup>
            </form>
          </div>
        )}

        {activeTab === "appearance" && (
          <div className="space-y-1">
            <h3 className="text-sm font-semibold tracking-tight text-foreground">
              Appearance
            </h3>
            <p className="text-sm text-muted-foreground">
              Customize how {activeOrganization?.name} looks and feels.
            </p>
            <p className="pt-8 text-sm">Theme</p>
            <Select
              items={items}
              value={theme}
              onValueChange={(theme) => setTheme(theme as Theme)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {items.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsView;
