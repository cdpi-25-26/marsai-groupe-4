import i18n from  "./utils/i18n.js";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import Home from "./pages/public/Home.jsx";
import Dashboard from "./pages/admin/Dashboard.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import PublicLayout from "./layouts/PublicLayout.jsx";
import { Login } from "./pages/auth/Login.jsx";
import { Register } from "./pages/auth/Register.jsx";
import { RoleGuard } from "./middlewares/RoleGuard.jsx";
import Videos from "./pages/admin/Videos.jsx";
import Users from "./pages/admin/Users.jsx";
import Jury from "./pages/admin/Jury.jsx";
import Events from "./pages/admin/Events";
import Contact from "./pages/public/Contact.jsx";
import Film from "./pages/public/Film.jsx";
import Upload from "./pages/public/Upload.jsx";
import Palmares from "./pages/public/Palmares.jsx";
import Evennements from "./pages/public/Evennements.jsx";
import Cms from "./pages/admin/Cms.jsx";
import Reservation from "./pages/public/Reservation.jsx";
import JuryVote from "./pages/JuryVote.jsx";
import Gallerie from "./pages/public/Gallerie.jsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    },
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <Routes>
          {/* Routes publiques */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="/gallerie" element={<Gallerie />} />
            <Route path="/evennements" element={<Evennements />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<Register />} />
            <Route path="/films/:id" element={<Film />} />
            <Route path="/upload" element={<RoleGuard allowedRoles={["ADMIN", "PRODUCER"]}>
             <Upload />
            </RoleGuard>} />
            <Route path="/palmares" element={<Palmares />} />
            <Route path="/agenda" element={<Evennements />} />
            <Route path="/reservation" element={<Reservation />} />

            
          </Route>

          {/* Route jury */}
          <Route path="/jury" element={
            <RoleGuard allowedRoles={["JURY", "ADMIN"]}>
              <JuryVote />
            </RoleGuard>
          } />

          {/* Routes privées */}
          <Route path="admin" element={ <RoleGuard allowedRoles={["ADMIN"]}>
            <AdminLayout />
            </RoleGuard> 
              } >
            <Route index element={<Dashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="videos" element={<Videos />} />
            <Route path="jurys" element={<Jury />} />
            <Route path="events" element={<Events />} />
            <Route path="cms" element={<Cms />} />

          </Route>
        </Routes>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
);
