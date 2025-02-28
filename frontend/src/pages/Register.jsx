import { useState } from "react";
import axios from "axios";

export default function Register() {
  const [msg, setMsg] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [kontaktSpråk, setKontaktSpråk] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    axios
      .post(
        `http://localhost:4000/api/auth/register`,
        { email, password, confirmPassword, kontaktSpråk },
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
        setMsg(error.response?.data?.msg || "Registration failed");
      });
  }

  return (
    <div className="min-h-screen bg-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-700 rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-white text-center">Register</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-tr-lg rounded-bl-lg border border-gray-600 p-3 w-full bg-gray-800 text-white focus:border-blue-500 focus:outline-none"
          />
          <select
            value={kontaktSpråk}
            onChange={(e) => setKontaktSpråk(e.target.value)}
            className="rounded-tr-lg rounded-bl-lg border border-gray-600 p-3 w-full bg-gray-800 text-white focus:border-blue-500 focus:outline-none"
          >
            <option value="">Select a language</option>
            <option value="Pite-samisk">Pite-samisk</option>
            <option value="Lule-samisk">Lule-samisk</option>
            <option value="Ume-samisk">Ume-samisk</option>
            <option value="Sør-samisk">Sør-samisk</option>
            <option value="Nord-samisk">Nord-samisk</option>
            <option value="Enare-samisk">Enare-samisk</option>
            <option value="Skolt-samisk">Skolt-samisk</option>
            <option value="Kildin-samisk">Kildin-samisk</option>
            <option value="Akkala-samisk">Akkala-samisk</option>
            <option value="Ter-samisk">Ter-samisk</option>
          </select>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-tr-lg rounded-bl-lg border border-gray-600 p-3 w-full bg-gray-800 text-white focus:border-blue-500 focus:outline-none"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="rounded-tr-lg rounded-bl-lg border border-gray-600 p-3 w-full bg-gray-800 text-white focus:border-blue-500 focus:outline-none"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 font-bold py-3 px-6 rounded-tr-lg rounded-bl-lg w-full text-white transition-colors duration-300 mt-6"
          >
            Register
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-gray-300">Har du allerede en bruker?:
            <a href="/login" className="text-blue-400 hover:text-blue-300 ml-2 font-medium">
              Logg inn her
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