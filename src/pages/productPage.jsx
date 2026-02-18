import axios from "axios";
import { useEffect, useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { Loader } from "../components/loader";
import ProductCard from "../components/productCard";
import Header from "../components/header";
import React from "react";

export function ProductPage() {

  const location = useLocation();

  const query = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );

  const searchQuery = (query.get("search") || "").trim().toLowerCase();
  const categoryQuery = (query.get("category") || "").trim().toLowerCase();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const PRODUCTS_PER_CATEGORY = 10;

  const [visibleCount, setVisibleCount] = useState({});


  // LOAD PRODUCTS
  useEffect(() => {

    async function loadProducts() {

      try {

        const res = await axios.get(
          import.meta.env.VITE_API_URL + "/api/products"
        );

        const data = res.data || [];

        setProducts(data);

        // initialize visible count per category
        const counts = {};

        data.forEach((p) => {

          const cat = (p.category || "other").toLowerCase();

          if (!counts[cat]) {

            counts[cat] = PRODUCTS_PER_CATEGORY;

          }

        });

        setVisibleCount(counts);

      }
      catch (err) {

        console.error(err);

        toast.error("Failed to load products");

      }
      finally {

        setLoading(false);

      }

    }

    loadProducts();

  }, []);



  // FILTER PRODUCTS
  const filteredProducts = useMemo(() => {

    return products.filter((p) => {

      const name =
        (p.title || p.name || "").toLowerCase();

      const category =
        (p.category || "").toLowerCase();

      const matchSearch =
        !searchQuery || name.includes(searchQuery);

      const matchCategory =
        !categoryQuery || category.includes(categoryQuery);

      return matchSearch && matchCategory;

    });

  }, [products, searchQuery, categoryQuery]);



  // GROUP PRODUCTS BY CATEGORY
  const groupedProducts = useMemo(() => {

    const grouped = {};

    filteredProducts.forEach((product) => {

      const cat =
        (product.category || "other").toLowerCase();

      if (!grouped[cat]) {

        grouped[cat] = [];

      }

      grouped[cat].push(product);

    });

    return grouped;

  }, [filteredProducts]);



  // LOAD MORE
  function loadMore(category) {

    setVisibleCount((prev) => ({

      ...prev,

      [category]: prev[category] + PRODUCTS_PER_CATEGORY,

    }));

  }



  return (

    <div className="w-full min-h-screen bg-orange-100">

      {

        loading ? (

          <Loader />

        ) : (

          <div className="w-full max-w-[1600px] mx-auto p-3">

            {

              Object.keys(groupedProducts).length === 0 ? (

                <div className="text-center p-10">

                  No products found

                </div>

              ) : (

                Object.keys(groupedProducts).map((category) => {

                  const categoryProducts =
                    groupedProducts[category];

                  const visible =
                    visibleCount[category] ||
                    PRODUCTS_PER_CATEGORY;

                  return (

                    <div
                      key={category}
                      className="
                        bg-white
                        rounded-xl
                        mb-6
                        p-4
                        shadow-sm
                      "
                    >

                      {/* CATEGORY TITLE */}

                      <h2 className="
                        text-xl
                        font-semibold
                        mb-4
                        capitalize
                      ">

                        {category}

                      </h2>



                      {/* PRODUCT GRID */}

                      <div className="
                        flex
                        flex-wrap
                        justify-center
                      ">

                        {

                          categoryProducts
                          .slice(0, visible)
                          .map((product, index) => (

                            <div
                              key={index}
                              className="
                                w-1/2
                                sm:w-1/2
                                md:w-1/3
                                lg:w-1/4
                                xl:w-1/5
                                p-2
                              "
                            >

                              <ProductCard product={product} />

                            </div>

                          ))

                        }

                      </div>



                      {/* LOAD MORE BUTTON */}

                      {

                        visible < categoryProducts.length && (

                          <div className="
                            flex
                            justify-center
                            mt-4
                          ">

                            <button
                              onClick={() => loadMore(category)}
                              className="
                                px-6
                                py-2
                                bg-orange-500
                                text-white
                                rounded-lg
                                hover:bg-orange-600
                                transition
                              "
                            >

                              Load More

                            </button>

                          </div>

                        )

                      }

                    </div>

                  );

                })

              )

            }

          </div>

        )

      }

    </div>

  );

}
