import AddProductForm from "~/components/AddProductForm";
import type { Route } from "./+types/new";
import { redirect, type ActionFunctionArgs } from "react-router";
import { join } from "path";
import { writeFile, mkdir } from "fs/promises";
import crypto from "crypto";
import { AddProductSchema } from "~/db/schemas";
import AddProduct from "~/services/products/addProduct";

export function meta({}: Route.MetaArgs) {
  return [{ title: "New Product | RRv7" }];
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const data: Record<string, any> = {};

  formData.forEach((value, key) => {
    if (key !== "image" && key !== "intent") {
      data[key] = value;
    }
  });

  if (data.price) {
    data.price = Number(data.price);
  }

  const validationResult = AddProductSchema.safeParse(data);

  if (!validationResult.success) {
    return {
      error: "Validation failed on server",
    };
  }

  const imageFile = formData.get("image") as File;
  if (imageFile && imageFile.size > 0) {
    try {
      const fileExtension = imageFile.name.split(".").pop() || "jpg";
      const uniqueId = crypto.randomBytes(16).toString("hex");
      const fileName = `${uniqueId}.${fileExtension}`;

      const assetsDir = join(process.cwd(), "public", "assets");
      await mkdir(assetsDir, { recursive: true });

      const filePath = join(assetsDir, fileName);
      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      await writeFile(filePath, buffer);

      validationResult.data.imageUrl = `/assets/${fileName}`;
    } catch (error) {
      console.error("Error saving image:", error);
      return {
        error: "Failed to save image",
      };
    }
  }

  try {
    const slug = await AddProduct({ data: validationResult.data });
    return redirect(`/products/${slug}`);
  } catch (error) {
    console.error("Error updating product:", error);
    return {
      error: "Failed to update product",
    };
  }
}

export default function New() {
  return (
    <div className="bg-base-100 py-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold">Create Product</h1>
      <p className="text-base-content/70">Add a new product to your store</p>
      <AddProductForm />
    </div>
  );
}
