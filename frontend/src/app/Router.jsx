import { createBrowserRouter } from "react-router-dom";
import AuthGuard from "../components/auth/AuthGuard";
import PublicGuard from "../components/auth/PublicGuard";
import LoginPage from "../features/auth/pages/LoginPage";
import RegisterPage from "../features/auth/pages/RegisterPage";
import AllFilesPage from "../features/drive/pages/AllFilesPage";
import StarredPage from "../features/dashboard/pages/StarredPage";
import SharedFilesPage from "../components/share/SharedFilePage";
import ShareDashboard from "../components/share/ShareDashboard"
import Plans from "../components/Billing/BillingPage"
import LandingPage from "../LandingPage";
import RequireAdmin from "../components/auth/RequireAdmin";
import UsersPage from "../AdminUsersPages";

const Placeholder = ({ title }) => (
  <div className="min-h-screen bg-[#0c1017] p-10 text-white">{title}</div>
);

export const router = createBrowserRouter([
  { path: "/share/:token", element: <SharedFilesPage /> }, // this is for getshare filee no auth eneded 

  {
    element: <PublicGuard />,
    children: [
     { path: "/", element: <LandingPage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
      
    ],
  },
  {
    element: <AuthGuard />,
    children: [
      { path: "/app", element: <AllFilesPage /> },
      
      
     
      { path: "/app/starred", element: <StarredPage /> },
      { path: "/app/shared", element: <ShareDashboard /> },
      { path: "/app/photos", element: <Placeholder title="Photos" /> },
      { path: "/app/sessions", element: <Placeholder title="Sessions" /> },
      { path: "/app/billing", element: <Plans /> },
    ],
  },
   {
    element: <RequireAdmin />,
    children: [
     
   {path:"/admin/users", element:<UsersPage />} 

      
     
    ],
  },
  {
    path: "*",
    element: <LoginPage />,
  },
]);