import React from "react";
import { Navigate , Outlet} from "react-router-dom";

const AdminRoute = ({ children }) => {
  const session = JSON.parse(localStorage.getItem("session"));
  if (!session || session.role !== "admin") {
    return <Navigate to="/"  />;
  }
   return children ? children : <Outlet />;;
};

export default AdminRoute;