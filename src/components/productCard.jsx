import { Link, useNavigate } from "react-router-dom";
import { addToCart } from "../utils/cart";
import toast from "react-hot-toast";

export default function ProductCard({ product }) {
  const navigate = useNavigate();

  return (
    <div className="m-3 sm:m-2 flex justify-center">
      {/* Wrapper that keeps aspect ratio */}
      <div className="
        w-[350px] 
        h-auto 
        sm:w-[90%] sm:max-w-[calc(100%/3-1rem)]
        aspect-[7/9] 
        shadow-2xl rounded-[40px] 
        flex flex-col p-[25px] sm:p-[15px]
        transform transition-transform duration-200 hover:scale-[1.02]
      ">
        <Link to={"/overview/"+product.productID} className="flex-1">
          <img 
            className="w-full h-full object-cover rounded-[30px]" 
            src={product.images[0]} 
            alt={product.name} 
          />
        </Link>

        <h1 className="text-xl font-bold text-secondary mt-3">{product.name}</h1>

        {product.labelledPrice > product.price ? (
          <div className="flex gap-3 items-center mt-1">
            <p className="text-lg text-accent font-semibold">
              LKR {product.price.toFixed(2)}
            </p>
          </div>
        ) : (
          <p className="text-lg text-accent font-semibold mt-1">
            LKR {product.price.toFixed(2)}
          </p>
        )}

        <p className="text-sm text-secondary/70 mt-1">{product.productID}</p>

        <div className="flex flex-col gap-3 mt-4">
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
