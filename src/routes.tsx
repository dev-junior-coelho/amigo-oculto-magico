import AdminSetup from './pages/AdminSetup';
import AdminDistribution from './pages/AdminDistribution';
import ParticipantReveal from './pages/ParticipantReveal';
import type { ReactNode } from 'react';

interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
}

const routes: RouteConfig[] = [
  {
    name: 'Admin Setup',
    path: '/',
    element: <AdminSetup />,
    visible: false
  },
  {
    name: 'Admin Distribution',
    path: '/distribuir/:adminToken',
    element: <AdminDistribution />,
    visible: false
  },
  {
    name: 'Participant Reveal',
    path: '/revelar/:token',
    element: <ParticipantReveal />,
    visible: false
  },
  {
    name: 'Participant Reveal Manual',
    path: '/revelar',
    element: <ParticipantReveal />,
    visible: false
  }
];

export default routes;
