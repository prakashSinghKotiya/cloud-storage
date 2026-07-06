import { createContext, useContext, useMemo, useState } from "react";

const UIContext = createContext(null);

export function UIProvider({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null);

  const openModal = (name, payload = null) => {
    setActiveModal({ name, payload });
    console.log("openModal", name, payload);
  };

  const closeModal = () => setActiveModal(null);

  const value = useMemo(
    () => ({
      sidebarOpen,
      setSidebarOpen,
      activeModal,
      openModal,
      closeModal,
    }),
    [sidebarOpen, activeModal]
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUIContext() {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error("useUIContext must be used within UIProvider");
  }
  return context;
}