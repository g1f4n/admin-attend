/*!

=========================================================
* Argon Dashboard React - v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Index from 'views/leader/Index.js';
import Profile from 'views/leader/Profile.js';
import Maps from 'views/leader/Maps.js';
import Register from 'views/leader/Register.js';
import Login from 'views/examples/Login.js';
import Tables from 'views/leader/Tables.js';
import Icons from 'views/leader/Icons.js';
import Cuti from 'views/leader/Cuti';
import Izin from 'views/leader/Izin';
import PulangCepat from 'views/leader/PulangCepat';
import Lembur from 'views/leader/Lembur';
import Terlambat from 'views/leader/Terlambat';
import ChangeRequest from 'views/leader/ChangeRequest';
import StatusRequest from 'views/leader/StatusRequest';
import ViewHistory from 'views/leader/ViewHistory';
import { getLeaderId } from 'utils';
import { ExportExcelIdz } from 'views/leader/ExportExcelId';
import TesEksport from 'views/leader/TesEksport';

var routes2 = [
  {
    path: '/index',
    name: 'Dashboard',
    icon: 'ni ni-tv-2 text-primary',
    component: Index,
    layout: '/leader'
  },
  {
    path: '/maps/:id',
    name: 'Tracking',
    icon: 'ni ni-pin-3 text-red',
    component: Maps,
    layout: '/leader',
    invisible: true
  },
  {
    path: '/exportexcelid/:id',
    name: 'exportexcelid',
    icon: 'ni ni-pin-3 text-red',
    component: ExportExcelIdz,
    layout: '/leader',
    invisible: true
  },
  {
    path: '/staff',
    name: 'Staff',
    icon: 'ni ni-single-02 text-yellow',
    component: Profile,
    layout: '/leader'
  },
  {
    path: '/data-absen',
    name: 'Absen',
    icon: 'ni ni-bullet-list-67 text-red',
    component: Tables,
    layout: '/leader'
  },
  {
    path: '/request-cuti',
    name: 'Request Cuti',
    icon: 'ni ni-key-25 text-info',
    component: Cuti,
    layout: '/leader'
  },
  {
    path: '/request-izin',
    name: 'Request Izin',
    icon: 'ni ni-spaceship text-warning',
    component: Izin,
    layout: '/leader'
  },
  {
    path: '/request-pulang',
    name: 'Request Pulang',
    icon: 'ni ni-watch-time text-primary',
    component: PulangCepat,
    layout: '/leader'
  },
  {
    path: '/request-lembur',
    name: 'Request Lembur',
    icon: 'ni ni-time-alarm text-yellow',
    component: Lembur,
    layout: '/leader'
  },
  {
    path: '/request-terlambat',
    name: 'Request Terlambat',
    icon: 'ni ni-user-run text-danger',
    component: Terlambat,
    layout: '/leader'
  },
  {
    path: '/change-request',
    name: 'Change Request',
    icon: 'ni ni-archive-2 text-info',
    component: ChangeRequest,
    layout: '/leader'
  },
  {
    path: '/status-request',
    name: 'Status Request',
    icon: 'ni ni-archive-2 text-danger',
    component: StatusRequest,
    layout: '/leader'
  },
  {
    path: '/export-data',
    name: 'Export Data',
    icon: 'ni ni-single-copy-04 text-primary',
    component: TesEksport,
    layout: '/leader'
  },
  {
    path: '/view-history/:id',
    name: 'History',
    icon: 'ni ni-user-run text-primary',
    component: ViewHistory,
    layout: '/leader',
    invisible: true
  },
  // {
  // 	path: '/register',
  // 	name: 'Register',
  // 	icon: 'ni ni-circle-08 text-pink',
  // 	component: Register,
  // 	layout: '/auth'
  // },
  {
    path: '/login',
    name: 'Login',
    icon: 'ni ni-circle-08 text-pink',
    component: Login,
    layout: '/auth',
    invisible: true
  }
];
export default routes2;
