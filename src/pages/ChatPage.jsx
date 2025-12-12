import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

export default function ChatPage() {
  const location = useLocation();
  const cartFromState = location.state?.cart || []; // <-- get cart

  const [messages, setMessages] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [message, setMessage] = useState("");
  const [cart, setCart] = useState(cartFromState);

  const BASE_URL = "http://localhost:5000";

  const guestId = localStorage.getItem("guestId") || crypto.randomUUID();
  localStorage.setItem("guestId", guestId);

  const loadMessages = async () => {
    const res = await axios.get(`${BASE_URL}/api/chat?guestId=${guestId}`);
    setMessages(res.data);
  };

  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 1500);
    return () => clearInterval(interval);
  }, []);

  const sendMessage = async () => {
    if (!customerName || !message) return;

    await axios.post(`${BASE_URL}/api/chat`, {
      customerName,
      guestId,
      message,
    });

    setMessage("");
    loadMessages();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4">Chat With Us</h1>

      <input
        className="border px-4 py-2 mb-4 rounded"
        placeholder="Your Name"
        value={customerName}
        onChange={(e) => setCustomerName(e.target.value)}
      />

      {/* Show Cart Items in Chat */}
      {cart.length > 0 && (
        <div className="bg-white w-full max-w-xl p-4 mb-4 rounded border">
          <h2 className="font-semibold text-lg mb-2">Your Cart Items:</h2>
          {cart.map((item, idx) => (
            <div key={idx} className="flex justify-between border-b py-1">
              <span>{item.name} x {item.quantity}</span>
              <span>USD {item.price.toFixed(2)}</span>
            </div>
          ))}
        </div>
      )}

      {/* Messages */}
      <div className="bg-white w-full max-w-xl p-4 h-[450px] overflow-y-auto">
        {messages.map((msg) => (
          <div key={msg._id} className="my-2">
            <b>{msg.sender === "admin" ? "Admin" : msg.customerName}: </b>
            {msg.message}
          </div>
        ))}
      </div>

      <div className="mt-4 flex w-full max-w-xl">
        <input
          className="flex-1 border px-4 py-2 rounded mr-2"
          placeholder="Type message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
