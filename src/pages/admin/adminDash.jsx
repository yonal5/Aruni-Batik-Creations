import { useEffect, useState } from "react";
import axios from "axios";
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

  const [stats, setStats] = useState([]);
  const [cards, setCards] = useState({
    users: 0,
    chats: 0,
    orders: 0,
  });

  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  /*
  FETCH DASHBOARD DATA
  */
  const fetchDashboard = async () => {
    try {

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Unauthorized");
        return;
      }

      /* GET ADMIN STATS */
      const statsRes = await axios.get(
        `${BASE_URL}/api/admin/stats`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      /* GET ORDERS */
      const ordersRes = await axios.get(
        `${BASE_URL}/api/orders`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const users = statsRes.data?.users ?? 0;
      const chats = statsRes.data?.chats ?? 0;
      const ordersCount = ordersRes.data?.length ?? 0;

      setCards({
        users,
        chats,
        orders: ordersCount,
      });

      setOrders(ordersRes.data);

      setStats([
        { name: "Users", value: users },
        { name: "Chats", value: chats },
        { name: "Orders", value: ordersCount },
      ]);

      setError("");

    } catch (err) {
      console.log(err);
      setError("Failed to load dashboard");
    }
  };

  /*
  AUTO REFRESH
  */
  useEffect(() => {

    fetchDashboard();

    const interval = setInterval(fetchDashboard, 5000);

    return () => clearInterval(interval);

  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">

      <main className="flex-1 p-8">

        {/* ERROR */}
        {error && (
          <div className="mb-6 bg-red-100 text-red-700 p-4 rounded-lg">
            {error}
          </div>
        )}

        {/* CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

          {/* USERS */}
          <div className="bg-white p-6 rounded-lg shadow border-t-4 border-accent">
            <h3 className="text-accent font-semibold">
              Users
            </h3>
            <h1 className="text-3xl font-bold mt-2">
              {cards.users}
            </h1>
          </div>

          {/* CHATS */}
          <div className="bg-white p-6 rounded-lg shadow border-t-4 border-accent">
            <h3 className="text-accent font-semibold">
              Chats
            </h3>
            <h1 className="text-3xl font-bold mt-2">
              {cards.chats}
            </h1>
          </div>

          {/* ORDERS */}
          <div className="bg-white p-6 rounded-lg shadow border-t-4 border-accent">
            <h3 className="text-accent font-semibold">
              Orders
            </h3>
            <h1 className="text-3xl font-bold mt-2">
              {cards.orders}
            </h1>
          </div>

        </div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

          <div className="bg-white p-6 rounded-lg shadow border-t-4 border-accent">
            <h4 className="text-accent font-semibold mb-4">
              Activity
            </h4>

            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={stats}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" />
              </BarChart>
            </ResponsiveContainer>

          </div>

          <div className="bg-white p-6 rounded-lg shadow border-t-4 border-accent">
            <h4 className="text-accent font-semibold mb-4">
              Growth
            </h4>

            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={stats}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>

          </div>

        </div>

        {/* RECENT ORDERS TABLE */}
        <div className="bg-white rounded-lg shadow border-t-4 border-accent">

          <div className="p-4 border-b">

            <h3 className="font-semibold text-accent">
              Recent Orders
            </h3>

          </div>

          <div className="overflow-x-auto">

            <table className="w-full text-left">

              <thead className="bg-secondary text-white">

                <tr>
                  <th className="px-4 py-3">Order ID</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Date</th>
                </tr>

              </thead>

              <tbody>

                {orders.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center py-6">
                      No orders found
                    </td>
                  </tr>
                )}

                {orders.slice(0, 5).map(order => (

                  <tr
                    key={order.orderID}
                    className="border-b hover:bg-gray-100"
                  >

                    <td className="px-4 py-3">
                      {order.orderID}
                    </td>

                    <td className="px-4 py-3">
                      {order.customerName}
                    </td>

                    <td className="px-4 py-3">
                      LKR {order.total.toFixed(2)}
                    </td>

                    <td className="px-4 py-3">
                      {order.status}
                    </td>

                    <td className="px-4 py-3">
                      {new Date(order.date).toLocaleDateString()}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      </main>

    </div>
  );
}
