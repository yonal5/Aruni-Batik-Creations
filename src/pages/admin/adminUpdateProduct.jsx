import axios from "axios";
import { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Loader } from "../components/loader";
import ProductCard from "../components/productCard";

export function ProductPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const query = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const categoryQuery = (query.get("category") || "").toLowerCase();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // category state
  const [selectedCategory, setSelectedCategory] = useState(categoryQuery || "all");

  // view more state
  const PRODUCTS_PER_PAGE = 8;
  const [visibleCount, setVisibleCount] = useState(PRODUCTS_PER_PAGE);

  // load products
  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await axios.get(import.meta.env.VITE_API_URL + "/api/products");
        setProducts(res.data || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  // get categories from products dynamically
  const categories = useMemo(() => {
    const unique = new Set(products.map(p => (p.category || "").toLowerCase()));
    return ["all", ...unique];
  }, [products]);

  // filter products by category
  const filteredProducts = useMemo(() => {
    if (selectedCategory === "all") return products;
    return products.filter(
      p => (p.category || "").toLowerCase() === selectedCategory
    );
  }, [products, selectedCategory]);

  // visible products
  const visibleProducts = useMemo(() => {
    return filteredProducts.slice(0, visibleCount);
  }, [filteredProducts, visibleCount]);

  // view more function
  function handleViewMore() {
    setVisibleCount(prev => prev + PRODUCTS_PER_PAGE);
  }

  // change category
  function changeCategory(cat) {
    setSelectedCategory(cat);
    setVisibleCount(PRODUCTS_PER_PAGE);

    if (cat === "all") {
      navigate("/products");
    } else {
      navigate(`/products?category=${cat}`);
    }
  }

  if (loading) return <Loader />;

  return (
    <div className="w-full min-h-screen bg-orange-50">

      {/* CATEGORY BAR */}
      <div className="w-full bg-white shadow-sm p-4 flex flex-wrap gap-3 justify-center">

        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => changeCategory(cat)}
            className={`px-4 py-2 rounded-full border transition
              ${selectedCategory === cat
                ? "bg-orange-500 text-white border-orange-500"
                : "bg-white text-gray-700 border-gray-300 hover:bg-orange-100"
              }`}
          >
            {cat === "all"
              ? "All"
              : cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}

      </div>


      {/* PRODUCT GRID */}
      <div className="w-full flex flex-wrap justify-center gap-6 p-6 bg-white">

        {visibleProducts.length === 0 && (
          <div className="text-gray-500 text-lg">
            No products found
          </div>
        )}

        {visibleProducts.map(product => (
          <ProductCard
            key={product.productID}
            product={product}
          />
        ))}

      </div>


      {/* VIEW MORE BUTTON */}
      {visibleCount < filteredProducts.length && (
        <div className="w-full flex justify-center pb-10">

          <button
            onClick={handleViewMore}
            className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
          >
            View More
          </button>

        </div>
      )}

    </div>
  );
}
