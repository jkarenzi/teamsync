import { Link, useLocation } from "react-router-dom";
import { HiOutlineFolder } from "react-icons/hi2";
import { IoSettingsOutline } from "react-icons/io5";
import { AiOutlineHome } from "react-icons/ai";
import { RiBookMarkedLine } from "react-icons/ri";


const Drawer = () => {
    const location = useLocation()
    return (
        <div className="xs:hidden lg:flex flex-col gap-8 w-[8%] border-r-[1.5px] border-custom-borderGrey">
            <Link 
                to={`/instructor`}
                className="flex flex-col items-center gap-1 mt-8"
                >
                <div className={`p-3 rounded-lg ${location.pathname === `/instructor` ? 'bg-gradient-to-r from-custom-blue to-indigo-600 hover:from-custom-blue hover:to-indigo-700':'hover:bg-[#f2f2f2]'}`}>
                    <AiOutlineHome size={20} color={location.pathname === `/instructor` ? 'white': 'black'}/>
                </div>    
                <h2 className="text-xs">Home</h2>
            </Link>
            <Link 
                to={`/instructor/classes`}
                className="flex flex-col items-center gap-1"
                >
                <div className={`p-3 rounded-lg ${location.pathname === `/instructor/classes` ? 'bg-gradient-to-r from-custom-blue to-indigo-600 hover:from-custom-blue hover:to-indigo-700':'hover:bg-[#f2f2f2]'}`}>
                    <RiBookMarkedLine size={20} color={location.pathname === `/instructor/classes` ? 'white': 'black'}/>
                </div>    
                <h2 className="text-xs">Classes</h2>
            </Link>
            <Link 
                to={`/instructor/assignments`}
                className="flex flex-col items-center gap-1"
                >
                <div className={`p-3 rounded-lg ${location.pathname === `/instructor/assignments` ? 'bg-gradient-to-r from-custom-blue to-indigo-600 hover:from-custom-blue hover:to-indigo-700':'hover:bg-[#f2f2f2]'}`}>
                    <HiOutlineFolder size={20} color={location.pathname === `/instructor/assignments` ? 'white': 'black'}/>
                </div>    
                <h2 className="text-xs">Assignments</h2>
            </Link>
            <Link 
                to={`/instructor/settings`}
                className="flex flex-col items-center gap-1"
                >
                <div className={`p-3 rounded-lg ${location.pathname === `/instructor/settings` ? 'bg-gradient-to-r from-custom-blue to-indigo-600 hover:from-custom-blue hover:to-indigo-700':'hover:bg-[#f2f2f2]'}`}>
                    <IoSettingsOutline size={20} color={location.pathname === `/instructor/settings` ? 'white': 'black'}/>
                </div>    
                <h2 className="text-xs">Settings</h2>
            </Link>
        </div>
    );
}
 
export default Drawer;