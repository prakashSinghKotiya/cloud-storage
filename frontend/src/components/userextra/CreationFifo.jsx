import { useRef, useState } from "react";
import {
  FolderPlus,
  Plus,
  Upload,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useDrive } from "../../context/DriveContext";
import { useUploadContext } from "../../context/UploadContext";
import { useAuthContext } from "../../context/AuthContext";
import { Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CreationFifo({
  onUpload,
  onCreateFolder,
}) {

  const {user}= useAuthContext();
  console.log("admin:",user);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const [showCreateFolder, setShowCreateFolder] =
    useState(false);

  const [folderName, setFolderName] =
    useState("");

  const { createFolder } = useDrive();

  const {
    handleFileSelect,
  } = useUploadContext();

  const inputRef = useRef(null);

  const openFilePicker = () => {
    inputRef.current?.click();
  };

  const handleCreateFolder = async () => {
    const name = folderName.trim();

    if (!name) return;

    await createFolder(name);

    setFolderName("");
    setShowCreateFolder(false);
  };

  const closeModal = () => {
    setShowCreateFolder(false);
    setFolderName("");
  };

  return (
    <>
      {/* Hidden File Input */}

      <input
        ref={inputRef}
        type="file"
        hidden
        onChange={handleFileSelect}
      />

      {/* Desktop */}

      <div className="hidden w-full items-center justify-center gap-4 px-6 py-4 md:flex">
        <button
          onClick={() =>
            setShowCreateFolder(true)
          }
          className="
            flex
            items-center
            gap-2
            rounded-xl
            border
            border-white/10
            bg-white/5
            px-4
            py-2.5
            text-sm
            font-medium
            transition
            hover:bg-white/10
          "
        >
          <FolderPlus size={18} />
          New Folder
        </button>

        <button
          onClick={openFilePicker}
          className="
            flex
            items-center
            gap-2
            rounded-xl
            border
            border-blue-400/20
            bg-blue-500/10
            px-5
            py-3
            text-sm
            font-medium
            text-blue-300
            backdrop-blur-xl
            transition-all
            duration-300
            hover:border-blue-400/40
            hover:bg-blue-500/20
            hover:shadow-lg
            hover:shadow-blue-500/20
          "
        >
          <Upload size={18} />
          Upload File
        </button>

        {user?.role === "Admin" && (
  <button
    onClick={() => navigate("/admin/users")}
    className="
      flex items-center gap-2
      rounded-xl
      border border-violet-500/20
      bg-violet-500/10
      px-5 py-3
      text-sm font-medium
      text-violet-300
      backdrop-blur-xl
      transition-all
      hover:border-violet-400/40
      hover:bg-violet-500/20
      hover:shadow-lg
      hover:shadow-violet-500/20
    "
  >
    <Shield size={18} />
    Admin Panel
  </button>
)}
      </div>

      {/* Mobile FAB */}

      <div className="fixed bottom-6 right-6 z-50 md:hidden">
        {open && (
          <div className="mb-3 w-52 overflow-hidden rounded-2xl border border-white/10 bg-[#131922]/90 shadow-2xl backdrop-blur-xl">
            <button
              onClick={() => {
                setOpen(false);
                openFilePicker();
              }}
              className="flex w-full items-center gap-3 px-4 py-3 text-sm transition hover:bg-white/5"
            >
              <Upload size={18} />
              Upload File
            </button>

            <button
              onClick={() => {
                setOpen(false);
                setShowCreateFolder(true);
              }}
              className="flex w-full items-center gap-3 px-4 py-3 text-sm transition hover:bg-white/5"
            >
              <FolderPlus size={18} />
              New Folder
            </button>
            {user?.role === "Admin" && (
  <button
    onClick={() => {
      setOpen(false);
      navigate("/admin/users");
    }}
    className="
      flex w-full items-center gap-3
      px-4 py-3
      text-sm
      text-violet-300
      transition
      hover:bg-violet-500/10
    "
  >
    <Shield size={18} />
    Admin Panel
  </button>
)}
          </div>
        )}

        <button
          onClick={() => setOpen(!open)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 shadow-xl transition hover:bg-blue-500"
        >
          {open ? (
            <X size={24} />
          ) : (
            <Plus size={24} />
          )}
        </button>
      </div>

      {/* Create Folder Modal */}

      <AnimatePresence>
        {showCreateFolder && (
          <>
           <motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.15 }}
  className="fixed inset-0 bg-black/45 backdrop-blur-md"
/>

            <motion.div
             initial={{
  opacity: 0,
  y: 16,
}}

animate={{
  opacity: 1,
  y: 0,
}}

exit={{
  opacity: 0,
  y: 10,
}}
             transition={{
  type: "spring",
  stiffness: 420,
  damping: 32,
}}
              className="
                fixed
                left-1/2
                top-1/2
                z-[101]
                w-[92%]
                max-w-md
                -translate-x-1/2
                -translate-y-1/2
                rounded-3xl
                border
                border-white/10
                bg-[#121821]/80
                p-6
                shadow-2xl
                backdrop-blur-2xl
                transform-gpu
              "
            >
              <div className="mb-6 flex items-center gap-4">
                <div className="rounded-2xl bg-blue-500/15 p-3">
                  <FolderPlus
                    size={24}
                    className="text-blue-400"
                  />
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-white">
                    Create Folder
                  </h2>

                  <p className="text-sm text-zinc-400">
                    Enter a name for your new
                    folder.
                  </p>
                </div>
              </div>

              <input
                autoFocus
                value={folderName}
                onChange={(e) =>
                  setFolderName(
                    e.target.value
                  )
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleCreateFolder();
                  }

                  if (e.key === "Escape") {
                    closeModal();
                  }
                }}
                placeholder="Folder name..."
                className="
                  w-full
                  rounded-2xl
                  border
                  border-white/10
                  bg-white/5
                  px-4
                  py-3
                  text-white
                  placeholder:text-zinc-500
                  outline-none
                  transition
                  focus:border-blue-500/50
                  focus:bg-white/10
                "
              />

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={closeModal}
                  className="
                    rounded-xl
                    border
                    border-white/10
                    bg-white/5
                    px-5
                    py-2.5
                    text-sm
                    transition
                    hover:bg-white/10
                  "
                >
                  Cancel
                </button>

                <button
                  disabled={
                    !folderName.trim()
                  }
                  onClick={
                    handleCreateFolder
                  }
                  className="
                    rounded-xl
                    bg-blue-600
                    px-5
                    py-2.5
                    text-sm
                    font-medium
                    text-white
                    transition
                    hover:bg-blue-500
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  Create Folder
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}