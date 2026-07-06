import { useEffect } from "react";
import { FolderPlus, Upload, Grid2X2, List } from "lucide-react";

import AppShell from "../../../components/layout/AppShell";
import Breadcrumbs from "../../../components/breadcrumbs/Breadcrumbs";

import { useDrive } from "../../../context/DriveContext";

export default function FolderPage() {
  const {
    loading,
    currentDirectoryId,

    filteredFiles,
    filteredFolders,

    refreshDirectory,

    viewMode,
    setViewMode,

    createFolder,
  } = useDrive();

  useEffect(() => {
    refreshDirectory(currentDirectoryId);
  }, []);

  return (
    <AppShell>

      {/* Breadcrumb */}

      <div className="mb-6">
        <Breadcrumbs />
      </div>

      {/* Header */}

      <div className="flex items-center justify-between mb-8">

        <div>

          <h1 className="text-3xl font-bold">
            My Drive
          </h1>

          <p className="text-zinc-400 mt-2">
            Manage your folders and file
          </p>

        </div>

        <div className="flex gap-3">

          <button
            className="
            flex
            items-center
            gap-2
            rounded-xl
            border
            border-white/10
            bg-white/5
            px-4
            py-2
            hover:bg-white/10
            transition
            "
            onClick={() => createFolder("New Folder")}
          >
            <FolderPlus size={18} />
            Folder
          </button>

          <button
            className="
            flex
            items-center
            gap-2
            rounded-xl
            bg-blue-600
            px-4
            py-2
            hover:bg-blue-500
            transition
            "
          >
            <Upload size={18} />
            Upload
          </button>

        </div>

      </div>

      {/* View Toggle */}

      <div className="flex justify-end mb-6">

        <div className="flex rounded-xl border border-white/10 overflow-hidden">

          <button
            onClick={() => setViewMode("grid")}
            className={`
              px-4
              py-2
              transition
              ${
                viewMode === "grid"
                  ? "bg-blue-600"
                  : "bg-transparent hover:bg-white/5"
              }
            `}
          >
            <Grid2X2 size={18} />
          </button>

          <button
            onClick={() => setViewMode("list")}
            className={`
              px-4
              py-2
              transition
              ${
                viewMode === "list"
                  ? "bg-blue-600"
                  : "bg-transparent hover:bg-white/5"
              }
            `}
          >
            <List size={18} />
          </button>

        </div>

      </div>

      {/* Folders */}

      <section>

        <h2 className="text-xl font-semibold mb-5">
          Folders
        </h2>

        {loading ? (

          <div className="text-zinc-500">
            Loading folders...
          </div>

        ) : filteredFolders.length === 0 ? (

          <div
            className="
            rounded-2xl
            border
            border-dashed
            border-white/10
            bg-white/[0.03]
            p-10
            text-center
            text-zinc-400
            "
          >
            No folders yet
          </div>

        ) : (

          <div
            className="
            grid
            gap-5
            grid-cols-1
            sm:grid-cols-2
            xl:grid-cols-3
            2xl:grid-cols-4
            "
          >

            {filteredFolders.map((folder) => (

              <button
                key={folder._id}
                onClick={() => openFolder(folder)}
                className="
                rounded-2xl
                border
                border-white/10
                bg-white/[0.03]
                p-5
                text-left
                hover:bg-white/[0.05]
                transition
                "
              >

                <div className="text-5xl mb-5">
                  📁
                </div>

                <h3 className="font-semibold">
                  {folder.name}
                </h3>

              </button>

            ))}

          </div>

        )}

      </section>

      {/* Files */}

      <section className="mt-12">

        <h2 className="text-xl font-semibold mb-5">
          Files
        </h2>

        {loading ? (

          <div className="text-zinc-500">
            Loading files...
          </div>

        ) : filteredFiles.length === 0 ? (

          <div
            className="
            rounded-2xl
            border
            border-dashed
            border-white/10
            bg-white/[0.03]
            p-10
            text-center
            text-zinc-400
            "
          >
            No files inside this folder
          </div>

        ) : (

          <div
            className="
            grid
            gap-5
            grid-cols-1
            sm:grid-cols-2
            xl:grid-cols-3
            2xl:grid-cols-4
            "
          >

            {filteredFiles.map((file) => (

              <div
                key={file._id}
                className="
                rounded-2xl
                border
                border-white/10
                bg-white/[0.03]
                p-5
                hover:bg-white/[0.05]
                transition
                "
              >

                <div className="text-5xl mb-5">
                  📄
                </div>

                <h3 className="truncate font-medium">
                  {file.name}
                </h3>

                <p className="text-sm text-zinc-500 mt-2">
                  {(file.size / 1024).toFixed(2)} KB
                </p>

              </div>

            ))}

          </div>

        )}

      </section>

    </AppShell>
  );
}