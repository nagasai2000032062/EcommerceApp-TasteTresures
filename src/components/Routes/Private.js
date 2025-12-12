import { useState, useEffect } from "react";
import { useAuth } from "../../context/auth";
import { Outlet } from "react-router-dom";
import axios from "axios";
import Spinner from "../Spinner";

export default function PrivateRoute() {
  const [ok, setOk] = useState(false);
  const [auth, setAuth] = useAuth();

  const api="https://tastetresures-backend-production.up.railway.app";
  useEffect(() => {
    const authCheck = async () => {
      // const res = await axios.get("/api/v1/auth/user-auth");
      
      // console.log(res);
      // if (res.data) {
      //   setOk(true);
      // } else {
      //   console.log("hello2")
      //   setOk(false);
      // }
       try {
      const res = await axios.get(`${api}/api/v1/auth/user-auth`, {
        headers: {
          Authorization: `Bearer ${auth?.token}`,
        },
      });
      console.log(res);
      if (res.data) {
        setOk(true);
      } else {
        setOk(false);
      }
    } catch (error) {
      console.error("Authentication error:", error);
      setOk(false);
    }
    };
    if (auth?.token) authCheck();
  }, [auth?.token]);

  return ok ? <Outlet /> : <Spinner />;
}
