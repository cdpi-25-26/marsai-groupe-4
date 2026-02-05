import { useEffect } from "react";
import { useState } from "react";
import instance from "../api/config";

export function RoleGuard({ allowedRoles, children }) {
  const token = localStorage.getItem("token");

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // API Call /checkToken
  useEffect(() => {
    if (!token) {
      console.log("No token found");
      setLoading(false);
      return;
    }

    instance.post("/auth/checkToken", { token: token })
      .then((response) => {
        console.log("checkToken response:", response.data);
        if (response.data.role) {
          setUser(response.data);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error checking token:", error);
        console.error("Error response:", error.response?.data);
        setLoading(false);
      });
  }, [token]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (allowedRoles.includes(user?.role)) {
    return children;
  } else {
    return <div>Access Denied</div>;
  }
}