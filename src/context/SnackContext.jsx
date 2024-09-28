import { createContext, useContext, useState } from "react";

// Crea el contexto
const SnackContext = createContext();

// Componente proveedor del contexto
export const SnackContextProvider = ({ children }) => {
  const [snackInfo, setSnackInfo] = useState({
    message: "",
    severity: "success",
    isOpen: false,
  });

  const openSnack = (message, severity) => {
    setSnackInfo({
      message,
      severity,
      isOpen: true,
    });

    setTimeout(() => {
      setSnackInfo((prevSnackInfo) => ({
        ...prevSnackInfo,
        isOpen: false,
      }));
    }, 3000);
  };

  const closeSnack = () => {
    setSnackInfo((prevSnackInfo) => ({
      ...prevSnackInfo,
      isOpen: false,
    }));
  };

  return (
    <SnackContext.Provider value={{ snackInfo, openSnack, closeSnack }}>
      {children}
    </SnackContext.Provider>
  );
};

// Función personalizada para acceder al contexto
export const useSnackContext = () => {
  return useContext(SnackContext);
};
