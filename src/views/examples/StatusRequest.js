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
import moment from 'moment';
import { getLeaderId } from 'utils';
import ModalHandler from 'components/Modal/Modal';
import Axios from 'axios';
import HeaderNormal from 'components/Headers/HeaderNormal';
import Alertz from 'components/Alert/Alertz';

class StatusRequest extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			staff: [],
			shifting: {},
			loading: false,
			requestMode: false,
			userIndex: 0,
			loadingModal: false,
			approvalMode: false,
			rejectMode: false,
			userId: '',
			fullnames: '',
			reason: '',
			checkId: [],
			loadingReco: false,
			detail: {},
			detailMode: false,
			message: '',
			color: 'danger',
			visible: false,
			idUser: ''
		};
	}

	componentDidMount() {
		this.getData();
	}

	toggle = (state) => {
		this.setState({
			[state]: !this.state[state]
		});
	};

	getDetail = (e, id) => {
		e.preventDefault();
		const ChangeRequest = Parse.Object.extend('ChangeRequest');
		const query = new Parse.Query(ChangeRequest);

		query.equalTo('userId', {
			__type: 'Pointer',
			className: '_User',
			objectId: id
		});
		query.include('userId');
		query.include('shifting');
		query
			.first()
			.then((x) => {
				console.log(x.attributes);
				console.log('shifting', x.get('shifting'));
				this.setState({
					detailMode: true,
					detail: x.attributes,
					shifting: x.get('shifting').attributes,
					loading: false
				});
			})
			.catch((err) => {
				alert(err.message);
			});
	};

	getData() {
		this.setState({ loading: true });
		const ChangeRequest = Parse.Object.extend('ChangeRequest');
		const query = new Parse.Query(ChangeRequest);

		query.equalTo('statusApprove', 3);
		query.include('userId');
		query
			.find()
			.then((x) => {
				console.log(x);
				this.setState({ staff: x, loading: false });
			})
			.catch((err) => {
				alert(err.message);
				this.setState({ loading: false });
			});
	}

	handleReject = (e) => {
		e.preventDefault();
		this.setState({ loadingModal: true });

		const ChangeRequest = Parse.Object.extend('ChangeRequest');
		const query = new Parse.Query(ChangeRequest);

		query.get(this.state.idUser).then((x) => {
			x.set('statusApprove', 0);
			x.set('alasanReject', this.state.reason);
			x.save().then(() => {
				const newArr = [ ...this.state.staff ];
				newArr.splice(this.state.userIndex, 1);
				this.setState({
					message: 'Berhasil reject',
					color: 'success',
					visible: true,
					staff: newArr,
					rejectMode: false,
					loading: false
				});
			});
		});
	};

	handleApproval = (e, approvalMode) => {
		e.preventDefault();
		this.setState({ loadingModal: true });
		const User = new Parse.User();
		const query = new Parse.Query(User);

		query
			.get(this.state.userId)
			.then((user) => {
				const ChangeRequest = Parse.Object.extend('ChangeRequest');
				const query = new Parse.Query(ChangeRequest);

				query.exclude('createdAt');
				query.exclude('updatedAt');

				query.include('userId');
				query
					.get(this.state.idUser)
					.then((changeRequest) => {
						let data = changeRequest.attributes;
						console.log(changeRequest);
						for (var i in data) {
							if (i === 'statusApprove') continue;
							if (i === 'leaderId') continue;
							if (i === 'idUser') continue;
							if (i === 'userId') continue;
							user.set(i, data[i]);
						}
						user
							.save(null, { useMasterKey: true })
							.then((c) => {
								changeRequest.set('statusApprove', approvalMode ? 1 : 0);
								if (!approvalMode)
									changeRequest.set('alasanReject', this.state.reason);
								changeRequest
									.save()
									.then((ex) => {
										const newArr = [ ...this.state.staff ];
										newArr.splice(this.state.userIndex, 1);
										this.setState({
											message: 'Berhasil approve',
											color: 'success',
											staff: newArr,
											approvalMode: false,
											loadingModal: false,
											visible: true
										});
									})
									.catch((err) => {
										console.log(err.message);
										this.setState({
											loadingModal: false,
											message: 'Terjadi kesalahan',
											color: 'danger',
											visible: true
										});
									});
							})
							.catch((err) => {
								console.log(err.message);
								this.setState({
									loadingModal: false,
									message: 'Terjadi kesalahan',
									color: 'danger'
								});
							});
					})
					.catch(({ message }) => {
						this.setState({
							loadingModal: false,
							message: 'Terjadi kesalahan',
							color: 'danger',
							visible: true
						});
						console.log(message);
					});
			})
			.catch((err) => {
				console.log(err.message);
				this.setState({
					loading: false,
					message: 'Terjadi kesalahan',
					color: 'danger',
					visible: true
				});
			});
	};

	render() {
		const {
			staff,
			loading,
			loadingModal,
			fullnames,
			approvalMode,
			rejectMode,
			detailMode,
			detail
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
									<h3 className="mb-2">Change request status</h3>
									<Alertz
										color={this.state.color}
										message={this.state.message}
										open={this.state.visible}
										togglez={() => this.toggle('visible')}
									/>
								</CardHeader>
								<Table className="align-items-center table-flush" responsive>
									<thead className="thead-light">
										<tr>
											<th scope="col">NIK</th>
											<th scope="col">Nama</th>
											<th scope="col">Status</th>
											<th scope="col">Aksi</th>
										</tr>
									</thead>
									<tbody>
										{loading ? (
											<td colSpan={4} style={{ textAlign: 'center' }}>
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
												/>{' '}
												<Spinner
													as="span"
													animation="grow"
													size="sm"
													role="status"
													aria-hidden="true"
												/>
											</td>
										) : staff.length < 1 ? (
											<td colSpan={4} style={{ textAlign: 'center' }}>
												No data found...
											</td>
										) : (
											staff.map((prop, key) => (
												<tr>
													<td>{prop.get('userId').attributes.nik}</td>
													<td>
														{prop.get('userId').attributes.fullname}
													</td>
													<td
														style={{
															color: `${prop.attributes
																.statusApprove === 3
																? 'blue'
																: `${prop.attributes
																		.statusApprove === 2
																		? 'green'
																		: 'red'}`}`
														}}
													>
														<strong>
															{prop.get('statusApprove') === 3 ? (
																'Belum diproses'
															) : prop.get('statusApprove') === 2 ? (
																'Approved'.toUpperCase()
															) : (
																'Rejected'.toUpperCase()
															)}
														</strong>
													</td>
													<td>
														<Button
															id="t4"
															color="secondary"
															className="btn-circle"
															onClick={(e) => {
																this.setState({
																	// detailMode: false,
																	userId: prop.get('userId').id,
																	userIndex: key,
																	fullnames: prop.get('userId')
																		.attributes.fullname
																});
																this.getDetail(
																	e,
																	prop.get('userId').id
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
															Detail
														</UncontrolledTooltip>

														<Button
															id="t1"
															color="primary"
															className="btn-circle"
															onClick={() => {
																this.setState({
																	approvalMode: true,
																	userId: prop.get('userId').id,
																	idUser: prop.id,
																	userIndex: key,
																	fullnames: prop.get('userId')
																		.attributes.fullname
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
																	userId: prop.get('userId').id,
																	idUser: prop.id,
																	userIndex: key,
																	fullnames: prop.get('userId')
																		.attributes.fullname
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

				<ModalHandler
					show={detailMode}
					loading={loadingModal}
					footer={false}
					handleHide={() => {
						this.toggle('detailMode');
						this.setState({ detail: {} });
					}}
					title={`${fullnames} change request data`}
					body={
						<div>
							<Form className="text-dark">
								{detail.fotoWajah !== undefined ? (
									<FormGroup>
										<Label>Foto Wajah</Label>
										<Row className="ml-1">
											<img
												height={100}
												width={100}
												src={
													detail.fotoWajah !== undefined ? (
														detail.fotoWajah.url()
													) : (
														''
													)
												}
												alt="foto"
											/>
										</Row>
									</FormGroup>
								) : (
									''
								)}

								<FormGroup controlId="formShifting">
									<Label>Shifting</Label>
									<Input
										type="number"
										disabled={true}
										placeholder={this.state.shifting.tipeShift}
									/>
								</FormGroup>

								<FormGroup controlId="formCuti">
									<Label>Jumlah cuti</Label>
									<Input
										type="number"
										disabled={true}
										placeholder={detail.jumlahCuti}
									/>
								</FormGroup>

								<FormGroup controlId="formLembut">
									<Label>Lembur</Label>
									<Input
										className="text-dark"
										type="text"
										disabled={true}
										placeholder={detail.lembur}
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
							</Form>
						</div>
					}
					handleSubmit={this.rejectChecked}
				/>

				{/* Ubah Data Modal */}
				<ModalHandler
					show={approvalMode}
					loading={loadingModal}
					footer={true}
					handleHide={() => this.toggle('approvalMode')}
					title="Approval Confirmation"
					body={`Approve change request ${fullnames} ?`}
					handleSubmit={(e) => this.handleApproval(e, true)}
				/>

				{/* reject modal */}
				<ModalHandler
					show={rejectMode}
					loading={loadingModal}
					handleHide={() => this.toggle('rejectMode')}
					title="Reject Confirmation"
					body={
						<div>
							<h3 className="mb-4">{`Reject change request ${fullnames} ?`}</h3>
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

export default StatusRequest;
