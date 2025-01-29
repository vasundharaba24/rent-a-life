import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaUser, FaLock, FaFacebook, FaGoogle, FaTwitter } from "react-icons/fa";
import img1 from "../../assets/images/img1.svg";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import {toast} from 'react-toastify';

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Check if email and password match the predefined values
      if (email === 'vasundharaba247@gmail.com' && password === '123456') {
        // If match, navigate to the desired page
        toast.success("logged in as admin..!",{autoClose : 1000});
        navigate('/demo');
      } else {
        // If not match, display error
        setError("Invalid email or password");
      }
    } catch (error) {
      // Handle login errors
      setError(error.message);
    }
  };
  

  return (
    <div className="px-5 sm:px-10 md:px-20 lg:px-32 py-5 h-screen overflow-y-hidden bg-slate-200">
      <div className="navbar pt-3 flex items-center justify-between px-5">
        <div className="text-black text-2xl sm:text-3xl font-bold cursor-pointer">
        <Link to={"/"} >
         <span className="text-blue-400 font-extrabold text-4xl">Rent-</span>
          a-Life
      
          </Link>
        </div>
        <div>
          <p className="font-bold text-lg sm:text-xl">
            New User?{" "}
            <Link to={"/signup"}>
              <span
                id="signupButton"
                className="pl-1 text-blue-400 cursor-pointer"
              >
                SignUp
              </span>
            </Link>
          </p>
        </div>
      </div>
      <div className="hero-section flex flex-col sm:flex-row items-center justify-center sm:justify-between h-full">
        <div className="hero-right mb-5 sm:mb-0 flex-1 mr-10 md:mr-20 lg:mr-32">
          <img className="w-full" src={img1} alt="" />
        </div>
        <div className="hero-left flex-1 flex flex-col justify-center items-center sm:items-start">
          <div
            style={{
              borderColor: "#B7D3DF",
            }}
            className="border-4 border-slate-400 p-6 sm:p-14 rounded-md shadow-slate-700 shadow-2xl transition-all duration-500"
          >
            <form onSubmit={handleLogin}>
              <div className="mb-5 sm:mb-10">
                <h2
                  style={{ color: "#393E46" }}
                  className="text-xl sm:text-3xl font-bold"
                >
                  Welcome Back!
                </h2>
                <p
                  style={{ color: "#393E46" }}
                  className="font-bold text-lg sm:text-xl"
                >
                  Login as Admin
                </p>
              </div>
              <div
                style={{ borderColor: "#B4D4FF" }}
                className="flex items-center mb-3 sm:mb-5 bg-white p-3 sm:p-5 border-1 rounded-md"
              >
                <FaUser
                  style={{ color: "#B7D3DF" }}
                  className="text-xl sm:text-2xl"
                />
                <input
                  className="outline-none w-full px-3 sm:px-5"
                  type="email"
                  value={email}
                  placeholder="Ex: xyz@gmail.com"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div
                style={{ borderColor: "#B4D4FF" }}
                className="flex items-center mb-3 sm:mb-10 bg-white p-3 sm:p-5 border-1 rounded-md"
              >
                <FaLock
                  style={{ color: "#B7D3DF" }}
                  className="text-lg sm:text-2xl text-slate-400"
                />
                <input
                  value={password}
                  className="outline-none w-full px-3 sm:px-5"
                  type="password"
                  placeholder="Enter the password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-3 sm:gap-10">
                <button
                  type="submit"
                  className="bg-slate-200 px-5 sm:px-8 py-2 sm:py-3 rounded-lg font-bold hover:bg-slate-400 hover:text-white text-sm sm:text-base text-slate-500 duration-300 border-2 border-slate-400"
                >
                  LOGIN
                </button>
                {error && <p className="text-red-500">{error}</p>}
               
              </div>
              <div className="flex gap-3 sm:gap-10 items-center justify-center sm:justify-start mt-5 sm:mt-10">
                <h2
                  style={{ color: "#393E46" }}
                  className="text-sm sm:text-base mr-2 font-bold"
                >
                  Login with:
                </h2>

              </div>
            </form>
            <ToastContainer />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
