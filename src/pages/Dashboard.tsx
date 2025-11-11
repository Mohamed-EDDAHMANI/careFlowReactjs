import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">Welcome, {user?.name} 👋</h1>
      <p>Your role: {user?.role}</p>
      <button
        onClick={logout}
        className="mt-4 bg-red-500 text-white py-2 px-4 rounded"
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
