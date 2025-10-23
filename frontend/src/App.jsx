import { useState } from "react";
import "./App.css";
import Home from "./components/Home";
import Itinerary from "./components/Itinerary";
import Cart from "./components/Cart";
import MyPlans from "./components/MyPlans";
import AppFlightHotel from "./AppFlightHotel";

function App() {
  const [page, setPage] = useState("home");
  const [showModal, setShowModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [travellerType, setTravellerType] = useState("");
  const [accountCreated, setAccountCreated] = useState(false);
  const [user, setUser] = useState(null); // logged-in user
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [users, setUsers] = useState([]);

  const [settings, setSettings] = useState({
    notifications: true,
    privacy: true,
  });

  const renderPage = () => {
    switch (page) {
      case "itinerary":
        return <Itinerary />;
      case "cart":
        return <Cart />;
      case "plans":
        return <MyPlans />;
      case "myprofile":
        return user ? <MyProfile /> : <Home />;
      case "settings":
        return user ? <Settings /> : <Home />;
        case "flighthotels":
            return <AppFlightHotel />;
      default:
        return <Home />;
    }
  };

  // Signup Handler
  const handleSignup = async (e) => {
  e.preventDefault();
  const name = e.target.name.value.trim();
  const email = e.target.email.value.trim();
  const phone = e.target.phone.value.trim();
  const password = e.target.password.value;
  const confirm = e.target.confirm.value;

  if (password !== confirm) return alert("Passwords do not match!");

  try {
    const res = await fetch("http://localhost:4000/api/users/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone, password, travellerType }),
    });

    const data = await res.json();
    if (!res.ok) return alert(data.message);

    alert("Signup successful!");
    setIsLogin(true);
  } catch (err) {
    console.error(err);
    alert("Error connecting to server");
  }
};


  // Login Handler
  const handleLogin = async (e) => {
  e.preventDefault();
  const email = e.target.email.value.trim();
  const password = e.target.password.value;

  try {
    const res = await fetch("http://localhost:4000/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) return alert(data.message);

    setUser(data.user);
    setShowModal(false);
  } catch (err) {
    console.error(err);
    alert("Error connecting to server");
  }
};


  // Logout
  const handleLogout = () => {
    setUser(null);
    setShowProfileMenu(false);
  };

  // Update user profile
  const updateUserProfile = async (newPhone, newTraveller) => {
  try {
    const res = await fetch("http://localhost:4000/api/users/update-profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: user.email,
        phone: newPhone,
        travellerType: newTraveller,
      }),
    });

    const data = await res.json();
    if (!res.ok) return alert(data.message);

    setUser(data.user); // update frontend state with backend's latest
    alert("Profile updated!");
  } catch (err) {
    console.error(err);
    alert("Error updating profile");
  }
};

  // Change password
const changePassword = async (current, newPass, confirm) => {
  if (newPass !== confirm) {
    alert("New passwords do not match!");
    return;
  }

  try {
    console.log("Sending change password request:", { email: user.email, current, newPass });

    const res = await fetch("http://localhost:4000/api/users/change-password", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: user.email,
        current,
        newPass,
      }),
    });

    console.log("Response object:", res);

    const data = await res.json();
    console.log("Response data:", data);

    if (!res.ok) return alert(data.message);
    alert(data.message);
  } catch (err) {
    console.error("Fetch error:", err);
    alert("Error connecting to server");
  }
};


  // MyProfile Component
  const MyProfile = () => {
    const [phone, setPhone] = useState(user.phone);
    const [traveller, setTraveller] = useState(user.travellerType);

    return (
      <div className="screen-section">
        <h2>My Profile</h2>
        <div
          className="screen-card"
          style={{ maxWidth: "400px", margin: "0 auto" }}
        >
          <p>
            <strong>Name:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Contact Number:</strong>{" "}
            <input
              type="tel"
              value={phone}
              pattern="[6-9]{1}[0-9]{9}"
              onChange={(e) => setPhone(e.target.value)}
            />
          </p>
          <p>
            <strong>Traveller Type:</strong>{" "}
            <select
              value={traveller}
              onChange={(e) => setTraveller(e.target.value)}
            >
              <option value="adventure">Adventure Seeker</option>
              <option value="luxury">Luxury Explorer</option>
              <option value="budget">Budget Traveller</option>
              <option value="culture">Culture Enthusiast</option>
              <option value="relax">Relaxation Lover</option>
              <option value="other">Other</option>
            </select>
          </p>
          <p>
            <strong>Joined:</strong> {user.joined}
          </p>
          <button onClick={() => updateUserProfile(phone, traveller)}>
            Save Changes
          </button>
        </div>
      </div>
    );
  };

  // Settings Component
  const Settings = () => {
    const [current, setCurrent] = useState("");
    const [newPass, setNewPass] = useState("");
    const [confirm, setConfirm] = useState("");
    const [notif, setNotif] = useState(settings.notifications);
    const [privacy, setPrivacy] = useState(settings.privacy);

    const handleSettingsSave = () => {
      setSettings({ notifications: notif, privacy });
      alert("Settings saved!");
    };

   return (
  <div className="screen-section">
    <h2>Settings</h2>
    <div
      className="screen-card"
      style={{ maxWidth: "400px", margin: "0 auto" }}
    >
      <h3>Change Password</h3>
      <input
        type="password"
        placeholder="Current Password"
        value={current}
        onChange={(e) => setCurrent(e.target.value)}
      />
      <input
        type="password"
        placeholder="New Password"
        value={newPass}
        onChange={(e) => setNewPass(e.target.value)}
      />
      <input
        type="password"
        placeholder="Confirm New Password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
      />
      <button
        type="button" // prevents form submission / page reload
        onClick={() => changePassword(current, newPass, confirm)}
      >
        Change Password
      </button>

      <h3>Notifications</h3>
      <label>
        <input
          type="checkbox"
          checked={notif}
          onChange={() => setNotif(!notif)}
        />
        Receive travel deals & itinerary reminders
      </label>

      <h3>Privacy Settings</h3>
      <label>
        <input
          type="checkbox"
          checked={privacy}
          onChange={() => setPrivacy(!privacy)}
        />
        Show my contact number & traveller type to others
      </label>

      <button
        type="button"
        onClick={handleSettingsSave}
      >
        Save Settings
      </button>
    </div>
  </div>
);

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
            <button onClick={() => setPage("flighthotels")}>Hotels and Flights</button>
          </div>

          {/* --- PASTE THIS ENTIRE BLOCK --- */}

{user ? (
  <div className="profile-section">
    <div
      className="profile-icon"
      onClick={() => setShowProfileMenu(!showProfileMenu)}
    >
      {/* New SVG Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        width="24px"
        height="24px"
      >
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
      </svg>
    </div>

    {showProfileMenu && (
      <div className="profile-menu">
        <div className="user-info">
          <strong>Hi, {user.name} 👋</strong>
          <p>{user.email}</p>
          <p>{user.travellerType}</p>
        </div>
        <button
          onClick={() => {
            setPage("myprofile");
            setShowProfileMenu(false);
          }}
        >
          My Profile
        </button>
        <button
          onClick={() => {
            setPage("plans");
            setShowProfileMenu(false);
          }}
        >
          My Trips
        </button>
        <button
          onClick={() => {
            setPage("settings");
            setShowProfileMenu(false);
          }}
        >
          Settings
        </button>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    )}
  </div>
) : (
  <button className="login-btn" onClick={() => setShowModal(true)}>
    Sign Up / Login
  </button>
)}

{/* --- END OF BLOCK TO PASTE --- */}
        </div>
      </nav>

      <main>{renderPage()}</main>

      <footer>
        <p>© 2025 TravelMate. All rights reserved.</p>
        <p>Contact: info@travelmate.com | +91 98765 43210</p>
        <p>Privacy Policy | Terms & Conditions</p>
      </footer>

      {/* Login/Signup Modal */}
      {showModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowModal(false)} // close on outside click
        >
          <div
            className="modal-box"
            onClick={(e) => e.stopPropagation()} // prevent closing on inner click
          >
            <div className="modal-header">
              <div className="modal-tabs">
                <button
                  className={isLogin ? "active" : ""}
                  onClick={() => setIsLogin(true)}
                >
                  Login
                </button>
                <button
                  className={!isLogin ? "active" : ""}
                  onClick={() => setIsLogin(false)}
                >
                  Sign Up
                </button>
              </div>
            </div>

            {isLogin ? (
              <div className="form-container">
                <h2>Login to TravelMate</h2>
                <form onSubmit={handleLogin}>
                  <label>Email</label>
                  <input name="email" type="email" required />
                  <label>Password</label>
                  <input name="password" type="password" required />
                  <button type="submit" className="login-submit-btn">
                    Login
                  </button>
                </form>
              </div>
            ) : (
              <div className="form-container scrollable-form">
                {accountCreated ? (
                  <p className="success-msg">🎉 Account Created Successfully!</p>
                ) : (
                  <>
                    <h2>Create Your Account</h2>
                    <form onSubmit={handleSignup}>
                      <label>Name</label>
                      <input name="name" type="text" required />
                      <label>Email</label>
                      <input name="email" type="email" required />
                      <label>Contact Number (+91)</label>
                      <input
                        name="phone"
                        type="tel"
                        pattern="[6-9]{1}[0-9]{9}"
                        required
                      />
                      <label>What kind of traveller are you?</label>
                      <select
                        value={travellerType}
                        onChange={(e) => setTravellerType(e.target.value)}
                        required
                      >
                        <option value="">Select an option</option>
                        <option value="adventure">Adventure Seeker</option>
                        <option value="luxury">Luxury Explorer</option>
                        <option value="budget">Budget Traveller</option>
                        <option value="culture">Culture Enthusiast</option>
                        <option value="relax">Relaxation Lover</option>
                        <option value="other">Other</option>
                      </select>
                      {travellerType === "other" && (
                        <input
                          type="text"
                          placeholder="Please specify"
                          required
                        />
                      )}
                      <label>Password</label>
                      <input name="password" type="password" required />
                      <label>Confirm Password</label>
                      <input name="confirm" type="password" required />
                      <button type="submit" className="signup-submit-btn">
                        Sign Up
                      </button>
                    </form>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;