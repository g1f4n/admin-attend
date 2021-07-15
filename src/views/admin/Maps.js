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
// react plugin used to create google maps
import { compose, withProps, withStateHandlers } from 'recompose';
import {
	withScriptjs,
	withGoogleMap,
	GoogleMap,
	Marker,
	Polyline,
	InfoWindow
} from 'react-google-maps';

// reactstrap components
import { Card, Container, Row, Col, Table, CardHeader } from 'reactstrap';

// core components
import Header from 'components/Headers/Header.js';
import HeaderNormal from 'components/Headers/HeaderNormal';
import Parse from 'parse';
import moment from 'moment';
import { convertDate } from 'utils';
import { slicename } from 'utils/slice';
import { getUserRole } from "utils";
// mapTypeId={google.maps.MapTypeId.ROADMAP}

// const locationArr = [
// 	[ -6.2407535, 106.8558205 ],
// 	[ -6.2128274, 106.8100491 ],
// 	[ -6.2028274, 106.8000491 ],
// 	[ -6.1703274, 106.7600491 ]
// ];

// const path = [
// 	{
// 		lat: -6.2407535,
// 		lng: 106.8558205
// 	},
// 	{
// 		lat: -6.2128274,
// 		lng: 106.8100491
// 	},
// 	{
// 		lat: -6.2028274,
// 		lng: 106.8000491
// 	},
// 	{
// 		lat: -6.1703274,
// 		lng: 106.7600491
// 	}
// ];

// const path2 = [
// 	{
// 		lat: -6.2607535,
// 		lng: 106.8558205
// 	},
// 	{
// 		lat: -6.2428274,
// 		lng: 106.8100491
// 	},
// 	{
// 		lat: -6.2328274,
// 		lng: 106.8000491
// 	},
// 	{
// 		lat: -6.1903274,
// 		lng: 106.7600491
// 	}
// ];

// let newArr = [];

// [ path, path2 ].map((x, i) => {
// 	x.map((z) => {
// 		console.log(z);
// 		newArr.splice(i, 0, {
// 			lat: z.lat,
// 			lng: z.lng
// 		});
// 	});
// });

// console.log(newArr);

// let newArrz = [ {}, {} ];

// path.concat(path2).forEach((x, i) => {
// 	console.log(`${x['lat']} , ${x['lng']}`);
// 	newArrz.push({
// 		lat: x['lat'],
// 		lng: x['lng']
// 	});
// });

// console.log(newArrz);

const MapWrapper = compose(
	withStateHandlers(
		() => ({
			isOpen: false,
			id: ''
		}),
		{
			onToggleOpen: ({ isOpen, id }) => (idx) => ({
				isOpen: !isOpen,
				id: idx
			})
		}
	),
	withScriptjs,
	withGoogleMap
)((props) => (
	<GoogleMap
		defaultZoom={12}
		defaultCenter={{ lat: parseFloat(props.avgLat), lng: parseFloat(props.avgLng) }}
		center={{ lat: parseFloat(props.avgLat), lng: parseFloat(props.avgLng) }}
		defaultOptions={{
			scrollwheel: false
		}}
	>
		{props.userPosition.map((x) => (
			<Marker
				onClick={() => props.onToggleOpen(x.id)}
				icon={{
					labelOrigin: new window.google.maps.Point(11, 50),
					url: require(`../GmapsIcon/${x.get('user').attributes.color === undefined
						? 'red'
						: x.get('user').attributes.color}-dot.png`),
					//size: new window.google.maps.Size(22, 40),
					origin: new window.google.maps.Point(0, 0),
					anchor: new window.google.maps.Point(11, 40)
				}}
				// icon={require(`./GmapsIcon/${x.get('user').attributes.color === undefined
				// 	? 'red'
				// 	: x.get('user').attributes.color}-dot.png`)}
				title={`${x.get('fullname')} absen masuk: ${x.get("lateTimes") !== undefined ? convertDate(
					x.get('lateTimes'),
					'HH:mm:ss'
				) : convertDate(
					x.get('absenMasuk'),
					'HH:mm:ss'
				)}`}
				position={{
					lat: parseFloat(x.get('latitude')),
					lng: parseFloat(x.get('longitude'))
				}}
				label={{
					text: slicename(x.get('fullname')),
					fontWeight: 'bold'
				}}
			>
				{props.id === x.id && (
					<InfoWindow onCloseClick={props.onToggleOpen}>
						<div>
							<img src={x.get('selfieImage').url()} height={100} width={100} />
							<br />
							<br />
							{x.get('lateTimes') !== undefined && <p>Terlambat</p>}
							<p>
								Absen masuk:{' '}
								<span style={{ color: x.get("lateTimes") !== undefined ? 'red' : 'blue' }}>
									{x.get("lateTimes") !== undefined ? convertDate(x.get('lateTimes'), 'HH:mm:ss') : convertDate(x.get('absenMasuk'), 'HH:mm:ss')}
								</span>
							</p>
						</div>
					</InfoWindow>
				)}
			</Marker>
		))}

		{/* {path.concat(path2).map((x, i) => (
				<Marker
					title="joker"
					position={{
						lat: x['lat'],
						lng: x['lng']
					}}
				/>
			))}

			{[ path, path2 ].map((x, i) => (
				<Polyline
					options={{
						strokeColor: '#ff2527',
						strokeOpacity: 0.75,
						strokeWeight: 2
					}}
					path={x}
				/>
			))} */}
	</GoogleMap>
));

class Maps extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			locationArr: [
				[ -6.2407535, 106.8558205 ],
				[ -6.2128274, 106.8100491 ],
				[ -6.2028274, 106.8000491 ]
			],
			userLocation: [],
			avgLat: 0,
			avgLng: 0,
			loading: false,
			late: []
		};
	}

	componentDidMount() {
		// this.getLeaderStaff();
		this.getLeaderStaff2();
		this.getDataTerlambat();
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevState.late !== this.state.late) {
			console.log(this.state.userLocation);
			console.log('updated');
			this.getCenterAverage(this.state.userLocation.concat(this.state.late));
		}
	}

	getLeaderStaff = () => {
		this.setState({ loading: true });
		const id = this.props.match.params.id;
		console.log(id);

		const Absence = Parse.Object.extend('Absence');
		const query = new Parse.Query(Absence);

		const d = new Date();
		const start = new moment(d);
		start.startOf('day');
		const finish = new moment(start);
		finish.add(1, 'day');

		query.equalTo('leaderIdNew', {
			__type: 'Pointer',
			className: '_User',
			objectId: id
		});
		query.greaterThanOrEqualTo('createdAt', start.toDate());
		query.lessThan('createdAt', finish.toDate());
		query.include('user');
		query
			.find()
			.then((x) => {
				console.log(x);
				//this.getCenterAverage(x);

				// });

				this.setState(
					{
						userLocation: x
					},
					() => console.log(this.state.userLocation)
				);
			})
			.catch((err) => {
				console.log(err);
				this.setState({ loading: false });
			});
	};

	queryAbsenByLevel = (rolesIdKey, containedRoles, id) => {
		// this.setState({ loading: true });
		// const id = this.props.match.params.id;
		console.log("iddssa",id);

		const Absence = Parse.Object.extend('Absence');
		const query = new Parse.Query(Absence);

		const hierarki = new Parse.User();
        const hierarkiQuery = new Parse.Query(hierarki);
		
		const d = new Date();
		const start = new moment(d);
		start.startOf('day');
		const finish = new moment(start);
		finish.add(1, 'day');
		
        hierarkiQuery.containedIn("roles", containedRoles);
		hierarkiQuery.equalTo(rolesIdKey, {
			__type: 'Pointer',
			className: '_User',
			objectId: id
		});
		query.matchesQuery("user", hierarkiQuery);
		query.greaterThanOrEqualTo('createdAt', start.toDate());
		query.lessThan('createdAt', finish.toDate());
		query.include('user');
		query
			.find()
			.then((x) => {
				console.log(x);
				//this.getCenterAverage(x);

				// });

				this.setState(
					{
						userLocation: x
					},
					() => console.log(this.state.userLocation)
				);
			})
			.catch((err) => {
				console.log(err);
				this.setState({ loading: false });
			});
	}

	getLeaderStaff2 = () => {
		this.setState({ loading: true });
		const userRole = getUserRole();
		const id = this.props.match.params.id;
		// const roles = id.split("&")
		// console.log("iddssa", roles)

		const hierarki = new Parse.User();
		const hierarkiQuery = new Parse.Query(hierarki);
		hierarkiQuery.get(id).then((roles) => {
			switch (roles.get("roles")) {
				case "team leader":
				  this.queryAbsenByLevel("leaderIdNew", ["staff", "Staff"], id);
				  break;
				case "supervisor":
				  this.queryAbsenByLevel("supervisorID", ["staff", "team leader"], id);
				  break;
				case "manager":
				  this.queryAbsenByLevel("managerID", ["staff", "team leader", "supervisor"], id);
				  break;
				case "head":
				  this.queryAbsenByLevel("headID", [
					"staff",
					"team leader",
					"supervisor",
					"manager",
				  ], id);
				  break;
				case "gm":
				  this.queryAbsenByLevel("headID", [
					"staff",
					"team leader",
					"supervisor",
					"manager",
					"head",
				  ], id);
				  break;
		  
				default:
				  break;
			  }
		})
		.catch((err) => {
				console.log(err);
				this.setState({ loading: false });
			});
	  };

	getCenterAverage = (arr) => {
		this.setState({ loading: true });
		let avgLat = arr.reduce((acc, currentValue) => {
			console.log(acc + parseFloat(currentValue.attributes.latitude));
			return acc + parseFloat(currentValue.attributes.latitude);
		}, 0);

		let avgLng = arr.reduce((acc, currentValue) => {
			console.log(acc + parseFloat(currentValue.attributes.longitude));
			return acc + parseFloat(currentValue.attributes.longitude);
		}, 0);

		console.log(avgLat + ' ' + avgLng);

		this.setState({
			avgLat: avgLat / arr.length,
			avgLng: avgLng / arr.length,
			loading: false
		});
	};

	getDataTerlambat = () => {
		this.setState({ loading: true });
		const Late = Parse.Object.extend('Late');
		const query = new Parse.Query(Late);

		const d = new Date();
		const start = new moment(d);
		start.startOf('day');
		const finish = new moment(start);
		finish.add(1, 'day');

		query.equalTo('status', 3);
		query.greaterThanOrEqualTo('time', start.toDate());
		query.lessThan('time', finish.toDate());
		query.include('user');
		query
			.find()
			.then((x) => {
				console.log(x);
				this.setState({ late: x });
			})
			.catch((err) => {
				alert(err.message);
				this.setState({ loading: false });
			});
	};

	setCenterMaps = (lat, lng) => {
		this.setState({ avgLat: parseFloat(lat), avgLng: parseFloat(lng) });
	};

	render() {
		const { locationArr } = this.state;

		return (
			<React.Fragment>
				<HeaderNormal />
				{/* Page content */}
				<Container className="mt--8" fluid>
					<Row>
						<div className="col">
							{this.state.loading ? (
								<div style={{ height: `100%`, textAlign: 'center' }}>
									Loading map...
								</div>
							) : this.state.userLocation.length === 0 ? (
								<div style={{ height: `100%`, textAlign: 'center' }}>
									Tidak ada data absen hari ini
								</div>
							) : (
								<Row>
									<Col lg={6} className="mb-5">
										<Card className="shadow">
											<MapWrapper
												userPosition={this.state.userLocation.concat(
													this.state.late
												)}
												avgLat={this.state.avgLat}
												avgLng={this.state.avgLng}
												googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyC5tj-2X6b7kwGTqGZkB7sofZdMhpyE75Q"
												loadingElement={<div style={{ height: `100%` }} />}
												containerElement={
													<div
														style={{ height: `500px` }}
														className="map-canvas"
														id="map-canvas"
													/>
												}
												mapElement={
													<div
														style={{
															height: `100%`,
															borderRadius: 'inherit'
														}}
													/>
												}
											/>
										</Card>
									</Col>

									<Col lg={6} className="">
										<Card className="shadow">
											<CardHeader className="border-0">
												<h3>Data absen hari ini</h3>
											</CardHeader>
											<Table
												className="align-items-center table-flush"
												responsive
												style={{ borderRadius: 'inherit' }}
											>
												<thead className="thead-light">
													<tr>
														<th scope="col">NIK</th>
														<th scope="col">Nama</th>
														<th scope="col">Absen Masuk</th>
													</tr>
												</thead>
												<tbody>
													{this.state.userLocation
														// .concat(this.state.late)
														.map((prop, key) => (
															<tr
																onClick={() =>
																	this.setCenterMaps(
																		prop.get('latitude'),
																		prop.get('longitude')
																	)}
															>
																<td>
																	{
																		prop.get('user').attributes
																			.nik
																	}
																</td>
																<td>{prop.get('fullname')}</td>
																<td>
																	{prop.get("lateTimes") !== undefined ? (
																		<div>
																			<span
																				style={{
																					color: 'red'
																				}}
																			>
																				{convertDate(
																					prop.get(
																						'lateTimes'
																					),
																					'HH:mm:ss'
																				)}
																			</span>{' '}
																		</div>
																	) : (
																		convertDate(
																			prop.get('absenMasuk'),
																			'HH:mm:ss'
																		)
																	)}
																</td>
															</tr>
														))}
												</tbody>
											</Table>
										</Card>
									</Col>
								</Row>
							)}
						</div>
					</Row>
				</Container>
			</React.Fragment>
		);
	}
}

export default Maps;
