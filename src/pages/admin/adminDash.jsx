import { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function AdminDashboard() {

  const [activePage, setActivePage] = useState("dashboard");
  const [orders, setOrders] = useState([]);

  /* ================= LOAD ORDERS ================= */

  useEffect(() => {
    if (activePage === "orders") {
      loadOrders();
    }
  }, [activePage]);

  const loadOrders = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/orders`);
      setOrders(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load orders");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`${BASE_URL}/api/orders/${id}`, { status });
      loadOrders();
    } catch {
      alert("Failed to update");
    }
  };

  /* ================= PAGE RENDER ================= */

  const renderPage = () => {

    if (activePage === "orders") {
      return (
        <div>
          <h1>Orders</h1>

          <table border="1" cellPadding="10" width="100%">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Total</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {orders.map(order => (
                <tr key={order._id}>

                  <td>{order._id}</td>

                  <td>
                    {order.shippingAddress?.name || "N/A"}
                  </td>

                  <td>
                    Rs {order.total}
                  </td>

                  <td>
                    {order.status}
                  </td>

                  <td>

                    <button onClick={() =>
                      updateStatus(order._id, "Processing")
                    }>
                      Processing
                    </button>

                    <button onClick={() =>
                      updateStatus(order._id, "Completed")
                    }>
                      Complete
                    </button>

                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        </div>
      );
    }

    if (activePage === "products") {
      return <h1>Products Page</h1>;
    }

    if (activePage === "users") {
      return <h1>Users Page</h1>;
    }

    return (
      <div>
        <h1>Admin Dashboard</h1>
        <p>Welcome Admin</p>
      </div>
    );
  };

  /* ================= UI ================= */

  return (
    <div style={{ display: "flex", height: "100vh" }}>

      {/* Sidebar */}
      <div style={{
        width: "250px",
        background: "#111",
        color: "#fff",
        padding: "20px"
      }}>

        <h2>Admin Panel</h2>

        <button style={btn}
          onClick={() => setActivePage("dashboard")}>
          Dashboard
        </button>

        <button style={btn}
          onClick={() => setActivePage("orders")}>
          Orders
        </button>

        <button style={btn}
          onClick={() => setActivePage("products")}>
          Products
        </button>

        <button style={btn}
          onClick={() => setActivePage("users")}>
          Users
        </button>

      </div>

      {/* Content */}
      <div style={{
        flex: 1,
        padding: "20px",
        overflowY: "auto"
      }}>
        {renderPage()}
      </div>

    </div>
  );
}

/* ================= STYLE ================= */

const btn = {
  display: "block",
  width: "100%",
  padding: "10px",
  margin: "10px 0",
  background: "#333",
  color: "#fff",
  border: "none",
  cursor: "pointer"
};
