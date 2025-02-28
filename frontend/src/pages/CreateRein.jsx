import { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function CreateRein() {
  const { flokkId } = useParams();
  const navigate = useNavigate();
  const [msg, setMsg] = useState("");
  const [navn, setNavn] = useState("");
  const [fødselsdato, setFødselsdato] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData();
    formData.append("navn", navn);
    formData.append("fødselsdato", fødselsdato);
    formData.append("flokkId", flokkId);
    
    if (file) {
      formData.append("bilde", file);
    }

    axios
      .post("http://localhost:4000/api/rein", formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        setMsg(response.data.msg);
        setLoading(false);
        setTimeout(() => {
          if (response.status === 201) {
            navigate(`/flokk/${flokkId}`);
          }
        }, 1000);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
        setMsg(error.response?.data?.msg || "Feil ved oppretting av reinsdyr");
      });
  }

  return (
    <div className="create-rein bg-gray-800 p-8 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-white">Registrer nytt reinsdyr</h1>
      <form
        onSubmit={handleSubmit}
        className="pt-6 w-full max-w-md mx-auto flex flex-col items-center justify-center text-center bg-gray-700 p-8 rounded-lg shadow-lg"
      >
        <input
          type="text"
          placeholder="Navn på reinsdyr"
          value={navn}
          onChange={(e) => setNavn(e.target.value)}
          className="rounded-tr-lg rounded-bl-lg border border-gray-600 p-3 w-full mb-4 bg-gray-800 text-white focus:border-blue-500 focus:outline-none"
          required
        />
        
        <div className="w-full mb-4">
          <label className="block text-left text-white mb-2">Fødselsdato</label>
          <input
            type="date"
            value={fødselsdato}
            onChange={(e) => setFødselsdato(e.target.value)}
            className="rounded-tr-lg rounded-bl-lg border border-gray-600 p-3 w-full bg-gray-800 text-white focus:border-blue-500 focus:outline-none"
            required
          />
        </div>
        
        <div className="w-full mb-4">
          <label className="block text-left text-white mb-2">Bilde (valgfritt)</label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="rounded-tr-lg rounded-bl-lg border border-gray-600 p-3 w-full bg-gray-800 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-600 file:text-white hover:file:bg-gray-500"
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className={`bg-blue-600 hover:bg-blue-700 font-bold py-3 px-6 rounded-tr-lg rounded-bl-lg w-full mt-6 text-white transition-colors duration-300 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Oppretter..." : "Registrer reinsdyr"}
        </button>
      </form>
      
      {msg && (
        <div className="mt-6 max-w-md mx-auto">
          <p className={`${msg.includes("Error") || msg.includes("Feil") ? "text-red-400" : "text-green-400"} bg-gray-700 p-4 rounded-lg`}>
            {msg}
          </p>
        </div>
      )}
    </div>
  );
}