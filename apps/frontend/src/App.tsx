/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import BaseLayout from "./components/layout/BaseLayout";
import Home from "./pages/Home";
import Rooms from "./pages/Rooms";
import RoomDetail from "./pages/RoomDetail";
import Contracts from "./pages/Contracts";
import Dashboard from "./pages/Dashboard";
import CreateRoom from "./pages/CreateRoom";
import ManageRoom from "./pages/ManageRoom";
import EditRoom from "./pages/EditRoom";
import PayRent from "./pages/PayRent";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";

// Force HMR reload
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route element={<BaseLayout />}>
          {/* Protected routes for all authenticated users */}
          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<Home />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/rooms/:id" element={<RoomDetail />} />
            <Route path="/contracts" element={<Contracts />} />
          </Route>

          {/* Protected routes for Admin & Landlord only */}
          <Route element={<ProtectedRoute allowedRoles={['admin', 'chu_nha']} />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create-room" element={<CreateRoom />} />
            <Route path="/manage-room/:id" element={<ManageRoom />} />
            <Route path="/edit-room/:id" element={<EditRoom />} />
          </Route>

          {/* Protected routes for Admin & Tenant only */}
          <Route element={<ProtectedRoute allowedRoles={['admin', 'nguoi_thue']} />}>
            <Route path="/pay/:id" element={<PayRent />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
