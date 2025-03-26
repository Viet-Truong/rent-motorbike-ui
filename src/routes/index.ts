import { FC } from 'react';

import config from '@/config';
// Layout
import DefaultLayout from '@/layouts/Default';
import AdminLayout from '@/layouts/Admin';
import EmployeeLayout from '@/layouts/Employee';
import ShopLayout from '@/layouts/Shop';
// User
import Home from '@/pages/User/home';
import ProductDetail from '@/pages/User/productDetail';
import Profile from '@/pages/User/profile';
import History from '@/pages/User/history';
import RegisterToBecomeShop from '@/pages/User/registerShop';
import Thanks from '@/pages/User/thanks';
import HistoryDetail from '@/pages/User/historyDetail';
import Cancel from '@/pages/Employee/cancel';
import Policy from '@/pages/User/policy';
import Contact from '@/pages/User/contact';
import ListOWnShop from '@/pages/User/listShop';

// Admin
import HomeAdmin from '@/pages/Admin/home';
import ApproveShop from '@/pages/Admin/approve';
import ListShop from '@/pages/Admin/list';
// Shop
import HomeShop from '@/pages/Shop/home';
import Employees from '@/pages/Shop/employees';
import Motorbike from '@/pages/Shop/motorbike';
import ProfileShop from '@/pages/Shop/profile';
import Statistic from '@/pages/Shop/statistic';
import ConditionMotorbike from '@/pages/Shop/condition';

// Employee
import HomeEmployee from '@/pages/Employee/home';
import ApproveRentMotorbike from '@/pages/Employee/approve';
import ReturnRentMotorbike from '@/pages/Employee/return';
import Done from '@/pages/Employee/done';
// Auth
import Login from '@/pages/login';
import Register from '@/pages/register';
import GoogleCallback from '@/pages/googleCallback';
import ConvertTextFromCCID from '@/pages/convertCCID';
import Verify from '@/pages/verify';
import InvoiceTemplate from '@/pages/invoiceTemplate';
import Store from '@/pages/User/store';
import ShopDetail from '@/pages/User/shopDetail';

type Routes = {
  path: string;
  component: () => JSX.Element;
  layout: FC<{ children: React.ReactNode | JSX.Element }> | null;
};

const publicRoutes: Routes[] = [
  // Auth
  { path: config.routes.login, component: Login, layout: null },
  { path: config.routes.register, component: Register, layout: null },
  { path: config.routes.google, component: GoogleCallback, layout: null },
  { path: config.routes.ccid, component: ConvertTextFromCCID, layout: null },
  { path: config.routes.verify, component: Verify, layout: null },
  // User
  { path: config.routes.home, component: Home, layout: DefaultLayout },
  { path: config.routes.policy, component: Policy, layout: DefaultLayout },
  { path: config.routes.contact, component: Contact, layout: DefaultLayout },
  { path: config.routes.store, component: Store, layout: DefaultLayout },
  {
    path: config.routes.motorbike,
    component: ProductDetail,
    layout: DefaultLayout,
  },
  {
    path: config.routes.history,
    component: History,
    layout: DefaultLayout,
  },
  { path: config.routes.historyDetail, component: HistoryDetail, layout: DefaultLayout },
  { path: config.routes.user, component: Profile, layout: DefaultLayout },
  {
    path: config.routes.registerToBecomeShop,
    component: RegisterToBecomeShop,
    layout: DefaultLayout,
  },
  { path: config.routes.thanks, component: Thanks, layout: DefaultLayout },
  { path: config.routes.invoice, component: InvoiceTemplate, layout: null },
  { path: config.routes.listShop, component: ListOWnShop, layout: DefaultLayout },
  { path: config.routes.storeDetail, component: ShopDetail, layout: DefaultLayout },
  // Admin
  { path: config.routes.admin, component: HomeAdmin, layout: AdminLayout },
  { path: config.routes.approve, component: ApproveShop, layout: AdminLayout },
  { path: config.routes.list, component: ListShop, layout: AdminLayout },
  { path: config.routes.profileAdmin, component: Profile, layout: AdminLayout },
  // Shop
  { path: config.routes.shop, component: HomeShop, layout: ShopLayout },
  { path: config.routes.profileShop, component: ProfileShop, layout: ShopLayout },
  {
    path: config.routes.motorbikeShop,
    component: Motorbike,
    layout: ShopLayout,
  },
  {
    path: config.routes.employeeShop,
    component: Employees,
    layout: ShopLayout,
  },
  { path: config.routes.statistic, component: Statistic, layout: ShopLayout },
  { path: config.routes.condition, component: ConditionMotorbike, layout: ShopLayout },
  // Employee
  {
    path: config.routes.employee,
    component: HomeEmployee,
    layout: EmployeeLayout,
  },
  { path: config.routes.profileEmployee, component: Profile, layout: EmployeeLayout },
  {
    path: config.routes.confirmOrder,
    component: ApproveRentMotorbike,
    layout: EmployeeLayout,
  },
  {
    path: config.routes.return,
    component: ReturnRentMotorbike,
    layout: EmployeeLayout,
  },
  {
    path: config.routes.done,
    component: Done,
    layout: EmployeeLayout,
  },
  { path: config.routes.cancel, component: Cancel, layout: EmployeeLayout },
];

export { publicRoutes };
