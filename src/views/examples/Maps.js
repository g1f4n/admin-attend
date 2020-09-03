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
import { withScriptjs, withGoogleMap, GoogleMap, Marker, Polyline } from 'react-google-maps';

// reactstrap components
import { Card, Container, Row } from 'reactstrap';

// core components
import Header from 'components/Headers/Header.js';
import HeaderNormal from 'components/Headers/HeaderNormal';
import Parse from 'parse';
import moment from 'moment';
// mapTypeId={google.maps.MapTypeId.ROADMAP}

const locationArr = [
	[ -6.2407535, 106.8558205 ],
	[ -6.2128274, 106.8100491 ],
	[ -6.2028274, 106.8000491 ],
	[ -6.1703274, 106.7600491 ]
];

const path = [
	{
		lat: -6.2407535,
		lng: 106.8558205
	},
	{
		lat: -6.2128274,
		lng: 106.8100491
	},
	{
		lat: -6.2028274,
		lng: 106.8000491
	},
	{
		lat: -6.1703274,
		lng: 106.7600491
	}
];

const path2 = [
	{
		lat: -6.2607535,
		lng: 106.8558205
	},
	{
		lat: -6.2428274,
		lng: 106.8100491
	},
	{
		lat: -6.2328274,
		lng: 106.8000491
	},
	{
		lat: -6.1903274,
		lng: 106.7600491
	}
];

let newArr = [];

[ path, path2 ].map((x, i) => {
	x.map((z) => {
		console.log(z);
		newArr.splice(i, 0, {
			lat: z.lat,
			lng: z.lng
		});
	});
});

console.log(newArr);

let newArrz = [ {}, {} ];

path.concat(path2).forEach((x, i) => {
	console.log(`${x['lat']} , ${x['lng']}`);
	newArrz.push({
		lat: x['lat'],
		lng: x['lng']
	});
});

console.log(newArrz);

const MapWrapper = withScriptjs(
	withGoogleMap((props) => (
		<GoogleMap
			defaultZoom={12}
			defaultCenter={{ lat: parseFloat(props.avgLat), lng: parseFloat(props.avgLng) }}
			defaultOptions={{
				scrollwheel: false
			}}
		>
			{props.userPosition.map((x) => (
				<Marker
					title={x.get('fullname')}
					position={{
						lat: parseFloat(x.get('latitude')),
						lng: parseFloat(x.get('longitude'))
					}}
				/>
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
	))
);

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
			avgLng: 0
		};
	}

	componentDidMount() {
		this.getLeaderStaff();
	}

	getLeaderStaff = () => {
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
		query.greaterThanOrEqualTo('absenMasuk', start.toDate());
		query.lessThan('absenMasuk', finish.toDate());
		query
			.find()
			.then((x) => {
				console.log(x);
				this.getCenterAverage(x);
				this.setState({ userLocation: x }, () => console.log(this.state.userLocation));
			})
			.catch((err) => {
				console.log(err);
			});
	};

	getCenterAverage = (arr) => {
		let avgLat = arr.reduce((acc, currentValue) => {
			return (
				(parseFloat(acc.get('latitude')) + parseFloat(currentValue.get('latitude'))) /
				arr.length
			);
		});

		let avgLng = arr.reduce((acc, currentValue) => {
			return (
				(parseFloat(acc.get('longitude')) + parseFloat(currentValue.get('longitude'))) /
				arr.length
			);
		});

		console.log(avgLat + ' ' + avgLng);

		this.setState({
			avgLat: avgLat,
			avgLng: avgLng
		});
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
							<Card className="shadow border-0">
								{this.state.avgLat !== 0 ? (
									<MapWrapper
										userPosition={this.state.userLocation}
										avgLat={this.state.avgLat}
										avgLng={this.state.avgLng}
										googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyC5tj-2X6b7kwGTqGZkB7sofZdMhpyE75Q"
										loadingElement={<div style={{ height: `100%` }} />}
										containerElement={
											<div
												style={{ height: `600px` }}
												className="map-canvas"
												id="map-canvas"
											/>
										}
										mapElement={
											<div
												style={{ height: `100%`, borderRadius: 'inherit' }}
											/>
										}
									/>
								) : this.state.userLocation.length === 0 ? (
									<div style={{ height: `100%`, textAlign: 'center' }}>
										Tidak ada data absen hari ini
									</div>
								) : (
									'Loading...'
								)}
							</Card>
						</div>
					</Row>
				</Container>
			</React.Fragment>
		);
	}
}

export default Maps;
