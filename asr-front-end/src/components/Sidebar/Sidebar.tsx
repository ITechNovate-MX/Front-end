import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../routes/constants";
import { ReactComponent as HomeIcon } from "../../icons/home.svg";
import { ReactComponent as UploadIcon } from "../../icons/upload.svg";
import { ReactComponent as RecordsIcon } from "../../icons/records.svg";
import ASRIcon from "../../icons/asr.png"; // Importar el PNG correctamente
import './Sidebar.css'; // Puedes seguir usando tu CSS o reemplazarlo con Tailwind

const Sidebar: React.FC = () => {
    const [activeLink, setActiveLink] = useState("");

    const handleSetActive = (route: string) => {
        setActiveLink(route);
    };

    return (
        <div className="sidebar bg-gray-950 text-white h-full p-4 shadow-lg">
          <div className="bg-white rounded-lg">
            <div className="flex items-center justify-center p-4">
                <img src={ASRIcon} alt="ASR Logo" className="w-24 h-24 object-contain" />
            </div>
          </div>
            <div 
                className={`sidebar-item flex items-center p-2 rounded-lg ${activeLink === ROUTES.HOME.path ? "bg-blue-800" : ""}`} 
                onClick={() => handleSetActive(ROUTES.HOME.path)}
            >
                <HomeIcon className="w-6 h-6 mr-2" />
                <Link to={ROUTES.HOME.path}>HOME</Link>
            </div>

            <div 
                className={`sidebar-item flex items-center p-2 rounded-lg ${activeLink === ROUTES.UPLOAD.path ? "bg-blue-800" : ""}`} 
                onClick={() => handleSetActive(ROUTES.UPLOAD.path)}
            >
                <UploadIcon className="w-6 h-6 mr-2" />
                <Link to={ROUTES.UPLOAD.path}>UPLOAD</Link>
            </div>

            <div 
                className={`sidebar-item flex items-center p-2 rounded-lg ${activeLink === ROUTES.RECORDS.path ? "bg-blue-800" : ""}`} 
                onClick={() => handleSetActive(ROUTES.RECORDS.path)}
            >
                <RecordsIcon className="w-6 h-6 mr-2" />
                <Link to={ROUTES.RECORDS.path}>RECORDS</Link>
            </div>
        </div>
    );
};

export default Sidebar;