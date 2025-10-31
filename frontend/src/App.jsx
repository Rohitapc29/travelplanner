import { useState, useEffect } from "react";
import "./App.css";
import Home from "./components/Home";
import Itinerary from "./components/Itinerary";
import MyPlans from "./components/MyPlans";
import AppFlightHotel from "./AppFlightHotel";
import AdminDashboard from "./components/AdminDashboard";
import "./components/Settings.css"; // <-- Add this for Settings styling
import Premium from "./components/Premium";
import PremiumSuccess from "./components/PremiumSuccess";
import PremiumGate from "./components/PremiumGate";

function App() {
  const [page, setPage] = useState("home");
  const [showModal, setShowModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [travellerType, setTravellerType] = useState("");
  const [accountCreated, setAccountCreated] = useState(false);
  const [user, setUser] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [settings, setSettings] = useState({
    notifications: true,
    privacy: true,
  });

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");

      if (token) {
        if (userData) {
          try {
            setUser(JSON.parse(userData));
            setIsLoading(false);
            return;
          } catch (error) {
            console.error("Error parsing user data:", error);
            localStorage.removeItem("user");
          }
        }

        try {
          const res = await fetch("http://localhost:4000/api/users/verify-token", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (res.ok) {
            const data = await res.json();
            setUser(data.user);
            localStorage.setItem("user", JSON.stringify(data.user));
          } else {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
          }
        } catch (error) {
          console.error("Error verifying token:", error);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      }

      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.substring(1);
      
      if (hash.startsWith('premium-success')) {
        console.log('Detected premium-success route');
        setPage('premium-success');
      } else if (hash) {
        setPage(hash);
      } else {
        setPage('home');
      }
    };
    
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const protectedRoutes = ["itinerary", "plans", "myprofile", "flighthotels", "admin", "premium"];
  const adminRoutes = ["admin"];

  const requiresAuth = (routeName) => protectedRoutes.includes(routeName);

  const navigateTo = (pageName) => {
    if (requiresAuth(pageName) && !user) {
      setShowModal(true);
      setIsLogin(true);
      return;
    }
    setPage(pageName);
  };

  const renderPage = () => {
    if (user?.isAdmin) return <AdminDashboard />;
    if (requiresAuth(page) && !user) return <Home />;

    switch (page) {
      case "home":
        return <Home />;
      case "itinerary":
        return <Itinerary />;
      case "plans":
        return <MyPlans />;
      case "myprofile":
        return <MyProfile />;
      case "settings":
        return <Settings />;
      case "flighthotels":
        return <AppFlightHotel navigateToMainApp={navigateTo} />;
      case "premium":
        return <Premium />;
      case "premium-success":
        return <PremiumSuccess />;
      default:
        return <Home />;
    }
  };

  // === AUTH HANDLERS ===
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

      const userObj = {
        _id: data._id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        travellerType: data.travellerType,
        joined: data.joined,
        isPremium: data.isPremium || false,
        subscriptionType: data.subscriptionType || null,
        premiumExpiryDate: data.premiumExpiryDate || null,
      };

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(userObj));

      setUser(userObj);
      setShowModal(false);
      alert("Signup successful!");
    } catch (err) {
      console.error(err);
      alert("Error connecting to server");
    }
  };

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

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setUser(data.user);
      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert("Error connecting to server");
    }
  };

  const updateUserProfile = async (newPhone, newTraveller) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:4000/api/users/update-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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

  const changePassword = async (current, newPass, confirm) => {
    if (newPass !== confirm) {
      alert("New passwords do not match!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:4000/api/users/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ current, newPass }),
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
    localStorage.removeItem("token");
    localStorage.removeItem("user");
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

  // === MY PROFILE ===
  const MyProfile = () => {
  const [name, setName] = useState("Prithvi Birbale");
  const [email, setEmail] = useState("prithvi@example.com");
  const [phone, setPhone] = useState("+91 9876543210");
  const [travellerType, setTravellerType] = useState("Solo Traveller");
  const [bio, setBio] = useState("Explorer. Food lover. Always planning my next trip.");

  const handleProfileSave = () => {
    alert("Profile updated successfully!");
  };

  return (
    <div className="screen-section">
      <h2>My Profile</h2>

      <div
        className="screen-card"
        style={{ maxWidth: "500px", margin: "0 auto" }}
      >
        <div className="profile-avatar">
          <img
            src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
            alt="User Avatar"
          />
        </div>

        <div className="profile-fields">
          <label>Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Phone Number</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <label>Traveller Type</label>
          <select
            value={travellerType}
            onChange={(e) => setTravellerType(e.target.value)}
          >
            <option>Solo Traveller</option>
            <option>Family Traveller</option>
            <option>Couple</option>
            <option>Backpacker</option>
            <option>Business Traveller</option>
          </select>

          <label>Bio</label>
          <textarea
            rows="3"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />

          <button type="button" onClick={handleProfileSave}>
            Save Profile
          </button>
        </div>
      </div>
    </div>
  );
};

  // === SETTINGS (STYLED) ===
  const Settings = () => {
    const [current, setCurrent] = useState("");
    const [newPass, setNewPass] = useState("");
    const [confirm, setConfirm] = useState("");
    const [notif, setNotif] = useState(settings.notifications);
    const [privacy, setPrivacy] = useState(settings.privacy);
    const [message, setMessage] = useState("");

    const handleSettingsSave = () => {
      setSettings({ notifications: notif, privacy });
      setMessage("✅ Settings saved successfully!");
      setTimeout(() => setMessage(""), 3000);
    };

    const handlePasswordChange = () => {
      if (!current || !newPass || !confirm) {
        setMessage("⚠️ Please fill in all password fields.");
        return;
      }
      if (newPass !== confirm) {
        setMessage("❌ New passwords do not match.");
        return;
      }
      changePassword(current, newPass, confirm);
      setMessage("✅ Password changed successfully!");
      setCurrent("");
      setNewPass("");
      setConfirm("");
    };

    return (
      <div className="settings-container">
        <h2 className="settings-title">⚙️ Account Settings</h2>
        <div className="settings-card">
          <h3>Change Password</h3>
          <div className="form-group">
            <input type="password" placeholder="Current Password" value={current} onChange={(e) => setCurrent(e.target.value)} />
            <input type="password" placeholder="New Password" value={newPass} onChange={(e) => setNewPass(e.target.value)} />
            <input type="password" placeholder="Confirm New Password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
            <button type="button" className="btn-primary" onClick={handlePasswordChange}>
              Change Password
            </button>
          </div>

          <hr />

          <h3>Notifications</h3>
          <label className="toggle-row">
            <input type="checkbox" checked={notif} onChange={() => setNotif(!notif)} />
            Receive travel deals & itinerary reminders
          </label>

          <h3>Privacy Settings</h3>
          <label className="toggle-row">
            <input type="checkbox" checked={privacy} onChange={() => setPrivacy(!privacy)} />
            Show my contact number & traveller type to others
          </label>

          <button type="button" className="btn-save" onClick={handleSettingsSave}>
            Save Settings
          </button>

          {message && <div className="settings-message">{message}</div>}
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
              <button onClick={() => navigateTo("plans")}>My Plans</button>
              <button onClick={() => navigateTo("flighthotels")}>Hotels & Flights</button>
              <button 
                onClick={() => navigateTo("premium")}
                style={{
                  background: user?.isPremium ? '#28a745' : 'linear-gradient(45deg, #FFD700, #FFA500)',
                  color: user?.isPremium ? 'white' : '#333',
                  fontWeight: 'bold'
                }}
              >
                {user?.isPremium ? '✅ Premium' : '⭐ Go Premium'}
              </button>
            </div>
          )}

          {user && (
            <div className="profile-section">
              <div className="profile-icon" onClick={() => setShowProfileMenu(!showProfileMenu)}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" width="24" height="24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 
                  1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>

              {showProfileMenu && (
                <div className="profile-menu">
                  <div className="user-info">
                    <strong>Hi, {user.name} 👋</strong>
                    <p>{user.email}</p>
                    <p>{user.travellerType}</p>
                    <p style={{
                      color: user?.isPremium ? '#28a745' : '#ffc107',
                      fontWeight: 'bold',
                      fontSize: '12px'
                    }}>
                      {user?.isPremium ? '✅ Premium Member' : '⭐ Free Plan'}
                    </p>
                  </div>
                  <button onClick={() => navigateTo("myprofile")}>My Profile</button>
                  <button onClick={() => navigateTo("plans")}>My Trips</button>
                  <button onClick={() => navigateTo("settings")}>Settings</button>
                  {!user?.isPremium && (
                    <button 
                      onClick={() => navigateTo("premium")}
                      style={{
                        background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                        color: '#333',
                        fontWeight: 'bold'
                      }}
                    >
                      ⭐ Upgrade to Premium
                    </button>
                  )}
                  <button className="logout-btn" onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          )}

          {!user && (
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

      {/* Login/Signup Modal (same as before) */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            {!user && <div className="auth-required-message"><p>🔒 Please login to access this feature</p></div>}
            <div className="modal-header">
              <div className="modal-tabs">
                <button className={isLogin ? "active" : ""} onClick={() => setIsLogin(true)}>Login</button>
                <button className={!isLogin ? "active" : ""} onClick={() => setIsLogin(false)}>Sign Up</button>
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
                  <button type="submit" className="login-submit-btn">Login</button>
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
                      <input name="phone" type="tel" pattern="[6-9]{1}[0-9]{9}" required />
                      <label>What kind of traveller are you?</label>
                      <select value={travellerType} onChange={(e) => setTravellerType(e.target.value)} required>
                        <option value="">Select an option</option>
                        <option value="adventure">Adventure Seeker</option>
                        <option value="luxury">Luxury Explorer</option>
                        <option value="budget">Budget Traveller</option>
                        <option value="culture">Culture Enthusiast</option>
                        <option value="relax">Relaxation Lover</option>
                        <option value="other">Other</option>
                      </select>
                      {travellerType === "other" && <input type="text" placeholder="Please specify" required />}
                      <label>Password</label>
                      <input name="password" type="password" required />
                      <label>Confirm Password</label>
                      <input name="confirm" type="password" required />
                      <button type="submit" className="signup-submit-btn">Sign Up</button>
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
