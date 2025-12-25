import axios from "axios";
import { useState, useEffect, useMemo } from "react";
import mediaUpload from "../utils/mediaUpload";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function UserSettings() {
  const [user, setUser] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [image, setImage] = useState(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get(`${import.meta.env.VITE_API_URL}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUser(res.data);
        setFirstName(res.data.firstName || "");
        setLastName(res.data.lastName || "");
      })
      .catch(() => {
        localStorage.removeItem("token");
        navigate("/login");
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const imagePreview = useMemo(() => {
    if (image) return URL.createObjectURL(image);
    if (user?.image) return user.image;
    return "";
  }, [image, user]);

  const passwordMismatch = newPassword && confirmPassword && newPassword !== confirmPassword;

  const updateProfile = async () => {
    if (!user) return;
    try {
      let profileImage = user.image;

      if (image) {
        profileImage = await mediaUpload(image);
      }

      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/users/me`,
        { firstName, lastName, image: profileImage },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      toast.success("Profile updated successfully");
      navigate("/");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
    }
  };

  const updatePassword = async () => {
    if (passwordMismatch) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/users/me/password`,
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      toast.success("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      navigate("/");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update password");
    }
  };

  if (loading) return <div className="text-center mt-20">Loading...</div>;

  return (
    <div className="w-full h-full bg-[url('/bg.jpg')] bg-cover bg-center bg-no-repeat flex flex-col lg:flex-row justify-center">
      {/* Profile Section */}
      <div className="w-full lg:w-[40%] backdrop-blur-2xl rounded-2xl m-8 p-6 flex flex-col bg-primary/70 shadow-xl ring-1 ring-secondary/10">
        <h1 className="text-2xl font-bold mb-6 text-center text-secondary">User Settings</h1>

        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 rounded-full overflow-hidden ring-2 ring-accent/60 shrink-0">
            {imagePreview ? (
              <img src={imagePreview} alt="Profile preview" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full grid place-items-center bg-secondary/10 text-secondary/60 text-sm">No Photo</div>
            )}
          </div>
          <label className="inline-flex items-center gap-3 px-4 py-2 rounded-xl cursor-pointer bg-white/70 hover:bg-white transition border border-secondary/10">
            <span className="text-sm font-medium text-secondary">Upload Photo</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
            />
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="text-sm text-secondary/80 mb-1">First Name</label>
            <input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Jane"
              className="px-3 py-2 rounded-xl bg-white/80 border border-secondary/10 outline-none focus:ring-2 focus:ring-accent/50"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm text-secondary/80 mb-1">Last Name</label>
            <input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Doe"
              className="px-3 py-2 rounded-xl bg-white/80 border border-secondary/10 outline-none focus:ring-2 focus:ring-accent/50"
            />
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={updateProfile}
            className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-accent text-white font-semibold hover:opacity-90 active:opacity-80 transition shadow"
          >
            Save Profile
          </button>
        </div>
      </div>

      {/* Password Section */}
      <div className="w-full lg:w-[40%] backdrop-blur-2xl rounded-2xl m-8 p-6 flex flex-col bg-primary/70 shadow-xl ring-1 ring-secondary/10">
        <h2 className="text-2xl font-bold mb-6 text-center text-secondary">Change Password</h2>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col">
            <label className="text-sm text-secondary/80 mb-1">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="px-3 py-2 rounded-xl bg-white/80 border border-secondary/10 outline-none focus:ring-2 focus:ring-accent/50"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-secondary/80 mb-1">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="px-3 py-2 rounded-xl bg-white/80 border border-secondary/10 outline-none focus:ring-2 focus:ring-accent/50"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-secondary/80 mb-1">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="px-3 py-2 rounded-xl bg-white/80 border border-secondary/10 outline-none focus:ring-2 focus:ring-accent/50"
            />
          </div>

          {passwordMismatch && <p className="text-sm text-red-600">Passwords do not match.</p>}
        </div>

        <div className="mt-6">
          <button
            onClick={updatePassword}
            disabled={!newPassword || !confirmPassword || passwordMismatch}
            className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-accent text-white font-semibold hover:opacity-90 active:opacity-80 transition shadow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Update Password
          </button>
        </div>
      </div>
    </div>
  );
}
 
