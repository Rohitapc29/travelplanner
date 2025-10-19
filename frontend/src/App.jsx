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