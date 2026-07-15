import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter } from 'wouter';

import { PublicLayout } from '@/components/layout/PublicLayout';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { EmployeeLayout } from '@/components/layout/EmployeeLayout';

import Home from '@/pages/public/Home';
import Services from '@/pages/public/Services';
import Portfolio from '@/pages/public/Portfolio';
import About from '@/pages/public/About';
import Quote from '@/pages/public/Quote';
import Consultation from '@/pages/public/Consultation';
import Testimonials from '@/pages/public/Testimonials';
import Careers from '@/pages/public/Careers';
import Freelancers from '@/pages/public/Freelancers';

import Login from '@/pages/auth/Login';

import AdminDashboard from '@/pages/admin/Dashboard';
import AdminApplicants from '@/pages/admin/Applicants';
import AdminEmployees from '@/pages/admin/Employees';
import AdminInquiries from '@/pages/admin/Inquiries';
import AdminConsultations from '@/pages/admin/Consultations';
import AdminProjects from '@/pages/admin/Projects';
import AdminPayments from '@/pages/admin/Payments';
import AdminSiteContent from '@/pages/admin/SiteContent';
import AdminAuditLog from '@/pages/admin/AuditLog';

import EmployeeDashboard from '@/pages/employee/Dashboard';
import EmployeeProjects from '@/pages/employee/Projects';
import EmployeePayoutSettings from '@/pages/employee/PayoutSettings';
import EmployeePaymentHistory from '@/pages/employee/PaymentHistory';
import EmployeeAccount from '@/pages/employee/Account';

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={() => <PublicLayout><Home /></PublicLayout>} />
      <Route path="/services" component={() => <PublicLayout><Services /></PublicLayout>} />
      <Route path="/portfolio" component={() => <PublicLayout><Portfolio /></PublicLayout>} />
      <Route path="/about" component={() => <PublicLayout><About /></PublicLayout>} />
      <Route path="/quote" component={() => <PublicLayout><Quote /></PublicLayout>} />
      <Route path="/consultation" component={() => <PublicLayout><Consultation /></PublicLayout>} />
      <Route path="/testimonials" component={() => <PublicLayout><Testimonials /></PublicLayout>} />
      <Route path="/careers" component={() => <PublicLayout><Careers /></PublicLayout>} />
      <Route path="/freelancers" component={() => <PublicLayout><Freelancers /></PublicLayout>} />
      
      <Route path="/admin/login" component={() => <Login type="admin" />} />
      <Route path="/employee/login" component={() => <Login type="employee" />} />

      <Route path="/admin" component={() => <AdminLayout><AdminDashboard /></AdminLayout>} />
      <Route path="/admin/applicants" component={() => <AdminLayout><AdminApplicants /></AdminLayout>} />
      <Route path="/admin/employees" component={() => <AdminLayout><AdminEmployees /></AdminLayout>} />
      <Route path="/admin/inquiries" component={() => <AdminLayout><AdminInquiries /></AdminLayout>} />
      <Route path="/admin/consultations" component={() => <AdminLayout><AdminConsultations /></AdminLayout>} />
      <Route path="/admin/projects" component={() => <AdminLayout><AdminProjects /></AdminLayout>} />
      <Route path="/admin/payments" component={() => <AdminLayout><AdminPayments /></AdminLayout>} />
      <Route path="/admin/site-content" component={() => <AdminLayout><AdminSiteContent /></AdminLayout>} />
      <Route path="/admin/audit-log" component={() => <AdminLayout><AdminAuditLog /></AdminLayout>} />

      <Route path="/employee" component={() => <EmployeeLayout><EmployeeDashboard /></EmployeeLayout>} />
      <Route path="/employee/projects" component={() => <EmployeeLayout><EmployeeProjects /></EmployeeLayout>} />
      <Route path="/employee/payout-settings" component={() => <EmployeeLayout><EmployeePayoutSettings /></EmployeeLayout>} />
      <Route path="/employee/payment-history" component={() => <EmployeeLayout><EmployeePaymentHistory /></EmployeeLayout>} />
      <Route path="/employee/account" component={() => <EmployeeLayout><EmployeeAccount /></EmployeeLayout>} />

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;