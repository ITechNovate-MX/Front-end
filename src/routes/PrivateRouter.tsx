import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";

const PrivateRouter = () => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar fija */}
      <aside className="w-64 h-screen bg-white fixed shadow-xl">
        <Sidebar />
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 bg-gray-100 p-6 ml-64 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default PrivateRouter;