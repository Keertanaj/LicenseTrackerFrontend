import React, { useState } from "react";
import { authService } from "../services/api"; 
import { useNavigate } from "react-router-dom";

const AuthPage = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    mobile: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setError("");
    setFormData({ username: "", email: "", password: "", mobile: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (isLoginMode) {
      // --- LOGIN LOGIC ---
      try {
        const loginData = { email: formData.email, password: formData.password };
        
        // Use your authService.login method
        const res = await authService.login(loginData); 
        
        const { token, redirectUrl } = res.data;
        localStorage.setItem("token", token);
        
        const redirectPath = new URL(redirectUrl).pathname;
        navigate(redirectPath);
        
      } catch (err) {
        setError(err.response?.data?.message || err.response?.data || "Login failed");
      }
    } else {
      // --- SIGNUP LOGIC ---
      try {
        // Use your authService.signup method
        // We pass the full formData
        await authService.signup(formData); 
        
        alert("Signup successful! Please login.");
        toggleMode();
        
      } catch (err) {
        setError(err.response?.data?.message || err.response?.data || "Signup failed");
      }
    }
  };

  return (
    <div>
      <h2>{isLoginMode ? "Login" : "Signup"}</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      
      <form onSubmit={handleSubmit}>
        {!isLoginMode && (
          <>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="mobile"
              placeholder="Mobile"
              value={formData.mobile}
              onChange={handleChange}
            />
          </>
        )}
        
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        
        <button type="submit">{isLoginMode ? "Login" : "Signup"}</button>
      </form>
      
      <p>
        {isLoginMode ? "Don't have an account?" : "Already have an account?"}
        <button 
          type="button" 
          onClick={toggleMode} 
          style={{
            background: 'none', 
            border: 'none', 
            color: 'blue', 
            cursor: 'pointer', 
            textDecoration: 'underline',
            marginLeft: '5px'
          }}
        >
          {isLoginMode ? "Sign Up" : "Login"}
        </button>
      </p>

      {isLoginMode && (
         <p>
           Forgot Password? <a href="/forgot">Click here</a>
         </p>
      )}
    </div>
  );
};

export default AuthPage;