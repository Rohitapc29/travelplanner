import { useState, useEffect } from "react";
import "./App.css";
import Home from "./components/Home";
import Itinerary from "./components/Itinerary";
import Cart from "./components/Cart";
import MyPlans from "./components/MyPlans";
import AppFlightHotel from "./AppFlightHotel";
import AdminDashboard from "./components/AdminDashboard";

function App() {
  const [page, setPage] = useState("home");
  const [showModal, setShowModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [travellerType, setTravellerType] = useState("");
  const [accountCreated, setAccountCreated] = useState(false);
  const [user, setUser] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [settings, setSettings] = useState({
    notifications: true,
    privacy: true,
  });

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          
          const res = await fetch("http://localhost:4000/api/users/verify-token", {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`
            }
          });

          if (res.ok) {
            const data = await res.json();
            setUser(data.user);
          } else {
            
            localStorage.removeItem('token');
          }
        } catch (error) {
          console.error('Error verifying token:', error);
          localStorage.removeItem('token');
        }
      }
      
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  // Protected routes array
  const protectedRoutes = ["itinerary", "cart", "plans", "myprofile", "settings", "flighthotels", "admin"];
  
  // Admin only routes
  const adminRoutes = ["admin"];

  const requiresAuth = (routeName) => {
    return protectedRoutes.includes(routeName);
  };

  
  const navigateTo = (pageName) => {
    if (requiresAuth(pageName) && !user) {
      
      setShowModal(true);
      setIsLogin(true); 
      return;
    }
    setPage(pageName);
  };

  const renderPage = () => {
    if (user?.isAdmin) {
      return <AdminDashboard />;
    }

    if (requiresAuth(page) && !user) {
      return <Home />;
    }

    switch (page) {
      case "itinerary":
        return <Itinerary />;
      case "cart":
        return <Cart />;
      case "plans":
        return <MyPlans />;
      case "myprofile":
        return <MyProfile />;
      case "settings":
        return <Settings />;
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

      localStorage.setItem('token', data.token);
      setUser({
        _id: data._id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        travellerType: data.travellerType,
        joined: data.joined
      });
      
      setShowModal(false);
      alert("Signup successful!");
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

      localStorage.setItem('token', data.token);
      
      setUser(data.user);
      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert("Error connecting to server");
    }
  };

  // Update user profile with auth header
  const updateUserProfile = async (newPhone, newTraveller) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch("http://localhost:4000/api/users/update-profile", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          phone: newPhone,
          travellerType: newTraveller,
        }),
      });

      const data = await res.json();
      if (!res.ok) return alert(data.message);

      setUser(data.user);
      alert("Profile updated!");
    } catch (err) {
      console.error(err);
      alert("Error updating profile");
    }
  };

  // Change password with auth header
  const changePassword = async (current, newPass, confirm) => {
    if (newPass !== confirm) {
      alert("New passwords do not match!");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch("http://localhost:4000/api/users/change-password", {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          current,
          newPass,
        }),
      });

      const data = await res.json();
      if (!res.ok) return alert(data.message);
      alert(data.message);
    } catch (err) {
      console.error("Fetch error:", err);
      alert("Error connecting to server");
    }
  };

 
  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setShowProfileMenu(false);
    setPage("home");
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

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
          <h1 onClick={() => !user?.isAdmin && setPage("home")}>TravelMate</h1>
          {!user?.isAdmin && (
            <div className="nav-links">
              <button onClick={() => setPage("home")}>Home</button>
              <button onClick={() => navigateTo("itinerary")}>Itinerary</button>
              <button onClick={() => navigateTo("cart")}>Cart</button>
              <button onClick={() => navigateTo("plans")}>My Plans</button>
              <button onClick={() => navigateTo("flighthotels")}>Hotels and Flights</button>
            </div>
          )}
          {user?.isAdmin && (
            <div className="nav-links">
              <button disabled style={{ fontWeight: 'bold' }}>Admin Dashboard</button>
            </div>
          )}

          {user ? (
            <div className="profile-section">
              <div
                className="profile-icon"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
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
                      navigateTo("myprofile");
                      setShowProfileMenu(false);
                    }}
                  >
                    My Profile
                  </button>
                  <button
                    onClick={() => {
                      navigateTo("plans");
                      setShowProfileMenu(false);
                    }}
                  >
                    My Trips
                  </button>
                  <button
                    onClick={() => {
                      navigateTo("settings");
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
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            {!user && (
              <div className="auth-required-message">
                <p>🔒 Please login to access this feature</p>
              </div>
            )}
            
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