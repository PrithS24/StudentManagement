import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./Components/Signup";
import Login from "./Components/Login";
import AdminPage from "./Components/AdminPage";
import StudentProfile from "./Components/StudentProfile";

function App() {
    return (
        <Router>
            <Routes>
                {/* Default route redirects to the login page */}
                <Route path="/" element={<Navigate to="/login" />} />

                {/* Define other routes */}
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/profile" element={<StudentProfile />} />
            </Routes>
        </Router>
    );
}

export default App;
