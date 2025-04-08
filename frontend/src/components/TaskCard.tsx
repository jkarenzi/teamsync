import { Task } from '../types/Task'
import { HiOutlineDotsVertical } from 'react-icons/hi'
import { MdOutlineDateRange } from 'react-icons/md'
import { useAppSelector } from '../redux/hooks'
import { formatDate, getPriorityClass, getUserInitials } from '../utils/taskUtils'
import { Draggable } from 'react-beautiful-dnd'
import { useEffect, useRef } from 'react'

interface IProps {
    task: Task
    toggleMenu: {state:boolean,id:string}
    setToggleMenu: React.Dispatch<React.SetStateAction<{state:boolean,id:string}>>
    setViewTask: React.Dispatch<React.SetStateAction<Task | null>>
    setSelectedTask: React.Dispatch<React.SetStateAction<Task | null>>
    setToggleDeleteOverlay: React.Dispatch<React.SetStateAction<{state:boolean,id:string, name:string}>>
    index: number
}

const TaskCard = ({task, toggleMenu, setToggleMenu, setViewTask, setSelectedTask, setToggleDeleteOverlay, index}:IProps) => {
    const {user} = useAppSelector(state => state.user)

    const menuRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setToggleMenu({state:false, id:''})
            }
        };

        if (toggleMenu.state) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [toggleMenu])


    return (
        <Draggable key={task.id} draggableId={task.id} index={index}>
            {(provided) => (
                <div 
                    className="relative group w-full flex flex-col bg-white rounded-md px-3 py-4 gap-4 border border-custom-borderGrey hover:border-custom-blue"
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    >
                    <button className={`rounded-full ${getPriorityClass(task.priorityLevel)} text-xs px-3 h-6 self-start`}>
                        {task.priorityLevel} priority
                    </button>
                    <h2>{task.description}</h2>
                    <div className="w-full flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <MdOutlineDateRange color="#64748b" size={20}/>
                            <h2 className="text-custom-textGrey text-sm">{formatDate(task.dueDate,"MMM DD")}</h2>
                        </div>
                        <div className="rounded-full w-7 h-7 bg-custom-blue flex items-center justify-center text-white text-xs">
                            {getUserInitials(task.user.fullName)}
                        </div>
                    </div>
                    <div className="absolute w-full h-full top-0 left-0 right-0 bottom-0 flex justify-end pr-2 pt-3 opacity-0 group-hover:opacity-100">
                        <HiOutlineDotsVertical className="cursor-pointer" color='black' size={20} onClick={() => setToggleMenu((prev) => ({state:!prev.state, id: task.id}))}/>
                    </div>
                    {toggleMenu.id === task.id && toggleMenu.state && <div ref={menuRef} className="absolute top-12 right-0 flex flex-col items-center bg-custom-blue rounded-lg w-32 gap-1 z-10 py-2">
                        <div className="w-[90%] p-2 text-white hover:bg-white hover:text-custom-blue rounded-md cursor-pointer text-sm" onClick={() => setViewTask(task)}>View</div>
                        {task.user.id === user!.id && <div className="w-[90%] p-2 text-white hover:bg-white hover:text-custom-blue rounded-md cursor-pointer text-sm" onClick={() => setSelectedTask(task)}>Edit</div>}
                        {task.user.id === user!.id && <div className="w-[90%] p-2 text-white hover:bg-white hover:text-custom-blue rounded-md cursor-pointer text-sm" onClick={() => setToggleDeleteOverlay({state:true, name:task.description, id: task.id})}>Delete</div>}
                    </div>}
                </div>
            )}
            
        </Draggable>
    );
}
 
export default TaskCard;