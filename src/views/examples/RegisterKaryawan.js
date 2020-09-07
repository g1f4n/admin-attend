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
import md5 from 'md5';
import Paginations from 'components/Pagination/Pagination';
import Alertz from 'components/Alert/Alertz';

class RegisterKaryawan extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			daftarStaff: [],
			daftarLeader: [],
			daftarTipe: [],
			daftarPosisi: [],
			daftarLevel: [],
			resPerPage: 25,
			first: {},
			loading: false,
			approvalMode: false,
			rejectMode: false,
			counter: 0,
			loadingModal: false,
			fullnames: '',
			fullname: '',
			userId: '',
			userIndex: 0,
			reason: '',
			checkId: [],
			addMode: false,
			editMode: false,
			deleteCounter: 0,
			loadingReco: false,
			message: '',
			level: 'Leader',
			fotoWajah: '',
			message: '',
			loadingReco: false,
			nama: '',
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
			fotoWajahObject: {},
			daftarShifting: [],
			shifting: {},
			leader: {},
			message: '',
			color: '',
			visible: false,
			message: '',
			color: 'danger',
			absenPoint: [],
			daftarPoint: [],
			imeiMessage: '',
			searchBy: 'all',
			searchValue: '',
			jamMasuk: 0,
			jamKeluar: 0
		};
	}

	componentDidMount() {
		this.getStaff();
		this.getLeader();
		this.getLevel();
		this.getPosisi();
		this.getTipe();
		this.getShifting();
		this.getPoint();
		//this.testRelasi();
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

	// testRelasi = () => {
	// 	// Declare the types.
	// 	var Post = Parse.Object.extend('Post');
	// 	var Comment = Parse.Object.extend('Comment');

	// 	// Create the post
	// 	var myPost = new Post();
	// 	myPost.set('title', "I'm Hungry");
	// 	myPost.set('content', 'Where should we go for lunch?');

	// 	// Create the comment
	// 	var myComment = new Comment();
	// 	myComment.set('content', "Let's do Sushirrito.");

	// 	// Add the post as a value in the comment
	// 	myComment.set('parent', myPost);

	// 	// This will save both myPost and myComment
	// 	myComment.save();
	// };

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

	getData = () => {
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

	handleFilter = (e) => {
		e.preventDefault();
		this.setState({ loadingFilter: true });
		const { searchBy, searchValue } = this.state;
		const { resPerPage, page } = this.state;

		const User = new Parse.User();
		const query = new Parse.Query(User);

		// query.notContainedIn('roles', [ 'admin', 'leader', 'Admin', 'Leader' ]);
		// query.skip(resPerPage * page - resPerPage);
		// query.limit(resPerPage);
		query.withCount();

		switch (searchBy) {
			case 'all':
				query
					.find({ useMasterKey: true })
					.then((x) => {
						this.setState({
							daftarStaff: x.results,
							totalData: x.count,
							loadingFilter: false
						});
					})
					.catch((err) => {
						this.setState({ loadingFilter: false });
						alert('cek koneksi anda');
					});
				break;

			case 'name':
				query.matches('fullname', searchValue, 'i');
				query
					.find({ useMasterKey: true })
					.then((x) => {
						this.setState({
							daftarStaff: x.results,
							totalData: x.count,
							loadingFilter: false
						});
					})
					.catch((err) => {
						this.setState({ loadingFilter: false });
						alert('cek koneksi anda');
					});
				break;

			case 'nik':
				query.equalTo('nik', searchValue);
				query
					.find({ useMasterKey: true })
					.then((x) => {
						this.setState({
							daftarStaff: x.results,
							totalData: x.count,
							loadingFilter: false
						});
					})
					.catch((err) => {
						this.setState({ loadingFilter: false });
						alert('cek koneksi anda');
					});
				break;

			case 'level':
				query.matches('level', searchValue, 'i');
				query
					.find({ useMasterKey: true })
					.then((x) => {
						this.setState({
							daftarStaff: x.results,
							totalData: x.count,
							loadingFilter: false
						});
					})
					.catch((err) => {
						this.setState({ loadingFilter: false });
						alert('cek koneksi anda');
					});
				break;

			case 'leader':
				const leader = new Parse.User();
				const leaderQuery = new Parse.Query(leader);
				leaderQuery.matches('fullname', searchValue, 'i');

				query.matchesQuery('leaderIdNew', leaderQuery);
				query
					.find({ useMasterKey: true })
					.then((x) => {
						this.setState({
							daftarStaff: x.results,
							totalData: x.count,
							loadingFilter: false
						});
					})
					.catch((err) => {
						this.setState({ loadingFilter: false });
						alert('cek koneksi anda');
					});
				break;
			default:
				break;
		}
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
		Axios.post('http://35.247.149.107:4000/api/face-check', formData, {
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

	handleCheckImei = (e, imei) => {
		e.preventDefault();
		this.setState({ loadingModal: true });

		const user = new Parse.User();
		const query = new Parse.Query(user);

		query.equalTo('imei', imei);
		query
			.first()
			.then((x) => {
				if (x) {
					this.setState({
						imeiMessage: 'Imei telah terdaftar',
						loadingModal: false
					});
					return;
				} else {
					this.handleSubmit();
				}
			})
			.catch((err) => {
				console.log(err);
				this.setState({ loadingModal: false });
			});
	};

	handleSubmit = () => {
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
		//user.set('shifting', Shifting.createWithoutData(this.state.shifting));
		user.set('fullname', name);
		user.set('email', email);
		user.set('username', username);
		user.set('password', md5(password));
		user.set('passwordClone', md5(password));
		user.set('nik', nik.toUpperCase());
		user.set('tipe', tipeKaryawan);
		user.set('posisi', posisi);
		user.set('level', level);
		user.set('imei', imei);
		user.set('jamKerja', jamKerja);
		user.set('lokasiKerja', lokasiKerja);
		user.set('jamMasuk', this.state.jamMasuk);
		user.set('jamKeluar', this.state.jamKeluar);
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
					loading: false,
					message: 'Berhasil tambah data',
					visible: true,
					color: 'success'
				});
			})
			.catch((err) => {
				this.setState({
					addMode: false,
					loading: false,
					message: 'Gagal tambah data, coba lagi',
					visible: true
				});
				console.log(err.message);
			});
	};

	handleUpdate = (e) => {
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
			email
		} = this.state;

		const user = new Parse.User();
		const query = new Parse.Query(user);
		const Shifting = new Parse.Object.extend('Shifting');
		Shifting.id = this.state.selectLeader;

		query
			.get(this.state.userId)
			.then((x) => {
				if (this.state.selectLeader !== '')
					x.set('leaderIdNew', {
						__type: 'Pointer',
						className: '_User',
						objectId: this.state.selectLeader
					});
				// if (this.state.shifting !== '')
				// 	x.set('shifting', {
				// 		__type: 'Pointer',
				// 		className: 'Shifting',
				// 		objectId: this.state.shifting
				// 	});
				x.set('fullname', this.state.fullname);
				x.set('email', email);
				x.set('username', username);
				x.set('jamMasuk', this.state.jamMasuk);
				x.set('jamKeluar', this.state.jamKeluar);
				x.set('username', username);
				if (password !== '') {
					x.set('password', md5(password));
					x.set('passwordClone', md5(password));
				}
				x.set('nik', nik.toUpperCase());
				x.set('tipe', tipeKaryawan);
				x.set('posisi', posisi);
				x.set('level', level);
				x.set('imei', imei);
				x.set('jamKerja', jamKerja);
				x.set('lokasiKerja', lokasiKerja);
				x.set('jumlahCuti', parseInt(jumlahCuti));
				x.set('lembur', lembur);
				x.set('roles', level);
				if (fotoWajah !== '') x.set('fotoWajah', new Parse.File('profile.jpg', fotoWajah));
				x
					.save(null, { useMasterKey: true })
					.then((x) => {
						this.setState({
							editMode: false,
							loadingModal: false,
							message: 'Berhasil update data',
							visible: true,
							color: 'success'
						});
					})
					.catch((err) => {
						this.setState({
							editMode: false,
							loadingModal: false,
							message: 'Gagal update data, coba lagi',
							visible: true
						});
						console.log(err.message);
					});
			})
			.catch((err) => {
				this.setState({
					editMode: false,
					loadingModal: false,
					message: err.message,
					visible: true
				});
				console.log(err.message);
			});
	};

	getDetail = (e, id) => {
		e.preventDefault();
		const user = new Parse.User();
		const query = new Parse.Query(user);

		query.include('shifting');
		query.include('leaderIdNew');
		query
			.get(id, { useMasterKey: true })
			.then(({ attributes }) => {
				console.log(attributes);
				// for (let i in attributes) {
				// 	console.log(`${i} : ${attributes[i]}`);
				// 	this.setState({ i: attributes[i] === undefined ? '' : attributes[i] });
				// }
				// console.log(attributes);
				this.setState({
					nik: attributes.nik,
					name: attributes.fullname,
					username: attributes.username,
					imei: attributes.imei,
					email: attributes.email,
					tipeKaryawan: attributes.tipe,
					posisi: attributes.posisi,
					jamKerja: attributes.jamKerja,
					lokasiKerja: attributes.lokasiKerja,
					jumlahCuti: attributes.jumlahCuti,
					shifting: attributes.shifting === undefined ? '' : attributes.shifting,
					lembur: attributes.lembur,
					level: attributes.level.toLowerCase(),
					leader: attributes.leaderIdNew === undefined ? '' : attributes.leaderIdNew,
					editMode: true
				});
			})
			.catch((err) => {
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
			level,
			email,
			fullname,
			imei,
			jamKerja,
			jumlahCuti,
			lokasiKerja,
			shifting,
			lembur,
			tipeKaryawan,
			nik,
			posisi,
			daftarPoint,
			loadingModal,
			fullnames,
			addMode,
			leader,
			photoMode,
			statusReco,
			daftarShifting,
			daftarLevel,
			daftarPosisi,
			daftarTipe,
			editMode
		} = this.state;

		const selectForm = (
			<FormGroup controlId="formlvl">
				<Input
					className="form-control-alternative"
					type="select"
					required={true}
					onChange={(e) =>
						this.setState({
							searchValue: e.target.value
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
		);

		const textForm = (
			<FormGroup>
				<Input
					type="text"
					className="form-control-alternative"
					disabled={this.state.searchBy === 'all'}
					placeholder={
						this.state.searchBy === 'all' ? '' : `Masukkan ${this.state.searchBy}`
					}
					onChange={(e) =>
						this.setState({
							searchValue: e.target.value
						})}
				/>
			</FormGroup>
		);

		return (
			<React.Fragment>
				<HeaderNormal />
				{/* Page content */}
				<Container className="mt--8" fluid>
					{/* Table */}
					<Row>
						<div className="col">
							<Alertz
								color={this.state.color}
								message={this.state.message}
								open={this.state.visible}
								togglez={() => this.toggle('visible')}
							/>
							<Card className="shadow">
								<CardHeader className="border-0">
									<Row className="mb-4">
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
									{/* <Row> */}
									<Form onSubmit={this.handleFilter} className>
										<Row>
											<Col lg={2}>Search by</Col>
											<Col lg={2}>
												<FormGroup controlId="formHorizontalEmails">
													<Input
														className="form-control-alternative"
														type="select"
														onChange={(e) =>
															this.setState({
																searchBy: e.target.value,
																searchValue: ''
															})}
													>
														{[
															'all',
															'nik',
															'name',
															'level',
															'leader'
														].map((x) => (
															<option value={x}>{x}</option>
														))}
													</Input>
												</FormGroup>
											</Col>
											<Col lg={4}>
												{this.state.searchBy === 'level' ? (
													selectForm
												) : (
													textForm
												)}
											</Col>
											<Col sm={2}>
												<Button
													color="primary"
													type="submit"
													disable={
														this.state.loadingFilter ? 'true' : 'false'
													}
												>
													<i className="fa fa-search" />{' '}
													{this.state.loadingFilter ? (
														'Fetching...'
													) : (
														'Search'
													)}
												</Button>
											</Col>
										</Row>
									</Form>
									{/* </Row> */}
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
															onClick={(e) => {
																this.setState({
																	approvalMode: true,
																	userId: prop.id,
																	userIndex: key,
																	fullname: prop.get('fullname')
																});

																this.getDetail(e, prop.id);
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
														{/* 
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
														</UncontrolledTooltip> */}
													</td>
												</tr>
											))
										)}
									</tbody>
								</Table>
								<Paginations resPerPage={this.state.resPerPage} totalPosts={20} />
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
						<Form
							onSubmit={(e) => this.handleCheckImei(e, this.state.imei)}
							autoComplete="off"
						>
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
								<FormText
									className="text-red"
									style={{
										color: 'red'
									}}
								>
									{this.state.imeiMessage !== '' ? this.state.imeiMessage : ''}
								</FormText>
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

							{/* <FormGroup controlId="formShifting">
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
							</FormGroup> */}

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

							<Row>
								<Col lg={4} md={4}>
									<Button
										color={this.state.statusReco === 0 ? 'danger' : 'primary'}
										type="submit"
										disabled={this.state.statusReco === 0 ? true : false}
									>
										{this.state.statusReco === 0 ? (
											'upload foto dahulu'
										) : this.state.loadingModal ? (
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
								</Col>
								<Col lg={8} md={8}>
									<div
										className="text-red"
										style={{
											color: 'red'
										}}
									>
										{this.state.imeiMessage !== '' ? (
											this.state.imeiMessage
										) : (
											''
										)}
									</div>
								</Col>
							</Row>
						</Form>
					}
					handleSubmit={(e) => this.handleAdd(e)}
				/>

				{/* edit modal */}
				<ModalHandler
					show={editMode}
					loading={loadingModal}
					footer={false}
					handleHide={() => this.toggle('editMode')}
					title="Edit Data"
					body={
						<Form onSubmit={this.handleUpdate} autoComplete="off">
							<FormGroup controlId="formCategory">
								<Label>Foto wajah</Label>
								<Input type="file" label="Foto wajah" onChange={this.handleFace} />
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
									value={fullname}
									type="text"
									placeholder="Masukkan nama"
									onChange={(e) => this.setState({ fullname: e.target.value })}
								/>
							</FormGroup>

							<FormGroup controlId="formTipex">
								<Label>Level</Label>
								<Input
									type="select"
									onChange={(e) =>
										this.setState({
											level: e.target.value
										})}
								>
									{daftarLevel.map((x, i) => (
										<option
											selected={
												level.toLowerCase() === x.get('level').toLowerCase()
											}
											key={i}
											value={x.get('level')}
										>
											{x.get('level')}
										</option>
									))}
								</Input>
							</FormGroup>

							{this.state.level !== 'leader' && this.state.level !== 'admin' ? (
								<FormGroup controlId="formLeaders">
									<Label>Pilih leader</Label>
									<Input
										type="select"
										onChange={(e) =>
											this.setState({
												selectLeader: e.target.value
											})}
									>
										{this.state.daftarLeader.map((x, i) => (
											<option
												selected={leader.id === x.id}
												key={i}
												value={x.id}
											>
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
									value={email}
									type="email"
									placeholder="Masukkan email"
									onChange={(e) => this.setState({ email: e.target.value })}
								/>
							</FormGroup>

							<FormGroup controlId="formz">
								<Label>Password</Label>
								<Input
									autoCapitalize="true"
									autoComplete="new-password"
									type="password"
									placeholder="Masukkan password jika ingin mengubah password"
									onChange={(e) => this.setState({ password: e.target.value })}
								/>
							</FormGroup>

							<FormGroup controlId="formNik">
								<Label>NIK</Label>
								<Input
									autoCapitalize="true"
									autoComplete="false"
									value={nik}
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
									onChange={(e) =>
										this.setState({
											tipeKaryawan: e.target.value
										})}
								>
									{/* <option selected disabled hidden>
										Pilih tipe karyawan
									</option> */}
									{daftarTipe.map((x, i) => (
										<option
											selected={tipeKaryawan === x.get('tipe').toLowerCase()}
											key={i}
											value={x.get('tipe')}
										>
											{x.get('tipe')}
										</option>
									))}
								</Input>
							</FormGroup>

							<FormGroup controlId="formPosisi">
								<Label>Posisi</Label>
								<Input
									type="select"
									onChange={(e) =>
										this.setState({ posisi: e.target.value.toUpperCase() })}
								>
									{daftarPosisi.map((x, i) => (
										<option
											selected={
												posisi.toLowerCase() ===
												x.get('position').toLowerCase()
											}
											key={i}
											value={x.get('position')}
										>
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
									defaultValue={imei}
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
									{[ 'Jam tetap', 'Jam fleksibel', 'Jam bebas' ].map((x) => (
										<option
											selected={jamKerja.toLowerCase() === x.toLowerCase()}
											value={x}
										>
											{x}
										</option>
									))}
								</Input>
							</FormGroup>

							<FormGroup controlId="formShifting">
								<Label>Shifting</Label>
								<Input
									type="select"
									onChange={(e) =>
										this.setState({
											shifting: e.target.value
										})}
								>
									{daftarShifting.map((x) => (
										<option selected={shifting.id === x.id} value={x.id}>
											{x.get('tipeShift')}
										</option>
									))}
								</Input>
							</FormGroup>

							<FormGroup controlId="formLokasi">
								<Label>Lokasi kerja</Label>
								<Input
									type="select"
									onChange={(e) =>
										this.setState({
											lokasiKerja: e.target.value
										})}
								>
									<option selected disabled hidden>
										Pilih lokasi kerja
									</option>
									{[ 'Tetap', 'Bebas (mobile)' ].map((x) => (
										<option
											selected={lokasiKerja.toLowerCase() === x.toLowerCase()}
											value={x}
										>
											{x}
										</option>
									))}
								</Input>
							</FormGroup>

							<FormGroup controlId="formCuti">
								<Label>Jumlah cuti</Label>
								<Input
									type="number"
									defaultValue={jumlahCuti}
									placeholder="Masukkan jumlah cuti"
									onChange={(e) =>
										this.setState({ jumlahCuti: parseInt(e.target.value) })}
								/>
							</FormGroup>

							<FormGroup controlId="formLembut">
								<Label>Lembur</Label>
								<Input
									type="select"
									required={true}
									onChange={(e) =>
										this.setState({
											lembur: e.target.value
										})}
								>
									{/* <option selected disabled hidden>
										Pilih lembur
									</option> */}
									{[ 'Ya', 'Tidak' ].map((x) => (
										<option
											selected={lembur.toLowerCase() === x.toLowerCase()}
											value={x}
										>
											{x}
										</option>
									))}
								</Input>
							</FormGroup>

							<Button
								color="primary"
								type="submit"
								disabled={loadingModal === 0 ? true : false}
							>
								{loadingModal ? 'Submitting...' : 'Submit'}
							</Button>
						</Form>
					}
					handleSubmit={(e) => this.handleUpdate(e)}
				/>
			</React.Fragment>
		);
	}
}

export default RegisterKaryawan;
