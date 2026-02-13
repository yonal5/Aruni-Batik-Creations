import { useEffect, useState } from "react";
import { loadCart, saveCart, getTotal } from "../utils/cart";
import { CiCircleChevUp, CiCircleChevDown } from "react-icons/ci";
import { BiTrash } from "react-icons/bi";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

export default function CheckoutPage() {

  const navigate = useNavigate();

  const [cart, setCart] = useState([]);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setCart(loadCart());
  }, []);

  function updateQty(index, amount) {

    const newCart = [...cart];

    newCart[index].quantity += amount;

    if (newCart[index].quantity <= 0)
      newCart.splice(index, 1);

    setCart(newCart);

    saveCart(newCart);
  }

  function removeItem(index) {

    const newCart = [...cart];

    newCart.splice(index, 1);

    setCart(newCart);

    saveCart(newCart);
  }

  async function placeOrder() {

    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    if (!form.address) {
      toast.error("Address required");
      return;
    }

    if (cart.length === 0) {
      toast.error("Cart empty");
      return;
    }

    setLoading(true);

    try {

      const items = cart.map(item => ({
        productID: item.productID,
        quantity: item.quantity
      }));

      const res = await axios.post(
        API + "/api/orders",
        {
          customerName: form.name,
          phone: form.phone,
          address: form.address,
          items
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      toast.success("Order placed successfully");

      saveCart([]);

      navigate("/orders");

    } catch (err) {

      toast.error(err.response?.data?.message || "Order failed");

    } finally {

      setLoading(false);

    }

  }

  return (

    <div className="min-h-screen bg-gray-100 flex justify-center p-4">

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* LEFT */}
        <div className="lg:col-span-2 bg-white p-4 rounded shadow">

          <h2 className="text-xl font-bold mb-4">
            Shipping Information
          </h2>

          <input
            placeholder="Full name"
            className="w-full border p-3 mb-3"
            value={form.name}
            onChange={e =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <input
            placeholder="Phone number"
            className="w-full border p-3 mb-3"
            value={form.phone}
            onChange={e =>
              setForm({ ...form, phone: e.target.value })
            }
          />

          <textarea
            placeholder="Shipping address"
            className="w-full border p-3"
            rows={4}
            value={form.address}
            onChange={e =>
              setForm({ ...form, address: e.target.value })
            }
          />

          <h2 className="text-xl font-bold mt-6 mb-4">
            Cart Items
          </h2>

          {cart.map((item, index) => (

            <div key={index}
              className="flex gap-4 border-b py-4">

              <img
                src={item.image}
                className="w-20 h-20 object-cover"
              />

              <div className="flex-1">

                <h3 className="font-semibold">
                  {item.name}
                </h3>

                <p>LKR {item.price}</p>

                <div className="flex items-center gap-2">

                  <CiCircleChevDown
                    onClick={() => updateQty(index, -1)}
                    className="text-2xl cursor-pointer"
                  />

                  <span>{item.quantity}</span>

                  <CiCircleChevUp
                    onClick={() => updateQty(index, 1)}
                    className="text-2xl cursor-pointer"
                  />

                  <BiTrash
                    onClick={() => removeItem(index)}
                    className="text-red-500 cursor-pointer ml-4"
                  />

                </div>

              </div>

            </div>

          ))}

        </div>


        {/* RIGHT */}
        <div className="bg-white p-4 rounded shadow h-fit">

          <h2 className="text-xl font-bold mb-4">
            Order Summary
          </h2>

          <div className="flex justify-between mb-2">
            <span>Total</span>
            <span>LKR {getTotal().toFixed(2)}</span>
          </div>

          <button
            onClick={placeOrder}
            disabled={loading}
            className="w-full bg-red-500 text-white py-3 mt-4 hover:bg-red-600"
          >
            {loading ? "Processing..." : "Place Order"}
          </button>

        </div>

      </div>

    </div>

  );

}
