import axios from "axios";
import { useEffect, useState, useMemo, useRef } from "react";
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

  // horizontal scroll refs
  const categoryScrollRef = useRef(null);
  const productScrollRefs = useRef({});

  useEffect(() => {

    async function load() {

      try {

        const response = await axios.get(
          import.meta.env.VITE_API_URL + "/api/products"
        );

        setProducts(response.data || []);

      }
      catch (error) {

        toast.error("Failed to load products");

      }
      finally {

        setLoading(false);

      }

    }

    load();

  }, []);



  // FILTER
  const filtered = useMemo(() => {

    return products.filter((p) => {

      const name = (p.title || p.name || "").toLowerCase();
      const prodCategory = (p.category || "").toLowerCase();

      const matchesSearch =
        !searchQuery || name.includes(searchQuery);

      const matchesCategory =
        !categoryQuery || prodCategory.includes(categoryQuery);

      return matchesSearch && matchesCategory;

    });

  }, [products, searchQuery, categoryQuery]);



  // GROUP
  const groupedProducts = useMemo(() => {

    const grouped = {};

    filtered.forEach((product) => {

      const cat = (product.category || "other").toLowerCase();

      if (!grouped[cat]) grouped[cat] = [];

      grouped[cat].push(product);

    });

    return grouped;

  }, [filtered]);



  function scrollLeft(ref) {
    if (ref.current) {
      ref.current.scrollBy({ left: -400, behavior: "smooth" });
    }
  }

  function scrollRight(ref) {
    if (ref.current) {
      ref.current.scrollBy({ left: 400, behavior: "smooth" });
    }
  }



  return (

    <div className="w-full min-h-[calc(100vh-100px)] bg-orange-100">

      <Header />

      {

        loading ? <Loader /> :

        <div className="w-full p-4">

          {/* -------------------- CATEGORY SLIDER -------------------- */}

          <div className="relative mb-6 bg-white rounded-xl p-3">

            <button
              onClick={() => scrollLeft(categoryScrollRef)}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow px-2 rounded-full"
            >
              {"<"}
            </button>

            <div
              ref={categoryScrollRef}
              className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
            >

              {

                Object.keys(groupedProducts).map((cat) => (

                  <button
                    key={cat}
                    onClick={() => navigate(`?category=${cat}`)}
                    className="
                      px-4 py-2
                      bg-orange-200
                      hover:bg-orange-300
                      rounded-full
                      whitespace-nowrap
                      transition
                    "
                  >
                    {cat}
                  </button>

                ))

              }

            </div>

            <button
              onClick={() => scrollRight(categoryScrollRef)}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow px-2 rounded-full"
            >
              {">"}
            </button>

          </div>



          {/* -------------------- PRODUCTS PER CATEGORY -------------------- */}

          {

            Object.keys(groupedProducts).map((category) => (

              <div
                key={category}
                className="bg-white rounded-xl mb-6 p-4 transition-all duration-300 hover:shadow-lg"
              >

                {/* HEADER ROW */}
                <div className="flex justify-between items-center mb-4">

                  <h2 className="text-xl font-semibold capitalize">
                    {category}
                  </h2>

                  <button
                    onClick={() => navigate(`/products?category=${category}`)}
                    className="text-orange-500 hover:underline"
                  >
                    View All
                  </button>

                </div>


                {/* HORIZONTAL PRODUCT SCROLL */}

                <div className="relative">

                  <button
                    onClick={() => scrollLeft(productScrollRefs.current[category])}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow px-2 rounded-full"
                  >
                    {"<"}
                  </button>

                  <div
                    ref={(el) =>
                      productScrollRefs.current[category] = { current: el }
                    }
                    className="
                      flex gap-4
                      overflow-x-auto
                      scroll-smooth
                      scrollbar-hide
                    "
                  >

                    {

                      groupedProducts[category]
                        .slice(0, 10)
                        .map((item, i) => (

                          <div
                            key={`${item.productID}-${i}`}
                            className="min-w-[220px] transform transition duration-300 hover:scale-105"
                          >
                            <ProductCard product={item} />
                          </div>

                        ))

                    }

                  </div>

                  <button
                    onClick={() => scrollRight(productScrollRefs.current[category])}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow px-2 rounded-full"
                  >
                    {">"}
                  </button>

                </div>

              </div>

            ))

          }

        </div>

      }

    </div>

  );

}
