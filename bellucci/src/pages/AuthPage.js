import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { API_BASE_URL } from '../config';

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let userCredential;
      if (isLogin) {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      } else {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
      }

      // 1. Get token
      const token = await userCredential.user.getIdToken();

      // 2. Create or update user in backend (call /api/users)
      const userRes = await fetch(`${API_BASE_URL}/api/users`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token.trim()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firebase_uid: userCredential.user.uid,
          email: userCredential.user.email,
          preferences: {},
          ...(isLogin ? {} : { first_name: firstName, last_name: lastName })
        })
      });

      if (!userRes.ok) {
        const errorText = await userRes.text();
        throw new Error(`User creation error: ${errorText}`);
      }

      // 3. Fetch user profile from backend (to get the role)
      const profileRes = await fetch(`${API_BASE_URL}/api/user/me`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token.trim()}`,
          "Content-Type": "application/json",
        }
      });
      if (!profileRes.ok) {
        const errorText = await profileRes.text();
        throw new Error("Profile fetch error: " + errorText);
      }
      const profileData = await profileRes.json();

      // 4. Navigate based on role
      if (profileData.role === "seller") {
        navigate("/seller-dashboard");
      } else {
        navigate("/home");
      }

    } catch (error) {
      alert("Connection error: " + error.message);
    }
    setLoading(false);
  };

  const handleForgotPassword = async () => {
    if (!email) {
      alert("Please enter your email first.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent!");
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.logo}>BELLUCCI</h1>
      <form onSubmit={handleAuth} style={styles.form}>
        {!isLogin && (
          <>
            <input
              style={styles.input}
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              required
            />
            <input
              style={styles.input}
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              required
            />
          </>
        )}
        <input
          style={styles.input}
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button style={styles.button} type="submit" disabled={loading}>
          {loading ? "Loading..." : isLogin ? "Login" : "Sign Up"}
        </button>
      </form>
      {isLogin && (
        <button style={styles.toggle} onClick={handleForgotPassword}>
          Forgot Password?
        </button>
      )}
      <button style={styles.toggle} onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
      </button>
      <button style={styles.toggle} onClick={() => navigate('/seller-register')}>
        Want to sell on Bellucci? Register as a Seller
      </button>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "#fff",
    padding: 30,
  },
  logo: {
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 40,
    color: "#000",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    width: 300,
    gap: 15,
  },
  input: {
    padding: 15,
    borderRadius: 8,
    border: "1px solid #000",
    fontSize: 16,
  },
  button: {
    background: "#000",
    color: "#fff",
    padding: 15,
    borderRadius: 8,
    fontWeight: "600",
    border: "none",
    cursor: "pointer",
    marginTop: 10,
  },
  toggle: {
    marginTop: 20,
    color: "#444",
    background: "none",
    border: "none",
    cursor: "pointer",
    textAlign: "center",
    fontSize: 16,
  }
};

export default AuthPage;