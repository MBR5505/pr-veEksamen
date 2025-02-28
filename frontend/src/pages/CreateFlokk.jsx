import { useState } from "react";
import axios from "axios";

export default function CreateFlokk() {
  const [msg, setMsg] = useState("");
  const [navn, setNavn] = useState("");
  const [serieinndeling, setSerieinndeling] = useState("");
  const [buemerkeNavn, setBuemerkeNavn] = useState("");
  const [eierId, setEierId] = useState("");
  const [beiteområdeId, setBeiteområdeId] = useState("");
  const [file, setFile] = useState(null);

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("navn", navn);
    formData.append("serieinndeling", serieinndeling);
    formData.append("buemerke_navn", buemerkeNavn);
    formData.append("eier_id", eierId);
    formData.append("beiteområde_id", beiteområdeId);
    if (file) {
      formData.append("buemerke_bilde", file);
    }

    axios
      .post("http://localhost:4000/api/flokk", formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        setMsg(response.data.msg);
        setTimeout(() => {
          if (response.status === 201) {
            window.location.replace("/profile");
          }
        }, 1000);
      })
      .catch((error) => {
        console.error(error);
        setMsg("Error creating flokk");
      });
  }

  return (
    <div className="create-flokk bg-gray-800 p-8 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-white">Create Flokk</h1>
      <form
        onSubmit={handleSubmit}
        className="pt-6 w-full max-w-md mx-auto flex flex-col items-center justify-center text-center bg-gray-700 p-8 rounded-lg shadow-lg"
      >
        <input
          type="text"
          placeholder="Navn"
          value={navn}
          onChange={(e) => setNavn(e.target.value)}
          className="rounded-tr-lg rounded-bl-lg border border-gray-600 p-3 w-full mb-4 bg-gray-800 text-white focus:border-blue-500 focus:outline-none"
          required
        />
        <input
          type="text"
          placeholder="Buemerke Navn"
          value={buemerkeNavn}
          onChange={(e) => setBuemerkeNavn(e.target.value)}
          className="rounded-tr-lg rounded-bl-lg border border-gray-600 p-3 w-full mb-4 bg-gray-800 text-white focus:border-blue-500 focus:outline-none"
          required
        />
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="rounded-tr-lg rounded-bl-lg border border-gray-600 p-3 w-full mb-4 bg-gray-800 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-600 file:text-white hover:file:bg-gray-500"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 font-bold py-3 px-6 rounded-tr-lg rounded-bl-lg w-full mt-6 text-white transition-colors duration-300"
        >
          Create Flokk
        </button>
      </form>
      {msg && (
        <div className="mt-6 max-w-md mx-auto">
          <p className="text-red-400 bg-gray-700 p-4 rounded-lg">{msg}</p>
        </div>
      )}
    </div>
  );
}
