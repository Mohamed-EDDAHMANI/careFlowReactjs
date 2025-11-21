import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../features/auth/authSlice";
import ErrorToast from "../components/ErrorToast";
import SuccessToast from "../components/SuccessToast";
import LoadingSpinner from "../components/LoadingSpinner";
import type { RootState, AppDispatch } from "../app/store";


const Login = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const theme = useSelector((state: RootState) => state.theme.mode);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await dispatch(loginUser(form));
    if (loginUser.fulfilled.match(result)) {
    setSuccess("Login successful! Redirecting...");
    setTimeout(() => navigate("/dashboard"), 1000);
  } else if (loginUser.rejected.match(result)) {
    setError(result.payload as string || "Une erreur est survenue");
    setForm({ email: "", password: "" });
  }
    setLoading(false);
  };

  return (
    <>
      {loading && <LoadingSpinner fullScreen message="Logging in..." />}
      {error && <ErrorToast message={error} onClose={() => setError("")} />}
      {success && <SuccessToast message={success} onClose={() => setSuccess("")} />}
      <div className={`flex justify-center items-center h-screen ${theme === 'light' ? 'bg-light-bg' : 'bg-dark-bg'}`}>
      <form
        onSubmit={handleSubmit}
        className={`${theme === 'light' ? 'bg-light-primary' : 'bg-dark-primary'} p-6 rounded-lg shadow-md w-96`}
      >
        <h1 className={`text-2xl font-bold mb-4 text-center ${theme === 'light' ? 'text-light-text' : 'text-dark-text'}`}>
          Login
        </h1>



        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="border p-2 w-full mb-3 rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="border p-2 w-full mb-4 rounded"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded w-full"
        >
          Se connecter
        </button>
      </form>
      </div>
    </>
  );
};

export default Login;
