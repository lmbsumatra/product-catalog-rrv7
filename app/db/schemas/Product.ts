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

export const UpdateProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  price: z.number("Price must be number").positive("Price must be positive"),
  category: z.string().min(1, "Category is required"),
  imageUrl: z.string().optional(), 
});

export type UpdateProduct = z.infer<typeof UpdateProductSchema>;
export type Product = z.infer<typeof ProductSchema>;
