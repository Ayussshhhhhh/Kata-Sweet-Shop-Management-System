import { useState } from "react";
import useAuth from "@/utils/useAuth";

export default function SignUpPage() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { signUpWithCredentials } = useAuth();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!email || !password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      await signUpWithCredentials({
        email,
        password,
        callbackUrl: "/",
        redirect: true,
      });
    } catch (err) {
      const errorMessages = {
        EmailCreateAccount:
          "This email is already registered. Please sign in instead.",
        CredentialsSignin: "Could not create account. Please try again.",
      };

      setError(
        errorMessages[err.message] || "Something went wrong. Please try again.",
      );
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 p-4">
      <form
        noValidate
        onSubmit={onSubmit}
        className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl border-4 border-pink-200"
      >
        <div className="mb-8 text-center">
          <div className="text-6xl mb-4 animate-bounce">🍬</div>
          <h1 className="text-4xl font-black bg-gradient-to-r from-pink-600 via-rose-600 to-orange-600 bg-clip-text text-transparent">
            Sweet Shop
          </h1>
          <p className="mt-3 text-gray-600 font-medium">
            Create your account to get started
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700">
              Email Address
            </label>
            <input
              required
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full rounded-xl border-2 border-pink-200 px-4 py-3.5 text-lg outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-100 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700">
              Password
            </label>
            <input
              required
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="w-full rounded-xl border-2 border-pink-200 px-4 py-3.5 text-lg outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-100 transition-all"
            />
          </div>

          {error && (
            <div className="rounded-xl bg-red-50 border-2 border-red-200 p-4 text-sm text-red-600 font-medium">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 px-4 py-4 text-base font-bold text-white transition-all hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-pink-200 disabled:opacity-50 shadow-lg"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <a
              href={`/account/signin${
                typeof window !== "undefined" ? window.location.search : ""
              }`}
              className="font-bold text-pink-600 hover:text-pink-700 transition-colors"
            >
              Sign in here
            </a>
          </p>
        </div>
      </form>
    </div>
  );
}
