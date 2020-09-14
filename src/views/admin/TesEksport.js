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
	InputGroup,
	InputGroupAddon,
	InputGroupText
} from 'reactstrap';
// core components
import Header from 'components/Headers/Header.js';
import Parse from 'parse';
import ReactDatetime from 'react-datetime';
import moment from 'moment';
import { getLeaderId } from 'utils';
import ModalHandler from 'components/Modal/Modal';
import { convertDate } from 'utils';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import _ from 'lodash/lang';
import { handleSelect } from 'utils';

class TesEksport extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			daftarStaff: [],
			absence: [],
			tableData: [],
			fileData: [],
			excelMode: false,
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
			approveAllMode: false,
			rejectAllMode: false,
			deleteCounter: 0,
			searchBy: 'all',
			searchValue: '',
			resPerPage: 20,
			page: 1,
			totalData: 0
		};
	}

	componentDidMount() {
		this.getData();
	}

	getData = (pageNumber = 1) => {
		this.setState({ loadingFilter: true });
		const { searchBy, searchValue } = this.state;
		const { resPerPage, page } = this.state;

		const User = new Parse.User();
		const query = new Parse.Query(User);

		query.notContainedIn('roles', [ 'admin', 'leader', 'Admin', 'Leader' ]);
		query.skip(resPerPage * pageNumber - resPerPage);
		query.limit(resPerPage);
		query.withCount();

		switch (searchBy) {
			case 'all':
				query
					.find({ useMasterKey: true })
					.then((x) => {
						x.results.map((y) => (y.select = false));
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
						x.results.map((y) => (y.select = false));
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
						x.results.map((y) => (y.select = false));
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

			case 'divisi':
				query.matches('posisi', searchValue, 'i');
				query
					.find({ useMasterKey: true })
					.then((x) => {
						x.results.map((y) => (y.select = false));
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
						x.results.map((y) => (y.select = false));
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

	closeLoading = () => {
		this.setState({ loadingModal: false });
	};

	handleApproval = (e, approvalMode) => {
		e.preventDefault();
		this.setState({ loadingModal: true });
		const Izin = Parse.Object.extend('Izin');
		const query = new Parse.Query(Izin);

		query
			.get(this.state.userId)
			.then((x) => {
				x.set('status', approvalMode ? 1 : 0);
				if (!approvalMode) x.set('alasanReject', this.state.reason);
				x
					.save()
					.then(() => {
						let newArr = [ ...this.state.izin ];
						newArr.splice(this.state.userIndex, 1);
						this.setState({
							counter: this.state.counter + 1,
							izin: newArr,
							[approvalMode ? 'approvalMode' : 'rejectMode']: false,
							loadingModal: false
						});
						alert(`Berhasil ${approvalMode ? 'approve' : 'reject'}`);
						return;
					})
					.catch((err) => {
						alert(err.message);
						this.closeLoading();
						return;
					});
			})
			.catch((err) => {
				alert(err.message);
				this.closeLoading();
				return;
			});
	};

	toggle = (state) => {
		this.setState({
			[state]: !this.state[state]
		});
	};

	handleAllCheck = (e) => {
		let daftarStaff = this.state.daftarStaff;
		let collecId = [];
		let fileData = [];

		daftarStaff.map((x, index) => {
			x.select = e.target.checked;
			if (x.select) {
				collecId.push(x.id);
				fileData.push({ fileName: x.get('fullname'), tableId: `ekspor${index}` });
			} else {
				collecId = [];
				fileData = [];
			}

			return x;
		});

		this.setState({ daftarStaff: daftarStaff, checkId: collecId, fileData: fileData }, () =>
			console.log(this.state.checkId)
		);
	};

	handleChildCheck = (e) => {
		let { daftarStaff } = this.state;
		const { checkId, fileData } = this.state;
		let checked = e.target.value;
		daftarStaff.map((x, index) => {
			console.log('bandingkan', x.id === e.target.value);
			if (x.id === e.target.value) {
				console.log('sama');
				x.select = e.target.checked;
				if (x.select) {
					this.setState(
						(prevState) => ({
							checkId: [ ...this.state.checkId, checked ],
							fileData: [
								...this.state.fileData,
								{ fileName: x.get('fullname'), tableId: `ekspor${index}` }
							]
						}),
						() => {
							console.log(this.state.checkId);
							console.log(this.state.fileData);
						}
					);
				} else {
					const index = checkId.indexOf(checked);
					const fileDataIndex = fileData
						.map((x) => {
							return x.fileName;
						})
						.indexOf(x.get('fullname'));
					if (index > -1 || fileDataIndex > -1) {
						checkId.splice(index, 1);
						fileData.splice(fileDataIndex, 1);
						this.setState(
							(prevState) => ({
								checkId: checkId,
								fileData: fileData
							}),
							() => {
								console.log(this.state.checkId);
								console.log(this.state.fileData);
							}
						);
					}
				}
			}
		});

		this.setState({ daftarStaff: daftarStaff });
	};

	handleApproveAll = (e) => {
		this.setState({ loading: true });
		const Izin = Parse.Object.extend('Izin');
		const query = new Parse.Query(Izin);

		query.get(e).then((x) => {
			x.set('status', 1);
			x.save().then(() => {
				const newArr = [ ...this.state.izin ];
				newArr.splice(this.state.userIndex, 1);
				this.setState({
					izin: newArr,
					counter: this.state.counter + 1,
					approvalMode: false,
					loading: false
				});
			});
		});
	};

	handleRejectAll = (e) => {
		this.setState({ loading: true });
		const Izin = Parse.Object.extend('Izin');
		const query = new Parse.Query(Izin);

		query.get(e).then((x) => {
			x.set('status', 0);
			x.set('alasanReject', this.state.reason);
			x.save().then(() => {
				const newArr = [ ...this.state.izin ];
				newArr.splice(this.state.userIndex, 1);
				this.setState({
					counter: this.state.counter + 1,
					izin: newArr
				});
			});
		});
	};

	approveChecked = (e) => {
		this.setState({ loadingModal: true });
		const { checkId } = this.state;
		let totalData = 0;

		checkId.map((id) => {
			const Izin = Parse.Object.extend('Izin');
			const query = new Parse.Query(Izin);

			query.get(id).then((x) => {
				x.set('status', 1);
				x.save().then(() => {
					totalData = totalData + 1;
					if (totalData === checkId.length) {
						alert('Berhasil reject');
						return window.location.reload(false);
					}
				});
			});
		});

		this.setState({ loadingModal: false });
	};

	getDataAbsen = (e) => {
		e.preventDefault();
		//this.setState({ loading: true });
		this.setState({ absence: [], tableData: [] });
		const { checkId } = this.state;
		let totalData = 0;

		if (parseInt(this.state.status) === 4) {
			checkId.map((id) => {
				const Absence = Parse.Object.extend('Absence');
				const query = new Parse.Query(Absence);
				const d = new Date();
				const start = new moment(this.state.startDate);
				start.startOf('day');
				const finish = new moment(start);
				finish.add(1, 'day');

				query.equalTo('user', {
					__type: 'Pointer',
					className: '_User',
					objectId: id
				});
				query.ascending('absenMasuk');
				query.greaterThanOrEqualTo('absenMasuk', start.toDate());
				query.lessThan('absenMasuk', finish.toDate());
				query.include('user');
				query
					.find()
					.then((x) => {
						console.log('user', x);
						let newArr = [ ...this.state.absence ];
						newArr.splice(totalData, 0, x);
						let tableArr = [ ...this.state.tableData ];
						tableArr.splice(totalData, 0, {
							fileName: x[0].get('fullname'),
							tableId: `ekspor${totalData}`
						});
						this.setState({ absence: x, loading: false });
						totalData = totalData + 1;
						if (totalData === checkId.length) {
							alert('Berhasil check');
						}
					})
					.catch((err) => {
						alert(err.message);
						this.setState({ loading: false });
					});
			});
		} else if (parseInt(this.state.status) === 5) {
			checkId.map((id) => {
				const Absence = Parse.Object.extend('Absence');
				const query = new Parse.Query(Absence);
				const d = new Date();
				const start = new moment(this.state.startDate);
				start.startOf('week');
				const finish = new moment(start);
				finish.add(1, 'week');

				query.equalTo('user', {
					__type: 'Pointer',
					className: '_User',
					objectId: id
				});
				query.ascending('absenMasuk');
				query.greaterThanOrEqualTo('absenMasuk', start.toDate());
				query.lessThan('absenMasuk', finish.toDate());
				query.include('user');
				query
					.find()
					.then((x) => {
						console.log('user', x);
						let newArr = [ ...this.state.absence ];
						newArr.splice(totalData, 0, x);
						let tableArr = [ ...this.state.tableData ];
						tableArr.splice(totalData, 0, {
							fileName: x[0].get('fullname'),
							tableId: `ekspor${totalData}`
						});
						this.setState({ absence: x, loading: false });
						totalData = totalData + 1;
						if (totalData === checkId.length) {
							alert('Berhasil check');
						}
					})
					.catch((err) => {
						alert(err.message);
						this.setState({ loading: false });
					});
			});
		} else if (parseInt(this.state.status) === 6) {
			checkId.map((id) => {
				const Absence = Parse.Object.extend('Absence');
				const query = new Parse.Query(Absence);
				const d = new Date();
				const start = new moment(this.state.startDate);
				start.startOf('month');
				const finish = new moment(start);
				finish.add(1, 'month');

				query.equalTo('user', {
					__type: 'Pointer',
					className: '_User',
					objectId: id
				});
				query.ascending('absenMasuk');
				query.greaterThanOrEqualTo('absenMasuk', start.toDate());
				query.lessThan('absenMasuk', finish.toDate());
				query.include('user');
				query
					.find()
					.then((x) => {
						console.log('user', x);
						let newArr = [ ...this.state.absence ];
						newArr.splice(totalData, 0, x);
						let tableArr = [ ...this.state.tableData ];
						tableArr.splice(totalData, 0, {
							fileName: x[0].get('fullname'),
							tableId: `ekspor${totalData}`
						});
						this.setState({ absence: x, loading: false });
						totalData = totalData + 1;
						if (totalData === checkId.length) {
							alert('Berhasil check');
						}
					})
					.catch((err) => {
						alert(err.message);
						this.setState({ loading: false });
					});
			});
		} else if (parseInt(this.state.status) === 7) {
			checkId.map((id) => {
				const Absence = Parse.Object.extend('Absence');
				const query = new Parse.Query(Absence);
				const d = new Date();
				const start = new moment(this.state.startDate);
				//start.startOf('month');
				const finish = new moment(this.state.endDate);
				//finish.add(1, 'month');

				query.equalTo('user', {
					__type: 'Pointer',
					className: '_User',
					objectId: id
				});
				query.ascending('absenMasuk');
				query.greaterThanOrEqualTo('absenMasuk', start.toDate());
				query.lessThan('absenMasuk', finish.toDate());
				query.include('user');
				query
					.find()
					.then((x) => {
						console.log('user', x);
						let newArr = [ ...this.state.absence ];
						newArr.splice(totalData, 0, x);
						let tableArr = [ ...this.state.tableData ];
						tableArr.splice(totalData, 0, {
							fileName: x[0].get('fullname'),
							tableId: `ekspor${totalData}`
						});
						this.setState({ absence: x, loading: false });
						totalData = totalData + 1;
						if (totalData === checkId.length) {
							alert('Berhasil check');
						}
					})
					.catch((err) => {
						alert(err.message);
						this.setState({ loading: false });
					});
			});
		}

		checkId.map((id) => {
			const Absence = Parse.Object.extend('Absence');
			const query = new Parse.Query(Absence);

			//const id = this.props.match.params.id;

			const nullData = 'Data tidak ditemukan';

			const d = new Date();
			const start = new moment(d);
			start.startOf('day');
			const finish = new moment(start);
			finish.add(1, 'day');

			query.equalTo('user', {
				__type: 'Pointer',
				className: '_User',
				objectId: id
			});
			query.ascending('absenMasuk');
			// query.greaterThanOrEqualTo('createdAt', start.toDate());
			// query.lessThan('createdAt', finish.toDate());
			query.notContainedIn('roles', [ 'admin', 'Admin', 'leader', 'Leader' ]);
			query.include('user');
			query
				.find()
				.then((x) => {
					console.log('user', x);
					let newArr = [ ...this.state.absence ];
					newArr.splice(totalData, 0, x);
					let tableArr = [ ...this.state.tableData ];
					tableArr.splice(totalData, 0, {
						fileName: x[0].get('fullname'),
						tableId: `ekspor${totalData}`
					});
					this.setState(
						{
							absence: newArr,
							tableData: tableArr,
							loading: false
							// employeeName: _.isEmpty(x) ? nullData : x[0].get('fullname'),
							// employeeID: _.isEmpty(x) ? nullData : x[0].get('user').attributes.nik,
							// employeeTitle: _.isEmpty(x) ? nullData : x[0].get('user').attributes.level,
							// employeeDepartment: _.isEmpty(x) ? nullData : x[0].get('user').attributes.posisi
						},
						() => {
							console.log(this.state.absence);
							console.log(this.state.tableData);
						}
					);
					totalData = totalData + 1;
					if (totalData === checkId.length) {
						alert('Berhasil check');
					}
				})
				.catch((err) => {
					alert(err.message);
					this.setState({ loading: false });
				});
		});
	};

	rejectChecked = (e) => {
		e.preventDefault();
		this.setState({ loadingModal: true });
		const { checkId } = this.state;
		let totalData = 0;

		checkId.map((id) => {
			const Izin = Parse.Object.extend('Izin');
			const query = new Parse.Query(Izin);

			query.get(id).then((x) => {
				x.set('status', 1);
				x.set('alasanReject', this.state.reason);
				x.save().then(() => {
					totalData = totalData + 1;
					if (totalData === checkId.length) {
						alert('Berhasil reject');
						return window.location.reload(false);
					}
					// const newArr = [ ...this.state.izin ];
					// newArr.splice(this.state.userIndex, 1);
					// this.setState({
					// 	izin: newArr,
					// 	approvalMode: false,
					// 	loading: false
					// });
				});
			});
		});
	};

	render() {
		const {
			daftarStaff,
			loading,
			approvalMode,
			rejectMode,
			loadingModal,
			fullnames,
			counter,
			approveAllMode,
			rejectAllMode
		} = this.state;

		return (
			<React.Fragment>
				<Header izin={counter} />
				{/* Page content */}
				<Container className="mt--7" fluid>
					{/* Table */}
					<Row>
						<div className="col">
							<Card className="shadow">
								<CardHeader className="border-0">
									<h3 className="mb-2">Request izin</h3>
									{daftarStaff.length === 0 ? (
										''
									) : this.state.checkId.length === 0 ? (
										''
									) : (
										<Col sm={{ span: 0 }} className="float-none">
											<Button
												color="primary"
												size="sm"
												type="submit"
												disable={loading ? 'true' : 'false'}
												className="mr-2 m-1"
												onClick={(e) => this.getDataAbsen(e)}
											>
												<i className="fa fa-check" />{' '}
												{loading ? 'Fetching...' : 'Check'}
											</Button>
											<Button
												color="primary"
												type="submit"
												size="sm"
												className="m-1"
												disable={loading ? 'true' : 'false'}
												onClick={() =>
													this.setState({ rejectAllMode: true })}
											>
												<i className="fa fa-times" />{' '}
												{loading ? 'Fetching...' : 'Reject'}
											</Button>

											<Button
												color="primary"
												type="submit"
												size="sm"
												className="m-1"
												disable={loading ? 'true' : 'false'}
												onClick={() => this.setState({ excelMode: true })}
											>
												<i className="fa fa-times" /> Export to excel
											</Button>
										</Col>
									)}
									{/* <input type="text" placeholder="input" /> */}
								</CardHeader>
								<Table
									className="align-items-center table-flush"
									responsive
									id="ekspor"
								>
									<thead className="thead-light">
										<tr>
											<th>
												<input
													type="checkbox"
													onChange={this.handleAllCheck}
												/>
											</th>
											<th scope="col">NIK</th>
											<th scope="col">Nama</th>
											<th scope="col">Level</th>
											<th scope="col">Divisi</th>
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
													<td>
														<input
															type="checkbox"
															value={prop.id}
															checked={prop.select}
															onChange={this.handleChildCheck}
														/>
													</td>
													<td>{prop.get('nik')}</td>
													<td>{prop.get('fullname')}</td>
													<td>{prop.get('level')}</td>
													<td>{prop.get('posisi')}</td>
													{/* <td>
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
															<i className="fa fa-check" />
														</Button>
														<UncontrolledTooltip
															delay={0}
															placement="top"
															target="t1"
														>
															Approve
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
															<i className="fa fa-times" />
														</Button>
														<UncontrolledTooltip
															delay={0}
															placement="top"
															target="t2"
														>
															Reject
														</UncontrolledTooltip>
													</td> */}
												</tr>
											))
										)}
									</tbody>
								</Table>
							</Card>
							<Card>
								{this.state.absence.map((rowResult, index) => (
									<Table responsive className="mt-4" id={`ekspor${index}`}>
										<thead>
											<th>Nama</th>
											<th>Absen Masuk</th>
										</thead>
										<tbody>
											{rowResult.map((user) => (
												<tr>
													<td>{user.get('fullname')}</td>
													<td>
														{convertDate(
															user.get('absenMasuk'),
															'HH:mm:ss'
														)}
													</td>
												</tr>
											))}
										</tbody>
									</Table>
								))}
							</Card>
						</div>
					</Row>
				</Container>

				<ModalHandler
					size="lg"
					show={this.state.excelMode}
					loading={loadingModal}
					footer={true}
					disabled={this.state.absence.length < 1}
					handleHide={() => this.toggle('excelMode')}
					title={`Export ${this.state.checkId.length} data to excel`}
					body={
						<Form role="form" onSubmit={this.getDataAbsen} className="mt-3">
							<div className="row">
								<div className="col-md-1 col-sm-12">
									<p>Filter By</p>
								</div>
								<div className="col-md-2 col-sm-12">
									<FormGroup>
										<InputGroup className="input-group-alternative">
											<Input
												type="select"
												className="fa-pull-right"
												required={true}
												onChange={(e) => {
													this.setState({
														status: e.target.value
													});
												}}
											>
												<option value="">Pilih Waktu</option>
												{[ 4, 5, 6, 7 ].map((x) => (
													<option value={x}>{handleSelect(x)}</option>
												))}
											</Input>
										</InputGroup>
									</FormGroup>
								</div>
								<div className="col-md-3 col-sm-12">
									<FormGroup>
										<InputGroup className="input-group-alternative">
											<InputGroupAddon addonType="prepend">
												<InputGroupText>
													<i className="ni ni-calendar-grid-58" />
												</InputGroupText>
											</InputGroupAddon>
											{/* <Input
                              type="date"
                              placeholder="Date Picker Here"
                              required={true}
                              value={startDate}
                              onChange={(e) => {
                                this.setState({
                                  startDate: e.target.value,
                                });
                              }}
                            /> */}
											<ReactDatetime
												inputProps={{
													placeholder: `${parseInt(this.state.status) ===
													7
														? 'Set start date'
														: 'Set tanggal'}`,
													required: true,
													readOnly: true
												}}
												timeFormat={false}
												viewMode={
													parseInt(this.state.status) === 6 ? (
														'months'
													) : (
														'days'
													)
												}
												dateFormat={
													parseInt(this.state.status) === 6 ? (
														'MM/YYYY'
													) : (
														'MM/DD/YYYY'
													)
												}
												value={this.state.startDate}
												onChange={(e) => {
													this.setState({
														startDate: e.toDate()
													});
												}}
											/>
										</InputGroup>
									</FormGroup>
								</div>
								{parseInt(this.state.status) === 7 ? (
									<div className="col-md-3 col-sm-12">
										<FormGroup>
											<InputGroup className="input-group-alternative">
												<InputGroupAddon addonType="prepend">
													<InputGroupText>
														<i className="ni ni-calendar-grid-58" />
													</InputGroupText>
												</InputGroupAddon>
												{/* <Input
                              type="date"
                              placeholder="Date Picker Here"
                              required={true}
                              value={startDate}
                              onChange={(e) => {
                                this.setState({
                                  startDate: e.target.value,
                                });
                              }}
                            /> */}
												<ReactDatetime
													inputProps={{
														placeholder: 'Set end date',
														required: true,
														readOnly: true
													}}
													timeFormat={false}
													viewMode={
														parseInt(this.state.status) === 6 ? (
															'months'
														) : (
															'days'
														)
													}
													dateFormat={
														parseInt(this.state.status) === 6 ? (
															'MM/YYYY'
														) : (
															'MM/DD/YYYY'
														)
													}
													value={this.state.endDate}
													onChange={(e) => {
														this.setState({
															endDate: e.toDate()
														});
													}}
												/>
											</InputGroup>
										</FormGroup>
									</div>
								) : (
									''
								)}
								<div className="text-center mt--4">
									<Button
										className="my-4"
										color="primary"
										type="submit"
										disabled={loading}
									>
										{loading ? (
											<div>
												<Spinner
													as="span"
													animation="grow"
													size="sm"
													role="status"
													aria-hidden="true"
												/>{' '}
												Loading
											</div>
										) : (
											'Search'
										)}
									</Button>
								</div>
							</div>
						</Form>
					}
					handleSubmit={(e) => this.handleApproval(e, true)}
				/>
				{/* excel modal */}
				<ModalHandler
					show={approvalMode}
					loading={loadingModal}
					footer={true}
					handleHide={() => this.toggle('approvalMode')}
					title="Approval Confirmation"
					body={`Approve izin ${fullnames} ?`}
					handleSubmit={(e) => this.handleApproval(e, true)}
				/>

				{/* reject modal */}
				<ModalHandler
					show={rejectMode}
					loading={loadingModal}
					footer={false}
					handleHide={() => this.toggle('rejectMode')}
					title="Reject Confirmation"
					body={
						<div>
							<h3 className="mb-4">{`Reject izin ${fullnames} ?`}</h3>
							<Form onSubmit={(e) => this.handleApproval(e, false)}>
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
					handleSubmit={(e) => this.handleApproval(e, false)}
				/>

				{/* Approve All Modal */}
				<ModalHandler
					show={approveAllMode}
					loading={loadingModal}
					footer={true}
					handleHide={() => this.toggle('approveAllMode')}
					title="Approve Confirmation"
					body={
						<div>
							<h3 className="mb-4">{`Approve izin ${this.state.checkId
								.length} data ?`}</h3>
						</div>
					}
					handleSubmit={this.approveChecked}
				/>

				{/* Reject All Modal */}
				<ModalHandler
					show={rejectAllMode}
					loading={loadingModal}
					footer={false}
					handleHide={() => this.toggle('rejectAllMode')}
					title="Reject Confirmation"
					body={
						<div>
							<h3 className="mb-4">{`Reject izin ${this.state.checkId
								.length} data ?`}</h3>
							<Form onSubmit={(e) => this.rejectChecked(e)}>
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
									onClick={() => this.toggle('rejectAllMode')}
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
					handleSubmit={this.rejectChecked}
				/>
			</React.Fragment>
		);
	}
}

export default TesEksport;
