import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { FaBell } from "react-icons/fa"; // ✅ ADDED

export default function UserData() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoutMessage, setLogoutMessage] = useState("");
  const [unreadCount, setUnreadCount] = useState(0); // ✅ ADDED

  const menuRef = useRef(null);
  const btnRef = useRef(null);

  /* ================= FETCH USER ================= */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return setLoading(false);

    axios
      .get(`${import.meta.env.VITE_API_URL}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data))
      .catch(() => {
        localStorage.removeItem("token");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  /* ================= LOAD UNREAD COUNT ================= */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const loadUnread = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/chat/unread-count`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setUnreadCount(res.data.count || 0);

      } catch {
        setUnreadCount(0);
      }
    };

    loadUnread();
    const interval = setInterval(loadUnread, 3000);

    return () => clearInterval(interval);

  }, []);

  /* ================= CLICK OUTSIDE ================= */
  useEffect(() => {
    function close(e) {
      if (
        menuOpen &&
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        btnRef.current &&
        !btnRef.current.contains(e.target)
      ) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);

  }, [menuOpen]);

  /* ================= HELPERS ================= */
  const initials =
    user?.firstName || user?.lastName
      ? `${(user.firstName?.[0] ?? "")}${(user.lastName?.[0] ?? "")}`.toUpperCase()
      : "U";

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setMenuOpen(false);

    setLogoutMessage("You have successfully logged out");

    setTimeout(() => {
      setLogoutMessage("");
      window.location.href = "/login";
    }, 1000);
  };

  /* ================= AVATAR ================= */
  const avatarSrc =
    user?.image ||
    user?.profileImage ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      `${user?.firstName || "User"}`
    )}&background=0D8ABC&color=fff`;

  /* ================= GO TO CHAT ================= */
  const goToChat = () => {
    window.location.href = "/chat";
  };

  /* ================= RENDER ================= */
  return (
    <div className="relative flex items-center justify-end gap-3 shrink-0">

      {/* Logout message */}
      {logoutMessage && (
        <div className="fixed top-6 right-6 z-[9999] rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-lg animate-fade-in">
          {logoutMessage}
        </div>
      )}

      {loading && (
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-b-transparent" />
      )}

      {!loading && !user && (
        <a
          href="/login"
          className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white"
        >
          Login
        </a>
      )}

      {user && (
        <>
          {/* 🔔 NOTIFICATION BELL */}
          <div
            onClick={goToChat}
            className="relative cursor-pointer flex items-center justify-center w-10 h-10 rounded-full hover:bg-secondary/10"
          >
            <FaBell className="text-lg" />

            {/* unread badge */}
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 rounded-full animate-pulse">
                {unreadCount}
              </span>
            )}
          </div>

          {/* USER BAR */}
          <div className="relative">

            <div
              className="
                flex items-center gap-2 rounded-full bg-primary/80
                px-3 py-1.5 ring-1 ring-secondary/10
                max-[1124px]:px-2
              "
            >

              {/* Avatar */}
              <img
                src={avatarSrc}
                alt="User"
                className="h-9 w-9 rounded-full object-cover ring-2 ring-accent/50"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=User`;
                }}
              />

              {/* Name */}
              <div className="flex flex-col leading-tight max-[1124px]:hidden">
                <span className="text-sm font-semibold text-secondary">
                  {user.firstName}
                </span>
                {user.role && (
                  <span className="text-[11px] text-secondary/70">
                    {user.role}
                  </span>
                )}
              </div>

              {/* Menu button */}
              <button
                ref={btnRef}
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-secondary/10"
              >
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm0 5.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM11.5 15.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z" />
                </svg>
              </button>

            </div>

            {/* DROPDOWN unchanged */}
            {menuOpen && (
              <div
                ref={menuRef}
                className="
                  absolute top-12 z-50 w-56 rounded-xl bg-white p-1.5 shadow-lg
                  left-1/2 -translate-x-1/2
                  lg:left-auto lg:translate-x-0 lg:right-0
                "
              >

                <MenuItem
                  onClick={() => (window.location.href = "/settings")}
                  label="Account Settings"
                />

                <MenuItem
                  onClick={() => (window.location.href = "/cart")}
                  label="Cart"
                />

                {user.role === "admin" && (
                  <MenuItem
                    onClick={() => (window.location.href = "/admin")}
                    label="Admin Panel"
                  />
                )}

                <MenuItem label="Logout" onClick={logout} destructive />

              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

/* MENU ITEM unchanged */
function MenuItem({ label, to, onClick, destructive }) {
  return (
    <button
      onClick={onClick || (() => (window.location.href = to))}
      className={`w-full rounded-lg px-3 py-2 text-left text-sm transition ${
        destructive
          ? "text-red-600 hover:bg-red-50"
          : "text-secondary hover:bg-primary"
      }`}
    >
      {label}
    </button>
  );
}
