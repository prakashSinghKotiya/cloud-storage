import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

import {
  FolderOpen,
  Pencil,
  Share2,
  Star,
  Trash2,
  Download,
  Info,
  X,
} from "lucide-react";

import { useContextMenu } from "../../context/ContextMenuContext";
import { useDrive } from "../../context/DriveContext";
import { useUIContext } from "../../context/UIContext";

function MenuItem({
  icon: Icon,
  label,
  danger = false,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className={`
        group
        flex
        h-10
        w-full
        items-center
        gap-3
        rounded-xl
        px-3
        text-sm
        transition-all
        duration-200
        ${
          danger
            ? "text-red-400 hover:bg-red-500/10"
            : "text-zinc-300 hover:bg-white/8 hover:text-white"
        }
      `}
    >
      <Icon
        size={16}
        className="transition-transform duration-200 group-hover:scale-110"
      />

      <span className="truncate">{label}</span>
    </button>
  );
}

export default function ContextMenu() {
  
  const menuRef = useRef(null);

  const {
    menu,
    closeMenu,
  } = useContextMenu();

  const { openModal } = useUIContext();

  const {
    openFolder,
    toggleStar,
    shareFile,
    removeFile,
    removeFolder,
  } = useDrive();

  useEffect(() => {
    function clickOutside(e) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {
        closeMenu();
      }
    }

    function esc(e) {
      if (e.key === "Escape") {
        closeMenu();
      }
    }

    window.addEventListener(
      "mousedown",
      clickOutside
    );

    window.addEventListener(
      "keydown",
      esc
    );

    return () => {
      window.removeEventListener(
        "mousedown",
        clickOutside
      );

      window.removeEventListener(
        "keydown",
        esc
      );
    };
  }, []);

  const item = menu.item;

  if (!menu.visible || !item) return null;

  const isFolder = menu.type === "folder";

  const openItem = () => {
  if (isFolder) {
    openFolder(item);
  } else {
    window.location.href = `https://cloudisk-cloud.up.railway.app/file/${item._id}`;
  }

  closeMenu();
};

  return (
    <AnimatePresence>

      <motion.div
        ref={menuRef}
       initial={{
  opacity:0,
  scale:.96,
  y:-6
}}

animate={{
  opacity:1,
  scale:1,
  y:0
}}

exit={{
  opacity:0,
  scale:.96,
  y:-6
}}
        transition={{
          duration: 0.15,
        }}
        style={{
          left: menu.x,
          top: menu.y,
        }}
        className="
fixed
z-[999]
w-[220px]
sm:w-56
md:w-60
max-w-[calc(100vw-1rem)]
max-h-[calc(100vh-1rem)]
overflow-y-auto
rounded-2xl
border
border-white/10
bg-[#171b24]/95
shadow-2xl
backdrop-blur-xl
p-1.5
"
      >
        <div  className="mb-1 flex items-center justify-between border-b border-white/10 px-3 py-2">

          <h3 className="flex-1 truncate text-sm font-medium text-white">
            {item.name}
          </h3>

          <button
            onClick={closeMenu}
            className="rounded-lg p-1 hover:bg-white/5"
          >
            <X size={15} />
          </button>

        </div>
<MenuItem
    icon={FolderOpen}
    label="Open"
    onClick={openItem}
/>

       <MenuItem
  icon={Pencil}
  label="Rename"
  onClick={() => {
    openModal("rename", {
  item,
  type: menu.type,
});
    closeMenu();
  }}
/>

        {!isFolder && (
<MenuItem
  icon={Share2}
  label="Share"
  onClick={async () => {
    const {shareUrl} = await shareFile(item._id);
    console.log(shareUrl);
    

    openModal("share", {
      fileName: item.name,
      shareUrl:shareUrl ,
    });

    closeMenu();
  }}
/>
        )}

        {!isFolder && (
          <MenuItem
            icon={Star}
           label={
  item.starred
    ? "Remove from Starred"
    : "Add to Starred"
}
            onClick={async () => {
              await toggleStar(item._id);
              closeMenu();
            }}
          />
        )}

        {!isFolder && (
          <MenuItem
            icon={Download}
            label="Download"
            onClick={() => {
              (window.location.href = `https://cloudisk-cloud.up.railway.app/file/${item.id}?action=download`)
              closeMenu();
            }}
          />
        )}

        <MenuItem
          icon={Info}
          label="Properties"
          onClick={() => {
            console.log(item);
            closeMenu();
          }}
        />

        <div className="my-2 border-t border-white/10" />

        <MenuItem
          danger
          icon={Trash2}
          label="Delete"
          onClick={async () => {
            if (isFolder) {
              await removeFolder(item._id);
            } else {
              await removeFile(item._id);
            }

            closeMenu();
          }}
        />
      </motion.div>

    </AnimatePresence>
  );
}