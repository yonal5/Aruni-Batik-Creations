import { Link, useNavigate } from "react-router-dom";
import { addToCart } from "../utils/cart";
import toast from "react-hot-toast";
import React from "react";

export default function ProductCard({ product }) {
  const navigate = useNavigate();

  return (
    <div
      className="
        w-full max-w-[350px] h-auto
        shadow-2xl m-3 flex rounded-[40px] flex-col p-4
        bg-white
        transition-transform duration-300
        hover:scale-[1.02]
      "
    >
      {/* Product Image */}
      <Link to={`/overview/${product.productID}`}>
        <div className="w-full aspect-[7/9] overflow-hidden rounded-2xl">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
      </Link>

      {/* Product Name */}
      <h1 className="text-lg sm:text-base font-bold text-secondary mt-2 line-clamp-2">
        {product.name}
      </h1>

      {/* Price */}
      {product.labelledPrice > product.price ? (
        <div className="flex gap-2 items-center mt-1">
          <p className="text-md sm:text-sm text-accent font-semibold">
            LKR {product.price.toFixed(2)}
          </p>
        </div>
      ) : (
        <p className="text-md sm:text-sm text-accent font-semibold mt-1">
          LKR {product.price.toFixed(2)}
        </p>
      )}

      {/* Product ID */}
      <p className="text-xs sm:text-[10px] text-secondary/70 mt-1">{product.productID}</p>

      {/* Buttons */}
      <div className="flex flex-col gap-2 mt-3">
        <button
          onClick={() => {
            addToCart(product, 1);
            toast.success("Added to cart!");
            navigate("/cart");
          }}
          className="
            w-full py-2 sm:py-1.5 rounded-xl border-2 border-accent text-accent font-semibold
            text-sm sm:text-xs
            transition-all duration-300 hover:bg-accent hover:text-white
            shadow-sm hover:shadow-md active:scale-[0.98]
          "
        >
          Add to Cart
        </button>

        <Link
          to={`/overview/${product.productID}`}
          className="
            w-full py-2 sm:py-1.5 rounded-xl border-2 border-accent text-accent text-center font-semibold
            text-sm sm:text-xs
            transition-all duration-300 hover:bg-accent/90 hover:text-white
            shadow-sm hover:shadow-md active:scale-[0.98]
          "
        >
          View Product
        </Link>
      </div>
    </div>
  );
}
