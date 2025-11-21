import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../app/store";

const RootRedirect = () => {
  const accessToken = useSelector((state: RootState) => state.auth?.accessToken);
  return accessToken ? <Navigate to="/dashboard" replace /> : <Navigate to="/home" replace />;
};

export default RootRedirect;