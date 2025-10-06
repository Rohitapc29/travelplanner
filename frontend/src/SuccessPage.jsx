import React from "react";
import { Link } from "react-router-dom";

export default function SuccessPage() {
  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      background: "#f0f4f8",
    }}>
      <div style={{
        padding: 40,
        background: "white",
        borderRadius: 12,
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        textAlign: "center",
      }}>
        <h1 style={{ color: "green", marginBottom: 20 }}>✅ Payment Successful!</h1>
        <p>Thank you for booking your flight with us.</p>
        <p>
          <Link to="/" style={{ color: "#1a73e8", textDecoration: "underline" }}>
            Go to Homepage
          </Link>
        </p>
      </div>
    </div>
  );
}
