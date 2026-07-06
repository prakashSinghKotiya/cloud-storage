import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthContext } from "../../../context/AuthContext";
import { GoogleLogin } from "@react-oauth/google";



export default function LoginPage() {
  const navigate = useNavigate();
  
  const { login, googleLogin } = useAuthContext();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      setLoading(true);
      await login(formData);
      navigate("/app");
    } catch (err) {
      setError(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0c1017] px-4 text-white">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.04] p-8">
        <h1 className="text-2xl font-semibold">Login</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Access your cloud storage workspace
        </p>

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={onChange}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={onChange}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none"
          />

          {error && (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-blue-600 px-4 py-3 font-medium transition hover:bg-blue-500 disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-sm text-zinc-400">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-400">
            Register
          </Link>
        </p>

                <div className="relative text-center my-8">
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] bg-white/10"></div>

          <span className="relative px-4 bg-[#121933] text-gray-400 text-sm">
            Or continue with
          </span>
        </div>

        {/* GOOGLE LOGIN */}
        <div className="flex justify-center">
          <div className="scale-110 hover:scale-[1.14] transition-transform duration-300 ">
            <GoogleLogin
  onSuccess={async ({ credential }) => {
    try {
      await googleLogin(credential);
      navigate("/app");
    } catch (err) {
      console.error(err);
      setError(err.message || "Google login failed");
    }
  }}
  onError={() => setError("Google login failed")}
  theme="filled_blue"
  text="continue_with"
  useOneTap
/>
          </div>
        </div>
      </div>
    </div>
  );
}