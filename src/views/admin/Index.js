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
import React, { useRef } from 'react';
import { compose, withProps, withStateHandlers } from 'recompose';
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  Polyline,
  InfoWindow
} from 'react-google-maps';
// node.js library that concatenates classes (strings)
import classnames from 'classnames';
// javascipt plugin for creating charts
import Chart from 'chart.js';
// react plugin used to create charts
import { Line, Bar } from 'react-chartjs-2';
// Parse library
import Parse from 'parse';
import moment from 'moment';
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  NavItem,
  NavLink,
  Nav,
  Progress,
  Table,
  Container,
  Row,
  Col,
  Spinner
} from 'reactstrap';

// core components
import { chartOptions, parseOptions, chartExample1, chartExample2 } from 'variables/charts.js';

import Header from 'components/Headers/Header.js';
import { getUsername } from 'utils';
import { getLeaderId } from 'utils';
import { Link } from 'react-router-dom';
import { convertDate } from 'utils';
import { slicename } from 'utils/slice';
import Pagination from 'react-js-pagination';

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
    zoom={props.defaultZoom}
    defaultCenter={{ lat: parseFloat(props.avgLat), lng: parseFloat(props.avgLng) }}
    center={{ lat: parseFloat(props.avgLat), lng: parseFloat(props.avgLng) }}
    defaultOptions={{
      scrollwheel: false
    }}
  >
    {props.userPosition.map((x) => (
      <Marker
        key={x.id}
        onClick={(e) => {
          console.log(x.id);
          props.onToggleOpen(x.id);
          // x.select = true;
        }}
        icon={{
          labelOrigin: new window.google.maps.Point(11, 50),
          url: require(`../GmapsIcon/${
            x.get('user').attributes.color === undefined ? 'red' : x.get('user').attributes.color
          }-dot.png`),
          //size: new window.google.maps.Size(22, 40),
          origin: new window.google.maps.Point(0, 0),
          anchor: new window.google.maps.Point(11, 40)
        }}
        // icon={require(`./GmapsIcon/${x.get('user').attributes.color === undefined
        // 	? 'red'
        // 	: x.get('user').attributes.color}-dot.png`)}
        title={`${x.get('fullname')} absen masuk: ${x.get("lateTimes") !== undefined ? convertDate(x.get('lateTimes'), 'HH:mm:ss') : convertDate(x.get('absenMasuk'), 'HH:mm:ss')}`}
        position={{
          lat: parseFloat(x.get('latitude')),
          lng: parseFloat(x.get('longitude'))
        }}
        label={{
          text: slicename(x.get('fullname')),
          fontWeight: 'bold'
        }}
      >
        {x.id === props.id && (
          <InfoWindow onCloseClick={props.onToggleOpen}>
            <div>
              <img
                src={x.get('selfieImage') == undefined ? '' : x.get('selfieImage').url()}
                height={100}
                width={100}
              />

              <br />
              <br />
              {x.get("lateTimes") !== undefined && <p>Terlambat</p>}
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

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.lcoationRef = React.createRef();
    this.state = {
      activeNav: 1,
      chartExample1Data: 'data1',
      loading: false,
      totalStaff: 0,
      daftarRequest: [],
      daftarLeader: [],
      dataAbsen: [],
      resPerPage: 20,
      late: [],
      avgLat: 0,
      avgLng: 0,
      defaultZoom: 12
    };
    if (window.Chart) {
      parseOptions(Chart, chartOptions());
    }
  }

  componentDidMount() {
    this.getDaftarRequest();
    this.getDaftarLeader();
    this.getLeaderStaff();
    this.getDataTerlambat();
    // this.getLeaderStaffFilter();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.late !== this.state.late) {
      console.log(this.state.dataAbsen);
      this.getCenterAverage(this.state.dataAbsen.concat(this.state.late));
    }
  }

  scrollToMyRef = () => window.scrollTo(0, this.lcoationRef.offsetTop);

  getCenterAverage = (arr) => {
    this.setState({ loading: true });
    let avgLat = arr.reduce((acc, currentValue) => {
      return acc + parseFloat(currentValue.get('latitude'));
    }, 0);

    let avgLng = arr.reduce((acc, currentValue) => {
      return acc + parseFloat(currentValue.get('longitude'));
    }, 0);

    console.log(avgLat + ' ' + avgLng);

    this.setState({
      avgLat: avgLat / arr.length,
      avgLng: avgLng / arr.length,
      loading: false
    });
  };

  toggleNavs = (e, index) => {
    e.preventDefault();
    this.setState({
      activeNav: index,
      chartExample1Data: this.state.chartExample1Data === 'data1' ? 'data2' : 'data1'
    });
  };

  getDaftarLeader = () => {
    this.setState({ loading: true });
    const User = new Parse.User();
    const query = new Parse.Query(User);

    query.equalTo('roles', 'leader' || 'Leader');
    query
      .find({ useMasterKey: true })
      .then((x) => {
        this.setState({ daftarLeader: x });
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  getDaftarRequest = () => {
    const ChangeRequest = Parse.Object.extend('ChangeRequest');
    const query = new Parse.Query(ChangeRequest);

    query.equalTo('statusApprove', 3);
    query.exclude('createdAt');
    query.exclude('updatedAt');

    query.include('userId');
    query
      .find()
      .then((x) => {
        // let data = x[1].attributes;
        // console.log(x);
        // for (var i in data) {
        // 	console.log(i);
        // 	console.log(data[i]);
        // }
        this.setState({ daftarRequest: x });
      })
      .catch(({ message }) => {
        this.setState({ loading: false });
        console.log(message);

        //window.location.reload(false);
        return;
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
        x.map((y) => (y.select = false));
        console.log(x);
        this.setState({ late: x });
      })
      .catch((err) => {
        alert(err.message);
        this.setState({ loading: false });
      });
  };

  getLeaderStaff = () => {
    this.setState({ loading: true });

    const Absence = Parse.Object.extend('Absence');
    const query = new Parse.Query(Absence);

    const hierarki = new Parse.User();
    const hierarkiQuery = new Parse.Query(hierarki);

    const d = new Date();
    const start = new moment(d);
    start.startOf('day');
    const finish = new moment(start);
    finish.add(1, 'day');

    query.greaterThanOrEqualTo('createdAt', start.toDate());
    query.lessThan('createdAt', finish.toDate());
    query.matchesQuery("user", hierarkiQuery);
    query.include('user');
    query
      .find()
      .then((x) => {
        x.map((y) => (y.select = false));
        console.log(x);
        this.setState({ dataAbsen: x });
      })
      .catch((err) => {
        console.log(err);
        this.setState({ loading: false });
      });
  };

  getLeaderStaffFilter = (pageNumber = 1) => {
    this.setState({ loading: true, page: pageNumber });

    const {resPerPage} = this.state;

    const Absence = Parse.Object.extend('Absence');
    const query = new Parse.Query(Absence);

    const hierarki = new Parse.User();
    const hierarkiQuery = new Parse.Query(hierarki);

    const d = new Date();
    const start = new moment(d);
    start.startOf('day');
    const finish = new moment(start);
    finish.add(1, 'day');

    // Pagination
    query.skip(resPerPage * pageNumber - resPerPage);
    query.limit(resPerPage);
    query.withCount();

    // query.greaterThanOrEqualTo('createdAt', start.toDate());
    // query.lessThan('createdAt', finish.toDate());
    query.matchesQuery("user", hierarkiQuery);
    query.include('user');
    query
      .find()
      .then((x) => {
        x.map((y) => (y.select = false));
        // console.log(x);
        // console.log("totalData", x.count);
        this.setState({ dataAbsen: x, totalData:x.count });
      })
      .catch((err) => {
        console.log(err);
        this.setState({ loading: false });
      });
  };

  setCenterMaps = (lat, lng) => {
    this.setState({ avgLat: parseFloat(lat), avgLng: parseFloat(lng) });
  };

  render() {
    const { daftarRequest, loading, daftarLeader } = this.state;
    console.log(this.state.dataAbsen.concat(this.state.late));

    return (
      <React.Fragment>
        <Header />
        {/* Page content */}
        <Container className="mt--8" fluid>
          {/* <Row>
						<Col className="mb-5 mb-xl-0" xl="8">
							<Card className="bg-gradient-default shadow">
								<CardHeader className="bg-transparent">
									<Row className="align-items-center">
										<div className="col">
											<h6 className="text-uppercase text-light ls-1 mb-1">
												Overview
											</h6>
											<h2 className="text-white mb-0">Ketepatan waktu</h2>
										</div>
										<div className="col">
											<Nav className="justify-content-end" pills>
												<NavItem>
													<NavLink
														className={classnames('py-2 px-3', {
															active: this.state.activeNav === 1
														})}
														href="#pablo"
														onClick={(e) => this.toggleNavs(e, 1)}
													>
														<span className="d-none d-md-block">
															Month
														</span>
														<span className="d-md-none">M</span>
													</NavLink>
												</NavItem>
												<NavItem>
													<NavLink
														className={classnames('py-2 px-3', {
															active: this.state.activeNav === 2
														})}
														data-toggle="tab"
														href="#pablo"
														onClick={(e) => this.toggleNavs(e, 2)}
													>
														<span className="d-none d-md-block">
															Week
														</span>
														<span className="d-md-none">W</span>
													</NavLink>
												</NavItem>
											</Nav>
										</div>
									</Row>
								</CardHeader>
								<CardBody>
									<div className="chart">
										<Line
											data={chartExample1[this.state.chartExample1Data]}
											options={chartExample1.options}
											getDatasetAtEvent={(e) => console.log(e)}
										/>
									</div>
								</CardBody>
							</Card>
						</Col>
						<Col xl="4">
							<Card className="shadow">
								<CardHeader className="bg-transparent">
									<Row className="align-items-center">
										<div className="col">
											<h6 className="text-uppercase text-muted ls-1 mb-1">
												Performance
											</h6>
											<h2 className="mb-0">Total orders</h2>
										</div>
									</Row>
								</CardHeader>
								<CardBody>
									<div className="chart">
										<Bar
											data={chartExample2.data}
											options={chartExample2.options}
										/>
									</div>
								</CardBody>
							</Card>
						</Col>
					</Row>
					{''} */}
          <Row className="mt-5">
            <Col className="mb-5 mb-xl-0" xl="12">
              <Card className="shadow mb-5" ref={this.lcoationRef}>
                {this.state.loading ? (
                  <div style={{ height: `100%`, textAlign: 'center' }}>Loading map...</div>
                ) : this.state.dataAbsen.concat(this.state.late).length === 0 ? (
                  <div style={{ height: `100%`, textAlign: 'center' }}>
                    Tidak ada data absen hari ini
                  </div>
                ) : (
                  <MapWrapper
                    userPosition={this.state.dataAbsen.concat(this.state.late)}
                    avgLat={this.state.avgLat}
                    avgLng={this.state.avgLng}
                    defaultZoom={this.state.defaultZoom}
                    googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyC5tj-2X6b7kwGTqGZkB7sofZdMhpyE75Q"
                    loadingElement={<div style={{ height: `100%` }} />}
                    containerElement={
                      <div style={{ height: `500px` }} className="map-canvas" id="map-canvas" />
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
                )}
              </Card>
            </Col>
            <Col xl="6" className="mb-5">
              <Card className="shadow">
                <CardHeader className="border-0">
                  <Row className="align-items-center">
                    <div className="col">
                      <h3 className="mb-0">Change request</h3>
                    </div>
                    <div className="col text-right">
                      <Link to="/admin/status-request">
                        <Button color="primary" size="sm">
                          See all
                        </Button>
                      </Link>
                    </div>
                  </Row>
                </CardHeader>
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">NIK</th>
                      <th scope="col">Nama</th>
                      <th scope="col">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
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
                      </tr>
                    ) : daftarRequest.length < 1 ? (
                      <tr>
                        <td colSpan={4} style={{ textAlign: 'center' }}>
                          No data found...
                        </td>
                      </tr>
                    ) : (
                      daftarRequest.map((prop, key) => (
                        <tr>
                          <td>{prop.get('userId').attributes.nik}</td>
                          <td>{prop.get('userId').attributes.fullname}</td>
                          <td
                            style={{
                              color: `${
                                prop.attributes.statusApprove === 3
                                  ? 'blue'
                                  : `${prop.attributes.statusApprove === 1 ? 'green' : 'red'}`
                              }`
                            }}
                          >
                            <strong>
                              {prop.get('statusApprove') === 3
                                ? 'Waiting'
                                : prop.get('statusApprove') === 1
                                ? 'Approved'.toUpperCase()
                                : 'Rejected'.toUpperCase()}
                            </strong>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </Card>
            </Col>
            <Col xl="6">
              <Card className="shadow">
                <CardHeader className="border-0">
                  <Row className="align-items-center">
                    <div className="col">
                      <h3 className="mb-0">Data absen hari ini</h3>
                    </div>
                  </Row>
                </CardHeader>
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">NIK</th>
                      <th scope="col">Nama</th>
                      <th scope="col">Absen masuk</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={3} style={{ textAlign: 'center' }}>
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
                      </tr>
                    ) : this.state.dataAbsen.concat(this.state.late).length < 1 ? (
                      <tr>
                        <td colSpan={3} style={{ textAlign: 'center' }}>
                          No data found...
                        </td>
                      </tr>
                    ) : (
                      this.state.dataAbsen.concat(this.state.late).map((prop, key) => (
                        <tr
                          onClick={() => {
                            this.setCenterMaps(prop.get('latitude'), prop.get('longitude'));
                            this.setState({ defaultZoom: 22 });
                            this.scrollToMyRef();
                          }}
                        >
                          <td>{prop.get("user").attributes.nik}</td>
                          <td>{prop.get('user').attributes.fullname}</td>
                          <td>
                            {prop.get("lateTimes") !== undefined ? (
                              <div>
                                <span style={{ color: 'red' }}>
                                  {convertDate(prop.get('lateTimes'), 'HH:mm:ss')}
                                </span>
                              </div>
                            ) : (
                              convertDate(prop.get('absenMasuk'), 'HH:mm:ss')
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
                {/* <Pagination
                  activePage={this.state.page}
                  itemsCountPerPage={this.state.resPerPage}
                  totalItemsCount={this.state.totalData}
                  pageRangeDisplayed={5}
                  onChange={(pageNumber) => this.getLeaderStaffFilter(pageNumber)}
                  innerClass="pagination justify-content-end p-4"
                  itemClass="page-item mt-2"
                  linkClass="page-link"
                  prevPageText="<"
                  nextPageText=">"
                /> */}
              </Card>
            </Col>
          </Row>
        </Container>
      </React.Fragment>
    );
  }
}

export const Indexz = React.memo(Index);
