import { Outlet } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <header className="sticky top-0 left-0 right-0 z-50">
        <Navbar />
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
