import { Link, Route, Routes, useNavigate } from "react-router-dom";
import { FaChartLine, FaHome } from "react-icons/fa";
import { MdShoppingCartCheckout } from "react-icons/md";
import { BsBox2Heart } from "react-icons/bs";
import { HiOutlineUsers } from "react-icons/hi";
import { FiMenu, FiX } from "react-icons/fi";
import UserData from "../components/userData.jsx";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

import AdminHomePage from "./admin/adminHome";
import AdminProductPage from "./admin/adminProductPage";
import AddProductPage from "./admin/adminAddNewProduct";
import UpdateProductPage from "./admin/adminUpdateProduct";
import AdminChat from "./admin/AdminChat";
import AdminUsersPage from "./admin/usersPage";
import AdminDashboard from "./admin/adminDash";
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
          toast.error("You are not authorized to access admin panel");
          navigate("/");
          return;
        }
        setUserLoaded(true);
      })
      .catch(() => {
        toast.error("Session expired. Please login again");
        localStorage.removeItem("token");
        window.location.href = "/login";
      });
  }, [navigate]);

  const SidebarLinks = () => (
    <>
      <Link to="/admin/dashboard" className="admin-link" onClick={() => setMobileMenuOpen(false)}>
        <FaChartLine /> Dashboard
      </Link>
      <Link to="/admin/chat" className="admin-link" onClick={() => setMobileMenuOpen(false)}>
        <MdShoppingCartCheckout /> Chat
      </Link>
      <Link to="/admin/products" className="admin-link" onClick={() => setMobileMenuOpen(false)}>
        <BsBox2Heart /> Products
      </Link>
      <Link to="/admin/users" className="admin-link" onClick={() => setMobileMenuOpen(false)}>
        <HiOutlineUsers /> Users
      </Link>
      <Link to="/" className="admin-link" onClick={() => setMobileMenuOpen(false)}>
        <FaHome /> Return to Shop
      </Link>
    </>
  );

  return (
    <div className="w-full h-full bg-primary flex flex-col lg:flex-row text-secondary">
      {/* Sidebar */}
      <div
        className={`fixed lg:static top-0 left-0 z-50 w-[260px] lg:w-[300px] h-full bg-primary flex flex-col items-center gap-4 transition-transform duration-300 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex w-[90%] h-[70px] bg-accent items-center rounded-2xl mb-4">
          <img src="/logo.png" alt="Logo" className="h-[70px] ml-4 rounded-2xl" />
          <span className="text-white text-xl ml-4">Admin Panel</span>
        </div>

        {/* Close mobile */}
        <div className="lg:hidden w-full flex justify-end px-4">
          <button onClick={() => setMobileMenuOpen(false)} className="text-white text-2xl">
            <FiX />
          </button>
        </div>

        <UserData />
        <SidebarLinks />
      </div>

      {/* Mobile top bar */}
      <div className="lg:hidden flex items-center justify-between bg-accent p-3 rounded-xl mb-2">
        <button onClick={() => setMobileMenuOpen(true)} className="text-white text-2xl">
          <FiMenu />
        </button>
        <span className="text-white font-semibold">Admin Panel</span>
      </div>

      {/* Main content */}
      <div className="w-full lg:w-[calc(100%-300px)] h-full border-[4px] border-accent rounded-[20px] overflow-hidden">
        <div className="h-full w-full overflow-y-scroll">
          {userLoaded ? (
            <Routes>
              <Route path="/" element={<AdminHomePage />} />
              <Route path="/dashboard" element={<AdminDashboard />} />
              <Route path="/products" element={<AdminProductPage />} />
              <Route path="/chat" element={<AdminChat />} />
              <Route path="/add-product" element={<AddProductPage />} />
              <Route path="/update-product" element={<UpdateProductPage />} />
              <Route path="/users" element={<AdminUsersPage />} />
            </Routes>
          ) : (
            <Loader />
          )}
        </div>
      </div>
    </div>
  );
}
