import { useState } from "react";
import { Form, Link, useNavigate } from "react-router";
import type { Product } from "~/db/schemas";

type ProductDetailsI = {
  product: Product;
  user?: { id: number; username: string } | null;
};

export default function ProductDetails({ product, user }: ProductDetailsI) {
  const navigate = useNavigate();

  const isOwner = user && product.ownerId === user.id;

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="breadcrumbs text-sm mb-6">
        <ul>
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/products">Products</a>
          </li>
          <li className="text-base-content/70">{product.name}</li>
        </ul>
      </div>

      <a
        onClick={handleBack}
        className="btn btn-ghost justify-start w-fit mb-6"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Back to Products
      </a>

      <Form className="card bg-base-100 shadow-xl" method="post">
        <div className="card-body p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4 w-full">
              <div className="relative group w-full">
                <figure className=" max-h-120 rounded-xl overflow-hidden bg-base-200">
                  <img
                    className="w-full h-full object-cover"
                    src={
                      product.imageUrl ||
                      "http://localhost:5173/assets/fallback.png"
                    }
                    alt={product.name}
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      target.onerror = null;
                      target.src = "http://localhost:5173/assets/fallback.png";
                    }}
                  />
                </figure>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex items-start justify-between mb-3">
                  <h1 className="text-3xl font-bold text-base-content">
                    {product.name}
                  </h1>
                  <span className="text-4xl font-bold text-primary">
                    {product.price}
                  </span>
                </div>

                <p className="text-base-content/80 leading-relaxed">
                  {product.description}
                </p>
              </div>

              <div className="space-y-4">
                {isOwner ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      onClick={() =>
                        (window.location.href = `/products/${product.slug}/edit`)
                      }
                      className="btn btn-warning"
                    >
                      Edit
                    </button>

                    <button
                      name="intent"
                      value="delete"
                      className="btn btn-outline btn-error"
                    >
                      Delete
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        name="intent"
                        value="Add To Cart"
                        className="btn btn-outline btn-primary"
                      >
                        Add to Cart
                      </button>

                      <button
                        name="intent"
                        value="Buy Now"
                        className="btn btn-primary"
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
}
