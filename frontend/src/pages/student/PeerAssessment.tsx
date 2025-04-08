import { useFormik } from "formik"
import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import { submitPeerAssessment } from "../../redux/actions/assessmentActions"
import { peerAssessmentSchema } from "../../validationSchema/assessmentSchema"
import ClipLoader from "react-spinners/ClipLoader"
import { useEffect } from "react"
import { resetStatus } from "../../redux/slices/assessmentSlice"


const Assessment = () => {
    const {isSideMenuExpanded} = useAppSelector(state => state.appSetting)
    const {group} = useAppSelector(state => state.group)
    const {user} = useAppSelector(state => state.user)
    const {loading, status, totalPeerAssessments, unAssessedUsers} = useAppSelector(state => state.assessment)
    const dispatch = useAppDispatch()

    const formik = useFormik({
        initialValues:{
            receiverId: '', 
            groupId: group?.id, 
            involvement: '', 
            completion: '', 
            collaboration: '', 
            leadership: '', 
            overallContribution: '', 
            feedback:''
        },
        onSubmit: (formData) => {
            console.log(formData)
            dispatch(submitPeerAssessment({
                ...formData,
                involvement: parseInt(formData.involvement), 
                completion: parseInt(formData.completion), 
                collaboration: parseInt(formData.collaboration), 
                leadership: parseInt(formData.leadership), 
                overallContribution: parseInt(formData.overallContribution),
                groupId: formData.groupId as string
            }))
        },
        enableReinitialize: true,
        validationSchema: peerAssessmentSchema
    })

    useEffect(() => {
        if(status === 'successful'){
            formik.resetForm()
            dispatch(resetStatus())
        }
    },[status])

    return (
        <div className={`flex ${isSideMenuExpanded ? 'lg:w-[72%]':'lg:w-[87%]'} xs:w-full h-[calc(100vh-4rem)] overflow-y-auto overflow-x-hidden flex-col items-center bg-gradient-to-br from-white to-[rgba(88,106,234,0.08)] relative`}>
            <div className="absolute w-96 h-96 rounded-full bg-custom-blue opacity-5 -top-48 -right-48"></div>
            <div className="absolute w-80 h-80 rounded-full bg-purple-600 opacity-5 bottom-20 -left-40"></div>

            <div className="w-[90%] flex xs:flex-col lg:flex-row justify-between xs:items-start lg:items-center bg-white z-10 p-6 rounded-xl shadow-md mt-8 xs:gap-4 lg:gap-0">
                <div className="flex flex-col gap-2">
                    <h1 className="font-bold text-lg">{group?.name} Peer Assessment</h1>
                    {totalPeerAssessments !== (group?.users?.length && group?.users?.length - 1) && <h2 className="text-sm">You are required to submit peer evaluations for each of your group members</h2>}
                </div>
                {totalPeerAssessments !== (group?.users?.length && group?.users?.length - 1) && <div className="flex items-center text-custom-blue">
                    <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h2 className="text-custom-blue text-sm">{totalPeerAssessments}/{group?.users?.length && group?.users?.length - 1} peer evaluations submitted</h2>
                </div>}
            </div> 

            {totalPeerAssessments === (group?.users?.length && group?.users?.length - 1) && <div className="w-[90%] flex flex-col items-center self-center gap-12 mt-12 bg-white rounded-xl shadow-md border border-gray-100 py-20 z-10">
                <img src="/completed.png" width={90} height={90}/>
                <h1 className="text-custom-textGrey text-lg text-center">You've already submitted peer assessments for all group members</h1>
            </div>}
            
            {totalPeerAssessments !== (group?.users?.length && group?.users?.length - 1) && <form className="w-[90%] flex flex-col gap-8 my-12 bg-white shadow-md rounded-xl z-10 p-6 border border-gray-100" onSubmit={formik.handleSubmit}>
                {/* Receiver Selection */}
                <div className="flex flex-col gap-2">
                    <label>Select one of your group members to start the peer evaluation</label>
                    <select 
                        className={`border ${formik.touched.receiverId && formik.errors.receiverId ? 'border-red-500' : 'border-custom-borderGrey'} outline-none rounded-md w-48 h-10 bg-[#f2f2f2] text-sm`}
                        {...formik.getFieldProps('receiverId')}
                    >
                        <option defaultChecked value=''>Select group member</option>
                        {unAssessedUsers.map(member => {
                            if(member.id !== user!.id){
                                return <option key={member.id} value={member.id}>{member.name}</option>
                            }
                        })}
                    </select>
                    {formik.touched.receiverId && formik.errors.receiverId && (
                        <div className="text-red-500 text-sm">{formik.errors.receiverId}</div>
                    )}
                </div>

                {/* Involvement */}
                <div className="flex flex-col">
                    <label>Rate your peer’s involvement in group discussions.</label>
                    <h2 className="text-custom-textGrey text-sm">(1 = Not involved, 5 = Highly involved)</h2>
                    <input 
                        type="text"
                        className={`mt-4 border ${formik.touched.involvement && formik.errors.involvement ? 'border-red-500' : 'border-custom-borderGrey'} outline-none rounded-md w-16 h-8 pl-2 bg-[#f2f2f2]`}
                        {...formik.getFieldProps('involvement')}
                    />
                    {formik.touched.involvement && formik.errors.involvement && (
                        <div className="text-red-500 text-sm">{formik.errors.involvement}</div>
                    )}
                </div>

                {/* Completion */}
                <div className="flex flex-col">
                    <label>Rate your peer's ability to complete assigned tasks on time and to a high standard.</label>
                    <h2 className="text-custom-textGrey text-sm">(1 = Rarely meets expectations, 5 = Always meets expectations)</h2>
                    <input 
                        type="text"
                        className={`mt-4 border ${formik.touched.completion && formik.errors.completion ? 'border-red-500' : 'border-custom-borderGrey'} outline-none rounded-md w-16 h-8 pl-2 bg-[#f2f2f2]`}
                        {...formik.getFieldProps('completion')}
                    />
                    {formik.touched.completion && formik.errors.completion && (
                        <div className="text-red-500 text-sm">{formik.errors.completion}</div>
                    )}
                </div>

                {/* Collaboration */}
                <div className="flex flex-col">
                    <label>Rate your peer’s ability to collaborate effectively with the team.</label>
                    <h2 className="text-custom-textGrey text-sm">(1 = Poor collaborator, 5 = Excellent collaborator)</h2>
                    <input 
                        type="text"
                        className={`mt-4 border ${formik.touched.collaboration && formik.errors.collaboration ? 'border-red-500' : 'border-custom-borderGrey'} outline-none rounded-md w-16 h-8 pl-2 bg-[#f2f2f2]`}
                        {...formik.getFieldProps('collaboration')}
                    />
                    {formik.touched.collaboration && formik.errors.collaboration && (
                        <div className="text-red-500 text-sm">{formik.errors.collaboration}</div>
                    )}
                </div>

                {/* Leadership */}
                <div className="flex flex-col">
                    <label>Rate your peer's initiative and leadership</label>
                    <h2 className="text-custom-textGrey text-sm">(1 = No initiative, 5 = Highly proactive/demonstrated leadership)</h2>
                    <input 
                        type="text"
                        className={`mt-4 border ${formik.touched.leadership && formik.errors.leadership ? 'border-red-500' : 'border-custom-borderGrey'} outline-none rounded-md w-16 h-8 pl-2 bg-[#f2f2f2]`}
                        {...formik.getFieldProps('leadership')}
                    />
                    {formik.touched.leadership && formik.errors.leadership && (
                        <div className="text-red-500 text-sm">{formik.errors.leadership}</div>
                    )}
                </div>

                {/* Overall Contribution */}
                <div className="flex flex-col">
                    <label>Rate your peer’s overall involvement and contribution to the group project.</label>
                    <h2 className="text-custom-textGrey text-sm">(1 = Minimal involvement, 5 = Highly involved)</h2>
                    <input 
                        type="text"
                        className={`mt-4 border ${formik.touched.overallContribution && formik.errors.overallContribution ? 'border-red-500' : 'border-custom-borderGrey'} outline-none rounded-md w-16 h-8 pl-2 bg-[#f2f2f2]`}
                        {...formik.getFieldProps('overallContribution')}
                    />
                    {formik.touched.overallContribution && formik.errors.overallContribution && (
                        <div className="text-red-500 text-sm">{formik.errors.overallContribution}</div>
                    )}
                </div>

                {/* Feedback */}
                <div className="flex flex-col">
                    <label>Provide any additional comments or suggestions for your peer to improve their involvement or areas where they excelled.</label>
                    <textarea
                        className={`mt-4 border ${formik.touched.feedback && formik.errors.feedback ? 'border-red-500' : 'border-custom-borderGrey'} outline-none rounded-md xs:w-full lg:w-80 h-40 p-2 bg-[#f2f2f2] resize-none`}
                        {...formik.getFieldProps('feedback')}
                    />
                    {formik.touched.feedback && formik.errors.feedback && (
                        <div className="text-red-500 text-sm">{formik.errors.feedback}</div>
                    )}
                </div>
                <button type='submit' className='flex items-center justify-center w-60 h-10 bg-gradient-to-r from-custom-blue to-indigo-600 hover:from-custom-blue hover:to-indigo-700 text-white rounded-md mt-10'>{loading ? <ClipLoader size={24} color='white'/> :'Submit'}</button>
            </form>}
        </div>
    )
}
 
export default Assessment;