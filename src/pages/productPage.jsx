import axios from "axios";
import { useEffect, useState, useMemo } from "react";
import toast from "react-hot-toast";
import { Loader } from "../components/loader";
import ProductCard from "../components/productCard";

export function ProductPage() {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const PRODUCTS_PER_CATEGORY = 10;

  // track visible count per category
  const [visibleCount, setVisibleCount] = useState({});

  // load products
  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await axios.get(
          import.meta.env.VITE_API_URL + "/api/products"
        );

        const productList = res.data || [];
        setProducts(productList);

        // initialize visible count for each category
        const counts = {};
        productList.forEach(p => {
          const cat = (p.category || "other").toLowerCase();
          if (!counts[cat]) counts[cat] = PRODUCTS_PER_CATEGORY;
        });

        setVisibleCount(counts);

      } catch (err) {
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  // group products by category
  const productsByCategory = useMemo(() => {

    const grouped = {};

    products.forEach(product => {

      const cat = (product.category || "other").toLowerCase();

      if (!grouped[cat]) grouped[cat] = [];

      grouped[cat].push(product);

    });

    return grouped;

  }, [products]);


  // view more for specific category
  function handleViewMore(category) {

    setVisibleCount(prev => ({
      ...prev,
      [category]: prev[category] + PRODUCTS_PER_CATEGORY
    }));

  }


  if (loading) return <Loader />;


  return (
    <div className="w-full bg-orange-50 min-h-screen p-6">

      {Object.keys(productsByCategory).map(category => {

        const categoryProducts = productsByCategory[category];
        const visible = visibleCount[category] || PRODUCTS_PER_CATEGORY;

        return (

          <div key={category} className="mb-12">

            {/* CATEGORY TITLE */}
            <div className="flex justify-between items-center mb-4">

              <h2 className="text-2xl font-bold capitalize">
                {category}
              </h2>

            </div>


            {/* PRODUCTS GRID */}
            <div className="flex flex-wrap gap-6">

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

              <div className="mt-6 flex justify-center">

                <button
                  onClick={() => handleViewMore(category)}
                  className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
                >
                  View More
                </button>

              </div>

            )}

          </div>

        );

      })}

    </div>
  );
}
