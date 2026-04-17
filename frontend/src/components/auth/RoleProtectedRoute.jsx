import { Navigate } from "react-router-dom";

function RoleProtectedRoute({ allowedRole, children }) {

    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    // Not logged in
    if (!token) {
        return <Navigate to="/login" />;
    }

    // Role mismatch
    if (role !== allowedRole) {
        return <Navigate to="/unauthorized" />;
    }

    return children;
}

export default RoleProtectedRoute;