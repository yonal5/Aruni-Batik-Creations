import { Route, Routes, useLocation } from "react-router-dom";
import Header from "../components/header";
import { ProductPage } from "./productPage";
import ProductOverview from "./productOverview";

import CartPage from "./cart";
import ChatPage from "./ChatPage";
import About from "./About";
import Contact from "./Contact";
import Settings from "./settings";
import MainHeader from "../components/header";
import NotFoundPage from "./notFoundPage";
import ProfilePage from "./profile";
import WishlistPage from "./wishlist";
import FAQPage from "./faq";
import TermsPage from "./terms";
import ReturnsPage from "./returns";
import ReviewsPage from "./reviews";
import SearchResultsPage from "./searchResults";
import CheckoutPage from "./CheckoutPage";
import CartIcon from "./components/CartIcon";

export default function HomePage() {
  const location = useLocation();

  return (
    <div className="w-auto h-auto bg-white">
      <Header/>
      <CartIcon/>
      {location.pathname === "/" && (
        <div className="relative w-full md:h-full overflow-hidden bg-black shadow-lg">
          <img
            src="/yonallll.png"
            alt="WebSell"
            className="w-full h-full object-cover"
          />

          {/* WORKING BUTTON */}
          

        </div>
      )}
      

      <Routes>
        <Route path="/" element={<ProductPage />} />
        <Route path="/products" element={<ProductPage />} />
        <Route path="/search" element={<SearchResultsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/returns" element={<ReturnsPage />} />
        <Route path="/reviews" element={<ReviewsPage />} />
        <Route path="/overview/:id" element={<ProductOverview />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/chat" element={<ChatPage />} />

        
        <Route path="/*" element={<NotFoundPage/>} />
      </Routes>

    </div>
  );
}
