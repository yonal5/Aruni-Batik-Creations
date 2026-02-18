import axios from "axios";
import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { Loader } from "../components/loader";
import ProductCard from "../components/productCard";
import Header, { ProductNews, TtitleBar } from "../components/header";
import React from "react";

export function ProductPage() {
  const location = useLocation();
  const query = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const searchQuery = (query.get("search") || "").trim().toLowerCase();
  const categoryQuery = (query.get("category") || "").trim().toLowerCase();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // infinite-scroll / loop state
  const BATCH_SIZE = 12;
  const [visibleProducts, setVisibleProducts] = useState([]); // items shown in the grid
  const nextIndexRef = useRef(0); // next slice start index in filtered array
  const sentinelRef = useRef(null);
  const [loadingMore, setLoadingMore] = useState(false);

  // guard ref to avoid concurrent loadMore calls
  const isLoadingRef = useRef(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const response = await axios.get(import.meta.env.VITE_API_URL + "/api/products");
        setProducts(response.data || []);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // compute filtered list based on search/category
  const filtered = useMemo(() => {
    if (!searchQuery && !categoryQuery) return products;
    return products.filter((p) => {
      const name = (p.title || p.name || "").toString().toLowerCase();
      const matchesName = !searchQuery || name.includes(searchQuery);
      const prodCategory = (p.category || "").toString().toLowerCase();
      const matchesCategory = !categoryQuery || prodCategory.includes(categoryQuery);
      return matchesName && matchesCategory;
    });
  }, [products, searchQuery, categoryQuery]);

  // (re)initialize visibleProducts whenever filtered list changes
  useEffect(() => {
    isLoadingRef.current = false;
    nextIndexRef.current = 0;
    if (filtered.length === 0) {
      setVisibleProducts([]);
      return;
    }
    const start = 0;
    const end = Math.min(filtered.length, BATCH_SIZE);
    setVisibleProducts(filtered.slice(start, end));
    nextIndexRef.current = end % filtered.length;
  }, [filtered]);

  // load more items (looping) — show loader for 1.5s on each load
  const loadMore = useCallback(() => {
    if (filtered.length === 0) return;
    if (isLoadingRef.current) return;
    isLoadingRef.current = true;
    setLoadingMore(true);

    setTimeout(() => {
      const start = nextIndexRef.current;
      const batch = [];
      for (let i = 0; i < BATCH_SIZE; i++) {
        const idx = (start + i) % filtered.length;
        batch.push(filtered[idx]);
      }
      nextIndexRef.current = (start + BATCH_SIZE) % filtered.length;
      setVisibleProducts((prev) => [...prev, ...batch]);
      setLoadingMore(false);
      isLoadingRef.current = false;
    }, 1500);
  }, [filtered]);

  // IntersectionObserver to trigger loadMore when sentinel visible
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          loadMore();
        }
      });
    }, {
      root: null,
      rootMargin: "200px",
      threshold: 0.1,
    });
    obs.observe(sentinel);
    return () => obs.disconnect();
  }, [loadMore]);

  return (
    <div className="w-full min-h-[calc(100vh-100px)] bg-orange-100">
      {loading ? (
        <Loader />
      ) : (
        <div className="w-full h-full p-4">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-gray-600">No products found.</div>
          ) : (
            <>
              <div className="grid gap-4
                              grid-cols-2
                              sm:grid-cols-3
                              md:grid-cols-4
                              lg:grid-cols-5">
                {visibleProducts.map((item, i) => (
                  <ProductCard key={`${item.productID || item.id}-${i}`} product={item} />
                ))}
              </div>
              {/* sentinel for intersection observer */}
              <div ref={sentinelRef} className="w-full flex justify-center items-center my-6">
                {loadingMore ? (
                  <div className="text-sm text-gray-600">Loading more...</div>
                ) : (
                  <div className="text-sm text-gray-400">Scroll to load more</div>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default ProductPage;
