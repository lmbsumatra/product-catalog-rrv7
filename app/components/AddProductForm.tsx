import { useState } from "react";

export default function AddProductForm() {
  const [preview, setPreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="p-5 shadow-md rounded w-full max-w-2xl mx-auto flex flex-col md:flex-row gap-6 justify-center items-stretch">
      <fieldset className="fieldset w-full md:w-1/2 flex flex-col items-center justify-center">
        <legend className="fieldset-legend">Image</legend>

        <label
          htmlFor="product-image"
          className="relative group w-full min-h-50 h-full border border-dashed rounded flex items-center justify-center cursor-pointer hover:bg-base-200"
        >
          {preview ? (
            <>
              <span className="absolute z-9 flex group-hover:visible group-hover:bg-neutral-900/50 h-full w-full invisible text-sm text-white items-center justify-center">
                Click to change
              </span>
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover rounded"
              />
            </>
          ) : (
            <span className="text-sm text-gray-500">Click to add</span>
          )}
        </label>
        <input
          id="product-image"
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleImageChange}
        />
      </fieldset>

      <fieldset className="fieldset w-full md:w-2/3 space-y-3">
        <legend className="fieldset-legend">Name *</legend>
        <input
          type="text"
          className="input input-bordered w-full"
          placeholder="Dell 7480"
        />

        <legend className="fieldset-legend">Description</legend>
        <textarea
          className="textarea textarea-bordered w-full"
          placeholder="Black, 8gb RAM, 256 Storage"
        />

        <legend className="fieldset-legend">Price *</legend>
        <input
          type="text"
          className="input input-bordered w-full"
          placeholder="25000"
        />

        <legend className="fieldset-legend">Category *</legend>
        <select
          defaultValue="Pick a color"
          className="select select-bordered w-full"
        >
          <option disabled={true}>Select Category</option>
          <option>Technology</option>
          <option>Clothing</option>
          <option>Food</option>
        </select>

        <div className="flex gap-4 justify-end">
          <button className="btn btn-outline btn-error">Cancel</button>
          <button className="btn btn-soft btn-accent">Add Product</button>
        </div>
      </fieldset>
    </div>
  );
}
