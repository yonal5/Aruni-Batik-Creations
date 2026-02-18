import { Link, useNavigate } from "react-router-dom";
import { addToCart } from "../utils/cart";
import toast from "react-hot-toast";
import React from "react";

export default function ProductCard({ product }) {

  const navigate = useNavigate();

  return (

    <div
      className="
        w-full
        bg-white
        rounded-[40px]
        shadow-2xl
        overflow-hidden
        flex flex-col
        transition-all duration-300
        hover:shadow-xl
      "
    >

      {/* IMAGE */}
      <Link to={"/overview/" + product.productID}>

        <div className="w-full h-object-cover overflow-hidden">

          <img
            src={product.images[0]}
            alt={product.name}
            className="
              w-object-cover
              h-object-cover
            "
          />

        </div>

      </Link>


      {/* CONTENT */}
      <div className="flex flex-col p-4 gap-2">

        {/* NAME */}
        <h1
          className="
            font-bold
            text-secondary
            leading-tight
            text-[14px]
            sm:text-[15px]
            md:text-[16px]
            lg:text-[17px]
          "
        >
          {product.name}
        </h1>


        {/* PRICE */}
        <p
          className="
            font-semibold
            text-accent
            text-[13px]
            sm:text-[14px]
            md:text-[15px]
            lg:text-[16px]
          "
        >
          LKR {product.price.toFixed(2)}
        </p>


        {/* PRODUCT ID */}
        <p
          className="
            text-secondary/70
            text-[11px]
            sm:text-[12px]
            md:text-[13px]
          "
        >
          {product.productID}
        </p>


        {/* BUTTONS */}
        <div className="flex flex-col gap-2 mt-2">

          {/* ADD TO CART */}
          <button

            onClick={() => {

              addToCart(product, 1);
              toast.success("Added to cart!");
              navigate("/cart");

            }}

            className="
              w-full
              border-2
              border-accent
              text-accent
              rounded-xl
              font-semibold
              transition-all duration-300
              hover:bg-accent
              hover:text-white

              py-1.5
              text-[12px]

              sm:py-2
              sm:text-[13px]

              md:py-2.5
              md:text-[14px]

              lg:text-[15px]
            "
          >

            Add to Cart

          </button>


          {/* VIEW PRODUCT */}
          <Link

            to={"/overview/" + product.productID}

            className="
              w-full
              border-2
              border-accent
              text-accent
              rounded-xl
              font-semibold
              text-center
              transition-all duration-300
              hover:bg-accent
              hover:text-white

              py-1.5
              text-[12px]

              sm:py-2
              sm:text-[13px]

              md:py-2.5
              md:text-[14px]

              lg:text-[15px]
            "
          >

            View Product

          </Link>

        </div>

      </div>

    </div>

  );

}
