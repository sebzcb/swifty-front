import { Navigate, useLocation } from 'react-router-dom';

export const TutorRoute = ({ children}) => { //Mientas tanto
	const usuario = JSON.parse(localStorage.getItem('usuario'));
	return usuario && usuario?.rol == 'tutor' ? children : <Navigate to='/login' />;
};