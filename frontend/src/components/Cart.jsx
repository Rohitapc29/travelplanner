import React from "react";

function Cart() {
  const items = [
    { name: "Bali Escape Package", price: "$1200" },
    { name: "Swiss Alps Trip", price: "$1500" },
  ];

  return (
    <section className="screen-section">
      <h2>My Cart</h2>
      <div className="screen-cards">
        {items.map((item, idx) => (
          <div key={idx} className="screen-card">
            <h4>{item.name}</h4>
            <p>Price: {item.price}</p>
            <button>Remove</button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Cart;
