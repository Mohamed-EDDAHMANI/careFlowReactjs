import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../features/auth/authSlice";
import type { RootState } from "../app/store";


const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useSelector((state: RootState) => state.theme.mode);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await dispatch(loginUser(form) as any);
    if (result.type === 'auth/login/fulfilled') {
      if (result.payload.success) {
        navigate("/dashboard");
      } else {
        setError(result.payload.message);
      }
    } else if (result.type === 'auth/login/rejected') {
      setError(result.payload?.message || "Une erreur est survenue");
    }
  };

  return (
    <div className={`flex justify-center items-center h-screen ${theme === 'light' ? 'bg-light-bg' : 'bg-dark-bg'}`}>
      <form
        onSubmit={handleSubmit}
        className={`${theme === 'light' ? 'bg-light-primary' : 'bg-dark-primary'} p-6 rounded-lg shadow-md w-96`}
      >
        <h1 className={`text-2xl font-bold mb-4 text-center ${theme === 'light' ? 'text-light-text' : 'text-dark-text'}`}>
          Login
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-3">
            {error}
          </div>
        )}

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
  );
};

export default Login;
