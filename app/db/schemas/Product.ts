import { z } from "zod";

export const ProductSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number("Price is required").positive("Price must be positive"),
  imageUrl: z.string("Image is required").url("Must be a valid URL"),
  category: z.string().min(1, "Category is required"),
  ownerId: z.number().nullable().optional().default(1),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

// Schema for form validation (before image processing)
export const AddProductFormSchema = ProductSchema.pick({
  name: true,
  description: true,
  price: true,
  category: true,
}).extend({
  // Make imageUrl optional for form validation, but we'll validate file presence separately
  imageUrl: z.string().optional(),
}).required({
  name: true,
  description: true,
  price: true,
  category: true,
});

// Schema for final validation (after image processing)
export const AddProductSchema = ProductSchema.pick({
  name: true,
  description: true,
  price: true,
  imageUrl: true,
  category: true,
}).required();

export const UpdateProductSchema = ProductSchema.pick({
  name: true,
  description: true,
  price: true,
  category: true,
  imageUrl: true,
}).partial();

export type Product = z.infer<typeof ProductSchema>;
export type AddProduct = z.infer<typeof AddProductSchema>;
export type AddProductForm = z.infer<typeof AddProductFormSchema>;
export type UpdateProduct = z.infer<typeof UpdateProductSchema>;