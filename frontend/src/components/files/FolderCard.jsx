import { motion } from "framer-motion";
import {
  Folder,
  MoreVertical,
  Clock3,
} from "lucide-react";

import { useContextMenu } from "../../context/ContextMenuContext";

const SIZE_STYLES = {
 small: {
  card: "p-3 rounded-xl",
  iconWrap: "h-9 w-9 rounded-lg",
  icon: "w-5 h-5",
  title: "text-sm",
},

  medium: {
    card: `
      min-h-[150px]
      sm:min-h-[180px]
      p-4 sm:p-6
      rounded-2xl sm:rounded-3xl
    `,
    iconWrap: `
      h-12 w-12
      sm:h-16 sm:w-16
      rounded-xl sm:rounded-2xl
    `,
    icon: "w-7 h-7 sm:w-9 sm:h-9",
    title: "text-base sm:text-lg",
  },

  large: {
    card: `
      min-h-[170px]
      sm:min-h-[220px]
      p-5 sm:p-8
      rounded-2xl sm:rounded-[30px]
    `,
    iconWrap: `
      h-14 w-14
      sm:h-20 sm:w-20
      rounded-2xl sm:rounded-3xl
    `,
     icon: "w-8 h-8 sm:w-10 sm:h-10",
    title: "text-lg sm:text-xl",
  },
};

export default function FolderCard({
  folder,
  onOpen,
  size = "medium",
  compact = false,
}) {
  const { openMenu } = useContextMenu();
  

  const styles =
    SIZE_STYLES[size] || SIZE_STYLES.medium;
    console.log("folder",folder);

  if (compact) {
    return (
      <motion.div
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.99 }}
        onClick={() => onOpen(folder)}
        onContextMenu={(e) =>
          openMenu(e, folder, "folder")
        }
        className="
        group
        flex
        cursor-pointer
        items-center
        justify-between
        rounded-2xl
        border
        border-white/10
        bg-[#11161f]
        px-5
        py-4
        transition-all
        duration-200
        hover:border-blue-500/40
        hover:bg-[#161c26]
        "
      >
        <div className="flex items-center gap-4">

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10">

            <Folder
              className={`${styles.icon} text-blue-400`}
            />

          </div>

          <div>

            <h3 className="font-medium text-white">
              {folder.name}
            </h3>

            <p className="mt-1 text-xs text-zinc-500">
              {folder.totalItems || 0} Items
            </p>

          </div>

        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            openMenu(e, folder, "folder");
          }}
          className="
          rounded-lg
          p-2
          opacity-0
          transition
          group-hover:opacity-100
          hover:bg-white/10
          "
        >
          <MoreVertical size={18} />
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{
        y: -6,
        transition: { duration: 0.18 },
      }}
      whileTap={{
        scale: 0.98,
      }}
      onClick={() => onOpen(folder)}
      onContextMenu={(e) =>
        openMenu(e, folder, "folder")
      }
      className={`
      group
      cursor-pointer
      border
      border-white/10
      bg-[#11161f]
      transition-all
      duration-300
      hover:-translate-y-1
      hover:border-blue-500/40
      hover:bg-[#171e28]
      hover:shadow-[0_18px_40px_rgba(0,0,0,0.35)]
      ${styles.card}
      `}
    >
      {/* Header */}

      <div className="flex items-start justify-between">

        <div
          className={`
          flex
          items-center
          justify-center
          bg-blue-500/10
          transition
          group-hover:scale-105
          ${styles.iconWrap}
          `}
        >
          <Folder
            size={styles.icon}
            className="text-blue-400"
          />
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            openMenu(e, folder, "folder");
          }}
          className="
          rounded-lg
          p-2
          text-zinc-500
          opacity-0
          transition
          hover:bg-white/10
          hover:text-white
          group-hover:opacity-100
          "
        >
          <MoreVertical size={18} />
        </button>

      </div>

      {/* Content */}

      <div className={size === "small" ? "mt-3" : "mt-6"}>

        <h3
          className={`
          truncate
          font-semibold
          tracking-tight
          text-white
          ${styles.title}
          `}
        >
          {folder.name}
        </h3>

        <div
  className={`
flex items-center gap-2 text-zinc-500
${size === "small" ? "mt-1 text-xs" : "mt-2 text-sm"}
`}
>

          <Folder size={14} />

          <span>
            {folder.totalItems || 0} Items
          </span>

        </div>

      </div>

      {/* Footer */}

      <div
  className={`flex items-center justify-between ${
    size === "small" ? "mt-4" : "mt-8"
  }`}
>

        <span
         className={`
rounded-full
border
border-white/10
bg-white/5
${size === "small" ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-xs"}
font-medium
text-zinc-400
`}
        >
          Folder
        </span>

        <div className="flex items-center gap-1 text-xs text-zinc-500">

          <Clock3 size={12} />

          <span>
            {folder.updatedAt
              ? new Date(
                  folder.updatedAt
                ).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                })
              : "--"}
          </span>

        </div>

      </div>
    </motion.div>
  );
}