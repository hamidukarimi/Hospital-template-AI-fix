import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import { AdminLayout } from "./admin/components/AdminLayout";
import ProtectedAdminRoute from "./admin/components/ProtectedAdminRoute";
import { ToastProvider } from "./admin/components/Toast";
import AdminLogin from "./admin/pages/AdminLogin";
import AdminDashboard from "./admin/pages/AdminDashboard";
import AdminProfile from "./admin/pages/AdminProfile";
import ArticlePage from "./admin/pages/articles/ArticlesPage";
import DoctorPage from "./admin/pages/doctors/DoctorsPage";
import FooterColumnsPage from "./admin/pages/footer/FooterColumnsPage";
import FooterLinksPage from "./admin/pages/footer/FooterLinksPage";
import FooterSettingsPage from "./admin/pages/footer/FooterSettingsPage";
import HelpCardsPage from "./admin/pages/help-cards/HelpCardsPage";
import LabTestsPage from "./admin/pages/lab-tests/LabTestsPage";
import ServicePage from "./admin/pages/services/ServicesPage";
import SiteSettingsPage from "./admin/pages/site-settings/SiteSettingsPage";
import SocialMediaPage from "./admin/pages/social-media/SocialMediaPage";
import TestimonialPage from "./admin/pages/testimonials/TestimonialsPage";
import WhyChooseUsPage from "./admin/pages/why-choose-us/WhyChooseUsPage";

import ServiceDetailsPage from "./pages/ServiceDetailsPage";
import ContactPage from "./pages/ContactPage"; // <-- 1. Import ContactPage
import AboutPage from "./pages/AboutPage";

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<ContactPage />} /> {/* <-- 2. Add Route */}
          <Route path="/about" element={<AboutPage />} />

          <Route path="/admin/login" element={<AdminLogin />} />

          <Route element={<ProtectedAdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/profile" element={<AdminProfile />} />
              <Route path="/admin/services/*" element={<ServicePage />} />
              <Route path="/admin/doctors/*" element={<DoctorPage />} />
              <Route path="/admin/articles/*" element={<ArticlePage />} />
              <Route
                path="/admin/testimonials/*"
                element={<TestimonialPage />}
              />
              <Route path="/admin/help-cards/*" element={<HelpCardsPage />} />
              <Route
                path="/admin/why-choose-us/*"
                element={<WhyChooseUsPage />}
              />
              <Route path="/admin/lab-tests/*" element={<LabTestsPage />} />
              <Route
                path="/admin/site-settings"
                element={<SiteSettingsPage />}
              />
              <Route
                path="/admin/social-media/*"
                element={<SocialMediaPage />}
              />
              <Route
                path="/admin/footer-settings"
                element={<FooterSettingsPage />}
              />
              <Route
                path="/admin/footer-columns/*"
                element={<FooterColumnsPage />}
              />
              <Route
                path="/admin/footer-links/*"
                element={<FooterLinksPage />}
              />
            </Route>
          </Route>
          <Route path="/services/:slug" element={<ServiceDetailsPage />} />
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;