import { useState } from "react";
import {
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDrive } from "../../context/DriveContext";

export default function FolderNode({
  folder,
  depth = 0,
}) {

const {
  openFolder,
} = useDrive();

  const [expanded, setExpanded] = useState(false);

  const children = folder.children || [];

 

  return (
    <div>

      <div
        className="
        flex
        items-center
        rounded-xl
        px-3
        py-2
        hover:bg-white/5
        transition
        cursor-pointer
        group
        "
        style={{
          paddingLeft: `${depth * 16 + 12}px`,
        }}
      >

        {children.length > 0 ? (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mr-1"
          >
            {expanded ? (
              <ChevronDown
                size={16}
                className="text-zinc-400"
              />
            ) : (
              <ChevronRight
                size={16}
                className="text-zinc-400"
              />
            )}
          </button>
        ) : (
          <div className="w-[20px]" />
        )}

       <button
  onClick={() => openFolder(folder)}
  className="flex items-center gap-3 flex-1"
>
          {expanded ? (
            <FolderOpen
              size={18}
              className="text-yellow-400"
            />
          ) : (
            <Folder
              size={18}
              className="text-yellow-400"
            />
          )}

          <span
            className="
            truncate
            text-sm
            text-zinc-300
            group-hover:text-white
            "
          >
            {folder.name}
          </span>
        </button>
      </div>

      <AnimatePresence>

        {expanded && children.length > 0 && (
          <motion.div
            initial={{
              opacity: 0,
              height: 0,
            }}
            animate={{
              opacity: 1,
              height: "auto",
            }}
            exit={{
              opacity: 0,
              height: 0,
            }}
            transition={{
              duration: 0.2,
            }}
          >
            {children.map((child) => (
              <FolderNode
                key={child._id}
                folder={child}
                depth={depth + 1}
              />
            ))}
          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
}