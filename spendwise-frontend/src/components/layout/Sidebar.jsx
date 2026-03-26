import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { 
  FiHome, 
  FiCreditCard, 
  FiFolder, 
  FiTarget, 
  FiPieChart, 
  FiUser, 
  FiLogOut,
  FiMenu,
  FiX
} from "react-icons/fi";
import logo from "../../assets/logo.png";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: FiHome },
  { name: "Transactions", href: "/transactions", icon: FiCreditCard },
  { name: "Categories", href: "/categories", icon: FiFolder },
  { name: "Budgets", href: "/budgets", icon: FiTarget },
  { name: "Savings", href: "/savings", icon: FiPieChart },
];

export default function Sidebar({ mobileOpen, setMobileOpen }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const SidebarContent = () => (
    <div className="h-full flex flex-col bg-gradient-to-b from-[#5409DA] to-[#4E71FF]">
      {/* Logo */}
      <div className="flex items-center justify-between px-6 py-8 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
            <span className="text-white font-bold text-xl">₱</span>
          </div>
          <h1 className="text-white font-bold text-xl tracking-tight">SpendWise</h1>
        </div>
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden text-white/70 hover:text-white"
        >
          <FiX size={24} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              onClick={() => setMobileOpen(false)}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                ${isActive 
                  ? "bg-white/20 text-white shadow-lg" 
                  : "text-white/70 hover:bg-white/10 hover:text-white"
                }
              `}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.name}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="border-t border-white/10 p-4">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 mb-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <FiUser size={18} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">
              {user?.email?.split("@")[0] || "User"}
            </p>
            <p className="text-white/50 text-xs truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:bg-white/10 hover:text-white transition-all duration-200"
        >
          <FiLogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block fixed left-0 top-0 h-screen w-72 z-20">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-full w-72 z-40 transform transition-transform duration-300 ease-in-out lg:hidden
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <SidebarContent />
      </div>
    </>
  );
}