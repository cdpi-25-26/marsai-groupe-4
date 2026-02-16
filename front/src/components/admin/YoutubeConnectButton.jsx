import { useState, useEffect } from "react";
import instance from "../../api/config";

const API_URL = instance.defaults.baseURL;

export default function YoutubeConnectButton() {
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const { data } = await instance.get("/youtube/check-auth");
        setIsConnected(data.connected);
      } catch (err) {
        console.error("Erreur check auth:", err);
        setError("Impossible de vérifier la connexion");
      } finally {
        setLoading(false);
      }
    };

    checkConnection();
  }, []);

  const handleConnect = () => {
    setLoading(true);
    window.location.href = `${API_URL}/youtube/auth`;
  };

  if (loading) {
    return (
      <button
        disabled
        className="px-6 py-3 bg-gray-400 text-white rounded-lg cursor-not-allowed flex items-center gap-2"
      >
        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z" />
        </svg>
        Vérification...
      </button>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 font-medium">
        {error}{" "}
        <button onClick={handleConnect} className="underline">
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleConnect}
      disabled={isConnected}
      className={`
        flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200
        ${
          isConnected
            ? "bg-green-600 text-white cursor-default shadow-md"
            : "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-md hover:shadow-lg"
        }
      `}
    >
      {isConnected ? (
        <>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          Connecté à YouTube
        </>
      ) : (
        "Connecter la chaîne YouTube"
      )}
    </button>
  );
}
