import { useState } from "react";
import "./style.css";
import { Input } from "@mui/material";
import Logo from "../../assets/images/near-me-logo.png";
import { Email, Lock } from "@mui/icons-material";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      localStorage.setItem("accessToken", response.data.data.accessToken);
      localStorage.setItem("refreshToken", response.data.data.refreshToken);

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
          <div className="auth-form-group">
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="auth-input"
              type="email"
              placeholder="Email"
            />
            <span className="authInputIcon">
              <Email style={{ fontSize: "16px" }} />
            </span>
          </div>
          <div className="auth-form-group">
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-input"
              type="password"
              placeholder="Password"
            />
            <span className="authInputIcon">
              <Lock style={{ fontSize: "16px" }} />
            </span>
          </div>
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
