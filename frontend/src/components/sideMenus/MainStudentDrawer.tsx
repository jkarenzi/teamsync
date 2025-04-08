import { Link, useLocation } from "react-router-dom";
import { HiOutlineFolder } from "react-icons/hi2";
import { IoSettingsOutline } from "react-icons/io5";
import { AiOutlineHome } from "react-icons/ai";


const Drawer = () => {
    const location = useLocation()
    return (
        <div className="xs:hidden lg:flex flex-col gap-8 w-[8%] border-r-[1.5px] border-custom-borderGrey">
            <Link 
                to={`/student`}
                className="flex flex-col items-center gap-1 mt-8"
                >
                <div className={`p-3 rounded-lg ${location.pathname === `/student` ? 'bg-gradient-to-r from-custom-blue to-indigo-600 hover:from-custom-blue hover:to-indigo-700':'hover:bg-[#f2f2f2]'}`}>
                    <AiOutlineHome size={20} color={location.pathname === `/student` ? 'white': 'black'}/>
                </div>    
                <h2 className="text-xs">Home</h2>
            </Link>
            <Link 
                to={`/student/projects`}
                className="flex flex-col items-center gap-1"
                >
                <div className={`p-3 rounded-lg ${location.pathname === `/student/projects` ? 'bg-gradient-to-r from-custom-blue to-indigo-600 hover:from-custom-blue hover:to-indigo-700':'hover:bg-[#f2f2f2]'}`}>
                    <HiOutlineFolder size={20} color={location.pathname === `/student/projects` ? 'white': 'black'}/>
                </div>    
                <h2 className="text-xs">Assignments</h2>
            </Link>
            <Link 
                to={`/student/settings`}
                className="flex flex-col items-center gap-1"
                >
                <div className={`p-3 rounded-lg ${location.pathname === `/student/settings` ? 'bg-gradient-to-r from-custom-blue to-indigo-600 hover:from-custom-blue hover:to-indigo-700':'hover:bg-[#f2f2f2]'}`}>
                    <IoSettingsOutline size={20} color={location.pathname === `/student/settings` ? 'white': 'black'}/>
                </div>    
                <h2 className="text-xs">Settings</h2>
            </Link>
        </div>
    );
}
 
export default Drawer;