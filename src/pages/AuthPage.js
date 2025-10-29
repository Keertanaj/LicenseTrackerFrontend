import React, { useState } from "react";
import { Container, Card, Form, Button, Alert } from "react-bootstrap"; 
import { authService } from "../services/api"; 

const AuthPage = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    mobile: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setError("");
    setLoading(false);
    setFormData({ username: "", email: "", password: "", mobile: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (isLoginMode) {
      // --- LOGIN LOGIC ---
      try {
        const loginData = { email: formData.email, password: formData.password };
        const res = await authService.login(loginData); 
        
        const { token, redirectUrl } = res.data;
        localStorage.setItem("token", token);
        
        // Navigate with full refresh
        window.location.href = new URL(redirectUrl).pathname || '/dashboard';
        
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.response?.data || "Login failed";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    } else {
      // --- SIGNUP LOGIC ---
      try {
        await authService.signup(formData); 
        
        alert("Signup successful! Please login.");
        toggleMode();
        
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.response?.data || "Signup failed";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Container 
      fluid 
      className="d-flex align-items-center justify-content-center" 
      style={{ minHeight: '100vh', backgroundColor: '#E6E6E6' }} // Theme Background
    >
      <Card 
        className="shadow-lg p-4" 
        style={{ maxWidth: '450px', width: '100%', backgroundColor: '#BAC8B1' }} // Theme Card Background
      >
        <Card.Body>
          <div className="text-center mb-4">
            <h2 style={{ color: '#404E3B' }} className="fw-bold">
              {isLoginMode ? "Welcome Back!" : "Create Account"}
            </h2>
            <p style={{ color: '#404E3B' }}>
              {isLoginMode ? "Sign in to your LicenseTracker account." : "Register to start managing your licenses."}
            </p>
          </div>

          {error && <Alert variant="danger" className="text-center">{error}</Alert>}
          
          <Form onSubmit={handleSubmit}>
            
            {/* Username Field (Signup Only) */}
            {!isLoginMode && (
              <Form.Group className="mb-3" controlId="formUsername">
                <Form.Label style={{ color: '#404E3B' }}>Username</Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  placeholder="Enter username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  style={{ backgroundColor: 'white', color: '#404E3B' }} // White Input
                />
              </Form.Group>
            )}

            {/* Email Field */}
            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label style={{ color: '#404E3B' }}>Email Address</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleChange}
                required
                style={{ backgroundColor: 'white', color: '#404E3B' }} // White Input
              />
            </Form.Group>
            
            {/* Password Field */}
            <Form.Group className="mb-3" controlId="formPassword">
              <Form.Label style={{ color: '#404E3B' }}>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                required
                style={{ backgroundColor: 'white', color: '#404E3B' }} // White Input
              />
            </Form.Group>

            {!isLoginMode && (
              <Form.Group className="mb-4" controlId="formMobile">
                <Form.Label style={{ color: '#404E3B' }}>Mobile (Optional)</Form.Label>
                <Form.Control
                  type="text"
                  name="mobile"
                  placeholder="Enter mobile number"
                  value={formData.mobile}
                  onChange={handleChange}
                  style={{ backgroundColor: 'white', color: '#404E3B' }} // White Input
                />
              </Form.Group>
            )}
            
            <div className="d-grid gap-2">
              <Button 
                type="submit" 
                disabled={loading} 
                className="fw-bold"
                style={{ backgroundColor: '#7B9669', borderColor: '#7B9669', color: 'white' }} // Theme Primary Button
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    &nbsp; {isLoginMode ? "Logging In..." : "Signing Up..."}
                  </>
                ) : (
                  isLoginMode ? "Login" : "Signup"
                )}
              </Button>
            </div>
          </Form>
        </Card.Body>
        
        <Card.Footer className="text-center border-0 mt-3" style={{ backgroundColor: '#BAC8B1' }}>
            <p className="text-muted mb-0" style={{ color: '#404E3B' }}>
                {isLoginMode ? "Don't have an account?" : "Already have an account?"}
                <Button 
                  variant="link" 
                  onClick={toggleMode} 
                  className="p-0 ms-1 fw-bold text-decoration-underline"
                  style={{ color: '#404E3B' }} // Theme Dark Text for link
                >
                  {isLoginMode ? "Sign Up" : "Login"}
                </Button>
            </p>
            {isLoginMode && (
                <p className="mt-2 mb-0">
                    <a href="/forgot" className="text-decoration-underline" style={{ color: '#404E3B' }}>Forgot Password?</a>
                </p>
            )}
        </Card.Footer>
      </Card>
    </Container>
  );
};

export default AuthPage;