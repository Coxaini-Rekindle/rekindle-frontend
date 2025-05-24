import { Navigate, Route, Routes } from "react-router-dom";

import { ProtectedRoute } from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/auth/login/Login";
import Register from "./pages/auth/register/Register";
import Groups from "./pages/groups/Groups";
import "./i18n/i18n";

function App() {
  return (
    <Routes>
      {/* Protected routes */}
      <Route
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
        path="/"
      />
      <Route
        element={
          <ProtectedRoute>
            <Groups />
          </ProtectedRoute>
        }
        path="/groups"
      />

      {/* Public routes */}
      <Route element={<Login />} path="/login" />
      <Route element={<Register />} path="/register" />

      {/* Fallback route */}
      <Route element={<Navigate to="/" />} path="*" />
    </Routes>
  );
}

export default App;
