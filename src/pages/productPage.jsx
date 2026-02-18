import axios from "axios";
import { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Loader } from "../components/loader";
import ProductCard from "../components/productCard";
import React from "react";

export function ProductPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const query = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );

  const searchQuery = (query.get("search") || "").trim().toLowerCase();
  const categoryQuery = (query.get("category") || "").trim().toLowerCase();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const PRODUCTS_PER_CATEGORY = 10;

  // visible count per category
  const [visibleCount, setVisibleCount] = useState({});

  // Load products from API
  useEffect(() => {
    async function load() {
      try {
        const response = await axios.get(
          import.meta.env.VITE_API_URL + "/api/products"
        );
        const data = response.data || [];
        setProducts(data);

        // initialize visible counts
        const counts = {};
        data.forEach((p) => {
          const cat = (p.category || "other").toLowerCase();
          if (!counts[cat]) counts[cat] = PRODUCTS_PER_CATEGORY;
        });
        setVisibleCount(counts);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Filter products
  const filtered = useMemo(() => {
    return products.filter((p) => {
      const name = (p.title || p.name || "").toLowerCase();
      const matchesSearch = !searchQuery || name.includes(searchQuery);
      const prodCategory = (p.category || "").toLowerCase();
      const matchesCategory = !categoryQuery || prodCategory.includes(categoryQuery);
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, categoryQuery]);

  // Group products by category
  const groupedProducts = useMemo(() => {
    const grouped = {};
    filtered.forEach((product) => {
      const cat = (product.category || "other").toLowerCase();
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(product);
    });
    return grouped;
  }, [filtered]);

  // Load more products per category
  function loadMore(category) {
    navigate(`/category/${category}`); // go to full category page
  }

  if (loading) return <Loader />;

  if (Object.keys(groupedProducts).length === 0) {
    return <div className="p-8 text-center text-lg">No products found.</div>;
  }

  return (
    <div className="w-full min-h-[calc(100vh-100px)] bg-orange-100 py-6 px-4 md:px-8">
      {Object.keys(groupedProducts).map((category) => {
        const categoryProducts = groupedProducts[category];
        const visible = visibleCount[category] || PRODUCTS_PER_CATEGORY;

        return (
          <div
            key={category}
            className="w-full bg-white rounded-xl mb-10 p-6 shadow-md"
          >
            {/* CATEGORY TITLE */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold capitalize text-secondary">
                {category}
              </h2>
              {categoryProducts.length > PRODUCTS_PER_CATEGORY && (
                <button
                  onClick={() => loadMore(category)}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
                >
                  View All
                </button>
              )}
            </div>

            {/* PRODUCTS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {categoryProducts.slice(0, visible).map((product, i) => (
                <ProductCard key={`${product.productID}-${i}`} product={product} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
