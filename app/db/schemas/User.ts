import { z } from "zod";

export const UserSchema = z.object({
  id: z.number().optional(),
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type User = z.infer<typeof UserSchema>;
