import './App.scss';
import Home from './pages/About';
import { Routes, Route } from 'react-router-dom';
import BlogsPage from './pages/BlogsPage';
import PricingPage from './pages/PricingPage';
import Contactus from './pages/Contact/Contactus';
import Transcribe from './pages/Transcribe/TranscribeMainPage';
import NotFoundPage from './pages/NotFoundPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import DashboardPage from './pages/DashboardPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import TeamPage from './pages/Dashboard/Components/Team/Team';
import ContactsPage from './pages/Dashboard/Components/Contacts/Contacts';
import InvoicesPage from './pages/Dashboard/Components/Invoices/Invoices';
import FormPage from './pages/Dashboard/Components/Form/Form';
import CalendarPage from './pages/Dashboard/Components/Calendar/Calendar';
import FAQPage from './pages/Dashboard/Components/Faq/Faq';
import BarPage from './pages/Dashboard/Components/Bar/Bar';
import PiePage from './pages/Dashboard/Components/Pie/Pie';
import LinePage from './pages/Dashboard/Components/Line/Line';
import GeographyPage from './pages/Dashboard/Components/Geography/Geography';
import SettingsPage from './pages/SettingsPage';
import Layout from './components/Layout';
import { AuthProvider } from './components/AuthContext/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="transcribe" element={<Transcribe />} />
          <Route path="updates" element={<BlogsPage />} />
          <Route path="pricing" element={<PricingPage />} />
          <Route path="contact" element={<Contactus />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="reset-password" element={<ResetPasswordPage />} />
          <Route path="verify-email" element={<VerifyEmailPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
        
        <Route path="/dashboard/:user_id" element={<DashboardPage />} >
          <Route path='team' element={<TeamPage />} />
          <Route path='contacts' element={<ContactsPage />} />
          <Route path='invoices' element={<InvoicesPage />} />
          <Route path='form' element={<FormPage />} />
          <Route path='calendar' element={<CalendarPage />} />
          <Route path='faq' element={<FAQPage />} />
          <Route path='bar' element={<BarPage />} />
          <Route path='pie' element={<PiePage />} />
          <Route path='line' element={<LinePage />} />
          <Route path='geography' element={<GeographyPage />} />
          <Route path='settings' element={<SettingsPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
