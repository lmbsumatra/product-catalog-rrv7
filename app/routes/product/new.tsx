import AddProductForm from "~/components/AddProductForm";
import type { Route } from "./+types/new";
import { redirect, type ActionFunctionArgs } from "react-router";
import { join } from "path";
import { writeFile, mkdir } from "fs/promises";
import crypto from "crypto";
import { AddProductSchema } from "~/db/schemas";
import AddProduct from "~/services/products/addProduct";
import { getUserId } from "~/utils/auth.server";

export function meta({}: Route.MetaArgs) {
  return [{ title: "New Product | RRv7" }];
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const data: Record<string, any> = {};
  const ownerId = await getUserId(request);

  formData.forEach((value, key) => {
    if (key !== "image" && key !== "intent") {
      data[key] = value;
    }
  });

  if (data.price) {
    data.price = Number(data.price);
  }

  const imageFile = formData.get("image") as File;
  console.log("Image file received:", imageFile?.name, imageFile?.size);

  if (!imageFile || imageFile.size === 0) {
    return {
      error: "Image file is required",
    };
  }

  let imageUrl: string;

  try {
    const fileExtension = imageFile.name.split(".").pop() || "jpg";
    const uniqueId = crypto.randomBytes(16).toString("hex");
    const fileName = `${uniqueId}.${fileExtension}`;

    const assetsDir = join(process.cwd(), "public", "assets");
    console.log("Assets directory path:", assetsDir);
    
    await mkdir(assetsDir, { recursive: true });

    const filePath = join(assetsDir, fileName);
    console.log("Full file path:", filePath);
    
    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    await writeFile(filePath, buffer);
    console.log("Image saved successfully:", fileName);

    imageUrl = `http://localhost:5173/assets/${fileName}`;
    console.log("Generated imageUrl:", imageUrl);
    
  } catch (error) {
    console.error("Error saving image:", error);
    return {
      error: "Failed to save image",
      details: error instanceof Error ? error.message : "Unknown error",
    };
  }

  const completeProductData = {
    ...data,
    imageUrl,
  };

  const validationResult = AddProductSchema.safeParse(completeProductData);

  if (!validationResult.success) {
    console.error("Product validation failed:", validationResult.error);
    return {
      error: "Product validation failed",
      validationErrors: validationResult.error.flatten(),
    };
  }

  try {
    const slug = await AddProduct({
      data: {
        ...validationResult.data,
        ownerId: ownerId ? Number(ownerId) : null,
      },
    });
    
    console.log("Product created successfully with slug:", slug);
    
    return redirect(`/products/${slug || 'success'}`);
    
  } catch (error) {
    console.error("Error creating product:", error);
    return {
      error: "Failed to create product",
      details: error instanceof Error ? error.message : "Unknown error",
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