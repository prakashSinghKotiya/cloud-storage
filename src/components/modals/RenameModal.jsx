import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { X } from "lucide-react";

import { useUIContext } from "../../context/UIContext";
import { useDrive } from "../../context/DriveContext";

export default function RenameModal() {
  const { activeModal, closeModal } = useUIContext();

  const {
    updateFileName,
    renameFolder,
  } = useDrive();

 const payload = activeModal?.payload;

const item = payload?.item;

const isFolder = payload?.type === "folder";

  const open = activeModal?.name === "rename";

  

  const [value, setValue] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && item) {
      setValue(item.name || "");
    }
  }, [open, item]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") {
        closeModal();
      }
    };

    window.addEventListener("keydown", handler);

    return () =>
      window.removeEventListener("keydown", handler);
  }, [closeModal]);

  async function handleRename() {
    if (!value.trim()) return;

    try {
      setLoading(true);

      if (isFolder) {
        await renameFolder(item._id, value.trim());
      } else {
        await updateFileName(item._id, value.trim());
      }

      closeModal();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[120] bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          />

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.9,
              y: 20,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.95,
              y: 10,
            }}
            transition={{
              duration: 0.18,
            }}
            className="
              fixed
              left-1/2
              top-1/2
              z-[130]
              w-full
              max-w-md
              -translate-x-1/2
              -translate-y-1/2
              rounded-3xl
              border
              border-white/10
              bg-[#151922]
              p-7
              shadow-2xl
            "
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                Rename {isFolder ? "Folder" : "File"}
              </h2>

              <button
                onClick={closeModal}
                className="rounded-lg p-2 hover:bg-white/5"
              >
                <X size={18} />
              </button>
            </div>

            <input
              autoFocus
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleRename();
                }
              }}
              className="
                mt-6
                w-full
                rounded-2xl
                border
                border-white/10
                bg-white/5
                px-5
                py-3
                outline-none
                focus:border-blue-500
              "
            />

            <div className="mt-7 flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="
                  rounded-xl
                  border
                  border-white/10
                  px-5
                  py-2.5
                "
              >
                Cancel
              </button>

              <button
                disabled={!value.trim() || loading}
                onClick={handleRename}
                className="
                  rounded-xl
                  bg-blue-600
                  px-5
                  py-2.5
                  disabled:opacity-40
                "
              >
                {loading ? "Renaming..." : "Rename"}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}