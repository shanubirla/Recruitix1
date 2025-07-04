import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import {
    LogOut, User2, Briefcase, Search, Newspaper,
    LayoutDashboard, Building, Users, Bookmark, ChevronDown,
    MessageSquare, Menu, X, AlignHorizontalDistributeEnd
} from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { toast } from 'sonner';
import { USER_API_END_POINT } from '@/constants.js';
import { setUser } from '@/redux/authSlice.js';

const Navbar = () => {
    const { user } = useSelector((store) => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });
            if (res.data.success) {
                dispatch(setUser(null));
                navigate('/');
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || 'Logout failed');
        }
    };

    const closeMobileMenu = () => setMobileMenuOpen(false);

    return (
        <header className="sticky top-0 bg-white shadow-sm z-50 border-b border-gray-100">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                            <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                                <span className="bg-gradient-to-r from-teal-600 via-cyan-600 to-indigo-600 bg-clip-text text-transparent">
                                    Recruitix
                                </span>
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center space-x-8">
                        <div className="flex space-x-6">
                            {user && user.role === 'admin' ? (
                                <>
                                    <Link
                                        to="/admin/dashboard"
                                        className="flex items-center text-sm font-medium text-gray-700 hover:text-teal-600 transition-colors group"
                                    >
                                        <LayoutDashboard className="mr-2 h-4 w-4 text-gray-500 group-hover:text-teal-600 transition-colors" />
                                        Dashboard
                                    </Link>
                                    <Link
                                        to="/addRef"
                                        className="flex items-center text-sm font-medium text-gray-700 hover:text-teal-600 transition-colors group"
                                    >
                                        <AlignHorizontalDistributeEnd className="mr-2 h-4 w-4 text-gray-500 group-hover:text-teal-600 transition-colors" />
                                        Add Reference
                                    </Link>
                                    
                                </>
                            ) : user && user.role === 'recruiter' ? (
                                <>
                                    <Link
                                        to="/admin/companies"
                                        className="flex items-center text-sm font-medium text-gray-700 hover:text-teal-600 transition-colors group"
                                    >
                                        <Building className="mr-2 h-4 w-4 text-gray-500 group-hover:text-teal-600 transition-colors" />
                                        Companies
                                    </Link>
                                    <Link
                                        to="/admin/jobs"
                                        className="flex items-center text-sm font-medium text-gray-700 hover:text-teal-600 transition-colors group"
                                    >
                                        <Bookmark className="mr-2 h-4 w-4 text-gray-500 group-hover:text-teal-600 transition-colors" />
                                        Jobs
                                    </Link>
                                    <Link
                                        to="/messages"
                                        className="flex items-center text-sm font-medium text-gray-700 hover:text-teal-600 transition-colors group"
                                    >
                                        <MessageSquare className="mr-2 h-4 w-4 text-gray-500 group-hover:text-teal-600 transition-colors" />
                                        Messages
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/jobs"
                                        className="flex items-center text-sm font-medium text-gray-700 hover:text-teal-600 transition-colors group"
                                    >
                                        <Briefcase className="mr-2 h-4 w-4 text-gray-500 group-hover:text-teal-600 transition-colors" />
                                        Jobs
                                    </Link>
                                    <Link
                                        to="/browse"
                                        className="flex items-center text-sm font-medium text-gray-700 hover:text-teal-600 transition-colors group"
                                    >
                                        <Search className="mr-2 h-4 w-4 text-gray-500 group-hover:text-teal-600 transition-colors" />
                                        Browse
                                    </Link>
                                    <Link
                                        to="/newsList"
                                        className="flex items-center text-sm font-medium text-gray-700 hover:text-teal-600 transition-colors group"
                                    >
                                        <Newspaper className="mr-2 h-4 w-4 text-gray-500 group-hover:text-teal-600 transition-colors" />
                                        News
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* User Profile */}
                        {!user ? (
                            <div className="flex items-center space-x-3">
                                <Link to="/login">
                                    <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-teal-300 transition-colors">
                                        Login
                                    </Button>
                                </Link>
                                <Link to="/signup">
                                    <Button className="bg-gradient-to-r from-teal-600 to-indigo-600 hover:from-teal-700 hover:to-indigo-700 text-white shadow-sm transition-all duration-200 hover:shadow-md">
                                        Sign Up
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <Popover>
                                <PopoverTrigger asChild>
                                    <button className="flex items-center space-x-2 focus:outline-none hover:bg-gray-50 rounded-lg p-2 transition-colors">
                                        <Avatar className="h-8 w-8 border-2 border-teal-100">
                                            <AvatarImage src={user?.profile?.profilePhoto} alt={user?.fullname} />
                                            <AvatarFallback className="bg-gradient-to-r from-teal-100 to-indigo-100 text-teal-700 font-semibold">
                                                {user?.fullname?.charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <ChevronDown className="h-4 w-4 text-gray-500" />
                                    </button>
                                </PopoverTrigger>
                                <PopoverContent className="w-72 p-0 shadow-xl border border-gray-200 rounded-xl mt-2" align="end">
                                    <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-teal-50 to-indigo-50">
                                        <div className="flex items-center space-x-3">
                                            <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                                                <AvatarImage src={user?.profile?.profilePhoto} alt={user?.fullname} />
                                                <AvatarFallback className="bg-gradient-to-r from-teal-100 to-indigo-100 text-teal-700 font-semibold text-lg">
                                                    {user?.fullname?.charAt(0).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-semibold text-gray-900 truncate">{user?.fullname}</h4>
                                                <p className="text-sm text-gray-600 truncate">{user?.email}</p>
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-800 mt-1">
                                                    {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-2">
                                        {user?.role === 'student' && (
                                            <Button
                                                variant="ghost"
                                                className="w-full justify-start text-gray-700 hover:bg-gray-50 hover:text-teal-600 transition-colors"
                                                asChild
                                            >
                                                <Link to="/profile" className="flex items-center space-x-3 px-3 py-2">
                                                    <User2 className="h-4 w-4" />
                                                    <span>My Profile</span>
                                                </Link>
                                            </Button>
                                        )}
                                        {(user?.role === 'student' || user?.role === 'recruiter') && (
                                            <Button
                                                variant="ghost"
                                                className="w-full justify-start text-gray-700 hover:bg-gray-50 hover:text-teal-600 transition-colors"
                                                asChild
                                            >
                                                <Link to="/messages" className="flex items-center space-x-3 px-3 py-2">
                                                    <MessageSquare className="h-4 w-4" />
                                                    <span>Messages</span>
                                                </Link>
                                            </Button>
                                        )}
                                        <Button
                                            variant="ghost"
                                            className="w-full justify-start text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                                            onClick={logoutHandler}
                                        >
                                            <div className="flex items-center space-x-3 px-3 py-2">
                                                <LogOut className="h-4 w-4" />
                                                <span>Logout</span>
                                            </div>
                                        </Button>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        )}
                    </nav>

                    {/* Mobile Navigation Toggle */}
                    <div className="flex lg:hidden">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-lg text-gray-700 hover:text-teal-600 hover:bg-gray-100 focus:outline-none transition-colors"
                            aria-expanded="false"
                        >
                            <span className="sr-only">Open main menu</span>
                            {mobileMenuOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="lg:hidden bg-white shadow-lg border-t border-gray-100">
                    <div className="px-4 pt-4 pb-6 space-y-2">
                        {user && user.role === 'admin' ? (
                            <>
                                <Link
                                    to="/admin/dashboard"
                                    className="flex items-center px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-teal-600 hover:bg-teal-50 transition-colors"
                                    onClick={closeMobileMenu}
                                >
                                    <LayoutDashboard className="mr-3 h-5 w-5" />
                                    Dashboard
                                </Link>
                                <Link
                                    to="/addRef"
                                    className="flex items-center px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-teal-600 hover:bg-teal-50 transition-colors"
                                    onClick={closeMobileMenu}
                                >
                                    <AlignHorizontalDistributeEnd className="mr-3 h-5 w-5" />
                                    Add Reference
                                </Link>
                                
                            </>
                        ) : user && user.role === 'recruiter' ? (
                            <>
                                <Link
                                    to="/admin/companies"
                                    className="flex items-center px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-teal-600 hover:bg-teal-50 transition-colors"
                                    onClick={closeMobileMenu}
                                >
                                    <Building className="mr-3 h-5 w-5" />
                                    Companies
                                </Link>
                                <Link
                                    to="/admin/jobs"
                                    className="flex items-center px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-teal-600 hover:bg-teal-50 transition-colors"
                                    onClick={closeMobileMenu}
                                >
                                    <Bookmark className="mr-3 h-5 w-5" />
                                    Jobs
                                </Link>
                                <Link
                                    to="/messages"
                                    className="flex items-center px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-teal-600 hover:bg-teal-50 transition-colors"
                                    onClick={closeMobileMenu}
                                >
                                    <MessageSquare className="mr-3 h-5 w-5" />
                                    Messages
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/jobs"
                                    className="flex items-center px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-teal-600 hover:bg-teal-50 transition-colors"
                                    onClick={closeMobileMenu}
                                >
                                    <Briefcase className="mr-3 h-5 w-5" />
                                    Jobs
                                </Link>
                                <Link
                                    to="/browse"
                                    className="flex items-center px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-teal-600 hover:bg-teal-50 transition-colors"
                                    onClick={closeMobileMenu}
                                >
                                    <Search className="mr-3 h-5 w-5" />
                                    Browse
                                </Link>
                                <Link
                                    to="/newsList"
                                    className="flex items-center px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-teal-600 hover:bg-teal-50 transition-colors"
                                    onClick={closeMobileMenu}
                                >
                                    <Newspaper className="mr-3 h-5 w-5" />
                                    News
                                </Link>
                            </>
                        )}
                        
                        {/* User Actions for Mobile */}
                        {!user ? (
                            <div className="pt-6 border-t border-gray-200 space-y-3">
                                <Link
                                    to="/login"
                                    className="block w-full px-4 py-3 text-center text-base font-medium text-gray-700 hover:text-teal-600 border border-gray-300 rounded-lg hover:border-teal-300 transition-colors"
                                    onClick={closeMobileMenu}
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/signup"
                                    className="block w-full px-4 py-3 text-center text-base font-medium text-white bg-gradient-to-r from-teal-600 to-indigo-600 rounded-lg hover:from-teal-700 hover:to-indigo-700 transition-all duration-200"
                                    onClick={closeMobileMenu}
                                >
                                    Sign Up
                                </Link>
                            </div>
                        ) : (
                            <div className="pt-6 border-t border-gray-200 space-y-2">
                                <div className="flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-teal-50 to-indigo-50 rounded-lg">
                                    <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                                        <AvatarImage src={user?.profile?.profilePhoto} alt={user?.fullname} />
                                        <AvatarFallback className="bg-gradient-to-r from-teal-100 to-indigo-100 text-teal-700 font-semibold">
                                            {user?.fullname?.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-semibold text-gray-900 truncate">{user?.fullname}</h4>
                                        <p className="text-sm text-gray-600 truncate">{user?.email}</p>
                                    </div>
                                </div>
                                
                                {user?.role === 'student' && (
                                    <Link
                                        to="/profile"
                                        className="flex items-center px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-teal-600 hover:bg-teal-50 transition-colors"
                                        onClick={closeMobileMenu}
                                    >
                                        <User2 className="mr-3 h-5 w-5" />
                                        My Profile
                                    </Link>
                                )}
                                
                                {(user?.role === 'student' || user?.role === 'recruiter') && (
                                    <Link
                                        to="/messages"
                                        className="flex items-center px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-teal-600 hover:bg-teal-50 transition-colors"
                                        onClick={closeMobileMenu}
                                    >
                                        <MessageSquare className="mr-3 h-5 w-5" />
                                        Messages
                                    </Link>
                                )}
                                
                                <button
                                    onClick={() => {
                                        logoutHandler();
                                        closeMobileMenu();
                                    }}
                                    className="flex items-center w-full px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    <LogOut className="mr-3 h-5 w-5" />
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;