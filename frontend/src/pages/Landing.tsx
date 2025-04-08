import { useNavigate } from "react-router-dom";
import ChooseSwiper from "../components/ChooseSwiper";

const Landing = () => {
    const navigate = useNavigate()
    return (
        <div className="w-full flex flex-col items-center min-h-screen">
            <header className="w-full py-6 flex items-center justify-between px-8 shadow-sm bg-white sticky top-0 z-10">
                <h1 className="text-2xl font-bold text-custom-blue">TeamSync</h1>
                <div className="flex items-center gap-4">
                    <button className="px-4 py-2 hover:bg-gray-100 rounded-md transition-all" onClick={() => navigate('/login')}>Login</button>
                    <button className="px-6 py-2 flex items-center justify-center bg-custom-blue text-white rounded-md hover:bg-blue-700 transition-all shadow-md" onClick={() => navigate('/signup')}>Get Started</button>
                </div>
            </header>
            
            <div className="w-full flex flex-col items-center justify-center gap-8 h-[calc(100vh-5rem)] bg-gradient-to-br from-custom-blue to-purple-600 relative overflow-hidden">
                <div className="absolute w-72 h-72 rounded-full bg-white opacity-10 -top-20 -left-20"></div>
                <div className="absolute w-96 h-96 rounded-full bg-white opacity-10 -bottom-32 -right-32"></div>
                <div className="absolute w-60 h-60 rounded-full bg-white opacity-5 bottom-20 left-20 animate-pulse"></div>
                
                <div className="flex flex-col items-center gap-8 animate-fadeIn relative z-1 px-4 md:px-0">
                    <h1 className="xs:text-3xl lg:text-6xl font-bold text-center text-white">Welcome to <span className="text-white">TeamSync</span></h1>
                    <h2 className="xs:text-xl lg:text-3xl text-center text-white font-light">Collaborate Better, Contribute Fairly</h2>
                    <h2 className="max-w-[80%] text-center text-white text-opacity-90 lg:max-w-2xl">Group projects should inspire teamwork, not frustration. TeamSync is here to ensure fairness, accountability, and collaboration in every project.</h2>
                    <button className="mt-8 px-10 py-4 flex items-center justify-center bg-white text-custom-blue rounded-md hover:bg-gray-100 transition-all text-lg font-bold shadow-xl" onClick={() => navigate('/signup')}>
                        Start for Free
                    </button>
                </div>
            </div>
            
            <div className="w-full bg-white py-24">
                <div className="xs:w-[85%] lg:w-[90%] mx-auto flex flex-col items-center gap-16">
                    <div className="text-center">
                        <h1 className="text-custom-textBlack text-4xl font-bold mb-6">Why Choose TeamSync</h1>
                        <p className="xs:text-justify lg:text-center font-medium xs:w-full lg:w-[70%] mx-auto text-gray-600 text-lg">
                            Managing group contributions and collaboration can be challenging, but our system makes it simple,
                            transparent, and efficient. With real-time tracking, automated reporting, and seamless communication
                            tools, we ensure every member stays informed and engaged.
                        </p>
                    </div>
                    
                    <div className="flex w-full mt-8">
                        <ChooseSwiper/>
                    </div>
                </div>
            </div>

            <div className="w-full bg-gradient-to-r from-indigo-600 to-custom-blue py-24 relative overflow-hidden">
                <div className="absolute w-64 h-64 rounded-full bg-white opacity-10 top-10 right-10"></div>
                <div className="absolute w-40 h-40 rounded-full bg-white opacity-10 bottom-10 left-10"></div>
                
                <div className="xs:w-[85%] lg:w-[90%] mx-auto flex flex-col items-center justify-center gap-8 relative z-1">
                    <h1 className="text-4xl font-bold text-white text-center">Transform Group Work Today!</h1>
                    <h2 className="text-xl text-center text-white">Make group projects less stressful and more productive with <br className="xs:hidden lg:flex"/><span className="font-semibold">TeamSync</span></h2>
                    <div className="flex xs:flex-col lg:flex-row gap-6 mt-6">
                        <button className="px-8 py-4 flex items-center justify-center bg-white text-custom-blue rounded-md text-lg font-bold hover:bg-gray-100 transition-all shadow-xl" onClick={() => navigate('/signup')}>Get Started</button>
                        <button className="px-8 py-4 flex items-center justify-center border-2 border-white text-white rounded-md text-lg hover:bg-white hover:text-custom-blue transition-all" onClick={() => navigate('/login')}>Sign In</button>
                    </div>
                </div>
            </div>
            
            <footer className="w-full bg-gray-50 pt-16">
                <div className="w-[90%] mx-auto py-10 flex xs:flex-col lg:flex-row justify-between">
                    <div className="flex flex-col gap-4">
                        <h2 className="text-2xl font-bold text-custom-blue">TeamSync</h2>
                        <p className="text-gray-600 max-w-md">Making group work fair, transparent, and productive for students and instructors.</p>
                    </div>
                    <div className="flex xs:flex-col lg:flex-row gap-16 xs:mt-12 lg:mt-0">
                        <div className="flex flex-col gap-3">
                            <h3 className="font-semibold mb-2 text-lg">Product</h3>
                            <a href="#" className="text-gray-600 hover:text-custom-blue">Features</a>
                            <a href="#" className="text-gray-600 hover:text-custom-blue">Testimonials</a>
                            <a href="#" className="text-gray-600 hover:text-custom-blue">Pricing</a>
                        </div>
                        <div className="flex flex-col gap-3">
                            <h3 className="font-semibold mb-2 text-lg">Resources</h3>
                            <a href="#" className="text-gray-600 hover:text-custom-blue">Documentation</a>
                            <a href="#" className="text-gray-600 hover:text-custom-blue">Support</a>
                            <a href="#" className="text-gray-600 hover:text-custom-blue">FAQs</a>
                        </div>
                        <div className="flex flex-col gap-3">
                            <h3 className="font-semibold mb-2 text-lg">Company</h3>
                            <a href="#" className="text-gray-600 hover:text-custom-blue">About Us</a>
                            <a href="#" className="text-gray-600 hover:text-custom-blue">Contact</a>
                            <a href="#" className="text-gray-600 hover:text-custom-blue">Privacy Policy</a>
                        </div>
                    </div>
                </div>
                <div className="w-full border-t border-gray-200 mt-8">
                    <div className="w-[90%] mx-auto flex justify-center py-6 text-sm text-gray-600">
                        Copyright © {new Date().getFullYear()} TeamSync. All rights reserved
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Landing;