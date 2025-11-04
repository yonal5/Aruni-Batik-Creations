import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [cart, setCart] = useState(location.state || []);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleQuantityChange = (index, delta) => {
    const newCart = [...cart];
    newCart[index].quantity += delta;
    if (newCart[index].quantity < 1) newCart[index].quantity = 1;
    setCart(newCart);
  };

  const getTotal = () =>
    cart.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0);

  const handleCheckout = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    if (!cart.length) {
      toast.error("Cart is empty!");
      return;
    }

    const payload = {
      items: cart
        .filter(i => i.productID && i.quantity > 0)
        .map(i => ({
          productID: i.productID,
          quantity: i.quantity,
        })),
      phone: formData.phone || "Not provided",
      address: formData.address || "Not provided",
    };

    if (!payload.items.length) {
      toast.error("Cart items are invalid!");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        import.meta.env.VITE_API_URL + "/api/orders",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Order placed successfully!");
      navigate("/");
    } catch (err) {
      console.error("Checkout Error:", err);
      toast.error(err?.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-start pt-10 bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow-lg w-[600px] flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-center mb-4">Checkout</h2>

        <h3 className="font-semibold">Cart Items</h3>
        {cart.map((item, index) => (
          <div key={index} className="flex items-center justify-between border p-2 rounded">
            <div>
              <span className="font-semibold">{item.name}</span> <br />
              <span className="text-sm text-gray-500">{item.productID}</span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => handleQuantityChange(index, -1)}>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => handleQuantityChange(index, 1)}>+</button>
            </div>
            <div>${((item.price || 0) * (item.quantity || 0)).toFixed(2)}</div>
          </div>
        ))}
        <div className="text-right font-bold">Total: ${getTotal().toFixed(2)}</div>

        <h3 className="font-semibold mt-4">Account Info</h3>
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Phone Number"
          className="border p-2 rounded w-full"
        />
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Address"
          className="border p-2 rounded w-full"
        />

        <button
          onClick={handleCheckout}
          disabled={loading}
          className="bg-accent text-white py-2 rounded hover:bg-accent/80 mt-2"
        >
          {loading ? "Placing Order..." : "Checkout"}
        </button>
      </div>
    </div>
  );
}
