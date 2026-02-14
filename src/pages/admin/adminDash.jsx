import { useEffect, useState } from "react";
import axios from "axios";
import { FaBell } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line,} from "recharts";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function AdminDashboard() {
  const navigate = useNavigate();

  /* ---------------- STATES ---------------- */

  const [stats, setStats] = useState([]);
  const [cards, setCards] = useState({
    users: 0,
    chats: 0,
    orders: 0,
  });

  const [error, setError] = useState("");

  // 🔔 chat notification
  const [unreadTotal, setUnreadTotal] = useState(0);
  const [unreadUsers, setUnreadUsers] = useState([]);

  // 🛒 order notification
  const [newOrdersCount, setNewOrdersCount] = useState(0);
  const [newOrdersUsers, setNewOrdersUsers] = useState([]);

  /* ---------------- FETCH ADMIN STATS ---------------- */

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Unauthorized. Please login again.");
        return;
      }

      const res = await axios.get(`${BASE_URL}/api/admin/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const users = res.data?.users ?? 0;
      const chats = res.data?.chats ?? 0;
      const orders = res.data?.orders ?? 0;

      setCards({
        users,
        chats,
        orders,
      });

      setStats([
        { name: "Users", value: users },
        { name: "Chats", value: chats },
        { name: "Orders", value: orders },
      ]);

      setError("");

    } catch (err) {
      console.error("Admin stats error:", err);
      setError("Failed to load admin statistics.");
    }
  };

  /* ---------------- FETCH UNREAD CHATS ---------------- */

  const fetchUnreadChats = async () => {
    try {

      const token = localStorage.getItem("token");

      const res = await axios.get(`${BASE_URL}/api/chat/customers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const customers = res.data || [];

      const totalUnread = customers.reduce(
        (sum, c) => sum + (c.unreadCount || 0),
        0
      );

      const usersWithUnread = customers
        .filter((c) => c.unreadCount > 0)
        .slice(0, 2)
        .map((c) => c.userId);

      setUnreadTotal(totalUnread);
      setUnreadUsers(usersWithUnread);

    } catch (err) {
      console.error("Unread chat fetch failed:", err);
    }
  };

  /* ---------------- FETCH ORDERS ---------------- */

  const fetchOrders = async () => {
    try {

      const token = localStorage.getItem("token");

      const res = await axios.get(`${BASE_URL}/api/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const orders = res.data || [];

      // total orders
      setCards(prev => ({
        ...prev,
        orders: orders.length
      }));

      // pending orders
      const pendingOrders = orders.filter(
        order => order.status === "Pending"
      );

      setNewOrdersCount(pendingOrders.length);

      setNewOrdersUsers(
        pendingOrders
          .slice(0, 2)
          .map(order => order.userId)
      );

    } catch (err) {
      console.error("Orders fetch failed:", err);
    }
  };

  /* ---------------- AUTO REFRESH ---------------- */

  useEffect(() => {

    fetchStats();
    fetchUnreadChats();
    fetchOrders();

    const interval = setInterval(() => {

      fetchStats();
      fetchUnreadChats();
      fetchOrders();

    }, 5000);

    return () => clearInterval(interval);

  }, []);

  /* ---------------- UI ---------------- */

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">

      <main className="flex-1 p-8">

        {/* ERROR */}
        {error && (
          <div className="mb-6 rounded-lg bg-red-100 p-4 text-red-700">
            {error}
          </div>
        )}

        {/* CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

          {/* USERS */}
          <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-accent">

            <h3 className="text-accent text-lg font-semibold">
              Users
            </h3>

            <h1 className="text-3xl font-bold mt-2">
              {cards.users}
            </h1>

          </div>


          {/* CHATS */}
          <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-accent">

            <h3 className="text-accent text-lg font-semibold flex items-center gap-2">

              Chats

              {unreadTotal > 0 && (
                <button
                  onClick={() => navigate("/admin/chat")}
                  title="Open chats"
                >
                  <FaBell className="text-yellow-500 animate-pulse text-xl"/>
                </button>
              )}

            </h3>

            <h1 className="text-3xl font-bold mt-2">
              {cards.chats}
            </h1>

            {unreadTotal > 0 && (
              <div className="mt-3 text-sm text-gray-600">

                <p>
                  🔔 <b>{unreadTotal}</b> new chats
                </p>

                <p className="mt-1">
                  👤 From:

                  {unreadUsers.map(id => (
                    <span
                      key={id}
                      className="ml-2 bg-gray-200 px-2 py-1 rounded text-xs"
                    >
                      {id}
                    </span>
                  ))}

                </p>

              </div>
            )}

          </div>


          {/* ORDERS */}
          <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-accent">

            <h3 className="text-accent text-lg font-semibold flex items-center gap-2">

              Orders

              {newOrdersCount > 0 && (
                <button
                  onClick={() => navigate("/admin/orders")}
                  title="Open orders"
                >
                  <FaBell className="text-green-500 animate-pulse text-xl"/>
                </button>
              )}

            </h3>

            <h1 className="text-3xl font-bold mt-2">
              {cards.orders}
            </h1>

            {newOrdersCount > 0 && (
              <div className="mt-3 text-sm text-gray-600">

                <p>
                  🛒 <b>{newOrdersCount}</b> new orders
                </p>

                <p className="mt-1">
                  👤 From:

                  {newOrdersUsers.map(id => (
                    <span
                      key={id}
                      className="ml-2 bg-gray-200 px-2 py-1 rounded text-xs"
                    >
                      {id}
                    </span>
                  ))}

                </p>

              </div>
            )}

          </div>

        </div>


        {/* CHARTS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-accent">

            <h4 className="text-accent font-semibold mb-4">
              Activity
            </h4>

            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={stats}>
                <XAxis dataKey="name"/>
                <YAxis/>
                <Tooltip/>
                <Bar dataKey="value"/>
              </BarChart>
            </ResponsiveContainer>

          </div>


          <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-accent">

            <h4 className="text-accent font-semibold mb-4">
              Growth
            </h4>

            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={stats}>
                <XAxis dataKey="name"/>
                <YAxis/>
                <Tooltip/>
                <Line type="monotone" dataKey="value" strokeWidth={3}/>
              </LineChart>
            </ResponsiveContainer>

          </div>

        </div>

      </main>

    </div>
  );
}

