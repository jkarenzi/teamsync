import {useFormik} from 'formik'
import { Link, useNavigate } from 'react-router-dom';
import { getOwnProfile, login } from '../redux/actions/authActions';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import ClipLoader from "react-spinners/ClipLoader";
import { loginSchema } from '../validationSchema/authSchema';
import { useEffect } from 'react';

const Login = () => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const {isLoggingIn, user, token} = useAppSelector(state => state.user)

    const formik = useFormik({
        initialValues:{
            email: '',
            password: ''
        },
        onSubmit: (formData) => {
            dispatch(login(formData))
        },
        validationSchema: loginSchema
    })

    useEffect(() => {
        if(token){
            dispatch(getOwnProfile())
        }
    },[token])

    useEffect(() => {
        if(!user){
            return
        }

        if(user.role === 'user'){
            navigate('/student')
        }else if(user.role === 'instructor'){
            navigate('/instructor')
        }
    },[user])
    
    return (
        <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-custom-blue to-purple-600 relative overflow-hidden">
            <div className="absolute w-72 h-72 rounded-full bg-white opacity-10 -top-20 -left-20"></div>
            <div className="absolute w-96 h-96 rounded-full bg-white opacity-10 -bottom-32 -right-32"></div>
            <div className="absolute w-60 h-60 rounded-full bg-white opacity-5 bottom-20 left-20"></div>
            <div className="absolute top-8 left-8 cursor-pointer" onClick={() => navigate('/')}>
                <h1 className="text-2xl font-bold text-white">TeamSync</h1>
            </div>
            <form 
                onSubmit={formik.handleSubmit} 
                className="flex flex-col rounded-xl xs:w-[90%] md:w-[28rem] py-10 xs:px-6 lg:px-8 items-center bg-white shadow-2xl z-10 relative"
            >
                <h1 className="text-3xl font-bold text-custom-blue mb-2">Welcome back</h1>
                <p className="text-gray-500 mb-8 text-center">Sign in to your TeamSync account</p>
                
                <div className="flex flex-col gap-2 w-full mt-2">
                    <label className="font-medium text-gray-700">Email</label>
                    <input 
                        type="email" 
                        placeholder="Enter your email here" 
                        className={`border ${formik.touched.email && formik.errors.email 
                            ? 'border-red-500 focus:ring-red-200' 
                            : 'border-gray-300 focus:ring-blue-200'} 
                            outline-none rounded-md w-full py-3 px-4 bg-gray-50 focus:bg-white
                            transition-all duration-200 focus:ring-4 focus:border-custom-blue`}
                        {...formik.getFieldProps('email')}
                    />
                    {formik.touched.email && formik.errors.email && 
                        <div className="text-red-500 text-sm">{formik.errors.email}</div>
                    }
                </div>
                <div className="flex flex-col gap-2 w-full mt-6">
                    <div className="flex justify-between items-center">
                        <label className="font-medium text-gray-700">Password</label>
                        {/* <Link to="/forgot-password" className="text-sm text-custom-blue hover:underline">
                            Forgot password?
                        </Link> */}
                    </div>
                    <input 
                        type="password" 
                        placeholder="Enter your password here"
                        className={`border ${formik.touched.password && formik.errors.password 
                            ? 'border-red-500 focus:ring-red-200' 
                            : 'border-gray-300 focus:ring-blue-200'} 
                            outline-none rounded-md w-full py-3 px-4 bg-gray-50 focus:bg-white
                            transition-all duration-200 focus:ring-4 focus:border-custom-blue`}
                        {...formik.getFieldProps('password')}
                    />
                    {formik.touched.password && formik.errors.password && 
                        <div className="text-red-500 text-sm">{formik.errors.password}</div>
                    }
                </div>
                {/* <div className="flex items-center w-full mt-4">
                    <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 text-custom-blue focus:ring-custom-blue border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                        Remember me
                    </label>
                </div> */} 
                <button 
                    type="submit" 
                    className="flex items-center justify-center w-full h-12 bg-gradient-to-r from-custom-blue to-indigo-600 hover:from-custom-blue hover:to-indigo-700 text-white rounded-md mt-8 font-medium shadow-lg transition-all duration-200 hover:shadow-xl"
                >
                    {isLoggingIn ? <ClipLoader size={24} color="white"/> : "Sign In"}
                </button>
                <p className="text-gray-600 mt-8">
                    Don't have an account? {" "}
                    <Link to="/signup" className="text-custom-blue hover:underline font-medium">
                        Sign up
                    </Link>
                </p>
            </form>
        </div>
    );
}
 
export default Login;