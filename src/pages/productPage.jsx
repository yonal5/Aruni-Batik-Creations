import axios from "axios";
import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { Loader } from "../components/loader";
import ProductCard from "../components/productCard";
import Header from "../components/header";
import React from "react";

export function ProductPage() {
  const location = useLocation();
  const query = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const searchQuery = (query.get("search") || "").trim().toLowerCase();
  const categoryQuery = (query.get("category") || "").trim().toLowerCase();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const PRODUCTS_PER_BATCH = 10; // how many to show per category initially / per "load more"
  const [visibleCount, setVisibleCount] = useState({}); // tracks per category

  // fetch products
  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const response = await axios.get(import.meta.env.VITE_API_URL + "/api/products");
        const data = response.data || [];
        setProducts(data);

        // initialize visible counts per category
        const counts = {};
        data.forEach((p) => {
          const cat = (p.category || "other").toLowerCase();
          if (!counts[cat]) counts[cat] = PRODUCTS_PER_BATCH;
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

  // filter products based on search & category
  const filtered = useMemo(() => {
    return products.filter((p) => {
      const name = (p.title || p.name || "").toLowerCase();
      const prodCategory = (p.category || "").toLowerCase();
      const matchesSearch = !searchQuery || name.includes(searchQuery);
      const matchesCategory = !categoryQuery || prodCategory === categoryQuery;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, categoryQuery]);

  // group products by category
  const groupedProducts = useMemo(() => {
    const grouped = {};
    filtered.forEach((p) => {
      const cat = (p.category || "other").toLowerCase();
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(p);
    });
    return grouped;
  }, [filtered]);

  // load more products per category
  const loadMore = useCallback((category) => {
    setVisibleCount((prev) => ({
      ...prev,
      [category]: prev[category] + PRODUCTS_PER_BATCH
    }));
  }, []);

  return (
    <div className="w-full min-h-[calc(100vh-100px)] bg-orange-100">
      <Header />

      {loading ? (
        <Loader />
      ) : (
        <div className="w-full h-full flex flex-col gap-6 p-4">
          {Object.keys(groupedProducts).length === 0 ? (
            <div className="p-8 text-center text-gray-600">No products found.</div>
          ) : (
            Object.keys(groupedProducts).map((category) => {
              const categoryProducts = groupedProducts[category];
              const visible = visibleCount[category] || PRODUCTS_PER_BATCH;

              return (
                <div key={category} className="w-full bg-white rounded-xl p-4">
                  {/* Category Title */}
                  <div className="text-xl font-semibold mb-4 capitalize">{category}</div>

                  {/* Products Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {categoryProducts.slice(0, visible).map((item, i) => (
                      <ProductCard key={`${item.productID || item.id}-${i}`} product={item} />
                    ))}
                  </div>

                  {/* Load More */}
                  {visible < categoryProducts.length && (
                    <div className="w-full flex justify-center mt-4">
                      <button
                        onClick={() => loadMore(category)}
                        className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
                      >
                        Load More
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

export default ProductPage;
