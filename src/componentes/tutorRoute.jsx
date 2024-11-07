import { Navigate } from 'react-router-dom';
import { useUserContext } from '../context/UserContext';
import { ROL } from '../constants/rol';

export const TutorRoute = ({ children}) => { //Mientas tanto
	const { userInfo } = useUserContext();
	const usuario = userInfo;
	return usuario && usuario?.rol == ROL.TUTOR ? children : <Navigate to='/login' />;
};