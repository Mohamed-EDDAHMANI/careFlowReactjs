import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../app/store";

const RootRedirect = () => {
  const user = useSelector((state: RootState) => state.auth?.user);
  return user ? <Navigate to="/dashboard" replace /> : <Navigate to="/home" replace />;
};

export default RootRedirect;