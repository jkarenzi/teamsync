import { Outlet } from "react-router-dom";
import Header from "../Header"
import MainStudentDrawer from "../sideMenus/MainStudentDrawer"


const Layout = () => {
    return (
        <div className="w-full flex flex-col min-h-screen">
            <Header/>
            <div className="flex-1 flex">
                <MainStudentDrawer/>
                <Outlet/>
            </div>
        </div>
    );
}
 
export default Layout;