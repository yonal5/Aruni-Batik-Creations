import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";
import { Loader } from "../components/loader";
import ImageSlider from "../components/imageSlider";
import { addToCart } from "../utils/cart";
import FullScreenZoom from "../components/FullScreenZoom";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function ProductOverview({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [zoomImage, setZoomImage] = useState(null);

  const [status, setStatus] = useState("loading");
  const [product, setProduct] = useState(null);

  /* ---------------- FETCH PRODUCT ---------------- */
  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/products/${id}`)
      .then((res) => {
        setProduct(res.data);
        setStatus("success");
      })
      .catch(() => {
        toast.error("Failed to fetch product details");
        setStatus("error");
      });
  }, [id]);

  /* ---------------- STOCK CHECK ---------------- */
  const isOutOfStock = product?.stock <= 0;

  /* ---------------- BUY NOW ---------------- */
  const sendSingleProductToAdmin = async () => {
    if (!product || isOutOfStock) return;

    let userNumber = user?.id;

    if (!userNumber) {
      userNumber = localStorage.getItem("guestNumber");
      if (!userNumber) {
        userNumber = Math.floor(Math.random() * 1000000);
        localStorage.setItem("guestNumber", userNumber);
      }
    }

    const guestId =
      localStorage.getItem("guestId") || crypto.randomUUID();
    localStorage.setItem("guestId", guestId);

    const customerName =
      user?.name || user?.username || `User-${userNumber}`;

    const productMessage = `${product.name} x 1 - LKR ${Number(
      product.price
    ).toFixed(2)}`;

    try {
      await axios.post(`${BASE_URL}/api/chat`, {
        guestId,
        customerName,
        message: `🛒User-${userNumber} Checkout Items:\n${productMessage} `,
      });

      navigate("/chat");
    } catch (err) {
      console.error(err);
      toast.error("Failed to send product to admin");
    }
  };

  /* ---------------- STATES ---------------- */
  if (status === "loading") return <Loader />;

  if (status === "error")
    return (
      <h1 className="text-red-500 text-center mt-20">
        Failed to load product details
      </h1>
    );

  /* ---------------- UI ---------------- */
  return (
    <div className="w-full min-h-[calc(100vh-100px)] bg-gray-50 py-6 px-4 sm:px-6 lg:px-20 text-gray-800">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col lg:flex-row">

        {/* Image */}
        <div className="lg:w-1/2 w-full bg-gray-100 flex justify-center items-center p-4 sm:p-6">
          <ImageSlider
            images={product?.images || []}
            onImageClick={(img) => setZoomImage(img)}
            className="rounded-xl shadow-md"
          />
        </div>

        {/* Details */}
        <div className="lg:w-1/2 w-full p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">
              {product.name}
            </h1>

            <p className="text-xs sm:text-sm text-gray-500 mb-3">
              Product ID: {product.productID}
            </p>

            <p className="text-gray-600 mb-4">
              Category: <span className="font-semibold">{product.category}</span>
            </p>

            {/* Price */}
            <div className="mb-4 flex items-center gap-3 flex-wrap">
              {product.labelledPrice > product.price ? (
                <>
                  <span className="line-through text-gray-400">
                    LKR {Number(product.labelledPrice).toFixed(2)}
                  </span>
                  <span className="text-accent text-2xl font-bold">
                    LKR {Number(product.price).toFixed(2)}
                  </span>
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                    SALE
                  </span>
                </>
              ) : (
                <span className="text-accent text-2xl font-bold">
                  LKR {Number(product.price).toFixed(2)}
                </span>
              )}
            </div>

            {/* STOCK STATUS */}
            <div className="mb-4">
              {isOutOfStock ? (
                <span className="text-red-600 font-semibold text-lg">
                  ❌ Out of Stock
                </span>
              ) : (
                <span className="text-green-600 font-semibold text-lg">
                  ✅ In Stock ({product.stock} available)
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-700 text-justify leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button
              disabled={isOutOfStock}
              onClick={() => {
                if (isOutOfStock) return;
                addToCart(product, 1);
                toast.success("Added to cart");
                navigate("/cart");
              }}
              className={`w-full sm:w-1/2 py-3 rounded-xl font-semibold shadow-md ${
                isOutOfStock
                  ? "bg-gray-400 cursor-not-allowed text-white"
                  : "bg-accent text-white hover:shadow-lg"
              }`}
            >
              {isOutOfStock ? "Out of Stock" : "Add to Cart"}
            </button>

            <button
              disabled={isOutOfStock}
              onClick={sendSingleProductToAdmin}
              className={`w-full sm:w-1/2 py-3 rounded-xl font-semibold shadow-md ${
                isOutOfStock
                  ? "border border-gray-400 text-gray-400 cursor-not-allowed"
                  : "border border-accent text-accent hover:bg-accent hover:text-white"
              }`}
            >
              {isOutOfStock ? "Unavailable" : "Buy Now"}
            </button>
          </div>
        </div>
      </div>

      {/* Image Zoom */}
      {zoomImage && (
        <FullScreenZoom image={zoomImage} onClose={() => setZoomImage(null)} />
      )}
    </div>
  );
}
