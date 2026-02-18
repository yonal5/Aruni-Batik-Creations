import axios from "axios";
import { useEffect, useState, useMemo } from "react";
import toast from "react-hot-toast";
import { Loader } from "../components/loader";
import ProductCard from "../components/productCard";

export function ProductPage() {

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

        const productList = res.data || [];

        setProducts(productList);

        // initialize visible count
        const counts = {};

        productList.forEach(product => {

          const cat = product.category || "Other";

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


  // GROUP PRODUCTS BY CATEGORY
  const groupedProducts = useMemo(() => {

    const grouped = {};

    products.forEach(product => {

      const cat = product.category || "Other";

      if (!grouped[cat]) {
        grouped[cat] = [];
      }

      grouped[cat].push(product);

    });

    return grouped;

  }, [products]);


  // VIEW MORE FUNCTION
  function handleViewMore(category) {

    setVisibleCount(prev => ({
      ...prev,
      [category]: prev[category] + PRODUCTS_PER_CATEGORY
    }));

  }


  if (loading) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center bg-primary">
        <Loader />
      </div>
    );
  }


  return (

    <div className="w-full min-h-screen bg-primary">

      <div className="max-w-7xl mx-auto px-6 py-8">


        {Object.keys(groupedProducts).map(category => {

          const categoryProducts = groupedProducts[category];

          const visible = visibleCount[category] || PRODUCTS_PER_CATEGORY;

          return (

            <div
              key={category}
              className="mb-12 bg-white border border-secondary/10 rounded-2xl shadow-sm p-6"
            >

              {/* CATEGORY HEADER */}
              <div className="flex justify-between items-center mb-6">

                <h2 className="text-xl font-semibold text-secondary capitalize">

                  {category}

                </h2>

                <span className="text-xs bg-accent/10 text-accent px-3 py-1 rounded-full">

                  {categoryProducts.length} items

                </span>

              </div>


              {/* PRODUCTS GRID */}
              <div className="flex flex-wrap gap-6 justify-start">

                {categoryProducts
                  .slice(0, visible)
                  .map(product => (

                    <ProductCard
                      key={product.productID}
                      product={product}
                    />

                  ))}

              </div>


              {/* VIEW MORE BUTTON */}
              {visible < categoryProducts.length && (

                <div className="flex justify-center mt-6">

                  <button
                    onClick={() => handleViewMore(category)}
                    className="
                      px-6 py-2
                      bg-accent/10
                      text-secondary
                      rounded-full
                      ring-1 ring-accent/30
                      hover:bg-accent/20
                      hover:ring-accent
                      transition
                      font-medium
                    "
                  >

                    View More

                  </button>

                </div>

              )}

            </div>

          );

        })}


      </div>

    </div>

  );

}
