const routes = {
  // auth
  login: '/login',
  logout: '/logout',
  register: '/register',
  google: '/google',
  verify: 'verify',
  // user
  ccid: '/ccid',
  home: '/',
  motorbike: '/motorbike/:slug',
  history: '/history',
  historyDetail: '/history/detail',
  user: '/user',
  registerToBecomeShop: '/registerToBecomeShop',
  thanks: '/thanks',
  policy: '/policy',
  contact: '/contact',
  store: '/store',
  storeDetail: '/store/:id',
  invoice: '/invoice/:id',
  // admin
  admin: '/admin',
  approve: '/admin/shop/approve',
  list: '/admin/shop/list',
  profileAdmin: '/admin/profile',
  // shop
  shop: '/shop',
  motorbikeShop: '/shop/motorbike',
  employeeShop: '/shop/employees',
  profileShop: '/shop/profile',
  statistic: '/shop/statistic',
  condition: '/shop/condition',
  listShop: '/shop/list',
  // employee
  employee: '/shop/employee',
  profileEmployee: '/shop/employee/profile',
  confirmOrder: '/shop/employee/approve',
  return: '/shop/employee/return',
  done: '/shop/employee/done',
  cancel: '/shop/employee/cancel',
};

export default routes;
