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
import React from 'react';

// reactstrap components
import {
	Badge,
	Card,
	CardHeader,
	CardFooter,
	DropdownMenu,
	DropdownItem,
	UncontrolledDropdown,
	DropdownToggle,
	Media,
	Pagination,
	PaginationItem,
	PaginationLink,
	Progress,
	Table,
	Container,
	Row,
	UncontrolledTooltip,
	Spinner,
	Button,
	Form,
	FormGroup,
	Input,
	Col,
	Label,
	FormText
} from 'reactstrap';
// core components
import Header from 'components/Headers/Header.js';
import Parse from 'parse';
import Axios from 'axios';
import moment from 'moment';
import { getLeaderId } from 'utils';
import ModalHandler from 'components/Modal/Modal';
import HeaderNormal from 'components/Headers/HeaderNormal';

class RegisterKaryawan extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			daftarStaff: [],
			daftarLeader: [],
			daftarTipe: [],
			daftarPosisi: [],
			daftarLevel: [],
			first: {},
			loading: false,
			approvalMode: false,
			rejectMode: false,
			counter: 0,
			loadingModal: false,
			fullnames: '',
			userId: '',
			userIndex: 0,
			reason: '',
			checkId: [],
			addMode: false,
			photoMode: false,
			deleteCounter: 0,
			loadingReco: false,
			message: '',
			level: 'Leader',
			fotoWajah: '',
			message: '',
			loadingReco: false,
			nama: '',
			nik: '',
			tipeKaryawan: 'Karyawan tetap',
			posisi: '',
			imei: '',
			jamKerja: 'Jam tetap',
			lokasiKerja: 'Tetap',
			jumlahCuti: 0,
			lembur: 'ya',
			username: '',
			password: '',
			selectLeader: '',
			statusReco: 0,
			email: '',
			fotoWajahObject: {},
			daftarShifting: [],
			shifting: ''
		};
	}

	componentDidMount() {
		this.getStaff();
		this.getLeader();
		this.getLevel();
		this.getPosisi();
		this.getTipe();
		this.getAbsen();
		this.getShifting();
	}

	getTipe = () => {
		this.setState({ loading: true });
		const EmployeeType = new Parse.Object.extend('EmployeeType');
		const query = new Parse.Query(EmployeeType);

		query.equalTo('status', 1);
		query
			.find()
			.then((x) => {
				this.setState({ daftarTipe: x, loading: false });
			})
			.catch((err) => {
				alert(err.message);
				this.setState({ loading: false });
			});
	};

	getPosisi = () => {
		this.setState({ loading: true });
		const Position = new Parse.Object.extend('Position');
		const query = new Parse.Query(Position);

		query.equalTo('status', 1);
		query
			.find()
			.then((x) => {
				this.setState({ daftarPosisi: x, loading: false });
			})
			.catch((err) => {
				alert(err.message);
				this.setState({ loading: false });
			});
	};

	getLevel = () => {
		this.setState({ loading: true });
		const Level = new Parse.Object.extend('Level');
		const query = new Parse.Query(Level);

		query.equalTo('status', 1);
		query
			.find()
			.then((x) => {
				this.setState({ daftarLevel: x, loading: false });
			})
			.catch((err) => {
				alert(err.message);
				this.setState({ loading: false });
			});
	};

	getStaff = () => {
		this.setState({ loading: true });
		const User = new Parse.User();
		const query = new Parse.Query(User);

		query
			.find({ useMasterKey: true })
			.then((x) => {
				this.setState({ daftarStaff: x, loading: false });
			})
			.catch((err) => {
				this.setState({ loading: false });
				alert('cek koneksi anda');
			});
	};

	getShifting = () => {
		const Shifting = Parse.Object.extend('Shifting');
		const query = new Parse.Query(Shifting);

		query.equalTo('status', 1);
		query
			.find()
			.then((x) => {
				this.setState({ daftarShifting: x });
			})
			.catch((err) => {
				alert('cek koneksi anda');
			});
	};

	getLeader = () => {
		this.setState({ loading: true });
		const User = new Parse.User();
		const query = new Parse.Query(User);

		query.equalTo('roles', 'leader' || 'Leader');

		query
			.find({ useMasterKey: true })
			.then((x) => {
				this.setState({ daftarLeader: x, loading: false });
			})
			.catch((err) => {
				this.setState({ loading: false });
				alert('cek koneksi anda');
			});
	};

	getAbsen = () => {
		const Absence = new Parse.Object.extend('Absence');
		const query = new Parse.Query(Absence);

		const d = new Date();
		const start = new moment(d);
		start.startOf('day');
		const finish = new moment(start);
		finish.add(1, 'day');

		query.equalTo('leaderIdNew', {
			__type: 'Pointer',
			className: '_User',
			objectId: 'iIoJF9pqc6'
		});

		query
			.find()
			.then((x) => {
				console.log(x);
			})
			.catch((err) => {
				console.log(err.message);
			});
	};

	handleFace = (e) => {
		this.setState({ loadingReco: true, statusReco: 0, fotoWajah: e.target.files[0] });
		const formData = new FormData();
		formData.append('knax', e.target.files[0]);
		Axios.post('http://35.247.147.177:4000/api/face-check', formData, {
			headers: {
				'Content-Type': 'multipart/form-data'
			}
		})
			.then(({ data }) => {
				if (data.status === 1)
					return this.setState({
						statusReco: 1,
						message: `✔️ ${data.message}`,
						loadingReco: false
					});
				return this.setState({
					statusReco: 0,
					message: `✖️ ${data.message}`,
					loadingReco: false
				});
			})
			.catch((err) => alert('Terjadi error...'));
	};

	handleSubmit = (e) => {
		e.preventDefault();
		this.setState({ loading: true });
		const {
			name,
			nik,
			tipeKaryawan,
			posisi,
			level,
			imei,
			jamKerja,
			lokasiKerja,
			jumlahCuti,
			lembur,
			fotoWajah,
			username,
			password,
			email
		} = this.state;

		const user = new Parse.User();
		const Shifting = new Parse.Object.extend('Shifting');
		user.set('leaderIdNew', {
			__type: 'Pointer',
			className: '_User',
			objectId: this.state.selectLeader
		});
		user.set('shifting', Shifting.createWithoutData(this.state.shifting));
		user.set('fullname', name);
		user.set('email', email);
		user.set('username', username);
		user.set('password', password);
		user.set('passwordClone', password);
		user.set('nik', nik.toUpperCase());
		user.set('tipe', tipeKaryawan);
		user.set('posisi', posisi);
		user.set('level', level);
		user.set('imei', imei);
		user.set('jamKerja', jamKerja);
		user.set('lokasiKerja', lokasiKerja);
		user.set('jumlahCuti', parseInt(jumlahCuti));
		user.set('lembur', lembur);
		user.set('roles', level);
		user.set('fotoWajah', new Parse.File('profile.jpg', fotoWajah));
		user
			.save()
			.then((x) => {
				this.setState({
					daftarStaff: this.state.daftarStaff.concat(x),
					addMode: false,
					loading: false
				});
			})
			.catch((err) => {
				this.setState({ addMode: false, loading: false });
				alert(err.message);
			});
	};

	toggle = (state) => {
		this.setState({
			[state]: !this.state[state]
		});
	};

	render() {
		const {
			daftarStaff,
			loading,
			loadingReco,
			message,
			approvalMode,
			rejectMode,
			loadingModal,
			fullnames,
			addMode,
			photoMode,
			statusReco,
			daftarShifting,
			daftarLevel,
			daftarPosisi,
			daftarTipe
		} = this.state;

		return (
			<React.Fragment>
				<HeaderNormal />
				{/* Page content */}
				<Container className="mt--8" fluid>
					{/* Table */}
					<Row>
						<div className="col">
							<Card className="shadow">
								<CardHeader className="border-0">
									<Row>
										<Button
											className="ml-2"
											color="primary"
											data-dismiss="modal"
											type="button"
											onClick={() => this.setState({ addMode: true })}
										>
											<i className="fa fa-plus" /> Register
										</Button>
									</Row>
									{/* <input type="text" placeholder="input" /> */}
								</CardHeader>
								<Table className="align-items-center table-flush" responsive>
									<thead className="thead-light">
										<tr>
											<th scope="col">NIK</th>
											<th scope="col">Nama</th>
											<th scope="col">Email</th>
											<th scope="col">Tipe Karyawan</th>
											<th scope="col">Posisi</th>
											<th scope="col">Level</th>
											<th scope="col">Aksi</th>
										</tr>
									</thead>
									<tbody>
										{loading ? (
											<td colSpan={6} style={{ textAlign: 'center' }}>
												<Spinner
													as="span"
													cuti
													animation="grow"
													size="sm"
													role="status"
													aria-hidden="true"
												/>{' '}
												<Spinner
													as="span"
													animation="grow"
													size="sm"
													role="status"
													aria-hidden="true"
												/>{' '}
												<Spinner
													as="span"
													animation="grow"
													size="sm"
													role="status"
													aria-hidden="true"
												/>
											</td>
										) : daftarStaff.length < 1 ? (
											<td colSpan={6} style={{ textAlign: 'center' }}>
												No data found...
											</td>
										) : (
											daftarStaff.map((prop, key) => (
												<tr>
													<td>{prop.get('nik')}</td>
													<td>{prop.get('fullname')}</td>
													<td>{prop.get('email')}</td>
													<td>{prop.get('tipe')}</td>
													<td>{prop.get('posisi')}</td>
													<td>{prop.get('level')}</td>
													<td>
														<Button
															id="t4"
															color="yellow"
															className="btn-circle"
															onClick={() => {
																this.setState({
																	viewPhoto: true
																});
															}}
														>
															<i className="fa fa-eye" />
														</Button>
														<UncontrolledTooltip
															delay={0}
															placement="top"
															target="t4"
														>
															Lihat detail
														</UncontrolledTooltip>

														<Button
															id="t1"
															color="primary"
															className="btn-circle"
															onClick={() => {
																this.setState({
																	approvalMode: true,
																	userId: prop.id,
																	userIndex: key,
																	fullnames: prop.get('fullname')
																});
															}}
														>
															<i className="fa fa-edit" />
														</Button>
														<UncontrolledTooltip
															delay={0}
															placement="top"
															target="t1"
														>
															Ubah data
														</UncontrolledTooltip>

														<Button
															id="t2"
															className="btn-circle btn-danger"
															onClick={(e) => {
																this.setState({
																	rejectMode: true,
																	userId: prop.id,
																	userIndex: key,
																	fullnames: prop.get('fullname')
																});
															}}
														>
															<i className="fa fa-trash" />
														</Button>
														<UncontrolledTooltip
															delay={0}
															placement="top"
															target="t2"
														>
															Hapus karyawan
														</UncontrolledTooltip>
													</td>
												</tr>
											))
										)}
									</tbody>
								</Table>
							</Card>
						</div>
					</Row>
				</Container>

				{/* add modal */}
				<ModalHandler
					show={addMode}
					loading={loadingModal}
					footer={false}
					handleHide={() => this.toggle('addMode')}
					title="Tambah Data"
					body={
						<Form onSubmit={this.handleSubmit} autoComplete="off">
							<FormGroup controlId="formCategory">
								<Label>Foto wajah</Label>
								<Input
									type="file"
									label="Foto wajah"
									onChange={this.handleFace}
									required={true}
								/>
								<FormText
									className={loadingReco ? 'text-muted' : ''}
									style={{
										color: `${this.state.statusReco == 0 ? 'red' : 'green'}`
									}}
								>
									{loadingReco ? 'processing...' : message}
								</FormText>
							</FormGroup>

							<FormGroup controlId="formNama">
								<Label>Nama</Label>
								<Input
									autoCapitalize="true"
									autoComplete="false"
									required={true}
									type="text"
									placeholder="Masukkan nama"
									onChange={(e) => this.setState({ name: e.target.value })}
								/>
							</FormGroup>

							<FormGroup controlId="formTipex">
								<Label>Level</Label>
								<Input
									type="select"
									required={true}
									onChange={(e) =>
										this.setState({
											level: e.target.value
										})}
								>
									<option selected disabled hidden>
										Pilih level
									</option>
									{daftarLevel.map((x, i) => (
										<option key={i} value={x.get('level')}>
											{x.get('level')}
										</option>
									))}
								</Input>
							</FormGroup>

							{this.state.level !== 'Leader' && this.state.level !== 'Admin' ? (
								<FormGroup controlId="formLeaders">
									<Label>Pilih leader</Label>
									<Input
										type="select"
										required={true}
										onChange={(e) =>
											this.setState({
												selectLeader: e.target.value
											})}
									>
										<option selected disabled hidden>
											Pilih leader
										</option>
										{this.state.daftarLeader.map((x, i) => (
											<option key={i} value={x.id}>
												{x.get('fullname')}
											</option>
										))}
									</Input>
								</FormGroup>
							) : (
								''
							)}

							<FormGroup controlId="formEmail">
								<Label>Email</Label>
								<Input
									autoComplete="off"
									required={true}
									type="email"
									placeholder="Masukkan email"
									onChange={(e) => this.setState({ email: e.target.value })}
								/>
							</FormGroup>

							<FormGroup controlId="formx">
								<Label>Username</Label>
								<Input
									autoComplete="off"
									required={true}
									type="text"
									placeholder="Masukkan username"
									onChange={(e) => this.setState({ username: e.target.value })}
								/>
							</FormGroup>

							<FormGroup controlId="formz">
								<Label>Password</Label>
								<Input
									autoCapitalize="true"
									autoComplete="new-password"
									required={true}
									type="password"
									placeholder="Masukkan password"
									onChange={(e) => this.setState({ password: e.target.value })}
								/>
							</FormGroup>

							<FormGroup controlId="formNik">
								<Label>NIK</Label>
								<Input
									autoCapitalize="true"
									autoComplete="false"
									required={true}
									type="text"
									placeholder="Masukkan NIK"
									onChange={(e) =>
										this.setState({ nik: e.target.value.toUpperCase() })}
								/>
							</FormGroup>

							<FormGroup controlId="formTipex">
								<Label>Tipe karyawan</Label>
								<Input
									type="select"
									required={true}
									onChange={(e) =>
										this.setState({
											tipeKaryawan: e.target.value
										})}
								>
									<option selected disabled hidden>
										Pilih tipe karyawan
									</option>
									{daftarTipe.map((x, i) => (
										<option key={i} value={x.get('tipe')}>
											{x.get('tipe')}
										</option>
									))}
								</Input>
							</FormGroup>

							<FormGroup controlId="formPosisi">
								<Label>Posisi</Label>
								<Input
									required={true}
									type="select"
									onChange={(e) =>
										this.setState({ posisi: e.target.value.toUpperCase() })}
								>
									<option selected disabled hidden>
										Pilih posisi
									</option>
									{daftarPosisi.map((x, i) => (
										<option key={i} value={x.get('position')}>
											{x.get('position')}
										</option>
									))}
								</Input>
							</FormGroup>

							<FormGroup controlId="formImei">
								<Label>IMEI</Label>
								<Input
									autoCapitalize="true"
									autoComplete="false"
									required={true}
									type="text"
									placeholder="Masukkan imei hp"
									onChange={(e) => this.setState({ imei: e.target.value })}
								/>
							</FormGroup>

							<FormGroup controlId="formJam">
								<Label>Jam kerja</Label>
								<Input
									type="select"
									required={true}
									onChange={(e) =>
										this.setState({
											jamKerja: e.target.value
										})}
								>
									<option selected disabled hidden>
										Pilih jam kerja
									</option>
									{[ 'Jam tetap', 'Jam fleksibel', 'Jam bebas' ].map((x) => (
										<option value={x}>{x}</option>
									))}
								</Input>
							</FormGroup>

							<FormGroup controlId="formShifting">
								<Label>Shifting</Label>
								<Input
									type="select"
									required={true}
									onChange={(e) =>
										this.setState({
											shifting: e.target.value
										})}
								>
									<option selected disabled hidden>
										Pilih shifting
									</option>
									{daftarShifting.map((x) => (
										<option value={x.id}>{x.get('tipeShift')}</option>
									))}
								</Input>
							</FormGroup>

							<FormGroup controlId="formLokasi">
								<Label>Lokasi kerja</Label>
								<Input
									type="select"
									required={true}
									onChange={(e) =>
										this.setState({
											lokasiKerja: e.target.value
										})}
								>
									<option selected disabled hidden>
										Pilih lokasi kerja
									</option>
									{[ 'Tetap', 'Bebas (mobile)' ].map((x) => (
										<option value={x}>{x}</option>
									))}
								</Input>
							</FormGroup>

							<FormGroup controlId="formCuti">
								<Label>Jumlah cuti</Label>
								<Input
									type="number"
									required={true}
									placeholder="Masukkan jumlah cuti"
									onChange={(e) =>
										this.setState({ jumlahCuti: parseInt(e.target.value) })}
								/>
							</FormGroup>

							<FormGroup controlId="formLembut">
								<Label>Lembur</Label>
								<Input
									type="select"
									defaultValue="all"
									required={true}
									onChange={(e) =>
										this.setState({
											lembur: e.target.value
										})}
								>
									<option selected disabled hidden>
										Pilih lembur
									</option>
									{[ 'Ya', 'Tidak' ].map((x) => <option value={x}>{x}</option>)}
								</Input>
							</FormGroup>

							<Button
								color={this.state.statusReco === 0 ? 'danger' : 'primary'}
								type="submit"
								disabled={this.state.statusReco === 0 ? true : false}
							>
								{this.state.statusReco === 0 ? (
									'upload foto dahulu'
								) : this.state.loading ? (
									'Please wait..'
								) : (
									'Submit'
								)}
							</Button>
						</Form>
					}
					handleSubmit={(e) => this.handleAdd(e)}
				/>
			</React.Fragment>
		);
	}
}

export default RegisterKaryawan;
