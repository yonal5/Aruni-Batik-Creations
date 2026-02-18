import axios from "axios";
import { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Loader } from "../components/loader";
import ProductCard from "../components/productCard";
import Header from "../components/header";
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

  // LOAD PRODUCTS
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
          if (!counts[cat]) {
            counts[cat] = PRODUCTS_PER_CATEGORY;
          }
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

  // FILTER PRODUCTS
  const filtered = useMemo(() => {
    return products.filter((p) => {
      const name = (p.title || p.name || "").toLowerCase();
      const matchesSearch = !searchQuery || name.includes(searchQuery);
      const prodCategory = (p.category || "").toLowerCase();
      const matchesCategory = !categoryQuery || prodCategory.includes(categoryQuery);
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, categoryQuery]);

  // GROUP BY CATEGORY
  const groupedProducts = useMemo(() => {
    const grouped = {};
    filtered.forEach((product) => {
      const cat = (product.category || "other").toLowerCase();
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(product);
    });
    return grouped;
  }, [filtered]);

  // Navigate to full category page
  function viewMore(category) {
    navigate(`/products/all?category=${category}`);
  }

  return (
    <div className="w-full min-h-[calc(100vh-100px)] bg-orange-100">
      {loading ? (
        <Loader />
      ) : (
        <div className="w-full h-full flex flex-col gap-6 p-4">
          {Object.keys(groupedProducts).length === 0 ? (
            <div className="p-8 text-center">No products found.</div>
          ) : (
            Object.keys(groupedProducts).map((category) => {
              const categoryProducts = groupedProducts[category];
              const visible = visibleCount[category] || PRODUCTS_PER_CATEGORY;

              return (
                <div
                  key={category}
                  className="w-full bg-white rounded-xl p-4 shadow"
                >
                  {/* CATEGORY TITLE */}
                  <div className="text-xl font-semibold mb-4 capitalize">
                    {category}
                  </div>

                  {/* PRODUCTS GRID */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-items-center">
                    {categoryProducts.slice(0, visible).map((item, i) => (
                      <ProductCard
                        key={`${item.productID}-${i}`}
                        product={item}
                        className="w-full"
                      />
                    ))}
                  </div>

                  {/* LOAD MORE / VIEW MORE BUTTON */}
                  {visible < categoryProducts.length && (
                    <div className="w-full flex justify-center mt-4">
                      <button
                        onClick={() => viewMore(category)}
                        className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
                      >
                        View More
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
