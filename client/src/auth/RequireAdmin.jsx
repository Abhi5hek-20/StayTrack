import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import AdminNavbar from "../Components/admin/AdminNavbar";

const RequireAdmin = () => {
  const { loading, role } = useSelector(
    (state) => state.auth
  );

  if (loading) return <div>Loading...</div>;

  if (role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <AdminNavbar />
      <Outlet />
    </>
  );
};

export default RequireAdmin;
