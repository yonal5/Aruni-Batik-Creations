import { Link, useNavigate } from "react-router-dom";
import { addToCart } from "../utils/cart";
import toast from "react-hot-toast";
import React from "react";

export default function ProductCard({ product }) {
  const navigate = useNavigate();

  return (
    <div className="w-full h-auto shadow-2xl m-3 flex flex-col rounded-[40px] p-4
                    sm:p-5
                    md:p-[25px]
                    bg-white
                    transition-all">
      
      {/* PRODUCT IMAGE */}
      <Link to={"/overview/" + product.productID}>
        <img
          className="w-full h-[clamp(250px,45vw,450px)] object-cover rounded-[30px]"
          src={product.images[0]}
        />
      </Link>

      {/* PRODUCT NAME */}
      <h1 className="mt-3 text-[clamp(14px,1.2vw,20px)] font-bold text-secondary">
        {product.name}
      </h1>

      {/* PRICE */}
      {product.labelledPrice > product.price ? (
        <div className="flex gap-2 items-center text-[clamp(12px,1vw,18px)]">
          <p className="text-accent font-semibold">LKR {product.price.toFixed(2)}</p>
        </div>
      ) : (
        <p className="text-accent font-semibold text-[clamp(12px,1vw,18px)]">
          LKR {product.price.toFixed(2)}
        </p>
      )}

      {/* PRODUCT ID */}
      <p className="text-secondary/70 text-[clamp(10px,0.9vw,14px)]">{product.productID}</p>

      {/* BUTTONS */}
      <div className="flex flex-col gap-2 mt-3 sm:mt-4">
        <button
          onClick={() => {
            addToCart(product, 1);
            toast.success("Added to cart!");
            navigate("/cart");
          }}
          className="w-full py-[clamp(6px,1.2vw,10px)] rounded-xl border-2 border-accent text-accent font-semibold
                     transition-all duration-300 hover:bg-accent hover:text-white shadow-sm hover:shadow-md active:scale-[0.98]
                     text-[clamp(12px,1vw,16px)]"
        >
          Add to Cart
        </button>

        <Link
          to={`/overview/${product.productID}`}
          className="w-full py-[clamp(6px,1.2vw,10px)] rounded-xl border-2 border-accent text-accent text-center font-semibold
                     transition-all duration-300 hover:bg-accent/90 hover:text-white shadow-sm hover:shadow-md active:scale-[0.98]
                     text-[clamp(12px,1vw,16px)]"
        >
          View Product
        </Link>
      </div>
    </div>
  );
}
