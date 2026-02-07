import { useEffect, useRef, useState } from "react";
import axios from "axios";
import mediaUpload from "../utils/mediaUpload";
import { FaImage, FaPaperPlane } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function ChatPage({ user }) {

  const navigate = useNavigate();
  const location = useLocation();

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [sending, setSending] = useState(false);
  const chatEndRef = useRef(null);

  /* ---------------- GUEST ID ---------------- */
  const [guestId] = useState(() => {
    let id = localStorage.getItem("guestId");
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("guestId", id);
    }
    return id;
  });

  /* ---------------- CUSTOMER NAME ---------------- */
  const customerName =
    user?.name ||
    user?.username ||
    `User-${guestId.slice(0, 6)}`;

  /* ---------------- AUTH CHECK ---------------- */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  /* ---------------- LOAD MESSAGES ---------------- */
  const loadMessages = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/chat`,
        { params: { guestId } }
      );

      setMessages(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Load messages failed:", err);
    }
  };

  /* ---------------- POLLING ---------------- */
  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 2000);
    return () => clearInterval(interval);
  }, []);

  /* ---------------- AUTO SCROLL ---------------- */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ---------------- SEND TEXT ---------------- */
  const sendText = async () => {
    if (!text.trim() || sending) return;

    try {
      setSending(true);

      await axios.post(`${BASE_URL}/api/chat`, {
        guestId,
        customerName,
        message: text,
        type: "text",
      });

      setText("");
      loadMessages();
    } catch (err) {
      console.error("Send failed:", err);
    }

    setSending(false);
  };

  /* ---------------- SEND IMAGE ---------------- */
  const sendImage = async () => {
    if (!image || sending) return;

    try {
      setSending(true);

      const imageUrl = await mediaUpload(image);

      await axios.post(`${BASE_URL}/api/chat`, {
        guestId,
        customerName,
        imageUrl,
        type: "image",
        message: "Image",
      });

      setImage(null);
      loadMessages();
    } catch (err) {
      console.error("Image send failed:", err);
    }

    setSending(false);
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white">

      {/* HEADER */}
      <div className="p-4 border-b border-accent text-accent font-bold">
        Chat with Admin
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">

        {messages.map(m => (
          <div
            key={m._id}
            className={`flex ${
              m.sender === "admin"
                ? "justify-start"
                : "justify-end"
            }`}
          >
            <div
              className={`max-w-xs px-3 py-2 rounded shadow ${
                m.sender === "admin"
                  ? "bg-white text-black"
                  : "bg-accent text-black"
              }`}
            >
              {m.type === "image" && m.imageUrl ? (
                <img
                  src={m.imageUrl}
                  alt="chat"
                  className="rounded max-w-[220px]"
                />
              ) : (
                m.message
              )}

              <div className="text-xs opacity-60 mt-1">
                {new Date(m.createdAt).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}

        <div ref={chatEndRef} />
      </div>

      {/* INPUT */}
      <div className="p-3 border-t border-accent flex gap-2 items-center">

        <label className="cursor-pointer text-accent">
          <FaImage size={22} />
          <input
            hidden
            type="file"
            onChange={e => setImage(e.target.files[0])}
          />
        </label>

        <input
          className="flex-1 px-3 py-2 rounded bg-black border border-accent text-white"
          placeholder="Type message..."
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendText()}
        />

        <button
          onClick={sendText}
          disabled={sending}
          className="bg-accent text-black p-3 rounded hover:opacity-80"
        >
          <FaPaperPlane />
        </button>

        {image && (
          <button
            onClick={sendImage}
            className="bg-accent text-black px-3 py-2 rounded"
          >
            Upload
          </button>
        )}

      </div>

    </div>
  );
}
