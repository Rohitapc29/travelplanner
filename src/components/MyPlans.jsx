import React from "react";

function MyPlans() {
  const plans = ["Paris Getaway", "Bali Escape", "Tokyo Highlights"];

  return (
    <section className="screen-section">
      <h2>My Plans</h2>
      <div className="screen-cards">
        {plans.map((plan, idx) => (
          <div key={idx} className="screen-card">
            <h4>{plan}</h4>
            <p>Details coming soon...</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default MyPlans;
