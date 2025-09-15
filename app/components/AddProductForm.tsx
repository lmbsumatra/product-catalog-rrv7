import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { AddProduct } from "~/db/schemas";
import { AddProductSchema } from "~/db/schemas";
import { useSubmit } from "react-router";

export default function AddProductForm() {
  const [preview, setPreview] = useState<string | null>();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageError, setImageError] = useState<string>("");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    clearErrors,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<AddProduct>({
    resolver: zodResolver(AddProductSchema),
    mode: "onChange",
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const isValid = validateImageFile(file);

      if (isValid) {
        setSelectedFile(file);
        setImageError("");
        clearErrors("imageUrl");

        setValue("imageUrl", "temp-image-url", { shouldValidate: true });

        const previewUrl = URL.createObjectURL(file);
        setPreview(previewUrl);

        return () => {
          URL.revokeObjectURL(previewUrl);
        };
      }
    } else {
      setSelectedFile(null);
      setPreview(null);
      setValue("imageUrl", "", { shouldValidate: true });
    }
  };

  const validateImageFile = (file: File): boolean => {
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setImageError("Image size must be less than 5MB");
      setError("imageUrl", { message: "Image size must be less than 5MB" });
      return false;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      setImageError("Only JPEG, PNG, WebP, and GIF images are allowed");
      setError("imageUrl", {
        message: "Only JPEG, PNG, WebP, and GIF images are allowed",
      });
      return false;
    }

    setImageError("");
    return true;
  };

  const submit = useSubmit();

  const onSubmit = async (data: AddProduct) => {
    if (!selectedFile) {
      setImageError("Image is required");
      setError("imageUrl", { message: "Image is required" });
      return;
    }

    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (key !== "imageUrl" && value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    formData.append("image", selectedFile);

    formData.append("intent", "create");

    submit(formData, {
      method: "POST",
      encType: "multipart/form-data",
    });
  };

  return (
    <div className="p-5 shadow-md rounded w-full max-w-2xl mx-auto flex flex-col md:flex-row gap-6 justify-center items-stretch">
      <fieldset className="fieldset w-full md:w-1/2 flex flex-col items-center justify-center">
        <legend className="fieldset-legend">Image *</legend>

        {(imageError || errors.imageUrl) && (
          <div className="label">
            <span className="label-text-alt text-error">
              {imageError || errors.imageUrl?.message}
            </span>
          </div>
        )}

        <label
          htmlFor="Pimage"
          className={`relative group w-full min-h-50 h-full border border-dashed rounded flex items-center justify-center cursor-pointer hover:bg-base-200 transition-colors ${
            imageError || errors.imageUrl ? "border-error" : "border-base-300"
          }`}
        >
          {preview ? (
            <>
              <span className="absolute z-10 flex group-hover:visible group-hover:bg-black/50 h-full w-full invisible text-sm text-white items-center justify-center rounded transition-all">
                Click to change
              </span>
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover rounded max-h-64"
              />
            </>
          ) : (
            <div className="text-center p-8">
              <svg
                className="w-12 h-12 mx-auto mb-2 text-base-content/50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              <span className="text-sm text-base-content/70">
                Click to add image
              </span>
            </div>
          )}
        </label>

        <input
          id="Pimage"
          type="file"
          className="hidden"
          accept="image/*"
          onChange={(e) => handleImageChange(e)}
        />

        {selectedFile && (
          <p className="text-xs text-base-content/70 mt-2 text-center">
            Selected: {selectedFile.name} (
            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
          </p>
        )}
      </fieldset>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="fieldset w-full md:w-2/3 space-y-4"
      >
        <div>
          <label className="label">
            <span className="label-text">Name *</span>
          </label>
          <input
            type="text"
            {...register("name")}
            className={`input input-bordered w-full ${errors.name ? "input-error" : ""}`}
            placeholder="Dell 7480"
          />
          {errors.name && (
            <div className="label">
              <span className="label-text-alt text-error">
                {errors.name.message}
              </span>
            </div>
          )}
        </div>

        <div>
          <label className="label">
            <span className="label-text">Description *</span>
          </label>
          <textarea
            {...register("description")}
            className={`textarea textarea-bordered w-full h-24 ${errors.description ? "textarea-error" : ""}`}
            placeholder="Black, 8gb RAM, 256 Storage"
          />
          {errors.description && (
            <div className="label">
              <span className="label-text-alt text-error">
                {errors.description.message}
              </span>
            </div>
          )}
        </div>

        <div>
          <label className="label">
            <span className="label-text">Price *</span>
          </label>
          <input
            type="number"
            {...register("price", { valueAsNumber: true })}
            className={`input input-bordered w-full ${errors.price ? "input-error" : ""}`}
            placeholder="25000"
            step="0.01"
            min="0"
          />
          {errors.price && (
            <div className="label">
              <span className="label-text-alt text-error">
                {errors.price.message}
              </span>
            </div>
          )}
        </div>

        <div>
          <label className="label">
            <span className="label-text">Category *</span>
          </label>
          <select
            {...register("category")}
            className={`select select-bordered w-full ${errors.category ? "select-error" : ""}`}
          >
            <option disabled value="">
              Select Category
            </option>
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
            <option value="books">Books</option>
            <option value="home">Home & Garden</option>
            <option value="sports">Sports</option>
            <option value="other">Other</option>
          </select>
          {errors.category && (
            <div className="label">
              <span className="label-text-alt text-error">
                {errors.category.message}
              </span>
            </div>
          )}
        </div>

        <div className="flex gap-4 justify-end pt-4">
          {/* <button
            type="button"
            className="btn btn-outline btn-error"
            onClick={reset}
          >
            Cancel
          </button> */}
          <button
            type="submit"
            className="btn btn-accent"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              "Add Product"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
