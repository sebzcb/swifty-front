import { ROL } from "../../constants/rol";
import { useUserContext } from "../../context/UserContext";
import SidebarDrawer from "../../utils/SidebarDrawer";
import { Outlet } from "react-router-dom";

const AdminIndex = () => {
    const { userInfo } = useUserContext();
    const user = userInfo;
    console.log(user);
    if (user === null || user.rol !== ROL.ADMINISTRADOR) {
        console.log('No es administrador');
        window.location.href = '/';
        return;
    }
    return (
        <>
            <SidebarDrawer>
                <Outlet />
            </SidebarDrawer>
        </>
    )
}
export default AdminIndex;