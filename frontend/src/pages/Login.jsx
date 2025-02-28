import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../auth/Auth.jsx";
import { Navigate } from "react-router-dom";

export default function Login() {
  const [msg, setMsg] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="min-h-screen bg-gray-800 flex items-center justify-center text-white">Loading authentication status...</div>;
  }

  if (user) {
    return <Navigate to={`/${user._id}`} />;
  }

  function handleSubmit(e) {
    e.preventDefault();
    axios
      .post(
        `http://localhost:4000/api/auth/login`,
        { email, password },
        { withCredentials: true }
      )
      .then((response) => {
        setMsg(response.data.msg);
        
        // Store userId in localStorage for persistence
        if (response.data.userId) {
          localStorage.setItem('userId', response.data.userId);
          window.location.replace(`/${response.data.userId}`);
        }
      })
      .catch((error) => {
        console.error(error);
        setMsg(error.response?.data?.msg || "Login failed");
      });
  }

  return (
    <div className="min-h-screen bg-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-700 rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-white text-center">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-tr-lg rounded-bl-lg border border-gray-600 p-3 w-full bg-gray-800 text-white focus:border-blue-500 focus:outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-tr-lg rounded-bl-lg border border-gray-600 p-3 w-full bg-gray-800 text-white focus:border-blue-500 focus:outline-none"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 font-bold py-3 px-6 rounded-tr-lg rounded-bl-lg w-full text-white transition-colors duration-300"
          >
            Login
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-gray-300">Har du ikke bruker?:
            <a href="/register" className="text-blue-400 hover:text-blue-300 ml-2 font-medium">
              Registrer deg her
            </a>
          </p>
        </div>
        {msg && (
          <div className="mt-6">
            <p className="text-red-400 bg-gray-800 p-4 rounded-lg text-center">{msg}</p>
          </div>
        )}
      </div>
    </div>
  );
}