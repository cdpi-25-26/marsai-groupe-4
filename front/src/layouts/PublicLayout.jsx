import { Outlet } from "react-router";
import Navbar from "../components/Navbar";
import { useTranslation } from "react-i18next";
import Footer from "../components/Footer";

export default function PublicLayout() {

    const { t } = useTranslation()
  
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
