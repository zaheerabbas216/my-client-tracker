import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Board from "../pages/Board";


export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Dashboard/>} />
            <Route path="/board/:id" element={<Board />} />
        </Routes>
    )
};