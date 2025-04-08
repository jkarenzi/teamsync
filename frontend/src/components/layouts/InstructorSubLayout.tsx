import { Outlet } from "react-router-dom";
import Drawer from "../sideMenus/InstructorDrawer"


const Layout = () => {
    return (
        <>
            <Drawer/>
            <Outlet/>   
        </>          
    );
}
 
export default Layout;