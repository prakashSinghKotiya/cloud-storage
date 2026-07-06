import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

const ContextMenuContext = createContext(null);

export function ContextMenuProvider({ children }) {
  const [menu, setMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    item: null,
    type: null, // file | folder
  });

  const openMenu = useCallback((event, item, type) => {
    event.preventDefault();
    event.stopPropagation();

const menuWidth = 240;
const menuHeight = 390;
const padding = 16;

let x = event.clientX;
let y = event.clientY;

if (x + menuWidth > window.innerWidth - padding) {
  x = window.innerWidth - menuWidth - padding;
}

if (y + menuHeight > window.innerHeight - padding) {
  y = window.innerHeight - menuHeight - padding;
}

x = Math.max(padding, x);
y = Math.max(padding, y);

    setMenu({
      visible: true,
      x,
      y,
      item,
      type,
    });
  }, []);

  const closeMenu = useCallback(() => {
    setMenu((prev) => ({
      ...prev,
      visible: false,
    }));
  }, []);

  const value = useMemo(
    () => ({
      menu,
      openMenu,
      closeMenu,
    }),
    [menu, openMenu, closeMenu]
  );

  return (
    <ContextMenuContext.Provider value={value}>
      {children}
    </ContextMenuContext.Provider>
  );
}

export function useContextMenu() {
  const context = useContext(ContextMenuContext);

  if (!context) {
    throw new Error(
      "useContextMenu must be used inside ContextMenuProvider"
    );
  }

  return context;
}