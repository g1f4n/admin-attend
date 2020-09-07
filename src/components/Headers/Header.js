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
import Skeleton from 'react-loading-skeleton';

// reactstrap components
import { Card, CardBody, CardTitle, Container, Row, Col } from 'reactstrap';
import { Link } from 'react-router-dom';
import Parse from 'parse';
import moment from 'moment';
import { getLeaderId } from 'utils';
import Alertz from 'components/Alert/Alertz';

class Header extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			activeNav: 1,
			chartExample1Data: 'data1',
			loading: false,
			totalRequest: 0,
			daftarLeader: [],
			leave: 0,
			totalLeader: 0,
			totalStaff: 0,
			message: '',
			visible: false,
			color: 'danger'
		};
	}

	componentDidMount() {
		this.getTotalLeader();
		this.getTotalRequest();
		this.getTotalStaff();
	}

	getTotalStaff = () => {
		const User = new Parse.User();
		const query = new Parse.Query(User);

		query.notContainedIn('roles', [ 'admin', 'leader' ]);

		query
			.count()
			.then((x) => {
				this.setState({ totalStaff: x });
			})
			.catch((err) => {
				alert(err.message);
			});
	};

	toggleNavs = (e, index) => {
		e.preventDefault();
		this.setState({
			activeNav: index,
			chartExample1Data: this.state.chartExample1Data === 'data1' ? 'data2' : 'data1'
		});
	};

	getTotalLeader = () => {
		const User = new Parse.User();
		const query = new Parse.Query(User);

		query.equalTo('roles', 'leader' || 'Leader');

		query
			.count()
			.then((x) => {
				this.setState({ totalLeader: x });
			})
			.catch((err) => {
				console.log(err.message);
			});
	};

	getTotalRequest = () => {
		const ChangeRequest = Parse.Object.extend('ChangeRequest');
		const query = new Parse.Query(ChangeRequest);

		query.equalTo('statusApprove', 3);
		query
			.count()
			.then((x) => {
				this.setState({ totalRequest: x });
			})
			.catch(({ message }) => {
				this.setState({
					loading: false,
					message: message,
					visible: true
				});
				alert(message);
				window.location.reload(false);
			});
	};

	toggle = (state) => {
		this.setState({
			[state]: !this.state[state]
		});
	};

	render() {
		const percentage = this.props.totalAbsen / this.props.totalStaff * 100;

		const { totalLeader, totalRequest, totalStaff, daftarLeader } = this.state;

		return (
			<React.Fragment>
				<div className="header bg-gradient-info pb-8 pt-5 pt-md-8">
					<Container fluid>
						<Alertz
							color={this.state.color}
							message={this.state.message}
							open={this.state.visible}
							togglez={() => this.toggle('visible')}
						/>
						<div className="header-body">
							{/* Card stats */}
							<Row>
								<Col lg="6" xl="4">
									<Link to="/admin/staff" style={{ color: 'inherit' }}>
										<Card className="card-stats mb-4 mb-xl-0">
											<CardBody>
												<Row>
													<div className="col">
														<CardTitle
															tag="h5"
															className="text-uppercase text-muted mb-0"
														>
															Staff
														</CardTitle>
														<span className="h2 font-weight-bold mb-0">
															{totalStaff}
														</span>
													</div>
													<Col className="col-auto">
														<div className="icon icon-shape bg-danger text-white rounded-circle shadow">
															<i className="fas fa-chart-bar" />
														</div>
													</Col>
												</Row>
											</CardBody>
										</Card>
									</Link>
								</Col>
								<Col lg="6" xl="4">
									<Link to="/admin/leader" style={{ color: 'inherit' }}>
										<Card className="card-stats mb-4 mb-xl-0">
											<CardBody>
												<Row>
													<div className="col">
														<CardTitle
															tag="h5"
															className="text-uppercase text-muted mb-0"
														>
															Leader
														</CardTitle>
														<span className="h2 font-weight-bold mb-0">
															{totalLeader}
														</span>
													</div>
													<Col className="col-auto">
														<div className="icon icon-shape bg-warning text-white rounded-circle shadow">
															<i className="fas fa-chart-pie" />
														</div>
													</Col>
												</Row>
											</CardBody>
										</Card>
									</Link>
								</Col>
								<Col lg="6" xl="4">
									<Link to="/admin/request-izin" style={{ color: 'inherit' }}>
										<Card className="card-stats mb-4 mb-xl-0">
											<CardBody>
												<Row>
													<div className="col">
														<CardTitle
															tag="h5"
															className="text-uppercase text-muted mb-0"
														>
															Change request
														</CardTitle>
														<span className="h2 font-weight-bold mb-0">
															{totalRequest}
														</span>
													</div>
													<Col className="col-auto">
														<div className="icon icon-shape bg-yellow text-white rounded-circle shadow">
															<i className="fas fa-users" />
														</div>
													</Col>
												</Row>
											</CardBody>
										</Card>
									</Link>
								</Col>
							</Row>
						</div>
					</Container>
				</div>
			</React.Fragment>
		);
	}
}

export default Header;
