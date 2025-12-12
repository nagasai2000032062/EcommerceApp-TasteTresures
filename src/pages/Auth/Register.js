// import React, { useState } from "react";
// import Layout from "./../../components/Layout/Layout";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";
// import "../../styles/AuthStyles.css";
// const Register = () => {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [phone, setPhone] = useState("");
//   const [address, setAddress] = useState("");
//   const [answer, setAnswer] = useState("");
//   const navigate = useNavigate();

//   // form function
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await axios.post("/api/v1/auth/register", {
//         name,
//         email,
//         password,
//         phone,
//         address,
//         answer,
//       });
//       if (res && res.data.success) {
//         console.log(res)
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
//     <Layout title="Register - Ecommer App">
//       <div className="form-container" style={{ minHeight: "90vh" }}>
//         <form onSubmit={handleSubmit}>
//           <h4 className="title">REGISTER FORM</h4>
//           <div className="mb-3">
//             <input
//               type="text"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               className="form-control"
//               id="exampleInputEmail1"
//               placeholder="Enter Your Name"
//               required
//               autoFocus
//             />
//           </div>
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
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="form-control"
//               id="exampleInputPassword1"
//               placeholder="Enter Your Password"
//               required
//             />
//           </div>
//           <div className="mb-3">
//             <input
//               type="text"
//               value={phone}
//               onChange={(e) => setPhone(e.target.value)}
//               className="form-control"
//               id="exampleInputEmail1"
//               placeholder="Enter Your Phone"
//               required
//             />
//           </div>
//           <div className="mb-3">
//             <input
//               type="text"
//               value={address}
//               onChange={(e) => setAddress(e.target.value)}
//               className="form-control"
//               id="exampleInputEmail1"
//               placeholder="Enter Your Address"
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
//               placeholder="What is Your Favorite sports"
//               required
//             />
//           </div>
//           <button type="submit" className="btn btn-primary">
//             REGISTER
//           </button>
//         </form>
//       </div>
//     </Layout>
//   );
// };

// export default Register;




import React, { useEffect, useState } from "react";
import Layout from "./../../components/Layout/Layout";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "../../styles/AuthStyles.css";

const Register = () => {
  const navigate = useNavigate();

  // Email OTP states
  const [email, setEmail] = useState("");
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [emailOtp, setEmailOtp] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailCooldown, setEmailCooldown] = useState(0);

  // Other fields
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  // const [address, setAddress] = useState("");
  const [answer, setAnswer] = useState("");

  // cooldown timer for email resend
  useEffect(() => {
    let t;
    if (emailCooldown > 0) {
      t = setTimeout(() => setEmailCooldown((s) => s - 1), 1000);
    }
    return () => clearTimeout(t);
  }, [emailCooldown]);

  // Reset OTP state if user edits email before verification
  useEffect(() => {
    if (!emailVerified) {
      setEmailOtp("");
      setEmailOtpSent(false);
    }
  }, [email, emailVerified]);

  // Send Email OTP
  const sendEmailOtp = async () => {
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      toast.error("Enter a valid email");
      return;
    }
    try {
      await axios.post("/api/v1/auth/otp/email/send", null, { params: { email } });
      setEmailOtpSent(true);
      setEmailCooldown(60);
      toast.success("Email OTP sent");
    } catch (e) {
      toast.error(e?.response?.data || "Failed to send email OTP");
    }
  };

  // Verify Email OTP
  const verifyEmailOtp = async () => {
    if (!emailOtp || emailOtp.length !== 6) {
      toast.error("Enter 6-digit OTP");
      return;
    }
    try {
      await axios.post("/api/v1/auth/otp/email/verify", null, {
        params: { email, otp: emailOtp },
      });
      setEmailVerified(true);
      toast.success("Email verified");
    } catch (e) {
      toast.error(e?.response?.data || "Invalid or expired OTP");
    }
  };

  // Register Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!emailVerified) {
      toast.error("Please verify your email first");
      return;
    }
    try {
      const res = await axios.post("/api/v1/auth/register", {
        name,
        email,
        password,
        phone,
        // address,
        answer,
      });
      console.log(res.data);
      if (res?.data?.success) {
        toast.success(res.data.message || "Registered successfully");
        navigate("/login");
      } else {
        toast[res?.data?.success === false ? "error" : "success"](
          res?.data || "Completed"
        );
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data || "Something went wrong");
    }
  };

  return (
    <Layout title="Register">
      <div className="form-container" style={{ minHeight: "100vh" }}>
        <form onSubmit={handleSubmit} className="p-3">
          <h4 className="title mb-3">REGISTER</h4>

          {/* Email + OTP */}
          <div className="mb-3">
            {/* <label className="form-label">Email</label> */}
            <div className="d-flex gap-2">
              <input
                type="email"
                className="form-control"
                value={email}
                disabled={emailVerified}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={sendEmailOtp}
                disabled={emailVerified || emailCooldown > 0 || !email}
              >
                {emailVerified
                  ? "Verified"
                  : emailCooldown > 0
                  ? `Resend (${emailCooldown})`
                  : "Send OTP"}
              </button>
            </div>
            {!emailVerified && emailOtpSent && (
              <div className="d-flex gap-2 mt-2">
                <input
                  type="text"
                  maxLength={6}
                  className="form-control"
                  value={emailOtp}
                  onChange={(e) => setEmailOtp(e.target.value.replace(/\D/g, ""))}
                  placeholder="Enter Email OTP"
                />
                <button type="button" className="btn btn-success" onClick={verifyEmailOtp}>
                  Verify
                </button>
              </div>
            )}
          </div>

          {/* Phone Field (no OTP required) */}
          <div className="mb-3">
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="form-control"
              placeholder="Enter your phone"
              required
            />
          </div>

          {/* Rest of form */}
          <div className="mb-3">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-control"
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              placeholder="Enter your password"
              required
            />
          </div>

         {/* <div className="mb-3">
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="form-control"
              placeholder="Enter your address"
              required
            />
          </div> */}

          <div className="mb-3">
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="form-control"
              placeholder="What is your favorite sports"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary mt-2" disabled={!emailVerified}>
            REGISTER
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default Register;
