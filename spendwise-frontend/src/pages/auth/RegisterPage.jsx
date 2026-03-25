//RegisterPage.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../../services/AuthService";
import { useAuth } from "../../context/AuthContext";

const passwordRequirements = [
  { label: "At least 8 characters",  test: (p) => p.length >= 8 },
  { label: "One uppercase letter",   test: (p) => /[A-Z]/.test(p) },
  { label: "One lowercase letter",   test: (p) => /[a-z]/.test(p) },
  { label: "One number",             test: (p) => /\d/.test(p) },
  { label: "One special character",  test: (p) => /[^A-Za-z0-9]/.test(p) },
];

export default function RegisterPage() {
  const navigate = useNavigate();
  const { saveSession } = useAuth();

  const [form, setForm] = useState({ email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [touched, setTouched] = useState(false);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
    if (e.target.name === "password") setTouched(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const allPassed = passwordRequirements.every((r) => r.test(form.password));
    if (!allPassed) {
      setError("Please meet all password requirements");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const data = await authService.signUp(form.email, form.password);
      saveSession(data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const EyeIcon = ({ visible }) =>
    visible ? (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
      </svg>
    ) : (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
      </svg>
    );

  const passwordsMatch = form.confirmPassword && form.password === form.confirmPassword;
  const passwordsMismatch = form.confirmPassword && form.password !== form.confirmPassword;

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">

        {/* Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">

          {/* Logo */}
          <div className="mb-7 text-center">
            <h1 className="text-2xl font-bold text-white tracking-tight">SpendWise</h1>
            <p className="text-gray-400 text-sm mt-1">Create your account</p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 px-4 py-3 rounded-lg bg-red-950 border border-red-800 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3.5 py-2.5 placeholder-gray-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3.5 py-2.5 pr-10 placeholder-gray-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition"
                >
                  <EyeIcon visible={showPassword} />
                </button>
              </div>

              {/* Requirements checklist */}
              {touched && form.password && (
                <div className="mt-3 space-y-1.5">
                  {passwordRequirements.map((req) => {
                    const passed = req.test(form.password);
                    return (
                      <div key={req.label} className="flex items-center gap-2">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"
                          className={passed ? "text-indigo-400" : "text-gray-600"}>
                          {passed
                            ? <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                            : <circle cx="12" cy="12" r="10"/>}
                        </svg>
                        <span className={`text-xs ${passed ? "text-gray-400" : "text-gray-600"}`}>
                          {req.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Confirm password
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className={`w-full bg-gray-800 border text-white text-sm rounded-lg px-3.5 py-2.5 pr-10 placeholder-gray-500 outline-none focus:ring-1 transition
                    ${passwordsMismatch
                      ? "border-red-700 focus:border-red-500 focus:ring-red-500"
                      : passwordsMatch
                      ? "border-indigo-600 focus:border-indigo-500 focus:ring-indigo-500"
                      : "border-gray-700 focus:border-indigo-500 focus:ring-indigo-500"
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition"
                >
                  <EyeIcon visible={showConfirm} />
                </button>
              </div>
              {passwordsMismatch && (
                <p className="text-xs text-red-400 mt-1.5">Passwords do not match</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold py-2.5 rounded-lg transition"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition">
              Sign in
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}