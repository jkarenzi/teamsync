import { Outlet, useNavigate, useParams } from "react-router-dom";
import Drawer from "../sideMenus/StudentDrawer"
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { useEffect } from "react";
import { getOwnAssignments } from "../../redux/actions/assignmentActions";
import { getOwnGroup } from "../../redux/actions/groupActions";
import { resetFetchGroupStatus, resetGroup } from "../../redux/slices/groupSlice";
import Pusher from "pusher-js";
import { Message } from "../../types/Message";
import { addMessage, resetMessages, setOnlineUsers } from "../../redux/slices/messageSlice";
import { IMembersObject } from "../../types/authFormData";
import { resetAssessment } from "../../redux/slices/assessmentSlice";
import { resetTasks } from "../../redux/slices/taskSlice";
import { clearReportData } from "../../redux/slices/reportSlice";


const pusherCluster = import.meta.env.VITE_PUSHER_CLUSTER
const pusherKey = import.meta.env.VITE_PUSHER_KEY
const baseUrl = import.meta.env.VITE_BASE_URL

const Layout = () => {
    const {projectId} = useParams()
    const dispatch = useAppDispatch()
    const {group, fetchGroupStatus} = useAppSelector(state => state.group)
    const {user, token} = useAppSelector(state => state.user)
    //const {onlineUsers} = useAppSelector(state => state.message)
    const navigate = useNavigate()
    
    useEffect(() => {
        if(projectId){
            dispatch(getOwnGroup(projectId))
            dispatch(getOwnAssignments())
        }

        return () => {
            dispatch(resetGroup())
            dispatch(resetAssessment())
            dispatch(resetMessages())
            dispatch(resetTasks())
            dispatch(clearReportData())
        }
    },[])

    useEffect(() => {
        if(!group && fetchGroupStatus === 'complete'){
            dispatch(resetFetchGroupStatus())
            navigate('/student/projects')
            return
        }

        if(group && fetchGroupStatus === 'complete'){
            dispatch(resetFetchGroupStatus())
        }
    },[fetchGroupStatus])

    useEffect(() => {
        if(!group){
            return
        }

        const pusher = new Pusher(pusherKey, {
            cluster: pusherCluster,
            channelAuthorization:{
                transport: "ajax",
                endpoint: `${baseUrl}/auth/pusher`,
                headers:{
                    Authorization: `Bearer ${token}`
                }
            }
        });

        const channel = pusher.subscribe(`presence-chat-${group.id}`)
        channel.bind("new-message", (message: Message) => {
            if(message.sender.id !== user!.id){
                dispatch(addMessage(message))
            }   
        })

        channel.bind("pusher:subscription_succeeded", (members: IMembersObject) => {
            console.log(members.members)
            dispatch(setOnlineUsers(members.members))
        })
    
        
        // channel.bind("pusher:member_added", (member:any) => {
        //     console.log(channel)
            
        //     if(onlineUsers){
        //         dispatch(setOnlineUsers({...onlineUsers, [member.id] : {name: member.info.name}}))
        //     }else{
        //         dispatch(setOnlineUsers({[member.id] : {name: member.info.name}}))
        //     }   
        // })
    
        
        // channel.bind("pusher:member_removed", (member:any) => {
        //     console.log(channel)
        //     const newObj:IMembers = {}
        //     for(const key in onlineUsers){
        //         if(key !== member.id){
        //             newObj[key] = onlineUsers[key]
        //         }
        //     }
            
        //     dispatch(setOnlineUsers(newObj))
        // })

        return () => {
            if (channel) {
                channel.unbind_all()
                channel.unsubscribe();
            }
        }
    },[group])

    return (
        <>
            <Drawer/>
            <Outlet/>   
        </>          
    );
}
 
export default Layout;