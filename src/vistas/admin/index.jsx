import { ROL } from "../../constants/rol";
import SidebarDrawer from "../../utils/SidebarDrawer";
import { Outlet } from "react-router-dom";

const AdminIndex = () => {
    const user = JSON.parse(localStorage.getItem('usuario'));
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