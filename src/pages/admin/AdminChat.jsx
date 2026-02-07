import { useEffect, useRef, useState } from "react";
import axios from "axios";
import mediaUpload from "../utils/mediaUpload";
import { FaImage, FaPaperPlane } from "react-icons/fa";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function AdminChat() {
  const [customers, setCustomers] = useState([]);
  const [selectedGuestId, setSelectedGuestId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef();

  // Load customer list
  const loadCustomers = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/chat/customers`);
      setCustomers(res.data);

      // auto-select first customer if none selected
      if (!selectedGuestId && res.data.length > 0) {
        setSelectedGuestId(res.data[0].userId);
      }
    } catch (err) {
      console.error("Load customers failed:", err);
    }
  };

  // Load messages for selected customer
  const loadMessages = async () => {
    if (!selectedGuestId) return;

    try {
      const res = await axios.get(
        `${BASE_URL}/api/chat/admin`,
        { params: { guestId: selectedGuestId } }
      );
      setMessages(res.data);
    } catch (err) {
      console.error("Load messages failed:", err);
    }
  };

  // Polling customers and messages
  useEffect(() => {
    loadCustomers();
    loadMessages();

    const interval = setInterval(() => {
      loadCustomers();
      loadMessages();
    }, 2000);

    return () => clearInterval(interval);
  }, [selectedGuestId]);

  // Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send text message
  const sendText = async () => {
    if (!text.trim() || !selectedGuestId) return;

    try {
      setLoading(true);
      await axios.post(`${BASE_URL}/api/chat/admin/send`, {
        guestId: selectedGuestId,
        message: text,
        type: "text",
      });
      setText("");
      loadMessages();
    } catch (err) {
      console.error("Send text failed:", err);
    }
    setLoading(false);
  };

  // Send image
  const sendImage = async () => {
    if (!image || !selectedGuestId) return;

    try {
      setLoading(true);
      const imageUrl = await mediaUpload(image);
      await axios.post(`${BASE_URL}/api/chat/admin/send`, {
        guestId: selectedGuestId,
        imageUrl,
        type: "image",
      });
      setImage(null);
      loadMessages();
    } catch (err) {
      console.error("Send image failed:", err);
    }
    setLoading(false);
  };

  return (
    <div className="flex h-screen bg-gray-100">

      {/* CUSTOMER LIST */}
      <div className="w-80 bg-white border-r flex flex-col">
        <div className="p-4 font-bold border-b">Customers</div>
        <div className="flex-1 overflow-y-auto">
          {customers.map((c) => (
            <div
              key={c.userId}
              onClick={() => setSelectedGuestId(c.userId)}
              className={`p-3 border-b cursor-pointer hover:bg-gray-100 ${
                selectedGuestId === c.userId ? "bg-green-100" : ""
              }`}
            >
              <div className="flex justify-between">
                <span>{c.customerName || c.userId}</span>
                {c.unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {c.unreadCount}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CHAT AREA */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b bg-white font-semibold">
          {customers.find((c) => c.userId === selectedGuestId)?.customerName ||
            "Select a customer"}
        </div>

        <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
          {messages.map((m) => (
            <div
              key={m._id}
              className={`flex mb-2 ${
                m.sender === "admin" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-3 py-2 rounded-lg max-w-xs shadow ${
                  m.sender === "admin" ? "bg-green-500 text-white" : "bg-white"
                }`}
              >
                {m.type === "image" ? (
                  <img src={m.imageUrl} alt="" className="rounded max-w-[220px]" />
                ) : (
                  m.message
                )}
                <div className="text-xs text-gray-400 mt-1">
                  {new Date(m.createdAt).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
          <div ref={chatEndRef}></div>
        </div>

        {/* INPUT */}
        <div className="p-3 bg-white flex gap-2 items-center border-t">
          <label className="cursor-pointer">
            <FaImage size={22} />
            <input
              type="file"
              hidden
              onChange={(e) => setImage(e.target.files[0])}
            />
          </label>
          <input
            className="flex-1 border px-3 py-2 rounded-full"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendText()}
          />
          <button
            onClick={sendText}
            disabled={loading}
            className="bg-green-500 text-white p-3 rounded-full"
          >
            <FaPaperPlane />
          </button>
          {image && (
            <button
              onClick={sendImage}
              className="bg-blue-500 text-white px-3 py-2 rounded"
            >
              Upload
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
