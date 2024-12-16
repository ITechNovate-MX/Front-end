import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAppContext } from "../../app-context/app-context";
import { ROUTES } from "../../routes/constants";
import { ReactComponent as HomeIcon } from "../../icons/home.svg";
import { ReactComponent as UploadIcon } from "../../icons/upload.svg";
import { ReactComponent as RecordsIcon } from "../../icons/records.svg";
import { ReactComponent as LogoutIcon } from "../../icons/logout.svg";
import ASRIcon from "../../icons/asrlogo.png";
import "./Sidebar.css";

const Sidebar: React.FC = () => {
  const { logOut } = useAppContext();
  const navigate = useNavigate();
  const [activeLink, setActiveLink] = useState("");

  useEffect(() => {
    // Establecer el enlace activo en función de la URL actual
    setActiveLink(window.location.pathname);
  }, []);

  const handleSetActive = (route: string) => {
    setActiveLink(route);
  };

  const handleLogOut = async () => {
    try {
      await logOut();
      navigate("/login"); // Usa `navigate` en lugar de `window.location.href`
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div className="sidebar">
      {/* Logo */}
      <div className="bg-white rounded-lg mb-6">
        <div className="flex items-center justify-center p-4">
          <img src={ASRIcon} alt="ASR Logo" className="w-64 h-48 object-contain" />
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col flex-1">
        <NavLink
          to={ROUTES.HOME.path}
          className={({ isActive }) =>
            `sidebar-item ${
              isActive ? "bg-blue-200" : "hover:bg-blue-100"
            }`
          }
          onClick={() => handleSetActive(ROUTES.HOME.path)}
        >
          <HomeIcon className="w-6 h-6 mr-2" />
          <span>INICIO</span>
        </NavLink>

        <NavLink
          to={ROUTES.UPLOAD.path}
          className={({ isActive }) =>
            `sidebar-item ${
              isActive ? "bg-blue-200" : "hover:bg-gray-100"
            }`
          }
          onClick={() => handleSetActive(ROUTES.UPLOAD.path)}
        >
          <UploadIcon className="w-6 h-6 mr-2" />
          <span>CARGAR FACTURA</span>
        </NavLink>

        <NavLink
          to={ROUTES.RECORDS.path}
          className={({ isActive }) =>
            `sidebar-item ${
              isActive ? "bg-blue-200" : "hover:bg-gray-100"
            }`
          }
          onClick={() => handleSetActive(ROUTES.RECORDS.path)}
        >
          <RecordsIcon className="w-6 h-6 mr-2" />
          <span>REGISTROS</span>
        </NavLink>

        {/* Logout */}
      <div
        className="sidebar-lastitem "
        onClick={handleLogOut}
      >
        <LogoutIcon className="w-6 h-6 mr-2" />
        <span>SALIR</span>
      </div>
      </nav>
    </div>
  );
};

export default Sidebar;