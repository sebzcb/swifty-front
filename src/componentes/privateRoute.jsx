import { Navigate, useLocation } from 'react-router-dom';

export const PrivateRoute = ({ children}) => { //Mientas tanto
	const location = useLocation();
	const usuario = localStorage.getItem('usuario');

	return usuario ? children : <Navigate to='/login' />;
};