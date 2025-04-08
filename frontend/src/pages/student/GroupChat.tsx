import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { BsSend } from "react-icons/bs";
import { getGroupMessages, sendMessage } from "../../redux/actions/messageActions";
import { addMessageToTempStorage } from "../../redux/slices/messageSlice";
import moment from "moment-timezone";


const GroupChat = () => {
    const {isSideMenuExpanded} = useAppSelector(state => state.appSetting)
    const {messages, onlineUsers} = useAppSelector(state => state.message)
    const {group} = useAppSelector(state => state.group)
    const {user} = useAppSelector(state => state.user)
    const dispatch = useAppDispatch()
    const [newMessage, setNewMessage] = useState("")
    const chatContainerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    },[messages]);

    useEffect(() => {
        if(group){
            dispatch(getGroupMessages(group.id))
        }
    },[group])

    const handleSend = () => {
        if(!newMessage.trim()){
            return
        }

        dispatch(addMessageToTempStorage({
            id: crypto.randomUUID(),
            content: newMessage,
            sender: user!,
            createdAt: moment().format("MMM D, [at] h:mm A")
        }))

        if(group){
            dispatch(sendMessage({
                groupId: group.id,
                content: newMessage
            }))
        }

        setNewMessage("")
    }

    const handleKeyDown = (e:React.KeyboardEvent<HTMLInputElement>) => {
        if(!newMessage){
            return
        }

        if(e.key !== 'Enter'){
            return
        }

        dispatch(addMessageToTempStorage({
            id: crypto.randomUUID(),
            content: newMessage,
            sender: user!,
            createdAt: moment().format("MMM D, [at] h:mm A")
        }))

        if(group){
            dispatch(sendMessage({
                groupId: group.id,
                content: newMessage
            }))
        }

        setNewMessage("")
    }

    return (
        <div className={`flex ${isSideMenuExpanded?'lg:w-[72%]':'lg:w-[87%]'} xs:w-full h-[calc(100vh-4rem)] flex-col`}>
            <div className="w-full flex flex-col py-4 items-center">
                <div className="xs:w-[90%] lg:w-[95%] flex flex-col gap-2">
                    <h2 className="text-custom-textBlack text-lg font-semibold">{group?.name}</h2>
                    <div className="flex items-center gap-6">
                        {group?.users?.map(user => <div className="flex items-center gap-2">
                            <h2 className="text-custom-textGrey text-sm font-medium">{user.fullName.split(" ")[0]}</h2>
                            {onlineUsers && Object.keys(onlineUsers).includes(user.id) && <div className="w-[0.4rem] h-[0.4rem] bg-green-600 rounded-full"></div>}
                        </div>)}
                    </div>
                </div>  
            </div>
            <div className="relative w-full h-[80%] bg-[#f2f2f2] overflow-y-auto overflow-x-hidden flex flex-col gap-4 items-end xs:px-6 lg:px-8 py-12 noscroll" ref={chatContainerRef}>
                <div className="absolute w-96 h-96 rounded-full bg-custom-blue opacity-5 -top-48 -right-48"></div>
                <div className="absolute w-80 h-80 rounded-full bg-purple-600 opacity-5 bottom-20 -left-40"></div>
                {messages.map(message => (
                    <div className={`flex gap-4 ${message.sender.id !== user!.id ? 'self-start':'self-end'} max-w-[70%]`}>
                        {message.sender.id !== user!.id && <div className="w-10 h-10 overflow-hidden rounded-full">
                            <img src={message.sender.profileImg} className="w-full h-full object-cover"/>
                        </div>}
                        <div className={`flex flex-col gap-1`}>
                            <h3 className="text-custom-textGrey text-xs"><span className={`${message.sender.id !== user!.id ? 'inline':'hidden'} font-bold text-custom-textBlack mr-3`}>{message.sender.fullName.split(" ")[0]}</span>{message.createdAt}</h3>
                            <div className={`flex ${message.sender.id !== user!.id ? 'bg-white text-gray-800 shadow-sm rounded-tl-none self-start':'bg-gradient-to-r from-custom-blue to-indigo-600 hover:from-custom-blue hover:to-indigo-700 text-white self-end rounded-tr-none'} rounded-xl px-4 py-2`}>
                                <h2 className="text-sm">{message.content}</h2>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="w-full flex justify-center py-4">
                <div className="w-[95%] flex items-center justify-between">
                    <input 
                        type="text" 
                        value={newMessage} 
                        className="px-2 xs:w-[85%] lg:w-[93%] h-12 outline-none  rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-custom-blue transition-all" 
                        placeholder="Type a message..." 
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <button 
                        className={`w-12 h-12 flex items-center justify-center rounded-full shadow-md ${
                            newMessage.trim() 
                            ? 'bg-gradient-to-r from-custom-blue to-indigo-600 hover:from-custom-blue hover:to-indigo-700' 
                            : 'bg-gray-200 cursor-not-allowed'
                        } transition-all`}
                        onClick={handleSend}
                        disabled={!newMessage.trim()}
                    >
                        <BsSend size={18} color={newMessage.trim() ? "white" : "#999"} />
                    </button>
                </div>
            </div>
        </div>
    );
}
 
export default GroupChat;