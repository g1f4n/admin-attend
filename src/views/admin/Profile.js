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
	Button,
	Card,
	CardHeader,
	CardBody,
	FormGroup,
	Form,
	Input,
	Container,
	Row,
	Col,
	Spinner
} from 'reactstrap';
import Pagination from 'react-js-pagination';
// core components
import UserHeader from 'components/Headers/UserHeader.js';
import Parse from 'parse';
import moment from 'moment';
import _ from 'lodash/lang';
import { getLeaderId } from 'utils';
import { slicename } from 'utils/slice';
import { Link } from 'react-router-dom';
import Paginations from 'components/Pagination/Pagination';
import Toastz from 'components/Alert/Toast';

class Profile extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			daftarStaff: [],
			daftarLevel: [],
			daftarPosisi: [],
			loading: false,
			searchBy: 'all',
			searchValue: '',
			resPerPage: 20,
			page: 1,
			totalData: 0,
			loadingFilter: false,
			toast: false
		};
	}

	componentDidMount() {
		//this.getAbsenStaff();
		//this.getData();
		this.getPosisi();
		this.getLeader();
		this.handleFilterPagination();
	}

	getAbsenStaff() {
		const User = new Parse.User();
		const query = new Parse.Query(User);

		query.notContainedIn('roles', [ 'admin', 'leader', 'Admin', 'Leader' ]);

		query
			.find({ useMasterKey: true })
			.then((x) => {
				this.setState({ daftarStaff: x });
			})
			.catch((err) => {
				alert(err.message);
			});
	}

	getData = (pageNumber = 1) => {
		this.setState({ loading: true, page: pageNumber });
		const { resPerPage, page } = this.state;
		const User = new Parse.User();
		const query = new Parse.Query(User);

		query.notContainedIn('roles', [ 'admin', 'leader', 'Admin', 'Leader' ]);
		query.skip(resPerPage * pageNumber - resPerPage);
		query.limit(resPerPage);
		query.withCount();

		query
			.find({ useMasterKey: true })
			.then((x) => {
				this.setState({
					daftarStaff: x.results,
					totalData: x.count,
					loading: false,
					toast: true,
					message: 'Halo'
				});
			})
			.catch((err) => {
				this.setState({ loading: false });
				alert('cek koneksi anda');
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

	handleFilter = (e, pageNumber = 1) => {
		e.preventDefault();
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

			case 'divisi':
				query.matches('posisi', searchValue, 'i');
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

	handleFilterPagination = (pageNumber = 1) => {
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

			case 'divisi':
				query.matches('posisi', searchValue, 'i');
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

	render() {
		const { daftarStaff, daftarLevel, loading } = this.state;

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
						Pilih {this.state.searchBy}
					</option>
					{this.state.searchBy === 'leader' ? (
						daftarLevel.map((x, i) => (
							<option key={i} value={x.get('level')}>
								{x.get('level')}
							</option>
						))
					) : (
						this.state.daftarPosisi.map((x, i) => (
							<option key={i} value={x.get('position')}>
								{x.get('position')}
							</option>
						))
					)}
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
				<UserHeader />
				{/* Page content */}
				<Container className="mt-2" fluid>
					<Card className="shadow p-2 pt-4">
						<CardHeader className="border-0 p-1 ml-2">
							{/* <Toastz
								show={this.state.toast}
								message={this.state.message}
								toggle={() => this.setState({ toast: false })}
							/> */}
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
													'leader',
													'divisi'
												].map((x) => <option value={x}>{x}</option>)}
											</Input>
										</FormGroup>
									</Col>
									<Col lg={4}>
										{this.state.searchBy == 'level' ||
										this.state.searchBy == 'divisi' ? (
											selectForm
										) : (
											textForm
										)}
										{/* <FormGroup>
											<Input
												type="text"
												className="form-control-alternative"
												disabled={this.state.searchBy === 'all'}
												placeholder={
													this.state.searchBy === 'all' ? (
														''
													) : (
														`Masukkan ${this.state.searchBy}`
													)
												}
												onChange={(e) =>
													this.setState({
														searchValue: e.target.value
													})}
											/>
										</FormGroup> */}
									</Col>
									<Col sm={2}>
										<Button
											color="primary"
											type="submit"
											disable={this.state.loadingFilter ? 'true' : 'false'}
										>
											<i className="fa fa-search" />{' '}
											{this.state.loadingFilter ? 'Fetching...' : 'Search'}
										</Button>
									</Col>
								</Row>
							</Form>
						</CardHeader>
						<Row>
							{loading ? (
								<Col lg={12} style={{ textAlign: 'center' }}>
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
								</Col>
							) : daftarStaff.length < 1 ? (
								<Col lg={12} style={{ textAlign: 'center' }}>
									No staff found
								</Col>
							) : (
								daftarStaff.map((staff) => (
									<Col md={3} className="mt-2">
										<Card className="card-profile shadow">
											<Row className="justify-content-center">
												<Col className="text-center p-2" lg="">
													<div className="">
														<a href={staff.get('fotoWajah').url()}>
															<img
																alt="..."
																style={{
																	height: '150px',
																	width: '150px'
																}}
																className="rounded-circle"
																src={staff.get('fotoWajah').url()}
															/>
														</a>
													</div>
												</Col>
											</Row>
											<CardBody
												className="pt-0 pt-md-4"
												style={{
													height: '200px',
													borderRadius: '50px 20px 20px 20px',
													borderColor: '#fc032d'
												}}
											>
												<div className="text-center mt-md-2">
													<h3>{slicename(staff.get('fullname'))}</h3>
													<div className="h5 font-weight-300">
														<i className="ni location_pin mr-2" />
														{staff.get('nik')}
													</div>
													<div className="h5">
														<i className="ni business_briefcase-24 mr-2" />
														{!_.isEmpty(staff.get('email')) ? (
															staff.get('email')
														) : (
															'-'
														)}
													</div>
													<div className="mt-2">
														<Link
															color="inherit"
															to={`/admin/export-absen/${staff.id}`}
														>
															<Button
																size="sm"
																color="primary"
																outline
															>
																<i className="ni ni-spaceship mr-2" />
																View history
															</Button>
														</Link>
													</div>
												</div>
											</CardBody>
										</Card>
									</Col>
								))
							)}
						</Row>
						<Pagination
							activePage={this.state.page}
							itemsCountPerPage={this.state.resPerPage}
							totalItemsCount={this.state.totalData}
							pageRangeDisplayed={5}
							onChange={(pageNumber) => this.handleFilterPagination(pageNumber)}
							innerClass="pagination justify-content-end p-4"
							itemClass="page-item mt-2"
							linkClass="page-link"
							prevPageText="<"
							nextPageText=">"
						/>
						{/* <Paginations
							resPerPage={this.state.resPerPage}
							totalPosts={this.state.totalData}
						/> */}
					</Card>
				</Container>
			</React.Fragment>
		);
	}
}

export default Profile;
