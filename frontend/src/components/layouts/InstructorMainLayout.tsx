import { Outlet } from "react-router-dom";
import Header from "../Header"
import MainInstructorDrawer from "../sideMenus/MainInstructorDrawer";


const Layout = () => {
    return (
        <div className="w-full flex flex-col min-h-screen">
            <Header/>
            <div className="flex-1 flex">
                <MainInstructorDrawer/>
                <Outlet/>
            </div>
        </div>
    );
}
 
export default Layout;