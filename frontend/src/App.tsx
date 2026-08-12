import { Routes, Route, Navigate } from 'react-router-dom';
import {
  BarChart2, CalendarDays, CheckSquare, LayoutDashboard, PlusCircle, Settings, Shield,
  Users,
} from 'lucide-react';
import { Layout, ScrollToTop } from '@/components/layout/Layout';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { ToastHost } from '@/components/common/Toast';

import { Discover } from '@/pages/discover/Discover';
import { Events } from '@/pages/events/Events';
import { EventDetail } from '@/pages/events/EventDetail';
import { MapPage } from '@/pages/events/MapPage';
import { Checkout } from '@/pages/events/Checkout';
import { Login } from '@/pages/auth/Login';
import { Register } from '@/pages/auth/Register';
import { ForgotPassword } from '@/pages/auth/ForgotPassword';
import { InterestOnboarding } from '@/pages/auth/InterestOnboarding';
import { Saved } from '@/pages/profile/Saved';
import { Profile } from '@/pages/profile/Profile';
import { Categories } from '@/pages/Categories';
import { ForOrganizers } from '@/pages/ForOrganizers';
import { About } from '@/pages/About';
import { Contact } from '@/pages/Contact';
import { NotFound } from '@/pages/NotFound';

import { OrganizerOverview } from '@/pages/organizer/OrganizerOverview';
import { MyEvents } from '@/pages/organizer/MyEvents';
import { CreateEvent } from '@/pages/organizer/CreateEvent';
import { Attendees } from '@/pages/organizer/Attendees';
import { CheckIn } from '@/pages/organizer/CheckIn';
import { AdminDashboard } from '@/pages/admin/AdminDashboard';

const organizerLinks = [
  { to: '/organizer', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/organizer/events', label: 'My events', icon: CalendarDays },
  { to: '/organizer/events/new', label: 'Create event', icon: PlusCircle },
  { to: '/organizer/attendees', label: 'Attendees', icon: Users },
  { to: '/organizer/checkin', label: 'Check-in', icon: CheckSquare },
  { to: '/organizer/analytics', label: 'Analytics', icon: BarChart2 },
];

const adminLinks = [
  { to: '/admin', label: 'Dashboard', icon: Shield, end: true },
  { to: '/admin/events', label: 'Events', icon: CalendarDays },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

export const App = () => (
  <>
    <ScrollToTop />
    <Routes>
      {/* Public */}
      <Route element={<Layout />}>
        <Route path="/" element={<Discover />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/for-organizers" element={<ForOrganizers />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/saved" element={<Saved />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/checkout/:id" element={<Checkout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/onboarding/interests" element={<InterestOnboarding />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Organizer dashboard */}
      <Route
        element={
          <DashboardShell title="Organizer Dashboard" links={organizerLinks}
            requiredRole="organizer" demoEmail="organizer@stepout.gh" />
        }
      >
        <Route path="/organizer" element={<OrganizerOverview />} />
        <Route path="/organizer/events" element={<MyEvents />} />
        <Route path="/organizer/events/new" element={<CreateEvent />} />
        <Route path="/organizer/attendees" element={<Attendees />} />
        <Route path="/organizer/checkin" element={<CheckIn />} />
        <Route path="/organizer/analytics" element={<Navigate to="/organizer" replace />} />
      </Route>

      {/* Admin */}
      <Route
        element={
          <DashboardShell title="Admin" links={adminLinks}
            requiredRole="admin" demoEmail="admin@stepout.gh" />
        }
      >
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/events" element={<Navigate to="/admin" replace />} />
        <Route path="/admin/users" element={<Navigate to="/admin" replace />} />
        <Route path="/admin/settings" element={<Navigate to="/admin" replace />} />
      </Route>
    </Routes>

    <ToastHost />
  </>
);
