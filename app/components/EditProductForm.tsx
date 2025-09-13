import { useEffect, useState } from "react";
import { Form } from "react-router";
import type { Product } from "~/db/schemas";

type ProductDetailsI = {
  product: Product;
};

export default function EditProductForm({ product }: ProductDetailsI) {
  const [preview, setPreview] = useState<string | null>(
    product.imageUrl || null
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    setPreview(product.imageUrl || null);
  }, [product.imageUrl]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
      
      return () => {
        URL.revokeObjectURL(previewUrl);
      };
    }
  };

  const handleReset = () => {
    setPreview(product.imageUrl || null);
    setSelectedFile(null);
    const fileInput = document.getElementById('product-image') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  return (
    <Form method="post" encType="multipart/form-data">
      <div className="p-5 shadow-md rounded w-full max-w-2xl mx-auto flex flex-col md:flex-row gap-6 justify-center items-stretch">
      
        <fieldset className="fieldset w-full md:w-1/2 flex flex-col items-center justify-center">
          <legend className="fieldset-legend">Image</legend>

          <label
            htmlFor="product-image"
            className="relative group w-full min-h-50 h-full border border-dashed border-base-300 rounded flex items-center justify-center cursor-pointer hover:bg-base-200 transition-colors"
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
                <span className="text-sm text-base-content/70">Click to add image</span>
              </div>
            )}
          </label>
          
          <input
            id="product-image"
            type="file"
            name="image"
            className="hidden"
            accept="image/*"
            onChange={handleImageChange}
          />
          
          {selectedFile && (
            <p className="text-xs text-base-content/70 mt-2 text-center">
              Selected: {selectedFile.name}
            </p>
          )}
        </fieldset>

        <fieldset className="fieldset w-full md:w-2/3 space-y-4">
          <div>
            <label className="label">
              <span className="label-text">Name *</span>
            </label>
            <input
              type="text"
              name="name"
              defaultValue={product.name}
              className="input input-bordered w-full"
              placeholder="Dell 7480"
              required
            />
          </div>

          <div>
            <label className="label">
              <span className="label-text">Description</span>
            </label>
            <textarea
              name="description"
              defaultValue={product.description || ""}
              className="textarea textarea-bordered w-full h-24"
              placeholder="Black, 8gb RAM, 256 Storage"
            />
          </div>

          <div>
            <label className="label">
              <span className="label-text">Price *</span>
            </label>
            <input
              type="number"
              name="price"
              defaultValue={product.price?.toString() || ""}
              className="input input-bordered w-full"
              placeholder="25000"
              step="0.01"
              min="0"
              required
            />
          </div>

          <div>
            <label className="label">
              <span className="label-text">Category *</span>
            </label>
            <select
              name="category"
              defaultValue={product.category || ""}
              className="select select-bordered w-full"
              required
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
              name="intent" 
              value="update"
              className="btn btn-accent"
            >
              Update Product
            </button>
          </div>
        </fieldset>
      </div>
    </Form>
  );
}