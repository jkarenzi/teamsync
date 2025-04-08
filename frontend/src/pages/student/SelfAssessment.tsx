import { useFormik } from "formik"
import { useEffect } from "react"
import { submitSelfAssessment } from "../../redux/actions/assessmentActions"
import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import { resetStatus } from "../../redux/slices/assessmentSlice"
import { selfAssessmentSchema } from "../../validationSchema/assessmentSchema"
import ClipLoader from "react-spinners/ClipLoader"


const Assessment = () => {
    const {isSideMenuExpanded} = useAppSelector(state => state.appSetting)
    const {group} = useAppSelector(state => state.group)
    const {loading, status, selfAssessmentSubmissionStatus} = useAppSelector(state => state.assessment)
    const dispatch = useAppDispatch()

    const formik = useFormik({
        initialValues:{
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
            dispatch(submitSelfAssessment({
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
        validationSchema: selfAssessmentSchema
    })

    useEffect(() => {
        if(status === 'successful'){
            formik.resetForm()
            dispatch(resetStatus())
        }
    },[status])
    
    return (
        <div className={`flex ${isSideMenuExpanded?'lg:w-[72%]':'lg:w-[87%]'} xs:w-full h-[calc(100vh-4rem)] overflow-y-auto overflow-x-hidden flex-col items-center bg-gradient-to-br from-white to-[rgba(88,106,234,0.08)] relative`}>
            <div className="absolute w-96 h-96 rounded-full bg-custom-blue opacity-5 -top-48 -right-48"></div>
            <div className="absolute w-80 h-80 rounded-full bg-purple-600 opacity-5 bottom-20 -left-40"></div>
            
            <div className="w-[90%] flex xs:flex-col lg:flex-row justify-between xs:items-start lg:items-center bg-white z-10 p-6 rounded-xl shadow-md mt-8">
                <div className="flex flex-col gap-2">
                    <h1 className="font-bold text-lg">Self Assessment</h1>
                    {!selfAssessmentSubmissionStatus && <h2 className="text-sm">You are required to submit a self evaluation of your contributions in this group project</h2>}
                </div>
            </div> 

            {selfAssessmentSubmissionStatus && <div className="w-[90%] flex flex-col items-center self-center gap-12 mt-12 bg-white rounded-xl shadow-md border border-gray-100 py-20 z-10">
                <img src="/completed.png" width={90} height={90}/>
                <h1 className="text-custom-textGrey text-lg text-center">You've already submitted your self assessment for this group project</h1>
            </div>}

            {!selfAssessmentSubmissionStatus && <form className="w-[90%] flex flex-col gap-8 my-12 bg-white shadow-md rounded-xl z-10 p-6 border border-gray-100" onSubmit={formik.handleSubmit}>
                <div className="flex flex-col">
                    <label>Rate your involvement in group discussions.</label>
                    <h2 className="text-custom-textGrey text-sm">(1 = Not involved, 5 = Highly involved)</h2>
                    <input 
                        id="text"
                        type="text" 
                        className={`mt-4 border ${formik.touched.involvement && formik.errors.involvement ? 'border-red-500' : 'border-custom-borderGrey'} outline-none rounded-md w-16 h-8 pl-2 bg-[#f2f2f2]`}
                        {...formik.getFieldProps('involvement')}
                    />
                    {formik.touched.involvement && formik.errors.involvement && (
                        <div className="text-red-500 text-sm">{formik.errors.involvement}</div>
                    )}
                </div>
                <div className="flex flex-col">
                    <label>Rate your ability to complete assigned tasks on time and to a high standard.</label>
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
                <div className="flex flex-col">
                    <label>Rate your ability to collaborate effectively with the team.</label>
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
                <div className="flex flex-col">
                    <label>Rate your initiative and leadership</label>
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
                <div className="flex flex-col">
                    <label>Rate your overall involvement and contribution to the group project.</label>
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
                <div className="flex flex-col">
                    <label>Provide any additional comments about areas you can improve on or areas you excelled at. </label>
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
    );
}
 
export default Assessment;