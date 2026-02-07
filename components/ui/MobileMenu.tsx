import NavLink from "./NavLink";
import FavoritesCounter from "./FavoritesCounter";

export default function MobileMenu({
    open,
    onClose,
  }: {
    open: boolean;
    onClose: () => void;
  }) {
    return (
      <div
        className={`
          md:hidden
          overflow-hidden
          transition-all duration-300
          ${open ? "max-h-24 opacity-100" : "max-h-0 opacity-0"}
        `}
      >
        <div
          className="
            flex items-center justify-center gap-6
            px-4 py-3
            bg-bg border-t border-white/5
          "
        >
          <NavLink />
          <FavoritesCounter />
        </div>
      </div>
    );
  }
  