import { useState, useEffect } from "react";
import useUser from "@/utils/useUser";
import {
  Search,
  ShoppingCart,
  Plus,
  Edit2,
  Trash2,
  Package,
  Sparkles,
} from "lucide-react";

export default function HomePage() {
  const { data: user, loading: userLoading } = useUser();
  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSweet, setEditingSweet] = useState(null);

  // Fetch user role
  useEffect(() => {
    if (user) {
      fetchUserRole();
    }
  }, [user]);

  const fetchUserRole = async () => {
    try {
      const response = await fetch("/api/user/role");
      if (response.ok) {
        const data = await response.json();
        setIsAdmin(data.isAdmin);
      }
    } catch (err) {
      console.error("Failed to fetch user role:", err);
    }
  };

  // Fetch sweets
  useEffect(() => {
    fetchSweets();
  }, [searchTerm, selectedCategory]);

  const fetchSweets = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (selectedCategory) params.append("category", selectedCategory);

      const response = await fetch(`/api/sweets?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch sweets");
      }
      const data = await response.json();
      setSweets(data.sweets);
      setError(null);
    } catch (err) {
      console.error("Error fetching sweets:", err);
      setError("Failed to load sweets");
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (sweetId, sweetName) => {
    if (!user) {
      window.location.href = "/account/signin";
      return;
    }

    const quantity = prompt(
      `How many ${sweetName} would you like to purchase?`,
      "1",
    );
    if (!quantity || parseInt(quantity) <= 0) return;

    try {
      const response = await fetch(`/api/sweets/${sweetId}/purchase`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: parseInt(quantity) }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Purchase failed");
      }

      alert("Purchase successful!");
      fetchSweets();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (sweetId) => {
    if (!confirm("Are you sure you want to delete this sweet?")) return;

    try {
      const response = await fetch(`/api/sweets/${sweetId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete sweet");
      }

      alert("Sweet deleted successfully");
      fetchSweets();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleRestock = async (sweetId, sweetName) => {
    const quantity = prompt(
      `How many ${sweetName} would you like to add to stock?`,
      "10",
    );
    if (!quantity || parseInt(quantity) <= 0) return;

    try {
      const response = await fetch(`/api/sweets/${sweetId}/restock`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: parseInt(quantity) }),
      });

      if (!response.ok) {
        throw new Error("Failed to restock");
      }

      alert("Restock successful!");
      fetchSweets();
    } catch (err) {
      alert(err.message);
    }
  };

  const categories = [...new Set(sweets.map((s) => s.category))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50">
      {/* Header with enhanced styling */}
      <header className="bg-white/80 backdrop-blur-md shadow-xl border-b-4 border-gradient-to-r from-pink-500 to-orange-500 sticky top-0 z-40">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-5xl animate-bounce">🍬</div>
              <div>
                <h1 className="text-4xl font-black bg-gradient-to-r from-pink-600 via-rose-600 to-orange-600 bg-clip-text text-transparent">
                  Sweet Shop
                </h1>
                <p className="mt-1 text-sm text-gray-600 font-medium">
                  India's Sweetest Destination ✨
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <div className="flex items-center gap-3 bg-gradient-to-r from-pink-50 to-orange-50 px-4 py-2 rounded-full border-2 border-pink-200">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center text-white font-bold text-sm">
                      {user.email[0].toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {user.email}
                    </span>
                    {isAdmin && (
                      <span className="ml-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-3 py-1 text-xs font-bold text-white shadow-lg">
                        ⭐ Admin
                      </span>
                    )}
                  </div>
                  <a
                    href="/account/logout"
                    className="rounded-full bg-gray-100 px-6 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-200 transition-all hover:scale-105"
                  >
                    Sign Out
                  </a>
                </>
              ) : (
                <>
                  <a
                    href="/account/signin"
                    className="rounded-full bg-pink-50 px-6 py-2.5 text-sm font-semibold text-pink-700 hover:bg-pink-100 transition-all hover:scale-105 border-2 border-pink-200"
                  >
                    Sign In
                  </a>
                  <a
                    href="/account/signup"
                    className="rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 px-6 py-2.5 text-sm font-bold text-white hover:shadow-2xl transition-all hover:scale-105 shadow-lg"
                  >
                    Sign Up
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Search and Filters with enhanced styling */}
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-pink-400" />
            <input
              type="text"
              placeholder="Search for your favorite sweets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-2xl border-2 border-pink-200 bg-white/80 backdrop-blur-sm py-3.5 pl-12 pr-4 text-gray-800 placeholder-gray-400 focus:border-pink-400 focus:outline-none focus:ring-4 focus:ring-pink-100 shadow-lg transition-all"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-2xl border-2 border-orange-200 bg-white/80 backdrop-blur-sm px-6 py-3.5 font-medium text-gray-700 focus:border-orange-400 focus:outline-none focus:ring-4 focus:ring-orange-100 shadow-lg transition-all"
            >
              <option value="">All Categories 🍭</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {isAdmin && (
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 px-6 py-3.5 font-bold text-white hover:shadow-2xl transition-all hover:scale-105 shadow-lg"
              >
                <Plus className="h-5 w-5" />
                Add Sweet
              </button>
            )}
          </div>
        </div>

        {/* Sweets Grid with enhanced cards */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-pink-500 border-r-transparent"></div>
            <p className="mt-6 text-lg text-gray-600 font-medium">
              Loading delicious sweets...
            </p>
          </div>
        ) : error ? (
          <div className="rounded-2xl bg-red-50 border-2 border-red-200 p-6 text-center text-red-600 font-medium shadow-lg">
            {error}
          </div>
        ) : sweets.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🍬</div>
            <p className="text-xl text-gray-600 font-medium">No sweets found</p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sweets.map((sweet) => (
              <div
                key={sweet.id}
                className="group overflow-hidden rounded-3xl bg-white shadow-xl transition-all hover:shadow-2xl hover:-translate-y-2 border-2 border-pink-100"
              >
                {/* Sweet Image/Icon */}
                <div className="relative h-56 bg-gradient-to-br from-pink-200 via-rose-200 to-orange-200 flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-300/20 to-orange-300/20"></div>
                  <div className="text-8xl transform group-hover:scale-110 transition-transform duration-300 filter drop-shadow-2xl">
                    🍬
                  </div>
                  {sweet.quantity === 0 && (
                    <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                      Out of Stock
                    </div>
                  )}
                  {sweet.quantity > 0 && sweet.quantity < 10 && (
                    <div className="absolute top-3 right-3 bg-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                      Low Stock!
                    </div>
                  )}
                </div>

                {/* Sweet Details */}
                <div className="p-5">
                  <div className="mb-3">
                    <h3 className="text-xl font-black text-gray-800 mb-1">
                      {sweet.name}
                    </h3>
                    <span className="inline-block bg-gradient-to-r from-pink-100 to-orange-100 text-pink-700 text-xs font-bold px-3 py-1 rounded-full border border-pink-200">
                      {sweet.category}
                    </span>
                  </div>

                  <p className="mt-3 text-sm text-gray-600 line-clamp-2 min-h-[40px]">
                    {sweet.description || "Delicious and sweet!"}
                  </p>

                  <div className="mt-4 flex items-center justify-between border-t-2 border-pink-50 pt-4">
                    <div className="flex flex-col">
                      <span className="text-3xl font-black bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent">
                        ₹{parseFloat(sweet.price).toFixed(2)}
                      </span>
                      <span className="text-xs text-gray-500 font-medium mt-0.5">
                        per piece
                      </span>
                    </div>
                    <div className="text-right">
                      <div
                        className={`text-sm font-bold ${sweet.quantity > 10 ? "text-green-600" : sweet.quantity > 0 ? "text-orange-600" : "text-red-600"}`}
                      >
                        {sweet.quantity > 0
                          ? `${sweet.quantity} available`
                          : "Sold out"}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-5 flex gap-2">
                    <button
                      onClick={() => handlePurchase(sweet.id, sweet.name)}
                      disabled={sweet.quantity === 0}
                      className="flex-1 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 px-4 py-3 text-sm font-bold text-white hover:shadow-xl transition-all hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 shadow-lg"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Buy Now
                    </button>
                    {isAdmin && (
                      <>
                        <button
                          onClick={() => setEditingSweet(sweet)}
                          className="rounded-2xl bg-blue-50 p-3 text-blue-600 hover:bg-blue-100 transition-all hover:scale-110 border-2 border-blue-200 shadow-md"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleRestock(sweet.id, sweet.name)}
                          className="rounded-2xl bg-green-50 p-3 text-green-600 hover:bg-green-100 transition-all hover:scale-110 border-2 border-green-200 shadow-md"
                        >
                          <Package className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(sweet.id)}
                          className="rounded-2xl bg-red-50 p-3 text-red-600 hover:bg-red-100 transition-all hover:scale-110 border-2 border-red-200 shadow-md"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Add/Edit Modal */}
      {(showAddModal || editingSweet) && (
        <SweetFormModal
          sweet={editingSweet}
          onClose={() => {
            setShowAddModal(false);
            setEditingSweet(null);
          }}
          onSuccess={() => {
            setShowAddModal(false);
            setEditingSweet(null);
            fetchSweets();
          }}
        />
      )}
    </div>
  );
}

function SweetFormModal({ sweet, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: sweet?.name || "",
    category: sweet?.category || "",
    price: sweet?.price || "",
    quantity: sweet?.quantity || "",
    description: sweet?.description || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const url = sweet ? `/api/sweets/${sweet.id}` : "/api/sweets";
      const method = sweet ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save sweet");
      }

      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl border-4 border-pink-200 animate-in zoom-in duration-200">
        <div className="mb-6 text-center">
          <div className="text-5xl mb-3">🍬</div>
          <h2 className="text-3xl font-black bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent">
            {sweet ? "Edit Sweet" : "Add New Sweet"}
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Sweet Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full rounded-xl border-2 border-pink-200 px-4 py-3 focus:border-pink-400 focus:outline-none focus:ring-4 focus:ring-pink-100 transition-all"
              placeholder="e.g., Gulab Jamun"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Category
            </label>
            <input
              type="text"
              required
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full rounded-xl border-2 border-pink-200 px-4 py-3 focus:border-pink-400 focus:outline-none focus:ring-4 focus:ring-pink-100 transition-all"
              placeholder="e.g., Indian Sweets"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Price (₹)
            </label>
            <input
              type="number"
              step="0.01"
              required
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              className="w-full rounded-xl border-2 border-pink-200 px-4 py-3 focus:border-pink-400 focus:outline-none focus:ring-4 focus:ring-pink-100 transition-all"
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Quantity
            </label>
            <input
              type="number"
              required
              value={formData.quantity}
              onChange={(e) =>
                setFormData({ ...formData, quantity: e.target.value })
              }
              className="w-full rounded-xl border-2 border-pink-200 px-4 py-3 focus:border-pink-400 focus:outline-none focus:ring-4 focus:ring-pink-100 transition-all"
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              className="w-full rounded-xl border-2 border-pink-200 px-4 py-3 focus:border-pink-400 focus:outline-none focus:ring-4 focus:ring-pink-100 transition-all"
              placeholder="Describe your sweet..."
            />
          </div>
          {error && (
            <div className="rounded-xl bg-red-50 border-2 border-red-200 p-4 text-sm text-red-600 font-medium">
              {error}
            </div>
          )}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border-2 border-gray-300 px-4 py-3 font-semibold text-gray-700 hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 px-4 py-3 font-bold text-white hover:shadow-xl transition-all disabled:opacity-50 shadow-lg"
            >
              {loading ? "Saving..." : "Save Sweet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
