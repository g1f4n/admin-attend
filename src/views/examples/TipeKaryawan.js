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
	Label
} from 'reactstrap';
// core components
import Header from 'components/Headers/Header.js';
import Parse from 'parse';
import moment from 'moment';
import { getLeaderId } from 'utils';
import ModalHandler from 'components/Modal/Modal';
import HeaderNormal from 'components/Headers/HeaderNormal';

class TipeKaryawan extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			tipe: [],
			inputTipe: '',
			detail: {},
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
			deleteMode: false,
			editMode: false,
			deleteCounter: 0
		};
	}

	componentDidMount() {
		this.getData();
	}

	getData = () => {
		this.setState({ loading: true });
		const EmployeeType = new Parse.Object.extend('EmployeeType');
		const query = new Parse.Query(EmployeeType);

		query.equalTo('status', 1);
		query
			.find()
			.then((x) => {
				this.setState({ tipe: x, loading: false });
			})
			.catch((err) => {
				alert(err.message);
				this.setState({ loading: false });
			});
	};

	handleAdd = (e) => {
		e.preventDefault();
		const { inputTipe } = this.state;
		this.setState({ loadingModal: true });

		const EmployeeType = Parse.Object.extend('EmployeeType');
		const query = new EmployeeType();
		query.set('tipe', inputTipe);

		query
			.save()
			.then((z) => {
				this.setState({
					addMode: false,
					loadingModal: false,
					tipe: this.state.tipe.concat(z)
				});
			})
			.catch((err) => {
				alert(err.message);
				this.setState({ loadingModal: false });
			});
	};

	getDetail = (e, id) => {
		e.preventDefault();

		const EmployeeType = Parse.Object.extend('EmployeeType');
		const query = new Parse.Query(EmployeeType);

		query
			.get(id)
			.then(({ attributes }) => {
				this.setState({ inputTipe: attributes.tipe, editMode: true });
			})
			.catch((err) => {
				alert(err.message);
				this.setState({ loadingModal: false });
			});
	};

	handleUpdate = (e) => {
		e.preventDefault();
		const { inputTipe } = this.state;
		this.setState({ loadingModal: true });

		const EmployeeType = Parse.Object.extend('EmployeeType');
		const query = new Parse.Query(EmployeeType);

		query
			.get(this.state.userId)
			.then((z) => {
				z.set('tipe', inputTipe);
				z
					.save()
					.then((x) => {
						this.setState({
							editMode: false,
							loadingModal: false
						});
					})
					.catch((err) => {
						alert(err.message);
						this.setState({ loadingModal: false });
					});
			})
			.catch((err) => {
				alert(err.message);
				this.setState({ loadingModal: false });
			});
	};

	handleRemove = (e) => {
		e.preventDefault();
		this.setState({ loadingModal: true });

		const EmployeeType = Parse.Object.extend('EmployeeType');
		const query = new Parse.Query(EmployeeType);

		query
			.get(this.state.userId)
			.then((z) => {
				z.set('status', 0);
				z
					.save()
					.then((x) => {
						let newArr = [ ...this.state.tipe ];
						newArr.splice(this.state.userIndex, 1);
						this.setState({
							deleteMode: false,
							loadingModal: false,
							tipe: newArr
						});
						alert('Berhasil hapus data');
					})
					.catch((err) => {
						alert(err.message);
						this.setState({ loadingModal: false });
					});
			})
			.catch((err) => {
				alert(err.message);
				this.setState({ loadingModal: false });
			});
	};

	toggle = (state) => {
		this.setState({
			[state]: !this.state[state]
		});
	};

	render() {
		const {
			tipe,
			loading,
			inputTipe,
			rejectMode,
			loadingModal,
			fullnames,
			addMode,
			deleteMode,
			editMode
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
											<i className="fa fa-plus" /> Tambah
										</Button>
									</Row>
									{/* <input type="text" placeholder="input" /> */}
								</CardHeader>
								<Table className="align-items-center table-flush" responsive>
									<thead className="thead-light">
										<tr>
											<th scope="col">No</th>
											<th scope="col">Tipe</th>
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
										) : tipe.length < 1 ? (
											<td colSpan={6} style={{ textAlign: 'center' }}>
												No data found...
											</td>
										) : (
											tipe.map((prop, key) => (
												<tr>
													<td>{key + 1}</td>
													<td>{prop.get('tipe')}</td>
													<td>
														<Button
															id="t1"
															color="primary"
															className="btn-circle"
															onClick={(e) => {
																this.setState({
																	userId: prop.id,
																	userIndex: key
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

														<Button
															id="t2"
															className="btn-circle btn-danger"
															onClick={(e) => {
																this.setState({
																	deleteMode: true,
																	userId: prop.id,
																	userIndex: key,
																	fullnames: prop.get('level')
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
															Hapus data
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
						<div>
							<Form onSubmit={(e) => this.handleAdd(e)}>
								<FormGroup>
									<Label>Tipe</Label>
									<Input
										id="zz1"
										placeholder="Masukkan tipe karyawan"
										type="text"
										required={true}
										onChange={(e) =>
											this.setState({ inputTipe: e.target.value })}
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
						<Form onSubmit={(e) => this.handleUpdate(e)}>
							<FormGroup>
								<Label>Tipe</Label>
								<Input
									id="zz1"
									placeholder="Masukkan tipe karyawan"
									value={inputTipe}
									type="text"
									required={true}
									onChange={(e) => this.setState({ inputTipe: e.target.value })}
								/>
							</FormGroup>

							<Button
								color="secondary"
								data-dismiss="modal"
								type="button"
								onClick={() => this.toggle('editMode')}
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
					}
					handleSubmit={(e) => this.handleUpdate(e)}
				/>

				<ModalHandler
					show={deleteMode}
					loading={loadingModal}
					footer={true}
					handleHide={() => this.toggle('deleteMode')}
					title="Remove Confirmation"
					body={
						<div>
							<h3 className="mb-4">{`Remove tipe ${fullnames} ?`}</h3>
						</div>
					}
					handleSubmit={(e) => this.handleRemove(e)}
				/>
			</React.Fragment>
		);
	}
}

export default TipeKaryawan;
