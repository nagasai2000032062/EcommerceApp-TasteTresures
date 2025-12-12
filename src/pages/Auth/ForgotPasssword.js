// import React, { useState } from "react";
// import Layout from "./../../components/Layout/Layout";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";
// import "../../styles/AuthStyles.css";

// const ForgotPasssword = () => {
//   const [email, setEmail] = useState("");
//   const [password, setNewPassword] = useState("");
//   const [answer, setAnswer] = useState("");

//   const navigate = useNavigate();

//   // form function
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await axios.post("/api/v1/auth/forgot-password", {
//         email,
//         answer,
//         password,
//       });
//       if (res && res.data.success) {
//         toast.success(res.data && res.data.message);
//         navigate("/login");
//       } else {
//         toast.error(res.data.message);
//       }
//     } catch (error) {
//       console.log(error);
//       toast.error("Something went wrong");
//     }
//   };
//   return (
//     <Layout title={"Forgot Password - Ecommerce APP"}>
//       <div className="form-container ">
//         <form onSubmit={handleSubmit}>
//           <h4 className="title">RESET PASSWORD</h4>

//           <div className="mb-3">
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="form-control"
//               id="exampleInputEmail1"
//               placeholder="Enter Your Email "
//               required
//             />
//           </div>
//           <div className="mb-3">
//             <input
//               type="text"
//               value={answer}
//               onChange={(e) => setAnswer(e.target.value)}
//               className="form-control"
//               id="exampleInputEmail1"
//               placeholder="Enter Your favorite Sport Name "
//               required
//             />
//           </div>
//           <div className="mb-3">
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setNewPassword(e.target.value)}
//               className="form-control"
//               id="exampleInputPassword1"
//               placeholder="Enter Your Password"
//               required
//             />
//           </div>

//           <button type="submit" className="btn btn-primary">
//             RESET
//           </button>
//         </form>
//       </div>
//     </Layout>
//   );
// };

// export default ForgotPasssword;





import React, { useState, useEffect } from "react";
import Layout from "./../../components/Layout/Layout";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "../../styles/AuthStyles.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const api="https://tastetresures-backend-production.up.railway.app";
  const navigate = useNavigate();

  // cooldown timer
  useEffect(() => {
    let t;
    if (cooldown > 0) {
      t = setTimeout(() => setCooldown((s) => s - 1), 1000);
    }
    return () => clearTimeout(t);
  }, [cooldown]);

  // Send OTP
  const sendOtp = async () => {
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      toast.error("Enter a valid email");
      return;
    }
    try {
      await axios.post(`${api}/api/v1/auth/otp/email/send`, null, { params: { email } });
      setOtpSent(true);
      setCooldown(60);
      toast.success("OTP sent to email");
    } catch (err) {
      toast.error(err?.response?.data || "Failed to send OTP");
    }
  };

  // Verify OTP
  const verifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      toast.error("Enter 6-digit OTP");
      return;
    }
    try {
      await axios.post(`${api}/api/v1/auth/otp/email/verify`, null, { params: { email, otp } });
      setOtpVerified(true);
      toast.success("OTP verified, you can reset password now");
    } catch (err) {
      toast.error(err?.response?.data || "Invalid OTP");
    }
  };

  // Reset Password
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otpVerified) {
      toast.error("Verify OTP before resetting password");
      return;
    }
    try {
      const res = await axios.post(`${api}/api/v1/auth/forgot-password`, null, {
        params: { email, otp, newPassword },
      });
      if (res?.data?.success) {
        toast.success(res.data.message);
        navigate("/login");
      } else {
        toast.error(res.data || "Failed to reset password");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <Layout title="Forgot Password">
      <div className="form-container"style={{ minHeight: "100vh" }}>
        <form onSubmit={handleSubmit}>
          <h4 className="title">RESET PASSWORD</h4>

          {/* Email Field */}
          <div className="mb-3">
            <input
              type="email"
              value={email}
              disabled={otpVerified}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              placeholder="Enter your email"
              required
            />
            <button
              type="button"
              className="btn btn-outline-primary mt-2"
              onClick={sendOtp}
              disabled={otpVerified || cooldown > 0}
            >
              {otpVerified
                ? "Verified"
                : cooldown > 0
                ? `Resend (${cooldown})`
                : "Send OTP"}
            </button>
          </div>

          {/* OTP Field */}
          {otpSent && !otpVerified && (
            <div className="mb-3 d-flex gap-2">
              <input
                type="text"
                value={otp}
                maxLength={6}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                className="form-control"
                placeholder="Enter OTP"
                required
              />
              <button type="button" className="btn btn-success" onClick={verifyOtp}>
                Verify OTP
              </button>
            </div>
          )}

          {/* New Password Field (enabled only after OTP verified) */}
          {otpVerified && (
            <div className="mb-3">
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="form-control"
                placeholder="Enter new password"
                required
              />
            </div>
          )}

          <button type="submit" className="btn btn-primary" disabled={!otpVerified}>
            RESET PASSWORD
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default ForgotPassword;
