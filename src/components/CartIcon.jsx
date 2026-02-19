import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";

export default function CartIcon() {
  const navigate = useNavigate();
  const [position, setPosition] = useState({ top: 50, left: 50 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // Start dragging
  const startDrag = (e) => {
    setDragging(true);
    setOffset({
      x: e.clientX - position.left,
      y: e.clientY - position.top,
    });
  };

  // Dragging
  const onDrag = (e) => {
    if (!dragging) return;
    setPosition({
      left: e.clientX - offset.x,
      top: e.clientY - offset.y,
    });
  };

  // End dragging
  const endDrag = () => setDragging(false);

  // Click handler to go to cart page
  const goToCart = () => {
    navigate("/cart"); // Change "/cart" if your route is different
  };

  return (
    <div
      onMouseDown={startDrag}
      onMouseMove={onDrag}
      onMouseUp={endDrag}
      onMouseLeave={endDrag}
      onClick={goToCart}
      style={{
        position: "absolute",
        top: position.top,
        left: position.left,
        cursor: dragging ? "grabbing" : "grab",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          width: 50,
          height: 50,
          backgroundColor: "#FF5722",
          borderRadius: "50%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
          userSelect: "none",
        }}
      >
        <FaShoppingCart size={24} />
      </div>
    </div>
  );
}
