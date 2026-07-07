import Sidebar from "./Sidebar";
import Header from "./Header";
import ContextMenu from "../context-menu/ContextMenu";
import RenameModal from "../modals/RenameModal";
import CreationFifo from "../userextra/CreationFifo";
import UploadManager from "../upload/UploadManager";
import ShareModal from "../share/ShareModal";
export default function AppShell({ children }) {
  return (
    <div className="min-h-screen bg-[#0c1017] text-white">
      <Sidebar />

      <div className="min-h-screen flex flex-col lg:ml-[290px]">
        <Header />

        <CreationFifo />

        <main className="w-full px-4 pt-4 pb-6 sm:px-6 lg:px-8 overflow-x-hidden">
          {children}
        </main>

        <UploadManager />
        <ContextMenu />
        <RenameModal />
        <ShareModal />
      </div>
    </div>
  );
}