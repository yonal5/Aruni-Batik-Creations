import { Link, Route, Routes, useNavigate } from "react-router-dom";
import { FaChartLine, FaHome } from "react-icons/fa";
import { MdShoppingCartCheckout } from "react-icons/md";
import { BsBox2Heart } from "react-icons/bs";
import { HiOutlineUsers } from "react-icons/hi";
import { FiMenu, FiX } from "react-icons/fi";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

import UserData from "../components/userData.jsx";
import AdminHomePage from "./admin/adminHome";
import AdminProductPage from "./admin/adminProductPage";
import AddProductPage from "./admin/adminAddNewProduct";
import UpdateProductPage from "./admin/adminUpdateProduct";
import AdminChat from "./admin/AdminChat";
import AdminUsersPage from "./admin/usersPage";
import AdminDashboard from "./admin/adminDash";
import AdminOrdersPage from "./admin/AdminOrdersPage";
import { Loader } from "../components/loader";

export default function AdminPage() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userLoaded, setUserLoaded] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login to access admin panel");
      navigate("/login");
      return;
    }

    axios
      .get(import.meta.env.VITE_API_URL + "/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data.role !== "admin") {
          toast.error("Not authorized");
          navigate("/");
          return;
        }
        setUserLoaded(true);
      })
      .catch(() => {
        toast.error("Session expired");
        localStorage.removeItem("token");
        navigate("/login");
      });
  }, [navigate]);

  const SidebarLinks = () => (
        <>
      <Link
        to="/admin/dashboard"
        className="w-[90%] flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-accent"
        onClick={() => setMobileMenuOpen(false)}
      >
        <FaChartLine />
        Dashboard
      </Link>
      <Link
        to="/admin/chat"
        className="w-[90%] flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-accent"
        onClick={() => setMobileMenuOpen(false)}
      >
        <MdShoppingCartCheckout className="text-xl" />
        Chat
      </Link>
      <Link
        to="/admin/products"
        className="w-[90%] flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-accent"
        onClick={() => setMobileMenuOpen(false)}
      >
        <BsBox2Heart />
        Products
      </Link>
      <Link
        to="/admin/users"
        className="w-[90%] flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-accent"
        onClick={() => setMobileMenuOpen(false)}
      >
        <HiOutlineUsers />
        Users
      </Link>
      <Link
        to="/admin/orders"
        className="w-[90%] flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-accent"
        onClick={() => setMobileMenuOpen(false)}
      >
        <MdShoppingCartCheckout className="text-xl" />
        Orders
      </Link>
      <Link
        to="/"
        className="w-[90%] flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-accent"
        onClick={() => setMobileMenuOpen(false)}
      >
        <FaHome />
        Return to Shop
      </Link>
    </>
  );

  return (
    <div className="w-full min-h-screen bg-primary flex flex-col lg:flex-row p-2 text-secondary">

      {/* Sidebar */}
      <div
        className={`fixed lg:static top-0 left-0 z-50 w-[260px] lg:w-[300px] h-full bg-primary flex flex-col items-center gap-5 transition-transform duration-300 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex w-[90%] h-[70px] bg-accent items-center rounded-2xl mb-5">
          <img
            src="/logo.png"
            alt="Logo"
            className="h-[70px] ml-4 rounded-2xl"
          />
          <span className="text-white text-xl ml-4">Admin Panel</span>
        </div>

        <div className="lg:hidden w-full flex justify-end px-4">
          <button onClick={() => setMobileMenuOpen(false)} className="text-white text-2xl">
            <FiX />
          </button>
        </div>

        <UserData />
        <SidebarLinks />
      </div>

      {/* Mobile Top Bar */}
      <div className="lg:hidden flex items-center justify-between bg-accent p-3 rounded-xl mb-2">
        <button onClick={() => setMobileMenuOpen(true)} className="text-white text-2xl">
          <FiMenu />
        </button>
        <span className="text-white font-semibold">Admin Panel</span>
      </div>

      {/* Main Content */}
      <div className="w-full lg:w-[calc(100%-300px)] border-4 border-accent rounded-2xl overflow-hidden">
        <div className="h-full w-full overflow-y-auto p-4">

          {userLoaded ? (
            <Routes>
              <Route index element={<AdminDashboard />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="products" element={<AdminProductPage />} />
              <Route path="chat" element={<AdminChat />} />
              <Route path="add-product" element={<AddProductPage />} />
              <Route path="update-product" element={<UpdateProductPage />} />
              <Route path="users" element={<AdminUsersPage />} />
              <Route path="orders" element={<AdminOrdersPage />} />
            </Routes>
          ) : (
            <Loader />
          )}

        </div>
      </div>
    </div>
  );
}

