import { useState } from "react";
import "./style.css";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import { InputAdornment, IconButton, OutlinedInput } from "@mui/material";
import { Email, Lock } from "@mui/icons-material";
import Logo from "../../assets/images/near-me-logo.png";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const baseUrl = import.meta.env.VITE_BASE_URL;

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Email and Password are required");
      return;
    }

    try {
      const response = await axios.post(`${baseUrl}users/admin/login`, {
        email,
        password,
      });
      const { data } = response;

      localStorage.setItem("authUser", JSON.stringify(data));
      localStorage.setItem("accessToken", data.data.accessToken);
      localStorage.setItem("refreshToken", data.data.refreshToken);

      toast.success(`Welcome ${email}`);
      navigate("/dashboard");
    } catch (error) {
      const backendError = error.response?.data?.errors || "Login failed";
      toast.error(backendError);
    }
  };

  return (
    <div className="auth-container">
      <Toaster />
      <div className="auth-wrapper">
        <div className="auth-logo-box">
          <img className="img-fluid" src={Logo} alt="Logo" />
        </div>
        <div className="auth-heading">
          <h2>Admin Login</h2>
        </div>
        <form className="authform" onSubmit={(e) => e.preventDefault()}>
          {/* Email */}
          <div className="auth-form-group">
            <OutlinedInput
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="auth-input"
              placeholder="Email"
              type="email"
              fullWidth
              startAdornment={
                <InputAdornment position="start">
                  <Email style={{ fontSize: 16, color: "#999" }} />
                </InputAdornment>
              }
            />
          </div>

          {/* Password */}
          <div className="auth-form-group">
            <OutlinedInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-input"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              fullWidth
              startAdornment={
                <InputAdornment position="start">
                  <Lock style={{ fontSize: 16, color: "#999" }} />
                </InputAdornment>
              }
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword((prev) => !prev)}
                    edge="end"
                    size="small"
                  >
                    {showPassword ? (
                      <EyeInvisibleOutlined />
                    ) : (
                      <EyeOutlined />
                    )}
                  </IconButton>
                </InputAdornment>
              }
            />
          </div>

          {/* Submit Button */}
          <div className="auth-form-group authSubmitbtn mb-0">
            <button
              onClick={handleLogin}
              className="theme-btn btn-main"
              type="button"
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signin;
