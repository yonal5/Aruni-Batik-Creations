import { Link, useNavigate } from "react-router-dom";
import { addToCart } from "../utils/cart";
import toast from "react-hot-toast";

export default function ProductCard({ product }) {
  const navigate = useNavigate();

  return (
    <div className="
      m-3
      flex flex-col
      p-[25px]
      shadow-2xl
      rounded-[40px]
      w-[350px] h-auto
      sm:w-[calc(33.333%-1rem)] sm:p-[15px] sm:m-2
      md:w-[350px] 
      transform transition-transform duration-200 hover:scale-[1.02]
    ">
      <Link to={"/overview/"+product.productID} >
        <img className="w-full h-[450px] object-cover rounded-[30px]" src={product.images[0]} alt={product.name} />
      </Link>

      <h1 className="text-xl font-bold text-secondary mt-3">{product.name}</h1>

      {product.labelledPrice > product.price ? (
        <div className="flex gap-3 items-center mt-1">
          <p className="text-lg text-accent font-semibold">LKR {product.price.toFixed(2)}</p>
        </div>
      ) : (
        <p className="text-lg text-accent font-semibold mt-1">LKR {product.price.toFixed(2)}</p>
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
  );
}
