import { Navigate, Route, Routes } from "react-router-dom";

import { ProtectedRoute } from "./components/ProtectedRoute";
import AppLayout from "./layout/AppLayout";
import Home from "./pages/Home";
import Login from "./pages/auth/login/Login";
import Register from "./pages/auth/register/Register";
import Groups from "./pages/groups/Groups";
import GroupInviteAccept from "./pages/groups/GroupInviteAccept";
import Profile from "./pages/profile";
import "./i18n/i18n";

function App() {
  return (
    <Routes>
      {/* Protected routes with navbar */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout>
              <Home />
            </AppLayout>
          </ProtectedRoute>
        }
        path="/"
      />
      <Route
        element={
          <ProtectedRoute>
            <AppLayout>
              <Groups />
            </AppLayout>
          </ProtectedRoute>
        }
        path="/groups"
      />

      <Route
        element={
          <ProtectedRoute>
            <AppLayout>
              <Profile />
            </AppLayout>
          </ProtectedRoute>
        }
        path="/profile"
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
