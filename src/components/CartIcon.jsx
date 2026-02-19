import { useState } from "react";
import { FaShoppingCart } from "react-icons/fa"; // using react-icons

export default function CartIcon() {
  const [position, setPosition] = useState({ top: 50, left: 50 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const startDrag = (e) => {
    setDragging(true);
    setOffset({
      x: e.clientX - position.left,
      y: e.clientY - position.top,
    });
  };

  const onDrag = (e) => {
    if (!dragging) return;
    setPosition({
      left: e.clientX - offset.x,
      top: e.clientY - offset.y,
    });
  };

  const endDrag = () => setDragging(false);

  return (
    <div
      onMouseDown={startDrag}
      onMouseMove={onDrag}
      onMouseUp={endDrag}
      onMouseLeave={endDrag}
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
        }}
      >
        <FaShoppingCart size={24} />
      </div>
    </div>
  );
}
