import { Outlet } from "react-router";
import Navbar from "../components/Navbar";
import { useTranslation } from "react-i18next";
import Footer from "../components/Footer";
import { useState } from "react";


export default function PublicLayout() {

    const { t } = useTranslation()

    const [email, setEmail] = useState("");
const [message, setMessage] = useState("");
const handleNewsletter = async () => {

  if (!email.includes("@")) {
    setMessage("Email invalide");
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/newsletter", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (data.success) {
      setMessage("Inscription réussie !");
      setEmail("");
    } else {
      setMessage("Email déjà inscrit");
    }

  } catch (error) {
    setMessage("Erreur serveur");
  }
};
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
