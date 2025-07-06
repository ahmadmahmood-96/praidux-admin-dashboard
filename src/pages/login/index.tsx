import { useState, useEffect } from "react";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import "./style.less";
// import ResetPasswordModal from "../../components/resetPassword/ResetPasswordModal";
import UseAuthentication from "../../utils/useAuthentication";

const Login = () => {
  const navigate = useNavigate();
  const { login, loading } = UseAuthentication();
  // const [isModalVisible, setModalVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (localStorage.getItem("token")) navigate("/");
  }, [navigate]);

  const handleLogin = () => {
    if (!email || !password) {
      return message.error("Please enter credentials");
    }

    login(email, password);
  };

  // const handleOk = () => {
  //   setModalVisible(false);
  // };

  // const handleCancel = () => {
  //   setModalVisible(false);
  // };

  return (
    <>
      <div className="MainLoginContainer">
        <div className="PraiducLogoContainer">
          <img src="/praidux-logo.png" alt="Logo" />
        </div>

        <div className="Login-form-admin">
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <p className="SignInLoginParidux">Sign in to your account</p>
            <p className="SignInLoginPariduxOPara">
              Only admin can have access to praidux web portal
            </p>
          </div>

          <div className="Login-Form-container-1">
            {/* Email input */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <p className="INPUT-signIn-Container-TOP">Email Address</p>
              <input
                className="Input-email-field"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password input */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <p className="INPUT-signIn-Container-TOP">Password</p>
              <input
                className="Input-email-field"
                placeholder="Enter your password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Sign In button */}
            <button className="SignIn-Button-Login" onClick={handleLogin} disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
              {!loading && <img src="/Images/SignIn/sideArrow.svg" alt="Arrow" />}
            </button>
          </div>
        </div>
      </div>

      {/* {isModalVisible && (
        <ResetPasswordModal
          isResetPassword={false}
          onOk={handleOk}
          onCancel={handleCancel}
        />
      )} */}
    </>
  );
};

export default Login;
