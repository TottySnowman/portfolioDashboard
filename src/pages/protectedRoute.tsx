import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const authState = useSelector((state: RootState) => state.auth);

  if (!authState.token) {
    return <Navigate to="/signin" replace />;
  }

  return children;
};

export default ProtectedRoute;