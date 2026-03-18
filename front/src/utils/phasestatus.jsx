import { createContext, useContext, useEffect, useState } from 'react';
import instance from '../api/config';

const ContestContext = createContext();

export function ContestProvider({ children }) {
  const [contestStatus, setContestStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await instance.get('/phase/status');
        setContestStatus(res.data);
      } catch (err) {
        console.error("Erreur récupération état concours", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, []);

  return (
    <ContestContext.Provider value={{ contestStatus, loading }}>
      {children}
    </ContestContext.Provider>
  );
}

export const useContest = () => useContext(ContestContext);