import Home from './pages/Home';
import Lottery from './pages/Lottery';
import Management from './pages/Management';
import type { ReactNode } from 'react';

interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
  requiresPassword?: boolean;
}

const routes: RouteConfig[] = [
  {
    name: '首页',
    path: '/',
    element: <Home />
  },
  {
    name: '抽奖页',
    path: '/lottery',
    element: <Lottery />,
    requiresPassword: true
  },
  {
    name: '人员信息',
    path: '/management',
    element: <Management />,
    requiresPassword: true
  }
];

export default routes;