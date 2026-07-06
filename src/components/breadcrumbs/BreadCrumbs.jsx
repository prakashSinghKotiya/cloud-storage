import { ChevronRight, Home } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDrive } from "../../context/DriveContext";

export default function Breadcrumbs() {
  console.log("Breadcrumbs:");
const {
  breadcrumbs = [],
  navigateToBreadcrumb,
  goHome,
} = useDrive();


const handleNavigate = async (index) => {
  await navigateToBreadcrumb(index);
};

  return (
    <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">

      <button
      onClick={goHome}
        className="
        flex
        items-center
        gap-2
        rounded-xl
        px-3
        py-2
        hover:bg-white/5
        transition
        "
      >
        <Home size={18} />
      </button>

      <AnimatePresence>

        {breadcrumbs.map((crumb, index) => (
          <motion.div
            key={crumb.id}
            initial={{
              opacity: 0,
              x: -10,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            exit={{
              opacity: 0,
            }}
            className="flex items-center"
          >
            <ChevronRight
              size={18}
              className="text-zinc-500"
            />

            <button
              onClick={() => handleNavigate(index)}
              className="
              ml-1
              rounded-xl
              px-3
              py-2
              text-sm
              text-zinc-300
              hover:bg-white/5
              hover:text-white
              transition
              "
            >
              {crumb.name}
            </button>
          </motion.div>
        ))}

      </AnimatePresence>

    </div>
  );
}