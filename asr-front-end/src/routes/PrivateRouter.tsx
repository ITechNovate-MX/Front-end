import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";

const PrivateRouter = () => {
  return (
    <>
      <div className="flex min-h-screen">
        <aside className="w-64  hidden md:block">
          <Sidebar />
        </aside>

        <main className="flex-1 bg-gray-100 p-6">
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default PrivateRouter;