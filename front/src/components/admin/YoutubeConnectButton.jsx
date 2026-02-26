import { useState, useEffect } from 'react';

export default function YoutubeConnectButton() {
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await fetch('http://localhost:3000/youtube/check-auth', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) throw new Error('Erreur vérification');

        const data = await response.json();
        setIsConnected(data.connected);
      } catch (err) {
        console.error('Erreur check auth:', err);
        setError('Impossible de vérifier la connexion');
      } finally {
        setLoading(false);
      }
    };

    checkConnection();
  }, []);

  const handleConnect = () => {
    setLoading(true);
    window.location.href = 'http://localhost:3000/youtube/auth';
  };

  if (loading) {
    return (
      <button disabled >
        Vérification...
      </button>
    );
  }

  if (error) {
    return (
      <div className="hover:cursor-pointer">
        {error} <button onClick={handleConnect} className="underline">Réessayer</button>
      </div>
    );
  }

  return (
    <button
      onClick={handleConnect}
      disabled={isConnected}
      className="hover:cursor-pointer"
    >
      {isConnected ? (
        <div>
          Connecté à YouTube 
        </div>
      ) : (
        'Chaîne YouTube'
      )}
    </button>
  );
}