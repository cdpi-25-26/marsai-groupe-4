import { useEffect } from "react";
import { useState } from "react";
import { useLocation } from "react-router";
import instance from "../api/config";
import AccessDeniedPage from "../pages/public/AccessDenied";
import handleLogout from "../utils/helpers";

export function RoleGuard({ allowedRoles, children }) {
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Re-check token whenever admin route changes
  useEffect(() => {
    const token = localStorage.getItem("token");
    setLoading(true);

    if (!token) {
      setUser(null);
      setLoading(false);
      handleLogout();
      return;
    }

    instance
      .post("/auth/checkToken", { token: token })
      .then((response) => {
        if (response.data.role) {
          setUser(response.data);
        } else {
          setUser(null);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error checking token:", error);
        console.error("Error response:", error.response?.data);
        setUser(null);
        setLoading(false);
        handleLogout();
      });
  }, [location.pathname]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (allowedRoles.includes(user?.role)) {
    return children;
  } else {
    
    return <AccessDeniedPage />;
  }
}
