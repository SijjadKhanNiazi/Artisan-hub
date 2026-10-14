import { useEffect, useState } from "react";
import { Plus, Search, ShoppingBag, Store, X } from "lucide-react";
import { useCartStore } from "../store/useCartStore";

export default function Navbar({
  onOpenAddModal,
  onOpenCart,
  searchQuery = "",
  onSearchChange = () => {},
}) {
  const cart = useCartStore((state) => state.cart);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const [scrolled, setScrolled] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Escape") onSearchChange("");
  };

  const SearchInput = ({ autoFocus = false }) => (
    <div className="relative w-full">
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
      <input
        type="text"
        value={searchQuery}
        autoFocus={autoFocus}
        onChange={(e) => onSearchChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search handmade products..."
        aria-label="Search products"
        className="w-full bg-slate-100 text-sm text-slate-800 placeholder-slate-400 pl-10 pr-10 py-2.5 rounded-2xl border border-transparent focus:bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-200 outline-none transition"
      />
      {searchQuery && (
        <button
          type="button"
          onClick={() => onSearchChange("")}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-md border-slate-200"
          : "bg-white/80 backdrop-blur-md shadow-sm border-slate-100"
      }`}
    >
      <div className="w-full px-4 sm:px-6 lg:px-12 py-3 flex items-center justify-between gap-4">
        {/* Logo */}
        <a
          href="/"
          aria-label="LocalArtisan Hub home"
          className="flex items-center gap-3 shrink-0 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
        >
          <div className="bg-gradient-to-br from-amber-100 to-amber-200 p-2.5 rounded-2xl shadow-sm">
            <Store className="w-6 h-6 text-amber-700" />
          </div>
          <span className="hidden sm:block text-xl font-extrabold tracking-tight text-slate-800">
            LocalArtisan <span className="text-amber-600">Hub</span>
          </span>
        </a>

        {/* Desktop search */}
        <div className="hidden md:block flex-1 max-w-xl">
          <SearchInput />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Mobile search toggle */}
          <button
            type="button"
            onClick={() => setMobileSearchOpen((v) => !v)}
            aria-label="Toggle search"
            aria-expanded={mobileSearchOpen}
            className="md:hidden p-3 rounded-2xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            {mobileSearchOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Search className="w-5 h-5" />
            )}
          </button>

          <button
            type="button"
            onClick={onOpenAddModal}
            aria-label="Add product"
            className="flex items-center gap-2 bg-amber-600 text-white px-3 sm:px-5 py-2.5 rounded-2xl font-semibold text-sm shadow-sm hover:bg-amber-700 hover:shadow active:scale-95 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Product</span>
          </button>

          <button
            type="button"
            onClick={onOpenCart}
            aria-label={`Open cart, ${totalItems} items`}
            className="relative p-3 rounded-2xl bg-slate-100 text-slate-700 hover:bg-slate-200 active:scale-95 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            <ShoppingBag className="w-5 h-5" />
            {totalItems > 0 && (
              <span
                key={totalItems}
                className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 bg-rose-500 text-white text-xs flex items-center justify-center rounded-full font-bold shadow-sm animate-bounce"
                style={{
                  animationIterationCount: 1,
                  animationDuration: "0.5s",
                }}
              >
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile search row */}
      {mobileSearchOpen && (
        <div className="md:hidden px-4 pb-3">
          <SearchInput autoFocus />
        </div>
      )}
    </header>
  );
}
