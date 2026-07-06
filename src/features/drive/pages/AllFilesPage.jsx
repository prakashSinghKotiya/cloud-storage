import { useEffect } from "react";
import AppShell from "../../../components/layout/AppShell";

import { useDrive } from "../../../context/DriveContext";
import ExplorerGrid from "../../../components/files/Homecard";
import Breadcrumbs from "../../../components/breadcrumbs/BreadCrumbs";


export default function AllFilesPage() {

  
const {
   filteredFiles,
  filteredFolders,
  directoryData,
  loading,
  refreshDirectory,
  toggleStar,
  removeFile,
  shareFile,
  openFolder,
  openFile
} = useDrive();

  useEffect(() => {
    refreshDirectory("");
  }, []);

 // const files = directoryData?.files || directoryData?.items?.files || [];
 //  const folders = directoryData?.directories || directoryData?.items?.directories || [];

  return (
    <AppShell>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">All Files</h2>
          <p className="text-sm text-zinc-400">
            Your uploaded files and folders
          </p>
        </div>
      </div>
       <div className="mb-6">
    <Breadcrumbs />
  </div>

      {loading ? (
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-10">
          Loading files...
        </div>
      ) : (
<ExplorerGrid
    files={filteredFiles}
    folders={filteredFolders}
    onStar={toggleStar}
    onDelete={removeFile}
    onShare={shareFile}
    onOpen={openFolder}
    onOpenFile={openFile}
/>
      )}
    </AppShell>
  );
}