import { useEffect, useState } from "react";
import axios from "axios";
import { FaBell, FaUsers, FaBoxOpen, FaShoppingCart, FaComments } from "react-icons/fa";
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
  CartesianGrid,
} from "recharts";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function AdminDashboard() {

  const navigate = useNavigate();

  /* ================= STATE ================= */

  const [cards, setCards] = useState({
    users: 0,
    chats: 0,
    orders: 0,
    products: 0,
  });

  const [stats, setStats] = useState([]);

  const [error, setError] = useState("");

  const [unreadTotal, setUnreadTotal] = useState(0);

  const [newOrdersCount, setNewOrdersCount] = useState(0);


  /* ================= TOKEN ================= */

  const getToken = () => {
    return localStorage.getItem("token");
  };


  /* ================= FETCH ADMIN STATS ================= */

  const fetchStats = async () => {

    try {

      const res = await axios.get(
        `${BASE_URL}/api/admin/stats`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`
          }
        }
      );

      setCards(prev => ({
        ...prev,
        users: res.data?.users || 0,
        chats: res.data?.chats || 0,
        orders: res.data?.orders || 0,
      }));

      setError("");

    }
    catch (err) {

      console.error(err);

      setError("Failed to load stats");

    }

  };


  /* ================= FETCH PRODUCTS ================= */

  const fetchProducts = async () => {

    try {

      const res = await axios.get(
        `${BASE_URL}/api/products`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`
          }
        }
      );

      const products = res.data || [];

      setCards(prev => ({
        ...prev,
        products: products.length
      }));

    }
    catch (err) {

      console.error("Products error:", err);

    }

  };


  /* ================= FETCH ORDERS ================= */

 const fetchOrders = async () => {
  try {

    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await axios.get(
      `${BASE_URL}/api/orders`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const orders = Array.isArray(res.data) ? res.data : [];

    setCards(prev => ({
      ...prev,
      orders: orders.length
    }));

    // safer pending check
    const pendingOrders = orders.filter(
      order => order.status && order.status === "Pending"
    );

    setNewOrdersCount(pendingOrders.length);

  } catch (err) {

    console.error("Orders error:", err.response?.data || err.message);

    setNewOrdersCount(0);

  }
};



  /* ================= FETCH CHATS ================= */

  const fetchChats = async () => {
  try {

    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await axios.get(
      `${BASE_URL}/api/chat/customers`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const customers = Array.isArray(res.data) ? res.data : [];

    // total chats = total customers
    setCards(prev => ({
      ...prev,
      chats: customers.length
    }));

    // calculate unread safely
    const unread = customers.reduce(
      (sum, customer) =>
        sum + (Number(customer.unreadCount) || 0),
      0
    );

    setUnreadTotal(unread);

  } catch (err) {

    console.error("Chat error:", err.response?.data || err.message);

    setUnreadTotal(0);

  }
};




  /* ================= UPDATE CHART ================= */

  useEffect(() => {

    setStats([
      { name: "Users", value: cards.users },
      { name: "Products", value: cards.products },
      { name: "Orders", value: cards.orders },
      { name: "Chats", value: cards.chats },
    ]);

  }, [cards]);


  /* ================= LOAD DATA ================= */

  useEffect(() => {

    fetchStats();
    fetchProducts();
    fetchOrders();
    fetchChats();

    const interval = setInterval(() => {

      fetchStats();
      fetchProducts();
      fetchOrders();
      fetchChats();

    }, 5000);

    return () => clearInterval(interval);

  }, []);


  /* ================= CARD COMPONENT ================= */

  const Card = ({ title, value, icon, color, onClick, notify }) => (

    <div
      onClick={onClick}
      className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition cursor-pointer border-t-4"
      style={{ borderColor: color }}
    >

      <div className="flex justify-between items-center">

        <div>

          <h3 className="text-gray-500 font-semibold">
            {title}
          </h3>

          <h1 className="text-3xl font-bold mt-1">
            {value}
          </h1>

        </div>

        <div className="text-3xl relative">

          {icon}

          {notify > 0 && (
            <FaBell className="text-red-500 absolute -top-3 -right-3 animate-pulse"/>
          )}

        </div>

      </div>

    </div>

  );


  /* ================= UI ================= */

  return (

    <div className="min-h-screen bg-gray-100 p-8">

      <h1 className="text-2xl font-bold mb-6">
        Admin Dashboard
      </h1>


      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}


      {/* ================= CARDS ================= */}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">

        <Card
          title="Users"
          value={cards.users}
          icon={<FaUsers className="text-blue-500"/>}
          color="#3b82f6"
          onClick={() => navigate("/admin/users")}
        />

        <Card
          title="Products"
          value={cards.products}
          icon={<FaBoxOpen className="text-purple-500"/>}
          color="#8b5cf6"
          onClick={() => navigate("/admin/products")}
        />

        <Card
          title="Orders"
          value={cards.orders}
          icon={<FaShoppingCart className="text-green-500"/>}
          color="#22c55e"
          notify={newOrdersCount}
          onClick={() => navigate("/admin/orders")}
        />

        <Card
          title="Chats"
          value={cards.chats}
          icon={<FaComments className="text-yellow-500"/>}
          color="#eab308"
          notify={unreadTotal}
          onClick={() => navigate("/admin/chat")}
        />

      </div>


      {/* ================= CHARTS ================= */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* BAR */}

        <div className="bg-white p-6 rounded-xl shadow">

          <h3 className="font-semibold mb-4">
            System Overview
          </h3>

          <ResponsiveContainer width="100%" height={250}>

            <BarChart data={stats}>

              <CartesianGrid strokeDasharray="3 3"/>

              <XAxis dataKey="name"/>

              <YAxis/>

              <Tooltip/>

              <Bar dataKey="value"/>

            </BarChart>

          </ResponsiveContainer>

        </div>


        {/* LINE */}

        <div className="bg-white p-6 rounded-xl shadow">

          <h3 className="font-semibold mb-4">
            Growth Trend
          </h3>

          <ResponsiveContainer width="100%" height={250}>

            <LineChart data={stats}>

              <CartesianGrid strokeDasharray="3 3"/>

              <XAxis dataKey="name"/>

              <YAxis/>

              <Tooltip/>

              <Line
                type="monotone"
                dataKey="value"
                strokeWidth={3}
              />

            </LineChart>

          </ResponsiveContainer>

        </div>

      </div>

    </div>

  );

}
