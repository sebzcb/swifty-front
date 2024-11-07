import PropTypes from 'prop-types';
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

// Configurar axios para enviar cookies con cada solicitud
axios.defaults.withCredentials = true;

// Crea el contexto
const UserContext = createContext();

// Componente proveedor del contexto
export const UserContextProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState(null);
    const [userInfoLoading, setUserInfoLoading] = useState(true);

    useEffect(() => {
        const asyncFunction = async () => {
          const endpoint = `${import.meta.env.VITE_BACK_URL}usuario/current-user`
          console.log("end  user context:",endpoint);
          setUserInfoLoading(true);
          axios.get(endpoint)
            .then((res) => {
              console.log("USER CONTEXT:", res);
              const data = res.data;
              setUserInfo(data.currentUser);
              setUserInfoLoading(false);
            })
            .catch((err) => {
              console.error("error en context user :",err);
              setUserInfoLoading(false);
            });
        };
        asyncFunction();
    }, []);

    return (
        <UserContext.Provider value={{ userInfo, userInfoLoading }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => {
    return useContext(UserContext);
};
UserContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};