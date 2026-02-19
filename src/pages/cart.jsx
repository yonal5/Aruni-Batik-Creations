import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CiCircleChevDown, CiCircleChevUp } from "react-icons/ci";
import { BiTrash } from "react-icons/bi";
import { addToCart, getTotal, loadCart } from "../utils/cart";

export default function CartPage({ user }) {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setCart(loadCart() || []);
  }, []);

  // Update quantity
  const updateCart = (item, qty) => {
    addToCart(item, qty);
    setCart(loadCart() || []);
  };

  // Remove item
  const removeItem = (item) => updateCart(item, -item.quantity);

  // Checkout
  const proceedToCheckout = () => {
    if (cart.length === 0) return alert("Your cart is empty!");
    navigate("/checkout", { state: { cart, user } });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-10">
      <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6">
        🛒 Shopping Cart
      </h1>

      {cart.length === 0 && (
        <div className="text-center py-20 bg-white rounded-xl shadow-md">
          <p className="text-gray-600 text-lg md:text-xl font-medium">
            Your cart is empty
          </p>
        </div>
      )}

      {cart.length > 0 && (
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Products */}
          <div className="flex-1 flex flex-col gap-4">
            {cart.map((item, index) => (
              <div
                key={index}
                className="flex flex-col md:flex-row items-center bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition"
              >
                {/* Image */}
                <div className="w-full md:w-40 h-40 bg-gray-100 flex items-center justify-center">
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

                {/* Info */}
                <div className="flex-1 p-4 flex flex-col justify-between w-full">
                  <div>
                    <h2 className="font-semibold text-lg">{item.name}</h2>
                    <p className="text-gray-500 text-sm">ID: {item.productID}</p>
                  </div>

                  <div className="flex items-center gap-3 mt-4">
                    <CiCircleChevDown
                      className="cursor-pointer text-2xl text-gray-600 hover:text-accent"
                      onClick={() => updateCart(item, -1)}
                    />
                    <span className="text-lg font-semibold">{item.quantity}</span>
                    <CiCircleChevUp
                      className="cursor-pointer text-2xl text-gray-600 hover:text-accent"
                      onClick={() => updateCart(item, 1)}
                    />
                    <button
                      onClick={() => removeItem(item)}
                      className="ml-auto text-red-500 hover:text-white hover:bg-red-500 p-2 rounded-full transition"
                    >
                      <BiTrash size={20} />
                    </button>
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
          </div>

          {/* Summary */}
          <div className="w-full lg:w-80 bg-white rounded-xl shadow-md p-6 flex flex-col gap-4 sticky top-24 h-max">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Order Summary
            </h3>

            <div className="flex justify-between text-gray-600">
              <span>Items ({cart.reduce((acc, cur) => acc + cur.quantity, 0)})</span>
              <span>LKR {getTotal().toFixed(2)}</span>
            </div>

            <div className="border-t border-gray-200 my-2"></div>

            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>LKR {getTotal().toFixed(2)}</span>
            </div>

            <button
              onClick={proceedToCheckout}
              className="mt-4 bg-accent text-white py-3 rounded-xl font-semibold hover:bg-accent/80 transition"
            >
              🚀 Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
