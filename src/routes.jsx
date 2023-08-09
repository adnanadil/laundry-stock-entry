import { Navigate, createBrowserRouter } from "react-router-dom";
import "./index.css";
import DashboardLayout from "./layout/dashboard/DashboardLayout";
import Page404 from "./pages/Page404";
import SimpleLayout from "./layout/simple/SimpleLayout";
import { UploadPage } from "./pages/UploadPage";
// import PdpPlanPage from "./pages/PDP-plan-page";
// import SAMI from "./pages/SAMI";
// import InterviewAssessmentPage from "./pages/Interview-assessment";
// import ManagerAssessment from "./pages/Manager-Assessment";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <DashboardLayout />,
    children: [
      { element: <Navigate to="/Upload" />, index: true },
      { path: "Upload", element: <UploadPage /> },
      // { path: "SAMI", element: <SAMI /> },
      // { path: "Interview-Assessment", element: <InterviewAssessmentPage /> },
      // { path: "PDP/Manager-Assessment", element: <ManagerAssessment /> },
    ],
  },
  {
    element: <SimpleLayout />,
    children: [
      { element: <Navigate to="/dashboard/PDP" />, index: true },
      { path: '404', element: <Page404 /> },
      { path: '*', element: <Navigate to="/404" /> },
    ],
  },
]);
