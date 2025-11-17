import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Apps/pages/Login";
import Register from "./Apps/pages/Login/Register";
import Dashboard from "./Apps/pages/Dashboard";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}