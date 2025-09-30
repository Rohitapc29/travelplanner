import { useState } from "react";
import "./App.css";
import Home from "./components/Home";
import Itinerary from "./components/Itinerary";
import Cart from "./components/Cart";
import MyPlans from "./components/MyPlans";

function App() {
  const [page, setPage] = useState("home");

  const renderPage = () => {
    switch (page) {
      case "itinerary":
        return <Itinerary />;
      case "cart":
        return <Cart />;
      case "plans":
        return <MyPlans />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="app">
      {/* Navbar */}
      <nav>
        <div className="navbar-container">
          <h1 onClick={() => setPage("home")}>TravelMate</h1>
          <div className="nav-links">
            <button onClick={() => setPage("home")}>Home</button>
            <button onClick={() => setPage("itinerary")}>Itinerary</button>
            <button onClick={() => setPage("cart")}>Cart</button>
            <button onClick={() => setPage("plans")}>My Plans</button>
          </div>
          <button className="login-btn">Sign Up / Login</button>
        </div>
      </nav>

      <main>{renderPage()}</main>

      {/* Footer */}
      <footer>
        <p>© 2025 TravelMate. All rights reserved.</p>
        <p>Contact: info@travelmate.com | +1 234 567 890</p>
        <p>Privacy Policy | Terms & Conditions</p>
      </footer>
    </div>
  );
}

export default App;
