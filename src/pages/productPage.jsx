import axios from "axios";
import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import ProductCard from "../components/productCard";
import Header from "../components/header";

export function ProductPage() {
  const location = useLocation();
  const query = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const searchQuery = (query.get("search") || "").trim().toLowerCase();
  const categoryQuery = (query.get("category") || "").trim().toLowerCase();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const scrollRefs = useRef({}); // For multiple categories
  const BATCH_SIZE = 12; // not used here, but can be for infinite scroll

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const response = await axios.get(import.meta.env.VITE_API_URL + "/api/products");
        setProducts(response.data || []);
      } catch (err) {
        console.error("Error fetching products:", err);
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Filtered products based on search/category query
  const filtered = useMemo(() => {
    return products.filter((p) => {
      const name = (p.title || p.name || "").toString().toLowerCase();
      const matchesName = !searchQuery || name.includes(searchQuery);
      const prodCategory = (p.category || "").toString().toLowerCase();
      const matchesCategory = !categoryQuery || prodCategory.includes(categoryQuery);
      return matchesName && matchesCategory;
    });
  }, [products, searchQuery, categoryQuery]);

  // Group products by category for horizontal slider
  const categories = useMemo(() => {
    const catMap = {};
    filtered.forEach((p) => {
      if (!catMap[p.category]) catMap[p.category] = [];
      catMap[p.category].push(p);
    });
    return catMap;
  }, [filtered]);

  const scrollLeft = (category) => {
    const ref = scrollRefs.current[category];
    if (ref) ref.scrollBy({ left: -400, behavior: "smooth" });
  };

  const scrollRight = (category) => {
    const ref = scrollRefs.current[category];
    if (ref) ref.scrollBy({ left: 400, behavior: "smooth" });
  };

  return (
    <div className="w-full min-h-[calc(100vh-100px)] bg-orange-100">
      <Header />

      {loading ? (
        <div className="p-8 text-center">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="p-8 text-center">No products found.</div>
      ) : (
        <div className="max-w-7xl mx-auto p-4 flex flex-col gap-6">
          {Object.keys(categories).map((cat) => (
            <div key={cat} className="bg-white rounded-xl p-4 shadow-sm">
              {/* Header */}
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold text-gray-800">{cat}</h2>
                <a
                  href={`/products?category=${encodeURIComponent(cat)}`}
                  className="text-orange-500 hover:text-orange-600 font-medium text-sm"
                >
                  View All →
                </a>
              </div>

              {/* Horizontal scroll */}
              <div className="relative">
                <button
                  onClick={() => scrollLeft(cat)}
                  className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-2 hover:bg-orange-100"
                >
                  ←
                </button>

                <div
                  ref={(el) => (scrollRefs.current[cat] = el)}
                  className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide"
                >
                  {categories[cat].map((item, i) => (
                    <div
                      key={`${item.productID || item.id}-${i}`}
                      className="snap-start min-w-[80%] sm:min-w-[50%] md:min-w-[33.33%] lg:min-w-[25%] xl:min-w-[20%] transition-transform duration-300 hover:scale-105"
                    >
                      <ProductCard product={item} />
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => scrollRight(cat)}
                  className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-2 hover:bg-orange-100"
                >
                  →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductPage;
