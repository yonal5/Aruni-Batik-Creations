import { Link, useNavigate } from "react-router-dom";
import { addToCart } from "../utils/cart";
import toast from "react-hot-toast";
import React from "react";

export default function ProductCard({ product }) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col rounded-[40px] shadow-2xl overflow-hidden
                    p-4 sm:p-6 bg-white
                    w-full
                    aspect-[7/9]">
      <Link to={"/overview/" + product.productID} className="flex-1">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover rounded-[30px]"
        />
      </Link>

      <div className="mt-4 flex flex-col gap-2">
        <h1 className="text-lg sm:text-xl font-bold text-secondary">
          {product.name}
        </h1>

        {product.labelledPrice > product.price ? (
          <div className="flex gap-3 items-center">
            <p className="text-lg text-accent font-semibold">
              LKR {product.price.toFixed(2)}
            </p>
          </div>
        ) : (
          <p className="text-lg text-accent font-semibold">
            LKR {product.price.toFixed(2)}
          </p>
        )}

        <p className="text-sm text-secondary/70">{product.productID}</p>

        <div className="flex flex-col gap-2 mt-2">
          <button
            onClick={() => {
              addToCart(product, 1);
              toast.success("Added to cart!");
              navigate("/cart");
            }}
            className="w-full py-2.5 rounded-xl border-2 border-accent text-accent font-semibold
                       transition-all duration-300 hover:bg-accent hover:text-white
                       shadow-sm hover:shadow-md active:scale-[0.98]"
          >
            Add to Cart
          </button>

          <Link
            to={`/overview/${product.productID}`}
            className="w-full py-2.5 rounded-xl border-2 border-accent text-accent text-center font-semibold
                       transition-all duration-300 hover:bg-accent/90 hover:text-white
                       shadow-sm hover:shadow-md active:scale-[0.98]"
          >
            View Product
          </Link>
        </div>
      </div>
    </div>
  );
}
