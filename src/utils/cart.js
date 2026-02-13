// src/utils/cart.js

// Load cart from localStorage
export function loadCart() {
  return JSON.parse(localStorage.getItem("cart") || "[]");
}

// Save cart to localStorage
export function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Add/update item in cart
export function addToCart(item, qty) {
  const cart = loadCart();
  const index = cart.findIndex(i => i.productID === item.productID);

  if (index !== -1) {
    cart[index].quantity += qty;
    if (cart[index].quantity <= 0) cart.splice(index, 1);
  } else if (qty > 0) {
    cart.push({ ...item, quantity: qty });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
}

// Get total price
export function getTotal() {
  const cart = loadCart();
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}
