import { lazy } from 'react';
import AppLayout from '../layout/AppLayout';
import AdminAppLayout from '../layout/AdminAppLayout';

import AuthLayout from '../layout/AuthLayout';

const Dashboard = lazy(() => import('../pages/Home/Home'));
const Settings = lazy(() => import('../pages/settings/Settings'));

const Login = lazy(() => import('../pages/Login/Login'));
const NotFound = lazy(() => import('../pages/NotFound/NotFound'));
const Room = lazy(() => import("../pages/Room/Room"))

const Router = [
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'settings', element: <Settings /> },
      { path: 'room/:roomName', element: <Room /> },
    ],
  },

  {
    path: '/',
    element: <AdminAppLayout />,
    children: [
      // { path: 'doctors', element: <DoctorsScreen /> },
      { path: 'room', element: <Room /> },
      { path: '*', element: <NotFound /> },
    ],
  },
  // {
  //   path: '/',
  //   element: <DealerAppLayout />,
  //   children: [
  //     { path: 'agents', element: <Agent /> },
  //     { path: 'transaction', element: <TransactionScreen /> },
  //   ],
  // },
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <Login /> },
      { path: '*', element: <NotFound /> },
    ],
  },
];

export default Router;
