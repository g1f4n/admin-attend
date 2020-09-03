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
import emailjs from 'emailjs-com';
import Alertz from 'components/Alert/Alertz';

class SelfRegistration extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			selfRegist: [],
			daftarLeader: [],
			daftarTipe: [],
			daftarPosisi: [],
			daftarLevel: [],
			daftarShifting: [],
			detail: {},
			loading: false,
			approvalMode: false,
			rejectMode: false,
			detailMode: false,
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
			name: '',
			nik: '',
			tipeKaryawan: '',
			posisi: '',
			imei: '',
			jamKerja: '',
			lokasiKerja: '',
			jumlahCuti: 0,
			lembur: 'ya',
			username: '',
			password: '',
			selectLeader: '',
			statusReco: 0,
			email: '',
			fotoWajahObj: {},
			message: '',
			color: 'danger',
			visible: false,
			daftarPoint: [],
			jamMasuk: 0,
			jamKeluar: 0,
			absenPoint: []
		};
	}

	componentDidMount() {
		this.getStaff();
		this.getLeader();
		this.getLevel();
		this.getPosisi();
		this.getTipe();
		this.getPoint();
		this.getShifting();
		emailjs.init('user_h2fWwDoztgEPcKNQ9vadt');
	}

	getPoint = () => {
		const ValidGeopoint = new Parse.Object.extend('ValidGeopoint');
		const query = new Parse.Query(ValidGeopoint);

		query.equalTo('status', 1);
		query
			.find()
			.then((x) => {
				this.setState({ daftarPoint: x, loading: false });
			})
			.catch((err) => {
				alert(err.message);
				this.setState({ loading: false });
			});
	};

	sendEmail = (e) => {
		emailjs.sendForm('gmail', 'template_N8cRQk3D', e.target, 'user_h2fWwDoztgEPcKNQ9vadt').then(
			(result) => {
				console.log(result.text);
			},
			(error) => {
				console.log(error.text);
			}
		);
	};

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
		const SelfRegist = Parse.Object.extend('SelfRegist');
		const query = new Parse.Query(SelfRegist);

		query.equalTo('status', 3);

		query
			.find()
			.then((x) => {
				this.setState({ selfRegist: x, loading: false });
			})
			.catch((err) => {
				this.setState({ loading: false });
				alert('cek koneksi anda');
			});
	};

	getDetail = (e, id, state) => {
		e.preventDefault();
		const SelfRegist = Parse.Object.extend('SelfRegist');
		const query = new Parse.Query(SelfRegist);

		query
			.get(id)
			.then(({ attributes }) => {
				console.log(attributes);
				this.setState(
					{
						nik: attributes.nik,
						name: attributes.fullname,
						username: attributes.usernameClone,
						imei: attributes.imei,
						email: attributes.email,
						fotoWajah:
							attributes.fotoWajah === undefined ? '' : attributes.fotoWajah.url(),
						fotoWajahObj: attributes.fotoWajah,
						password: attributes.passwordClone,
						loading: false,
						[state]: true
					},
					() => console.log(this.state.fotoWajah)
				);
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

	handleSendEmail = (email, from, to, message, alasan, state, alertMessage) => {
		var template_params = {
			to_email: email,
			from_name: from,
			to_name: to,
			message_html: message,
			alasan: alasan
		};

		var service_id = 'gmail';
		var template_id = 'template_N8cRQk3D';
		emailjs
			.send(service_id, template_id, template_params)
			.then(() => {
				this.setState({
					[state]: false,
					loadingModal: false,
					message: alertMessage,
					visible: true,
					color: 'success'
				});
				//alert(`Berhasil ${state === 'addMode' ? 'registrasi' : 'reject'}`);
				console.log('sukses');

				window.location.reload(false);
				return;
			})
			.catch((err) => {
				this.setState({
					[state]: false,
					loadingModal: false,
					message: 'Gagal tambah data, coba lagi',
					visible: true
				});
				//alert('Something went wrong, please try again');
				console.log(err);
				window.location.reload(false);
			});
	};

	handleReject = (e) => {
		e.preventDefault();
		this.setState({ loadingModal: true });

		const SelfRegist = Parse.Object.extend('SelfRegist');
		const query = new Parse.Query(SelfRegist);

		query.get(this.state.userId).then((x) => {
			x.set('status', 0);
			x.set('alasanReject', this.state.reason);
			x
				.save()
				.then(() => {
					this.handleSendEmail(
						this.state.email,
						'KTA Team',
						this.state.name,
						'Maaf self registration kamu ditolak dengan alasan:',
						this.state.reason,
						'rejectMode',
						'Berhasil reject'
					);
				})
				.catch((err) => {
					alert(err.message);
					this.setState({
						loadingModal: false,
						rejectMode: false,
						message: 'Gagal reject data',
						visible: true
					});
				});
		});
	};

	handleSubmit = (e) => {
		e.preventDefault();
		this.setState({ loadingModal: true });
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
			email,
			absenPoint
		} = this.state;

		const user = new Parse.User();
		user.set('leaderIdNew', {
			__type: 'Pointer',
			className: '_User',
			objectId: this.state.selectLeader
		});
		// user.set('absenPoint', {
		// 	__type: 'Pointer',
		// 	className: 'ValidGeopoint',
		// 	objectId: absenPoint
		// });
		user.set('fullname', name);
		user.set('email', email);
		user.set('username', nik.toUpperCase());
		user.set('password', password);
		user.set('absenPoint', this.state.absenPoint);
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
		user.set('fotoWajah', this.state.fotoWajahObj);
		user
			.save()
			.then((x) => {
				const SelfRegist = Parse.Object.extend('SelfRegist');
				const query = new Parse.Query(SelfRegist);

				query.get(this.state.userId).then((x) => {
					x.set('status', 1);
					x
						.save()
						.then(() => {
							this.handleSendEmail(
								this.state.email,
								'KTA Team',
								this.state.name,
								'Selamat kamu berhasil melakukan self registration! Silahkan login menggunakan NIK dan password yang sudah kamu buat, terimakasih!',
								'',
								'addMode',
								'Berhasil approve data'
							);
						})
						.catch((err) => {
							console.log(err.message);
							this.setState({
								loadingModal: false,
								rejectMode: false,
								message: 'Gagal tambah data, coba lagi',
								visible: true
							});
						});
				});
			})
			.catch((err) => {
				this.setState({
					addMode: false,
					loadingModal: false,
					message: 'Gagal tambah data, coba lagi',
					visible: true
				});
				console.log(err.message);
				//alert(err.message);
			});
	};

	toggle = (state) => {
		this.setState({
			[state]: !this.state[state]
		});
	};

	render() {
		const {
			selfRegist,
			loading,
			loadingReco,
			message,
			approvalMode,
			daftarPoint,
			rejectMode,
			detailMode,
			loadingModal,
			fullnames,
			addMode,
			photoMode,
			username,
			statusReco,
			imei,
			nik,
			daftarLevel,
			daftarPosisi,
			daftarTipe,
			email,
			fotoWajah,
			name
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
									<h3>Data self registration</h3>
									<Row>
										<Alertz
											color={this.state.color}
											message={this.state.message}
											open={this.state.visible}
											togglez={() => this.toggle('visible')}
										/>
										{/* <Button
											className="ml-2"
											color="primary"
											data-dismiss="modal"
											type="button"
											onClick={() => this.setState({ addMode: true })}
										>
											<i className="fa fa-plus" /> Register
										</Button> */}
									</Row>
									{/* <input type="text" placeholder="input" /> */}
								</CardHeader>
								<Table className="align-items-center table-flush" responsive>
									<thead className="thead-light">
										<tr>
											<th scope="col">NIK</th>
											<th scope="col">Nama</th>
											<th scope="col">Email</th>
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
										) : selfRegist.length < 1 ? (
											<tr>
												<td colSpan={6} style={{ textAlign: 'center' }}>
													No data found...
												</td>
											</tr>
										) : (
											selfRegist.map((prop, key) => (
												<tr>
													<td>{prop.get('nik')}</td>
													<td>{prop.get('fullname')}</td>
													<td>{prop.get('email')}</td>
													<td>
														<Button
															id="t4"
															color="yellow"
															className="btn-circle"
															onClick={(e) => {
																this.setState({
																	userId: prop.id,
																	userIndex: key,
																	fullnames: prop.get('fullname')
																});
																this.getDetail(
																	e,
																	prop.id,
																	'detailMode'
																);
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
															onClick={(e) => {
																this.setState({
																	userId: prop.id,
																	userIndex: key,
																	fullnames: prop.get('fullname')
																});
																this.getDetail(
																	e,
																	prop.id,
																	'addMode'
																);
															}}
														>
															<i className="fa fa-check" />
														</Button>
														<UncontrolledTooltip
															delay={0}
															placement="top"
															target="t1"
														>
															Registrasi
														</UncontrolledTooltip>

														<Button
															id="t2"
															className="btn-circle btn-danger"
															onClick={(e) => {
																this.setState({
																	rejectMode: true,
																	userId: prop.id,
																	userIndex: key,
																	email: prop.get('email'),
																	fullnames: prop.get('fullname')
																});
															}}
														>
															<i className="fa fa-times" />
														</Button>
														<UncontrolledTooltip
															delay={0}
															placement="top"
															target="t2"
														>
															Reject
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
					show={detailMode}
					loading={loadingModal}
					footer={false}
					handleHide={() => this.toggle('detailMode')}
					title="Details"
					body={
						<Form onSubmit={(e) => e.preventDefault()}>
							{fotoWajah !== '' ? (
								<FormGroup>
									<Label>Foto Wajah</Label>
									<Row className="ml-1">
										<img
											height={100}
											width={100}
											src={fotoWajah === '' ? '' : fotoWajah}
											alt="foto"
										/>
									</Row>
								</FormGroup>
							) : (
								''
							)}

							<FormGroup controlId="formNama">
								<Label>Nama</Label>
								<Input
									name="to_name"
									autoCapitalize="true"
									autoComplete="false"
									required={true}
									value={name}
									type="text"
									placeholder="Masukkan nama"
									onChange={(e) => this.setState({ name: e.target.value })}
								/>
							</FormGroup>

							<FormGroup controlId="formEmail">
								<Label>Email</Label>
								<Input
									name="to_email"
									autoComplete="off"
									required={true}
									type="email"
									value={email}
									placeholder="Masukkan email"
									onChange={(e) => this.setState({ email: e.target.value })}
								/>
							</FormGroup>

							<FormGroup controlId="formNik">
								<Label>NIK</Label>
								<Input
									autoCapitalize="true"
									autoComplete="false"
									required={true}
									value={nik}
									type="text"
									placeholder="Masukkan NIK"
									onChange={(e) => this.setState({ nik: e.target.value })}
								/>
							</FormGroup>

							<FormGroup controlId="formImei">
								<Label>IMEI</Label>
								<Input
									autoCapitalize="true"
									autoComplete="false"
									required={true}
									value={imei}
									type="text"
									placeholder="Masukkan imei hp"
									onChange={(e) => this.setState({ imei: e.target.value })}
								/>
							</FormGroup>
						</Form>
					}
				/>

				{/* add modal */}
				<ModalHandler
					show={addMode}
					loading={loadingModal}
					footer={false}
					handleHide={() => this.toggle('addMode')}
					title="Tambah Data"
					body={
						<Form onSubmit={this.handleSubmit}>
							<FormGroup controlId="formNama">
								<Label>Nama</Label>
								<Input
									name="to_name"
									autoCapitalize="true"
									autoComplete="false"
									required={true}
									value={name}
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
									name="to_email"
									required={true}
									type="email"
									value={email}
									placeholder="Masukkan email"
									onChange={(e) => this.setState({ email: e.target.value })}
								/>
							</FormGroup>

							<FormGroup controlId="formNik">
								<Label>NIK</Label>
								<Input
									autoCapitalize="true"
									autoComplete="false"
									required={true}
									value={nik}
									type="text"
									placeholder="Masukkan NIK"
									onChange={(e) => this.setState({ nik: e.target.value })}
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

							{fotoWajah !== '' ? (
								<FormGroup>
									<Label>Foto Wajah</Label>
									<Row className="ml-1">
										<img
											height={100}
											width={100}
											src={fotoWajah === '' ? '' : fotoWajah}
											alt="foto"
										/>
									</Row>
								</FormGroup>
							) : (
								''
							)}

							<FormGroup controlId="formImei">
								<Label>IMEI</Label>
								<Input
									autoCapitalize="true"
									autoComplete="false"
									required={true}
									value={imei}
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

							{this.state.jamKerja !== '' && this.state.jamKerja !== 'Jam bebas' ? (
								<FormGroup controlId="formJam">
									<Label>Jam masuk dan keluar</Label>
									<Row>
										<Col md={6}>
											<Input
												type="number"
												required={true}
												placeholder="Jam Masuk"
												onChange={(e) =>
													this.setState({
														jamMasuk: e.target.value
													})}
											/>
										</Col>
										<Col md={6}>
											<Input
												type="number"
												placeholder="Jam Keluar"
												required={true}
												onChange={(e) =>
													this.setState({
														jamKeluar: e.target.value
													})}
											/>
										</Col>
									</Row>
								</FormGroup>
							) : (
								''
							)}

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

							{this.state.lokasiKerja === 'Tetap' ? (
								<FormGroup controlId="formPoint">
									<Label>Absen point</Label>
									<Input
										type="select"
										required={true}
										onChange={(e) =>
											this.setState(
												{
													absenPoint: e.target.value.split(',')
												},
												() =>
													this.state.absenPoint.map((x) => {
														console.log(parseFloat(x));
													})
											)}
									>
										<option selected disabled hidden>
											Pilih absen point
										</option>
										{daftarPoint.map((x) => (
											<option
												value={[
													parseFloat(x.get('latitude')),
													parseFloat(x.get('longitude'))
												]}
											>
												{x.get('placeName')}
											</option>
										))}
									</Input>
								</FormGroup>
							) : (
								''
							)}

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

							<Button color="primary" type="submit" disabled={loadingModal}>
								{loadingModal ? (
									<div>
										<Spinner
											as="span"
											cuti
											animation="grow"
											size="sm"
											role="status"
											aria-hidden="true"
										/>{' '}
										Submitting...
									</div>
								) : (
									'Submit'
								)}
							</Button>
						</Form>
					}
					handleSubmit={(e) => this.handleAdd(e)}
				/>

				{/* reject modal */}
				<ModalHandler
					show={rejectMode}
					loading={loadingModal}
					handleHide={() => this.toggle('rejectMode')}
					title="Reject Confirmation"
					body={
						<div>
							<h3 className="mb-4">{`Reject self registration ${fullnames} ?`}</h3>
							<Form onSubmit={(e) => this.handleReject(e)}>
								<FormGroup>
									<Input
										id="exampleFormControlInput1"
										placeholder="Masukkan alasan"
										type="textarea"
										required={true}
										onChange={(e) => this.setState({ reason: e.target.value })}
									/>
								</FormGroup>
								<Button
									color="secondary"
									data-dismiss="modal"
									type="button"
									onClick={() => this.toggle('rejectMode')}
								>
									Close
								</Button>
								<Button color="primary" type="submit">
									{loadingModal ? (
										<div>
											<Spinner
												as="span"
												animation="grow"
												size="sm"
												role="status"
												aria-hidden="true"
											/>{' '}
											Submitting...
										</div>
									) : (
										'Submit'
									)}
								</Button>
							</Form>
						</div>
					}
					handleSubmit={(e) => this.handleReject(e)}
				/>
			</React.Fragment>
		);
	}
}

export default SelfRegistration;
