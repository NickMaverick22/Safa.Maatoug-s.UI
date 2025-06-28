import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PageTransition from "./components/PageTransition";
import Index from "./pages/Index";
import Histoire from "./pages/Histoire";
import Collection from "./pages/Collection";
import Avis from "./pages/Avis";
import Contact from "./pages/Contact";
import BookAppointment from "./pages/BookAppointment";
import SubmitTestimonial from "./pages/SubmitTestimonial";
import NotFound from "./pages/NotFound";
import WhatsAppFloat from "./components/WhatsAppFloat";

// CMS Pages
import CMSLogin from "./pages/cms/CMSLogin";
import CMSDashboard from "./pages/cms/CMSDashboard";
import CMSTestimonials from "./pages/cms/CMSTestimonials";
import CMSAppointments from "./pages/cms/CMSAppointments";
import CMSGallery from "./pages/cms/CMSGallery";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <PageTransition>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/histoire" element={<Histoire />} />
            <Route path="/collection" element={<Collection />} />
            <Route path="/avis" element={<Avis />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/book-appointment" element={<BookAppointment />} />
            <Route path="/submit-testimonial" element={<SubmitTestimonial />} />
            
            {/* CMS Routes */}
            <Route path="/cms/login" element={<CMSLogin />} />
            <Route path="/cms" element={<CMSDashboard />} />
            <Route path="/cms/testimonials" element={<CMSTestimonials />} />
            <Route path="/cms/appointments" element={<CMSAppointments />} />
            <Route path="/cms/gallery" element={<CMSGallery />} />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </PageTransition>
        <WhatsAppFloat />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;