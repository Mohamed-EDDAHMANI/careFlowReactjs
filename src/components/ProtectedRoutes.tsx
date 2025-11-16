import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

type Props = {
  children: React.ReactNode;
};

const ProtectedRoute = ({ children }: Props) => {
  const user = useSelector((state: any) => state.auth?.user);
  const accessTokenFromStore = useSelector((state: any) => state.auth?.accessToken);
  if (!user || !accessTokenFromStore) return <Navigate to="/login" replace />;
  return children;
};

export default ProtectedRoute;
