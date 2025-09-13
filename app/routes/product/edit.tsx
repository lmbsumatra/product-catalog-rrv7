import GetProduct from "~/services/products/getProduct";
import type { Route } from "./+types/edit";
import EditProductForm from "~/components/EditProductForm";
import { redirect, type ActionFunctionArgs } from "react-router";
import UpdateProduct from "~/services/products/updateProduct";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import crypto from "crypto";
import { UpdateProductSchema } from "~/db/schemas"; 

type LoaderData = {
  item: Awaited<ReturnType<typeof GetProduct>>;
};

export function meta({}: Route.MetaArgs) {
  return [{ title: "Edit Product | RRv7" }];
}

export async function action({ request, params }: ActionFunctionArgs) {
  const { slug } = params;
  if (!slug) {
    console.log("Item not found");
    return { error: "Product not found" };
  }

  const formData = await request.formData();
  const data: Record<string, any> = {};

  formData.forEach((value, key) => {
    if (key !== "image") {
      data[key] = value;
    }
  });

  if (data.price) {
    data.price = Number(data.price);
  }

  const validationResult = UpdateProductSchema.safeParse(data);
  
  if (!validationResult.success) {
    const fieldErrors: Record<string, string> = {};
    validationResult.error.issues.forEach((err: any) => {
      if (err.path[0]) {
        fieldErrors[err.path[0] as string] = err.message;
      }
    });
    
    return { 
      error: "Validation failed", 
      fieldErrors,
      values: data
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
        values: data
      };
    }
  }

  try {
    await UpdateProduct({ slug, data: validationResult.data });
    return redirect(`/products/${slug}`);
  } catch (error) {
    console.error("Error updating product:", error);
    return { 
      error: "Failed to update product",
      values: data
    };
  }
}

export async function loader({ params }: Route.LoaderArgs) {
  const { slug } = params;
  if (!slug) {
    console.log("Item not found");
    return;
  }

  const data = await GetProduct({ slug });
  if (!data) {
    console.log("Item not found");
    return;
  }
  return { item: data };
}

export default function Edit({
  loaderData,
  actionData,
  params,
}: {
  loaderData: LoaderData;
  actionData?: {
    error?: string;
    fieldErrors?: Record<string, string>;
    values?: Record<string, any>;
  };
  params: { slug: string };
}) {
  const item = loaderData?.item;
  const { slug } = params;

  if (!item || !slug) return <p>Product not found</p>;

  return (
    <div className="bg-base-100 min-h-screen py-8 flex flex-col items-center">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Edit Product</h1>
          <p className="text-base-content/70">
            Update your product information
          </p>
        </div>
        {actionData?.error && (
          <div className="alert alert-error mb-4 max-w-2xl mx-auto">
            <span>{actionData.error}</span>
          </div>
        )}
        <EditProductForm 
          product={item} 
          fieldErrors={actionData?.fieldErrors}
          submittedValues={actionData?.values}
        />
      </div>
    </div>
  );
}