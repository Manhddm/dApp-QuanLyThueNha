import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import RoomList from "./pages/RoomList";
import RoomDetail from "./pages/RoomDetail";
import Contracts from "./pages/Contracts";
import Dashboard from "./pages/Dashboard";
import Payment from "./pages/Payment";
import AccessDenied from "./pages/AccessDenied";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rooms" element={<RoomList />} />
        <Route path="/rooms/:id" element={<RoomDetail />} />
        <Route path="/contracts" element={<Contracts />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/access-denied" element={<AccessDenied />} />
      </Routes>
    </Router>
  );
}

export default App;
