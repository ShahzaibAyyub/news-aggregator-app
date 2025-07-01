import { Link, useLocation } from "react-router-dom";
import type { NavTabProps } from "../shared/interfaces";

function NavTab({ path, label }: NavTabProps) {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <Link
      to={path}
      className={`px-3 py-2 rounded-md text-lg font-medium transition-colors ${
        isActive(path)
          ? "bg-black text-white"
          : "text-gray-700 hover:text-black hover:bg-gray-100"
      }`}
    >
      {label}
    </Link>
  );
}

export default NavTab;
