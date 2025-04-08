import { IoMdNotificationsOutline } from "react-icons/io";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { logout } from "../redux/actions/authActions";
import { RxHamburgerMenu } from "react-icons/rx";
import { useEffect, useState, useRef } from "react";
import DropDownMenu from "./sideMenus/DropDownMenu";
import ClipLoader from "react-spinners/ClipLoader";
import { Notification } from "../types/Notification";
import { getAllNotifications } from "../redux/actions/notificationActions";
import NotificationBox from './Notification'
import { IoChevronDown } from "react-icons/io5";

const Header = () => {
    const {user, loggingOut} = useAppSelector(state => state.user)
    const {notifications} = useAppSelector(state => state.notification)
    const dispatch = useAppDispatch()
    const [toggleDropDown, setToggleDropDown] = useState(false)
    const [toggleNotifications, setToggleNotifications] = useState(false)
    const [showUserMenu, setShowUserMenu] = useState(false)
    const [unReadNotification, setUnReadNotification] = useState<Notification | undefined>(notifications.find(notification => !notification.read))
    const userMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        dispatch(getAllNotifications())
    },[])

    useEffect(() => {
        setUnReadNotification(notifications.find(notification => !notification.read))
    },[notifications])

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setShowUserMenu(false);
            }
        }
        
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="relative flex items-center justify-between bg-white border-b-[1.5px] border-custom-borderGrey w-full h-16 xs:pl-4 lg:pl-12 pr-4">
            <h2 className="text-lg font-bold">TeamSync</h2>
            <div className="flex items-center gap-8 xs:hidden lg:flex">
                <div className="relative cursor-pointer" onClick={() => setToggleNotifications(true)}>
                    <IoMdNotificationsOutline size={23} color="black"/>
                    {unReadNotification && <div className="absolute top-0 right-[0.2rem] w-[0.4rem] h-[0.4rem] rounded-full bg-red-500 animate-pulse"></div>}
                </div>
                
                {/* User profile with dropdown */}
                <div className="relative" ref={userMenuRef}>
                    <div 
                        className="flex items-center gap-3 cursor-pointer"
                        onClick={() => setShowUserMenu(!showUserMenu)}
                    >
                        <h2 className="text-sm">{user!.fullName}</h2>
                        <img src={user!.profileImg} className="w-8 h-8 rounded-md"/>
                        <IoChevronDown 
                            className={`text-gray-500 transition-transform duration-300 ${showUserMenu ? 'rotate-180' : ''}`} 
                            size={16}
                        />
                    </div>
                    
                    {showUserMenu && (
                        <div className="absolute top-10 right-0 w-40 bg-white border border-custom-borderGrey shadow-all-sides rounded-md animate-fadeIn z-50">
                            <div 
                                className="py-2 w-full flex justify-center cursor-pointer hover:bg-gray-50" 
                                onClick={() => dispatch(logout())}
                            >
                                {loggingOut ? <ClipLoader size={20} color="#586AEA"/> : 'Logout'}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
            <div className="xs:flex lg:hidden items-center gap-8">
                <div className="relative cursor-pointer" onClick={() => setToggleNotifications(true)}>
                    <IoMdNotificationsOutline size={23} color="black"/>
                    {unReadNotification && <div className="absolute top-0 right-[0.2rem] w-[0.4rem] h-[0.4rem] rounded-full bg-red-500"></div>}
                </div>
                <RxHamburgerMenu color="black" size={20} className="cursor-pointer" onClick={() => setToggleDropDown(prev => !prev)}/>
            </div>
            
            {toggleDropDown && <DropDownMenu setToggleDropDown={setToggleDropDown}/>}
            {toggleNotifications && <NotificationBox setToggleNotifications={setToggleNotifications}/>}
        </div>
    );
}
 
export default Header;