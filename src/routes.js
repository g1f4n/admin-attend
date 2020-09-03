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
import Index from 'views/Index.js';
import Profile from 'views/examples/Profile.js';
import Login from 'views/examples/Login.js';
import StatusRequest from 'views/examples/StatusRequest';
import RegisterKaryawan from 'views/examples/RegisterKaryawan';
import TipeKaryawan from 'views/examples/TipeKaryawan';
import ManajemenPosisi from 'views/examples/ManajemenPosisi';
import ManajemenLevel from 'views/examples/ManajemenLevel';
import ManajemenDepartemen from 'views/examples/ManajemenDepartemen';
import ManajemenPoint from 'views/examples/ManajemenPoint';
import SelfRegistration from 'views/examples/SelfRegistration';
import ExportData from 'views/examples/ExportData';
import ManajemenSetting from 'views/examples/ManajemenSetting';
import Maps from 'views/examples/Maps';
import LeaderList from 'views/examples/LeaderList';

var routes = [
	{
		path: '/index',
		name: 'Dashboard',
		icon: 'ni ni-tv-2 text-primary',
		component: Index,
		layout: '/admin'
	},
	{
		path: '/view-absen/:id',
		name: 'User Location',
		icon: 'ni ni-tv-2 text-danger',
		component: Maps,
		layout: '/admin',
		invisible: true
	},
	{
		path: '/leader',
		name: 'Leader',
		icon: 'ni ni-tv-2 text-yellow',
		component: LeaderList,
		layout: '/admin'
	},
	{
		path: '/staff',
		name: 'Staff',
		icon: 'ni ni-single-02 text-yellow',
		component: Profile,
		layout: '/admin'
	},
	{
		path: '/register',
		name: 'Register',
		icon: 'ni ni-bullet-list-67 text-red',
		component: RegisterKaryawan,
		layout: '/admin'
	},
	{
		path: '/self-regist',
		name: 'Self Registration',
		icon: 'ni ni-bullet-list-67 text-primary',
		component: SelfRegistration,
		layout: '/admin'
	},
	{
		path: '/status-request',
		name: 'Status Request',
		icon: 'ni ni-archive-2 text-info',
		component: StatusRequest,
		layout: '/admin'
	},
	{
		path: '/tipe',
		name: 'Manage Tipe',
		icon: 'ni ni-archive-2 text-danger',
		component: TipeKaryawan,
		layout: '/admin'
	},
	{
		path: '/point',
		name: 'Manage Absen Point',
		icon: 'ni ni-bullet-list-67 text-primary',
		component: ManajemenPoint,
		layout: '/admin'
	},
	{
		path: '/posisi',
		name: 'Manage Posisi',
		icon: 'ni ni-archive-2 text-green',
		component: ManajemenPosisi,
		layout: '/admin'
	},
	{
		path: '/level',
		name: 'Manage Level',
		icon: 'ni ni-spaceship text-red',
		component: ManajemenLevel,
		layout: '/admin'
	},
	{
		path: '/appsetting',
		name: 'Manage Setting',
		icon: 'ni ni-spaceship text-blue',
		component: ManajemenSetting,
		layout: '/admin'
	},
	{
		path: '/departemen',
		name: 'Manage Departemen',
		icon: 'ni ni-key-25 text-primary',
		component: ManajemenDepartemen,
		layout: '/admin'
	},
	{
		path: '/eksport',
		name: 'Eksport Data',
		icon: 'ni ni-key-25 text-primary',
		component: ExportData,
		layout: '/admin'
	},
	// {
	// 	path: '/data-absen',
	// 	name: 'Absen',
	// 	icon: 'ni ni-bullet-list-67 text-red',
	// 	component: Tables,
	// 	layout: '/admin'
	// },
	// {
	// 	path: '/request-cuti',
	// 	name: 'Request Cuti',
	// 	icon: 'ni ni-key-25 text-info',
	// 	component: Cuti,
	// 	layout: '/admin'
	// },
	// {
	// 	path: '/request-izin',
	// 	name: 'Request Izin',
	// 	icon: 'ni ni-spaceship text-warning',
	// 	component: Izin,
	// 	layout: '/admin'
	// },
	// {
	// 	path: '/request-pulang',
	// 	name: 'Request Pulang',
	// 	icon: 'ni ni-watch-time text-primary',
	// 	component: PulangCepat,
	// 	layout: '/admin'
	// },
	// {
	// 	path: '/request-lembur',
	// 	name: 'Request Lembur',
	// 	icon: 'ni ni-time-alarm text-yellow',
	// 	component: Lembur,
	// 	layout: '/admin'
	// },
	// {
	// 	path: '/request-terlambat',
	// 	name: 'Request Terlambat',
	// 	icon: 'ni ni-user-run text-danger',
	// 	component: Terlambat,
	// 	layout: '/admin'
	// },
	// {
	// 	path: '/change-request',
	// 	name: 'Change Request',
	// 	icon: 'ni ni-archive-2 text-info',
	// 	component: ChangeRequest,
	// 	layout: '/admin'
	// },

	// {
	// 	path: '/view-history/:id',
	// 	name: 'History',
	// 	icon: 'ni ni-user-run text-primary',
	// 	component: ViewHistory,
	// 	layout: '/admin',
	// 	invisible: true
	// },
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
export default routes;
