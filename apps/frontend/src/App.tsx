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
import PayRent from "./pages/PayRent";
import Login from "./pages/Login";
import Register from "./pages/Register";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route element={<BaseLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/rooms/:id" element={<RoomDetail />} />
          <Route path="/contracts" element={<Contracts />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/pay/:id" element={<PayRent />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
