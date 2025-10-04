import { useState } from "react";
import "./App.css";
import Home from "./components/Home";
import Itinerary from "./components/Itinerary";
import Cart from "./components/Cart";
import MyPlans from "./components/MyPlans";

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
      default:
        return <Home />;
    }
  };

  // Signup Handler
  const handleSignup = (e) => {
    e.preventDefault();
    const name = e.target.name.value.trim();
    const email = e.target.email.value.trim();
    const phone = e.target.phone.value.trim();
    const password = e.target.password.value;
    const confirm = e.target.confirm.value;

    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(password)) {
      alert(
        "Password must include at least 8 characters, with letters, numbers, and symbols."
      );
      return;
    }

    if (password !== confirm) {
      alert("Passwords do not match.");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
      alert("Please enter a valid 10-digit Indian phone number.");
      return;
    }

    const newUser = {
      name,
      email,
      phone,
      travellerType,
      password,
      joined: new Date().toLocaleDateString(),
    };
    setUsers([...users, newUser]);
    setAccountCreated(true);
    setTimeout(() => {
      setIsLogin(true);
      setAccountCreated(false);
    }, 1500);
  };

  // Login Handler
  const handleLogin = (e) => {
    e.preventDefault();
    const email = e.target.email.value.trim();
    const password = e.target.password.value;

    const existingUser = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!existingUser) {
      alert("Invalid credentials or user not found!");
      return;
    }

    setUser(existingUser);
    setShowModal(false);
  };

  // Logout
  const handleLogout = () => {
    setUser(null);
    setShowProfileMenu(false);
  };

  // Update user profile
  const updateUserProfile = (newPhone, newTraveller) => {
    setUser({ ...user, phone: newPhone, travellerType: newTraveller });
    setUsers(
      users.map((u) =>
        u.email === user.email
          ? { ...u, phone: newPhone, travellerType: newTraveller }
          : u
      )
    );
    alert("Profile updated!");
  };

  // Change password
  const changePassword = (current, newPass, confirm) => {
    if (current !== user.password) {
      alert("Current password incorrect!");
      return;
    }
    if (newPass !== confirm) {
      alert("New passwords do not match!");
      return;
    }
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(newPass)) {
      alert(
        "Password must include at least 8 characters, with letters, numbers, and symbols."
      );
      return;
    }

    setUser({ ...user, password: newPass });
    setUsers(
      users.map((u) =>
        u.email === user.email ? { ...u, password: newPass } : u
      )
    );
    alert("Password changed successfully!");
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
          <button onClick={() => changePassword(current, newPass, confirm)}>
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

          <button onClick={handleSettingsSave}>Save Settings</button>
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
          </div>

          {user ? (
            <div className="profile-section">
              <div
                className="profile-icon"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                👤
              </div>
              {showProfileMenu && (
                <div className="profile-menu">
                  <div style={{ marginBottom: "0.5rem" }}>
                    <strong>Hi, {user.name} 👋</strong>
                    <p>✉️ {user.email}</p>
                    <p>🧭 {user.travellerType}</p>
                  </div>
                  <hr />
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
                  <hr />
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
                        <input type="text" placeholder="Please specify" required />
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

      <style>{`
        .modal-overlay {
          position: fixed;
          top:0; left:0; width:100%; height:100%;
          background: rgba(0,0,0,0.6);
          display: flex; justify-content: center; align-items: center;
          z-index: 2000;
        }
        .modal-box {
          background: white; border-radius: 10px; padding: 1.5rem;
          width: 90%; max-width: 450px; box-shadow: 0 4px 12px rgba(0,0,0,0.2);
          max-height: 90vh; overflow: hidden; display: flex; flex-direction: column;
          animation: fadeIn 0.3s ease;
        }
        .scrollable-form { overflow-y: auto; max-height: 65vh; padding-right: 0.5rem; }
        .modal-header { display:flex; justify-content:space-between; align-items:center; }

        .profile-section { position: relative; }
        .profile-icon { background-color: #febb02; border-radius: 50%; width:38px; height:38px; display:flex; justify-content:center; align-items:center; font-size:1.2rem; cursor:pointer; }
        .profile-menu { position:absolute; right:0; top:50px; background:#fff; border-radius:8px; box-shadow:0 4px 10px rgba(0,0,0,0.15); padding:1rem; display:flex; flex-direction:column; gap:0.5rem; z-index:1000; min-width:220px; max-height:300px; overflow-y:auto; color:#003580; }
        .profile-menu p { margin:0; font-size:0.9rem; white-space: normal; word-wrap: break-word; }
        .profile-menu button { background:none; border:none; text-align:left; cursor:pointer; padding:0.4rem 0; color:#003580; font-weight:500; }
        .profile-menu button:hover { color:#febb02; }
        .logout-btn { color:red !important; font-weight:bold; }
        .success-msg { text-align:center; font-weight:bold; color:green; font-size:1.1rem; padding-top:2rem; }
        @keyframes fadeIn { from {opacity:0; transform:translateY(-20px);} to {opacity:1; transform:translateY(0);} }
      `}</style>
    </div>
  );
}

export default App;
