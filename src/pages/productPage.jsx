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

  // LOAD PRODUCTS
  useEffect(() => {
    async function load() {
      try {
        const response = await axios.get(
          import.meta.env.VITE_API_URL + "/api/products"
        );

        const data = response.data || [];
        setProducts(data);
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

  // NAVIGATE TO CATEGORY PAGE
  function viewAll(category) {
    navigate(`/products?category=${category}`);
  }

  if (loading) {
    return (
      <div className="w-full min-h-[calc(100vh-100px)] flex justify-center items-center bg-orange-100">
        <Loader />
      </div>
    );
  }

  return (
    <div className="w-full min-h-[calc(100vh-100px)] bg-orange-100">
      {Object.keys(groupedProducts).length === 0 ? (
        <div className="p-8 text-center">No products found.</div>
      ) : (
        <div className="w-full h-full flex flex-col loop bg-white">
          {Object.keys(groupedProducts).map((category) => {
            const categoryProducts = groupedProducts[category];
            const visible = PRODUCTS_PER_CATEGORY; // show only 10

            return (
              <div
                key={category}
                className="w-full bg-white rounded-xl mb-6 p-4"
              >
                {/* CATEGORY TITLE */}
                <div className="flex justify-between items-center mb-4">
                  <div className="text-xl font-semibold capitalize">
                    {category}
                  </div>
                  <button
                    onClick={() => viewAll(category)}
                    className="text-sm text-orange-500 hover:underline"
                  >
                    View More
                  </button>
                </div>

                {/* PRODUCTS GRID */}
                <div className="flex flex-row flex-wrap justify-center">
                  {categoryProducts.slice(0, visible).map((item, i) => (
                    <ProductCard
                      key={`${item.productID}-${i}`}
                      product={item}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
