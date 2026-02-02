import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { BrowserRouter, Route, Routes } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "./index.css";
import { ThemeProvider } from "./contexts/ThemeContext.jsx";
import Home from "./pages/public/Home.jsx";
import Films from "./pages/public/Films.jsx";
import Palmares from "./pages/public/Palmares.jsx";
import Soumettre from "./pages/public/Soumettre.jsx";
import Agenda from "./pages/public/Agenda.jsx";
import Contact from "./pages/public/Contact.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import PublicLayout from "./layouts/PublicLayout.jsx";
import { Login } from "./pages/auth/Login.jsx";
import { Register } from "./pages/auth/Register.jsx";
import AdminAccess from "./pages/auth/AdminAccess.jsx";
import AdminFilms from "./pages/admin/AdminFilms.jsx";
import AdminContent from "./pages/admin/AdminContent.jsx";
import AdminJury from "./pages/admin/AdminJury.jsx";
import AdminAwards from "./pages/admin/AdminAwards.jsx";
import MyFilms from "./pages/jury/MyFilms.jsx";
import { RoleGuard } from "./middlewares/RoleGuard.jsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    },
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <Routes>
          {/* Routes publiques */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="films" element={<Films />} />
            <Route path="palmares" element={<Palmares />} />
            <Route path="soumettre" element={<Soumettre />} />
            <Route path="agenda" element={<Agenda />} />
            <Route path="contact" element={<Contact />} />
            <Route path="auth/login" element={<Login />} />
            <Route path="auth/register" element={<Register />} />
          </Route>

          {/* Admin access (hidden route) */}
          <Route path="admin-access" element={<AdminAccess />} />

          {/* Admin routes */}
          <Route
            path="admin"
            element={
              <RoleGuard allowedRoles={["ADMIN"]}>
                <AdminLayout />
              </RoleGuard>
            }
          >
            <Route index element={<AdminFilms />} />
            <Route path="films" element={<AdminFilms />} />
            <Route path="jury" element={<AdminJury />} />
            <Route path="awards" element={<AdminAwards />} />
            <Route path="content" element={<AdminContent />} />
          </Route>

          {/* Jury routes */}
          <Route path="/" element={<PublicLayout />}>
            <Route
              path="jury/mes-films"
              element={
                <RoleGuard allowedRoles={["JURY"]}>
                  <MyFilms />
                </RoleGuard>
              }
            />
          </Route>
        </Routes>
      </QueryClientProvider>
    </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
);
