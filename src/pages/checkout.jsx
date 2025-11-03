import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { v4 as uuidv4 } from "uuid"; // for generating unique orderID

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [cart, setCart] = useState(location.state || []);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    websiteName: "",
    color: "Green",
    theme: "light",
    logo: "", 
    domain: "",
    note: "",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "logo") setFormData({ ...formData, logo: files[0] });
    else setFormData({ ...formData, [name]: value });
  };

  const handleQuantityChange = (index, delta) => {
    const newCart = [...cart];
    newCart[index].quantity += delta;
    if (newCart[index].quantity < 1) newCart[index].quantity = 1;
    setCart(newCart);
  };

  const getTotal = () =>
    cart.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0);

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

    const requiredFields = ["fullName", "email", "phone", "websiteName", "color", "theme"];
    for (let field of requiredFields) {
      if (!formData[field]?.trim()) {
        toast.error(`Please fill ${field}`);
        return;
      }
    }

    const items = cart
      .filter(item => item.productID && item.quantity > 0 && item.price >= 0 && item.name && item.image)
      .map(item => ({
        productID: item.productID,
        name: item.name,
        quantity: Number(item.quantity),
        price: Number(item.price),
        image: item.image
      }));

    if (!items.length) {
      toast.error("Cart items are invalid! Make sure each item has name and image.");
      return;
    }

    const payload = {
      orderID: uuidv4(),
      items,
      customerName: formData.fullName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      address: formData.domain?.trim() || "No address provided",
      total: getTotal(),
      status: "pending",
      date: new Date(),
    };

    setLoading(true);
    try {
      await axios.post(import.meta.env.VITE_API_URL + "/api/orders", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Order placed successfully!");
      setCart([]);
      navigate("/");
    } catch (err) {
      console.error("Checkout Error:", err.response?.data || err);
      toast.error(err.response?.data?.message || "Internal server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-start pt-10 bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow-lg w-[600px] flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-center mb-4">Checkout & Website Info</h2>

        {/* Cart Items */}
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
            <div>${(Number(item.price) * Number(item.quantity)).toFixed(2)}</div>
          </div>
        ))}
        <div className="text-right font-bold">Total: ${getTotal().toFixed(2)}</div>

        {/* Account Info */}
        <h3 className="font-semibold mt-4">Account Information</h3>
        <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Full Name" className="border p-2 rounded w-full"/>
        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="border p-2 rounded w-full"/>
        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number" className="border p-2 rounded w-full"/>

        {/* Website Info */}
        <h3 className="font-semibold mt-4">Website Information</h3>
        <input type="text" name="websiteName" value={formData.websiteName} onChange={handleChange} placeholder="Website Name" className="border p-2 rounded w-full"/>
        <input type="text" name="color" value={formData.color} onChange={handleChange} placeholder="Green, Blue, etc." className="border p-2 rounded w-full"/>
        <select name="theme" value={formData.theme} onChange={handleChange} className="border p-2 rounded w-full">
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
        <div>
          <label className="text-sm block mb-1">Upload Logo</label>
          <input type="file" name="logo" accept="image/*" onChange={handleChange} />
        </div>
        <input type="text" name="domain" value={formData.domain} onChange={handleChange} placeholder="Domain Name / Address" className="border p-2 rounded w-full"/>
        <textarea name="note" value={formData.note} onChange={handleChange} placeholder="Additional Notes / Requirements" rows="4" className="border p-2 rounded w-full"/>

        {/* Checkout Button */}
        <button onClick={handleCheckout} disabled={loading} className="bg-accent text-white py-2 rounded hover:bg-accent/80 mt-2">
          {loading ? "Placing Order..." : "Checkout"}
        </button>
      </div>
    </div>
  );
}
