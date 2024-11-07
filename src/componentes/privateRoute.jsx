import { Navigate } from 'react-router-dom';
import { useUserContext } from '../context/UserContext';

export const PrivateRoute = ({ children}) => { //Mientas tanto
	const { userInfo } = useUserContext();
	return userInfo ? children : <Navigate to='/login' />;
};