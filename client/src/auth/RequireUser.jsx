import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import UserNavbar from "../Components/user/UserNavbar";

const RequireUser = () => {
  const { loading, role } = useSelector((state) => state.auth);

  if (loading) return <div>Loading...</div>;

  if (role !== "user") {
    return <Navigate to="/login" replace />;
  }

  return <>
   <UserNavbar />
      <Outlet />
  </>;
};

export default RequireUser;
