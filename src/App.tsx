import { Navigate, Route, Routes } from "react-router-dom";

import { ProtectedRoute } from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/auth/login/Login";
import Register from "./pages/auth/register/Register";
import Groups from "./pages/groups/Groups";
import GroupInviteAccept from "./pages/groups/GroupInviteAccept";
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

      {/* Group invitation routes - public access */}
      <Route element={<GroupInviteAccept />} path="/groups/invites/:inviteId" />
      <Route element={<GroupInviteAccept />} path="/groups/join/:token" />

      {/* Public routes */}
      <Route element={<Login />} path="/login" />
      <Route element={<Register />} path="/register" />

      {/* Fallback route */}
      <Route element={<Navigate to="/" />} path="*" />
    </Routes>
  );
}

export default App;
