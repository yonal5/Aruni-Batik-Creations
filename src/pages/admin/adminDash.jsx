```jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { FaBell } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function AdminDashboard() {

  const navigate = useNavigate();

  /* ================= STATES ================= */

  const [cards, setCards] = useState({
    users: 0,
    chats: 0,
    orders: 0,
    products: 0,
  });

  const [stats, setStats] = useState([]);

  const [error, setError] = useState("");

  const [unreadTotal, setUnreadTotal] = useState(0);
  const [unreadUsers, setUnreadUsers] = useState([]);

  const [newOrdersCount, setNewOrdersCount] = useState(0);
  const [newOrdersUsers, setNewOrdersUsers] = useState([]);


  /* ================= FETCH ADMIN STATS ================= */

  const fetchStats = async () => {
    try {

      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${BASE_URL}/api/admin/stats`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const users = res.data?.users || 0;
      const chats = res.data?.chats || 0;
      const orders = res.data?.orders || 0;

      setCards(prev => ({
        ...prev,
        users,
        chats,
        orders,
      }));

      setError("");

    } catch (err) {

      console.error(err);
      setError("Failed to load admin stats");

    }
  };


  /* ================= FETCH PRODUCTS ================= */

  const fetchProducts = async () => {

    try {

      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${BASE_URL}/api/products`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const products = res.data || [];

      setCards(prev => ({
        ...prev,
        products: products.length,
      }));

    } catch (err) {

      console.error("Products fetch error:", err);

    }

  };


  /* ================= FETCH ORDERS ================= */

  const fetchOrders = async () => {

    try {

      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${BASE_URL}/api/orders`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const orders = res.data || [];

      setCards(prev => ({
        ...prev,
        orders: orders.length,
      }));

      const pending = orders.filter(
        order => order.status === "Pending"
      );

      setNewOrdersCount(pending.length);

      setNewOrdersUsers(
        pending.slice(0, 2).map(order => order.customerName)
      );

    } catch (err) {

      console.error(err);

    }

  };


  /* ================= FETCH CHATS ================= */

  const fetchUnreadChats = async () => {

    try {

      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${BASE_URL}/api/chat/customers`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const customers = res.data || [];

      const total = customers.reduce(
        (sum, c) => sum + (c.unreadCount || 0),
        0
      );

      setUnreadTotal(total);

      setUnreadUsers(
        customers
          .filter(c => c.unreadCount > 0)
          .slice(0, 2)
          .map(c => c.userId)
      );

    } catch (err) {

      console.error(err);

    }

  };


  /* ================= UPDATE CHART ================= */

  useEffect(() => {

    setStats([
      { name: "Users", value: cards.users },
      { name: "Chats", value: cards.chats },
      { name: "Orders", value: cards.orders },
      { name: "Products", value: cards.products },
    ]);

  }, [cards]);


  /* ================= AUTO LOAD ================= */

  useEffect(() => {

    fetchStats();
    fetchProducts();
    fetchOrders();
    fetchUnreadChats();

    const interval = setInterval(() => {

      fetchStats();
      fetchProducts();
      fetchOrders();
      fetchUnreadChats();

    }, 5000);

    return () => clearInterval(interval);

  }, []);



  /* ================= UI ================= */

  return (

    <div className="min-h-screen bg-gray-100 p-8">

      {error && (
        <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">
          {error}
        </div>
      )}


      {/* ================= CARDS ================= */}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">


        {/* USERS */}

        <div className="bg-white p-6 rounded shadow border-t-4 border-blue-500">

          <h3 className="font-semibold text-lg">Users</h3>

          <h1 className="text-3xl font-bold">
            {cards.users}
          </h1>

        </div>



        {/* CHATS */}

        <div className="bg-white p-6 rounded shadow border-t-4 border-yellow-500">

          <h3 className="font-semibold text-lg flex items-center gap-2">

            Chats

            {unreadTotal > 0 && (
              <FaBell
                className="text-yellow-500 cursor-pointer"
                onClick={() => navigate("/admin/chat")}
              />
            )}

          </h3>

          <h1 className="text-3xl font-bold">
            {cards.chats}
          </h1>

          {unreadTotal > 0 && (
            <p className="text-sm text-gray-500 mt-2">
              {unreadTotal} unread chats
            </p>
          )}

        </div>



        {/* ORDERS */}

        <div className="bg-white p-6 rounded shadow border-t-4 border-green-500">

          <h3 className="font-semibold text-lg flex items-center gap-2">

            Orders

            {newOrdersCount > 0 && (
              <FaBell
                className="text-green-500 cursor-pointer"
                onClick={() => navigate("/admin/orders")}
              />
            )}

          </h3>

          <h1 className="text-3xl font-bold">
            {cards.orders}
          </h1>

          {newOrdersCount > 0 && (
            <p className="text-sm text-gray-500 mt-2">
              {newOrdersCount} pending orders
            </p>
          )}

        </div>



        {/* PRODUCTS */}

```
