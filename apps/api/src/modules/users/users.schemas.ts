import z from "zod";

export const updateUserSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .optional(),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email("Invalid email address")
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required to update a user profile",
  });

export type UpdateUserBody = z.infer<typeof updateUserSchema>;
