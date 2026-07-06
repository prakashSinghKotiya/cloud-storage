import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../../context/AuthContext";
import { sendOtp, verifyOtp } from "../../../api/auth.api"; // Update the path if needed

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuthContext();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const [loading, setLoading] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);

  const onChange = (e) => {
    const { name, value } = e.target;

    if (name === "email") {
      setOtp("");
      setOtpSent(false);
      setOtpVerified(false);
      setCountdown(0);
      setError("");
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSendOtp = async () => {
    if (!formData.email) {
      return setError("Please enter your email first.");
    }

    try {
      setSendingOtp(true);
      setError("");

      await sendOtp(formData.email);

      setOtpSent(true);
      setCountdown(60);
    } catch (err) {
      setError(
        err?.response?.data?.error ||
          err?.message ||
          "Failed to send OTP."
      );
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      return setError("Please enter OTP.");
    }

    try {
      setVerifyingOtp(true);
      setError("");

      await verifyOtp(formData.email, otp);

      setOtpVerified(true);
    } catch (err) {
      setError(
        err?.response?.data?.error ||
          err?.message ||
          "Invalid OTP."
      );
    } finally {
      setVerifyingOtp(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!otpVerified) {
      return setError("Please verify your email first.");
    }

    try {
      setLoading(true);
      setError("");

      await register({
        ...formData,
        otp,
      });

      navigate("/login");
    } catch (err) {
      setError(
        err?.response?.data?.error ||
          err?.message ||
          "Registration failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0c1017] px-4 text-white">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur-lg">
        <h1 className="text-3xl font-semibold">
          Create Account
        </h1>

        <form onSubmit={onSubmit} className="mt-6 space-y-5">
          {/* Name */}
          <input
            type="text"
            name="name"
            placeholder="Full name"
            value={formData.name}
            onChange={onChange}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-blue-500"
            required
          />

          {/* Email + OTP */}
          <div className="relative">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={onChange}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 pr-28 outline-none transition focus:border-blue-500"
              required
            />

            <button
              type="button"
              onClick={handleSendOtp}
              disabled={sendingOtp || countdown > 0}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-blue-600 px-3 py-2 text-xs font-medium transition hover:bg-blue-500 disabled:opacity-60"
            >
              {sendingOtp
                ? "Sending..."
                : countdown > 0
                ? `${countdown}s`
                : "Send OTP"}
            </button>
          </div>

          {/* OTP */}
          {otpSent && (
            <div className="relative">
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 pr-28 outline-none transition focus:border-green-500"
              />

              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={otpVerified || verifyingOtp}
                className={`absolute right-2 top-1/2 -translate-y-1/2 rounded-xl px-3 py-2 text-xs font-medium transition ${
                  otpVerified
                    ? "bg-green-600"
                    : "bg-green-500 hover:bg-green-400"
                } disabled:opacity-70`}
              >
                {verifyingOtp
                  ? "Verifying..."
                  : otpVerified
                  ? "Verified"
                  : "Verify"}
              </button>
            </div>
          )}

          {/* Password */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={onChange}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-blue-500"
            required
          />

          {/* Error */}
          {error && (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          {/* Register */}
          <button
            type="submit"
            disabled={loading || !otpVerified}
            className="w-full rounded-2xl bg-blue-600 px-4 py-3 font-medium transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-400 hover:text-blue-300"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}