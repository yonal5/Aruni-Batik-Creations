import { useEffect, useRef, useState } from "react";
import axios from "axios";
import mediaUpload from "../utils/mediaUpload";
import { useLocation, useNavigate } from "react-router-dom";
import { FaImage, FaPaperPlane } from "react-icons/fa";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function ChatPage({ user }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [authError, setAuthError] = useState("");
  const cartFromState = location.state?.cart || [];
  const [messages, setMessages] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [text, setText] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [sending, setSending] = useState(false);
  const [cart] = useState(cartFromState);
  const chatEndRef = useRef();

  const [guestId] = useState(() => {
    let id = localStorage.getItem("guestId");
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("guestId", id);
    }
    return id;
  });

  const [userNumber] = useState(() => {
    let num = localStorage.getItem("guestNumber");
    if (!num) {
      num = Math.floor(100000 + Math.random() * 900000);
      localStorage.setItem("guestNumber", num);
    }
    return num;
  });

  // Notification sound when admin sends message
  const notificationSound = new Audio("/notification.mp3");

  // Auth check
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setAuthError("⚠️ You are not logged in. Redirecting to login page...");
      const timer = setTimeout(() => {
        navigate("/login", { replace: true, state: { from: location.pathname } });
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [navigate, location.pathname]);

  // Set customer name
  useEffect(() => {
    if (user?.name || user?.username) {
      setCustomerName(user.name || user.username);
    } else {
      setCustomerName(`User-${userNumber}`);
    }
  }, [user, userNumber]);

  // Load messages
  const loadMessages = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/chat`, {
        params: { guestId },
        headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` },
      });

      const data = Array.isArray(res.data) ? res.data : res.data.messages || [];

      // Play notification if new admin message
      const lastMsg = data[data.length - 1];
      if (lastMsg?.sender === "admin" && !messages.find(m => m._id === lastMsg._id)) {
        notificationSound.play().catch(() => {});
      }

      setMessages(data);
    } catch (err) {
      console.error("Load messages failed:", err);
      setMessages([]);
    }
  };

  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 2000);
    return () => clearInterval(interval);
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send text
  const sendText = async () => {
    if (!text.trim() || sending) return;
    setSending(true);

    try {
      await axios.post(`${BASE_URL}/api/chat`, {
        guestId,
        customerName,
        type: "text",
        message: text.trim(),
      });
      setText("");
      loadMessages();
    } catch (err) {
      console.error("Send text failed:", err);
      alert("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  // Send image
  const sendImage = async () => {
    if (!selectedImage || sending) return;
    setSending(true);

    try {
      const imageUrl = await mediaUpload(selectedImage);
      await axios.post(`${BASE_URL}/api/chat`, {
        guestId,
        customerName,
        type: "image",
        imageUrl,
        message: "Image uploaded",
      });
      setSelectedImage(null);
      loadMessages();
    } catch (err) {
      console.error("Send image failed:", err);
      alert("Failed to upload image");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col items-center">
      {authError && (
        <div className="bg-red-100 text-red-700 border border-red-300 px-4 py-3 mb-3 rounded w-full max-w-xl text-center">
          {authError}
        </div>
      )}

      <h1 className="text-2xl font-bold mb-3">Chat With Us</h1>

      <input
        className="border px-4 py-2 mb-3 rounded w-full max-w-xl bg-gray-100"
        value={customerName}
        readOnly
      />

      {/* Cart */}
      {cart.length > 0 && (
        <div className="bg-white w-full max-w-xl p-3 mb-3 rounded border">
          <h2 className="font-semibold mb-2">Your Cart</h2>
          {cart.map((item, idx) => (
            <div key={idx} className="flex justify-between text-sm">
              <span>{item.name} × {item.quantity}</span>
              <span>${item.price.toFixed(2)}</span>
            </div>
          ))}
        </div>
      )}

      {/* Chat Messages */}
      <div className="bg-white w-full max-w-xl p-3 h-[60vh] overflow-y-auto rounded border">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`my-2 flex ${
              msg.sender === "admin" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-3 py-2 rounded-lg max-w-xs shadow break-words ${
                msg.sender === "admin" ? "bg-green-500 text-white" : "bg-gray-200"
              }`}
            >
              {msg.type === "image" && msg.imageUrl ? (
                <img src={msg.imageUrl} alt="" className="rounded max-w-[220px]" />
              ) : (
                msg.message
              )}
              <div className="text-xs text-gray-400 mt-1">
                {new Date(msg.createdAt).toLocaleString()}
              </div>
            </div>
          </div>
        ))}
        <div ref={chatEndRef}></div>
      </div>

      {/* Input */}
      <div className="mt-3 flex w-full max-w-xl items-center gap-2">
        <label className="cursor-pointer">
          <FaImage size={22} />
          <input
            type="file"
            hidden
            onChange={(e) => setSelectedImage(e.target.files[0])}
          />
        </label>
        <input
          className="flex-1 border px-4 py-2 rounded-l"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendText()}
        />
        <button
          onClick={sendText}
          disabled={sending}
          className="bg-blue-600 text-white px-5 py-2 rounded-r disabled:opacity-50"
        >
          <FaPaperPlane />
        </button>
        {selectedImage && (
          <button
            onClick={sendImage}
            className="bg-blue-500 text-white px-3 py-2 rounded"
          >
            Upload
          </button>
        )}
      </div>
    </div>
  );
}
