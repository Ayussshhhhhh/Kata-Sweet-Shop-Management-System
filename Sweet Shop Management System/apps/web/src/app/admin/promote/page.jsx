import { useState, useEffect } from "react";
import useUser from "@/utils/useUser";

export default function AdminPromotePage() {
  const { data: user, loading: userLoading } = useUser();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (user) {
      checkAdminStatus();
    }
  }, [user]);

  const checkAdminStatus = async () => {
    try {
      const response = await fetch("/api/user/role");
      if (response.ok) {
        const data = await response.json();
        setIsAdmin(data.isAdmin);
      }
    } catch (err) {
      console.error("Failed to check admin status:", err);
    }
  };

  const handlePromote = async () => {
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const response = await fetch("/api/admin/promote", {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to promote user");
      }

      setMessage(data.message);
      checkAdminStatus();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (userLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-pink-500 border-r-transparent"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 p-4">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl text-center border-4 border-pink-200">
          <div className="text-6xl mb-6">🍬</div>
          <h1 className="mb-4 text-3xl font-black bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent">
            Admin Promotion
          </h1>
          <p className="mb-6 text-gray-600 font-medium">
            You must be signed in to promote yourself to admin.
          </p>
          <a
            href="/account/signin?callbackUrl=/admin/promote"
            className="inline-block rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 px-8 py-4 font-bold text-white hover:shadow-2xl transition-all shadow-lg"
          >
            Sign In
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl border-4 border-pink-200">
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">⭐</div>
          <h1 className="text-3xl font-black bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent">
            Admin Promotion
          </h1>
        </div>

        {isAdmin ? (
          <div className="space-y-4">
            <div className="rounded-xl bg-green-50 border-2 border-green-200 p-5 text-center">
              <p className="text-green-700 font-bold text-lg">
                ✓ You are already an admin
              </p>
            </div>
            <a
              href="/"
              className="block w-full rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 px-4 py-4 text-center font-bold text-white hover:shadow-2xl transition-all shadow-lg"
            >
              Go to Sweet Shop
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-xl bg-yellow-50 border-2 border-yellow-200 p-4">
              <p className="text-sm text-yellow-800 font-medium">
                <strong>⚠️ Important:</strong> This page is for first-time setup
                only. After promoting yourself to admin, you should delete this
                page for security.
              </p>
            </div>

            <div className="rounded-xl bg-blue-50 border-2 border-blue-200 p-4">
              <p className="text-sm text-blue-800 font-medium">
                Signed in as: <strong>{user.email}</strong>
              </p>
            </div>

            {message && (
              <div className="rounded-xl bg-green-50 border-2 border-green-200 p-4 text-center">
                <p className="text-green-700 font-bold">{message}</p>
              </div>
            )}

            {error && (
              <div className="rounded-xl bg-red-50 border-2 border-red-200 p-4 text-center">
                <p className="text-red-600 font-bold">{error}</p>
              </div>
            )}

            <button
              onClick={handlePromote}
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 px-4 py-4 font-bold text-white hover:shadow-2xl transition-all disabled:opacity-50 shadow-lg"
            >
              {loading ? "Promoting..." : "Promote Me to Admin"}
            </button>

            <a
              href="/"
              className="block w-full rounded-xl border-2 border-gray-300 px-4 py-3 text-center font-semibold text-gray-700 hover:bg-gray-50 transition-all"
            >
              Back to Sweet Shop
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
