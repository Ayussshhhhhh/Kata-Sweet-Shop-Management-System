import useAuth from "@/utils/useAuth";

export default function LogoutPage() {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut({
      callbackUrl: "/",
      redirect: true,
    });
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl text-center border-4 border-pink-200">
        <div className="text-6xl mb-6">🍬</div>
        <h1 className="mb-6 text-3xl font-black bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent">
          Sign Out
        </h1>

        <p className="mb-8 text-gray-600 font-medium">
          Are you sure you want to sign out?
        </p>

        <button
          onClick={handleSignOut}
          className="w-full rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 px-4 py-4 text-base font-bold text-white transition-all hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-pink-200 shadow-lg"
        >
          Sign Out
        </button>

        <a
          href="/"
          className="mt-4 block w-full rounded-xl border-2 border-gray-300 px-4 py-3 font-semibold text-gray-700 hover:bg-gray-50 transition-all"
        >
          Cancel
        </a>
      </div>
    </div>
  );
}
