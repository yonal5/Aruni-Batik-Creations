import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CiCircleChevDown, CiCircleChevUp } from "react-icons/ci";
import { BiTrash } from "react-icons/bi";
import { addToCart, getTotal, loadCart } from "../utils/cart";

export default function CartPage({ user }) {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  // Update cart quantity
  const updateCart = (item, qty) => {
    addToCart(item, qty);
    setCart(loadCart());
  };

  // Remove item from cart
  const removeItem = (item) => updateCart(item, -item.quantity);

  // Checkout
  const proceedToCheckout = () => {
    if (cart.length === 0) return alert("Your cart is empty!");
    navigate("/checkout", { state: { cart, user } });
  };

  // Load cart on mount
  useEffect(() => {
    const loadedCart = loadCart() || [];
    setCart(loadedCart);
  }, []);

  return (
    <div className="min-h-screen bg-primary/10 flex justify-center pt-10 px-3">
      <div className="w-full max-w-3xl flex flex-col gap-6">

        {/* Empty cart */}
        {cart.length === 0 && (
          <div className="bg-white/80 backdrop-blur rounded-2xl p-10 text-center shadow-lg">
            <p className="text-gray-600 text-xl font-medium">
              🛒 Your cart is empty
            </p>
          </div>
        )}

        {/* Cart items */}
        {cart.map((item, index) => (
          <div
            key={index}
            className="relative bg-white/90 backdrop-blur rounded-2xl shadow-md hover:shadow-xl transition flex flex-col md:flex-row overflow-hidden"
          >
            {/* Remove button */}
            <button
              onClick={() => removeItem(item)}
              className="absolute top-3 right-3 text-red-500 hover:text-white hover:bg-red-500 p-2 rounded-full transition"
            >
              <BiTrash size={20} />
            </button>

            {/* Image */}
            <div className="w-full h-44 bg-gray-100 rounded-xl flex items-center justify-center">
              <img
                src={
                  item.image.startsWith("http")
                    ? item.image
                    : `/uploads/${item.image}`
                }
                alt={item.name}
                className="max-h-full max-w-full object-contain"
              />
            </div>

            {/* Info & Quantity */}
            <div className="flex-1 p-4 flex flex-col justify-between">
              <div>
                <h1 className="font-semibold text-lg">{item.name}</h1>
                <span className="text-sm text-secondary">ID: {item.productID}</span>
              </div>

              <div className="flex items-center gap-3 mt-3">
                <CiCircleChevDown
                  className="text-2xl cursor-pointer hover:text-accent"
                  onClick={() => updateCart(item, -1)}
                />
                <span className="text-xl font-semibold">{item.quantity}</span>
                <CiCircleChevUp
                  className="text-2xl cursor-pointer hover:text-accent"
                  onClick={() => updateCart(item, 1)}
                />
              </div>
            </div>

            {/* Price */}
            <div className="w-full md:w-40 p-4 flex flex-col items-end justify-center">
              {item.labelledPrice > item.price && (
                <span className="text-gray-400 line-through text-sm">
                  LKR {item.labelledPrice.toFixed(2)}
                </span>
              )}
              <span className="text-accent font-bold text-2xl">
                LKR {item.price.toFixed(2)}
              </span>
            </div>
          </div>
        ))}

        {/* Checkout */}
        {cart.length > 0 && (
          <div className="sticky bottom-4 bg-white/95 backdrop-blur rounded-2xl shadow-xl p-5 flex flex-col md:flex-row items-center justify-between gap-4">
            <span className="text-2xl font-bold text-accent">
              Total: LKR {getTotal().toFixed(2)}
            </span>

            <button
              onClick={proceedToCheckout}
              className="bg-accent text-white px-8 py-3 rounded-xl text-lg font-medium hover:bg-accent/80 transition"
            >
              🚀 Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
