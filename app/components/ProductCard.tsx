import { Link, redirect } from "react-router";
import type { Product } from "~/db/schemas";

type ProductI = {
  product: Product;
};

export default function ProductCard({ product }: ProductI) {
  
  return (
    <Link to={`/products/${product.slug}`}>
      <div className="card bg-base-100 w-75 shadow-sm h-100">
        <figure>
          <img
            src={
              product.imageUrl || "http://localhost:5173/assets/fallback.png"
            }
            alt={product.name}
            onError={(e) => {
              const target = e.currentTarget as HTMLImageElement;
              target.onerror = null;
              target.src = "http://localhost:5173/assets/fallback.png";
            }}
          />
        </figure>
        <div className="card-body">
          <h2 className="card-title">{product.name}</h2>
          <p>{product.description}</p>
          <a href={`/products/${product.slug}`}>{product.slug}</a>
          <div className="card-actions justify-end">
            <button className="btn btn-primary" onClick={()=> redirect(`/produts/${product.slug}`)}>Buy Now</button>
          </div>
        </div>
      </div>
    </Link>
  );
}
