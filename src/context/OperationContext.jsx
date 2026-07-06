import {
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

const OperationContext = createContext(null);

export function OperationProvider({ children }) {
  const [operations, setOperations] = useState([]);

  const startOperation = (operation) => {
    const id = crypto.randomUUID();

    setOperations((prev) => [
      ...prev,
      {
        id,
        ...operation,
      },
    ]);

    return id;
  };

  const finishOperation = (id) => {
    setOperations((prev) =>
      prev.filter((op) => op.id !== id)
    );
  };

  const value = useMemo(
    () => ({
      operations,
      startOperation,
      finishOperation,
    }),
    [operations]
  );

  return (
    <OperationContext.Provider value={value}>
      {children}
    </OperationContext.Provider>
  );
}

export function useOperation() {
  return useContext(OperationContext);
}