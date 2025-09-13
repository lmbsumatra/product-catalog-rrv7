import { z } from "zod";

export const ProductSchema = z.object({
  id: z.number().optional(), 
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional(),
  price: z.number().positive("Price must be positive"),
  imageUrl: z.string().url("Must be a valid URL").optional(),
  category: z.string().optional(),
  ownerId: z.number().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type Product = z.infer<typeof ProductSchema>;
