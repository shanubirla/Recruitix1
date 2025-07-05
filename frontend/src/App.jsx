import React, { Suspense, lazy } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import RecentFeedbacks from './components/RecentFeedbacks.jsx';
import FeedbackForm from './components/FeedbackForm.jsx';

// Lazy-loaded components
import Navbar from './components/shared/Navbar';
const Login = lazy(() => import('./components/auth/Login.jsx'));
const Signup = lazy(() => import('./components/auth/Singup.jsx'));
const Home = lazy(() => import('./components/Home.jsx'));
const Jobs = lazy(() => import('./components/Jobs.jsx'));
const Browse = lazy(() => import('./components/Browse.jsx'));
const Profile = lazy(() => import('./components/Profile.jsx'));
const JobDetail = lazy(() => import('./components/JobDetail.jsx'));
const Companies = lazy(() => import('./components/recruiter/Companies.jsx'));
const CompanyCreate = lazy(() => import('./components/recruiter/CompanyCreate.jsx'));
const CompanySetup = lazy(() => import('./components/recruiter/CompanySetup.jsx'));
const AdminJobs = lazy(() => import('./components/recruiter/AdminJobs.jsx'));
const PostJob = lazy(() => import('./components/recruiter/PostJob.jsx'));
const Applicants = lazy(() => import('./components/recruiter/Applicants.jsx'));
const ProtectedRoute = lazy(() => import('./components/recruiter/ProtectedRoute.jsx'));
import Dashboard from './components/Admin/DashBoard.jsx';
const AboutUs = lazy(() => import('./components/ui/AboutUs.jsx'));
const Contact = lazy(() => import('./components/Concact.jsx'));
const Footer = lazy(() => import('./components/Footer.jsx'));
const NewsList = lazy(() => import('./components/NewsList.jsx'));
const ReferralPage = lazy(() => import('./components/GetReferralPage.jsx'));
const ContactForm = lazy(() => import('./components/ContactForm.jsx'));
const ChatPage = lazy(() => import('./ChatPage.jsx'));
const AdminAddReferral = lazy(() => import('./components/Admin/AdminAddReferral.jsx'));


const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/description/:id',
    element: <JobDetail />
  },
  {
    path: '/recentFeedbaks',
    element: <RecentFeedbacks/>
  },
  {
    path: '/feedback',
    element: <FeedbackForm/>
  },
  {
    path: '/admin/dashboard',
    element: <Dashboard />
  },
  {
    path: '/profile',
    element: <Profile />
  },
  {
    path: '/contactForm',
    element: <ContactForm />
  },
  {
    path: '/browse',
    element: <Browse />
  },
  {
    path: '/jobs',
    element: <Jobs />
  },
  {
    path: '/about',
    element: <AboutUs />
  },
  {
    path: '/contact',
    element: <Contact />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/signup',
    element: <Signup />
  },
  {
    path: '/admin/companies',
    element: <ProtectedRoute><Companies /></ProtectedRoute>
  },
  {
    path: '/admin/companies/create',
    element: <ProtectedRoute><CompanyCreate /></ProtectedRoute>
  },
  {
    path: '/admin/companies/:id',
    element: <ProtectedRoute><CompanySetup /></ProtectedRoute>
  },
  {
    path: '/admin/jobs',
    element: <ProtectedRoute><AdminJobs /></ProtectedRoute>
  },
  {
    path: '/messages',
    element: <ChatPage />
  },
  {
    path: '/admin/jobs/create',
    element: <ProtectedRoute><PostJob /></ProtectedRoute>
  },
  {
    path: '/admin/jobs/:id/applicants',
    element: <ProtectedRoute><Applicants /></ProtectedRoute>
  },
  {
    path: '/admin/jobs/:id/edit',
    element: <ProtectedRoute><PostJob /></ProtectedRoute>
  },
  {
    path: '/addRef',
    element: <AdminAddReferral />
  },
  {
    path: '/newsList',
    element: <NewsList />
  },
  {
    path: '/referral',
    element: <ReferralPage />
  }
]);

//  Loading spinner
const Loader = () => (
  <div className="flex items-center justify-center h-screen text-xl font-semibold">
    Loading...
  </div>
);

function App() {
  return (
    <Suspense fallback={<Loader />}>
      <RouterProvider router={appRouter} />
    </Suspense>
  );
}

export default App;
