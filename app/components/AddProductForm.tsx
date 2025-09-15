import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { AddProductForm } from "~/db/schemas";
import { AddProductFormSchema } from "~/db/schemas";

export default function AddProductForm() {
  const [preview, setPreview] = useState<string | null>();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageError, setImageError] = useState<string>("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddProductForm>({
    resolver: zodResolver(AddProductFormSchema),
    defaultValues: {
      category: "",
    },
    mode: "onChange",
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log("Image selected:", file?.name, file?.size);
    
    if (file) {
      setSelectedFile(file);
      setImageError(""); 
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);

      return () => {
        URL.revokeObjectURL(previewUrl);
      };
    }
  };

  const validateImageFile = (): boolean => {
    if (!selectedFile) {
      setImageError("Image is required");
      return false;
    }

    const maxSize = 5 * 1024 * 1024; 
    if (selectedFile.size > maxSize) {
      setImageError("Image size must be less than 5MB");
      return false;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(selectedFile.type)) {
      setImageError("Only JPEG, PNG, WebP, and GIF images are allowed");
      return false;
    }

    setImageError("");
    return true;
  };

  const onSubmit = async (data: AddProductForm) => {
    console.log("Form submitted with data:", data);
    
    if (!validateImageFile()) {
      return;
    }

    console.log("Selected file:", selectedFile?.name, selectedFile?.size);

    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    if (selectedFile) {
      formData.append("image", selectedFile);
      console.log("Image added to FormData:", selectedFile.name);
    }

    formData.append("intent", "create");

    try {
      const response = await fetch(window.location.pathname, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        if (response.redirected || response.status === 302) {
          window.location.href = response.url;
        } else {
          console.log("Product created successfully");
          handleReset();
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error("Error creating product:", errorData);
        
        if (errorData.error) {
          alert(errorData.error);
        }
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("Network error occurred. Please try again.");
    }
  };

  const handleReset = () => {
    reset();
    setPreview(null);
    setSelectedFile(null);
    setImageError("");
  };

  return (
    <div className="p-5 shadow-md rounded w-full max-w-2xl mx-auto flex flex-col md:flex-row gap-6 justify-center items-stretch">
      <fieldset className="fieldset w-full md:w-1/2 flex flex-col items-center justify-center">
        <legend className="fieldset-legend">Image *</legend>

        {imageError && (
          <div className="label">
            <span className="label-text-alt text-error">
              {imageError}
            </span>
          </div>
        )}

        <label
          htmlFor="Pimage"
          className={`relative group w-full min-h-50 h-full border border-dashed rounded flex items-center justify-center cursor-pointer hover:bg-base-200 transition-colors ${
            imageError ? 'border-error' : 'border-base-300'
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
            Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
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
          <button
            type="button"
            className="btn btn-outline btn-error"
            onClick={handleReset}
          >
            Cancel
          </button>
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