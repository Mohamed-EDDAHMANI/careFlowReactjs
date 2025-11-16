import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../app/store";

type Props = {
  children: React.ReactNode;
};

const ProtectedRoute = ({ children }: Props) => {
  const user = useSelector((state: RootState) => state.auth?.user);
  const accessTokenFromStore = useSelector((state: any) => state.auth?.accessToken);
  if (!user || !accessTokenFromStore) return <Navigate to="/login" replace />;
  return children;
};

export default ProtectedRoute;
