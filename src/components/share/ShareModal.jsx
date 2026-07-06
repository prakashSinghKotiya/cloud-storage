import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Copy, Check, X, Link as LinkIcon } from "lucide-react";
import { useUIContext } from "../../context/UIContext";

export default function ShareModal() {

    const { activeModal, closeModal } = useUIContext();

    const open = activeModal?.name === "share";

    const fileName = activeModal?.payload?.fileName ?? "";

    const shareUrl = activeModal?.payload?.shareUrl ?? "";
    
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open) setCopied(false);
  }, [open]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          />

          <motion.div
            initial={{ opacity: 0, scale: .95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: .95, y: 15 }}
            transition={{ duration: .18 }}
            className="fixed left-1/2 top-1/2 z-50 w-[92%] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/10 bg-zinc-900 p-6 shadow-2xl"
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">
                Share File
              </h2>

              <button
                onClick={closeModal}
                className="rounded-lg p-2 text-zinc-400 hover:bg-white/10 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <p className="mb-2 text-sm text-zinc-400">
              {fileName}
            </p>

            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-zinc-800 px-4 py-3">
              <LinkIcon size={18} className="text-zinc-400" />

              <input
                readOnly
                value={shareUrl}
                className="flex-1 bg-transparent text-sm text-white outline-none"
              />
            </div>

            <button
              onClick={handleCopy}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3 font-medium text-black transition hover:bg-zinc-200"
            >
              {copied ? (
                <>
                  <Check size={18} />
                  Copied
                </>
              ) : (
                <>
                  <Copy size={18} />
                  Copy Link
                </>
              )}
            </button>

            <p className="mt-4 text-center text-xs text-zinc-500">
              This link expires automatically in 1 hour.
            </p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}