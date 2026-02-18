import axios from "axios";
import { useEffect, useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { Loader } from "../components/loader";
import ProductCard from "../components/productCard";
import React from "react";

export function ProductPage() {
  const location = useLocation();
  const query = useMemo(() => new URLSearchParams(location.search), [location.search]);

  const searchQuery = (query.get("search") || "").trim().toLowerCase();
  const categoryQuery = (query.get("category") || "").trim().toLowerCase();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const PRODUCTS_PER_CATEGORY = 10;
  const [visibleCount, setVisibleCount] = useState({});

  // Load products
  useEffect(() => {
    async function load() {
      try {
        const response = await axios.get(import.meta.env.VITE_API_URL + "/api/products");
        const data = response.data || [];
        setProducts(data);

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

  // Group by category
  const groupedProducts = useMemo(() => {
    const grouped = {};
    filtered.forEach((product) => {
      const cat = (product.category || "other").toLowerCase();
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(product);
    });
    return grouped;
  }, [filtered]);

  // Load more per category
  function loadMore(category) {
    setVisibleCount((prev) => ({
      ...prev,
      [category]: prev[category] + PRODUCTS_PER_CATEGORY,
    }));
  }

  return (
    <div className="w-full min-h-[calc(100vh-100px)] bg-orange-100">
      {loading ? (
        <Loader />
      ) : (
        <div className="w-full h-full flex flex-col bg-white">
          {Object.keys(groupedProducts).length === 0 ? (
            <div className="p-8 text-center">No products found.</div>
          ) : (
            Object.keys(groupedProducts).map((category) => {
              const categoryProducts = groupedProducts[category];
              const visible = visibleCount[category] || PRODUCTS_PER_CATEGORY;

              return (
                <div key={category} className="w-full bg-white rounded-xl mb-6 p-4">
                  {/* CATEGORY TITLE */}
                  <div className="text-xl font-semibold mb-4 capitalize">{category}</div>

                  {/* PRODUCTS GRID */}
                  <div
                    className="
                      grid gap-4
                      grid-cols-1
                      sm:grid-cols-3
                      md:grid-cols-3
                      lg:grid-cols-4
                      justify-items-center
                    "
                  >
                    {categoryProducts.slice(0, visible).map((item, i) => (
                      <div key={`${item.productID}-${i}`} className="w-full max-w-[350px]">
                        <ProductCard product={item} />
                      </div>
                    ))}
                  </div>

                  {/* LOAD MORE BUTTON */}
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
