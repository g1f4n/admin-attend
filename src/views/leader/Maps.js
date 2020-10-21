// // /*!

// // =========================================================
// // * Argon Dashboard React - v1.1.0
// // =========================================================

// // * Product Page: https://www.creative-tim.com/product/argon-dashboard-react
// // * Copyright 2019 Creative Tim (https://www.creative-tim.com)
// // * Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

// // * Coded by Creative Tim

// // =========================================================

// // * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

// // */
// // import React from "react";
// // // react plugin used to create google maps
// // import {
// //   withScriptjs,
// //   withGoogleMap,
// //   GoogleMap,
// //   Marker
// // } from "react-google-maps";

// // // reactstrap components
// // import { Card, Container, Row } from "reactstrap";

// // // core components
// // import Header from "components/Headers/Header.js";
// // // mapTypeId={google.maps.MapTypeId.ROADMAP}
// // const MapWrapper = withScriptjs(
// //   withGoogleMap(props => (
// //     <GoogleMap
// //       defaultZoom={12}
// //       defaultCenter={{ lat: 40.748817, lng: -73.985428 }}
// //       defaultOptions={{
// //         scrollwheel: false,
// //         styles: [
// //           {
// //             featureType: "administrative",
// //             elementType: "labels.text.fill",
// //             stylers: [{ color: "#444444" }]
// //           },
// //           {
// //             featureType: "landscape",
// //             elementType: "all",
// //             stylers: [{ color: "#f2f2f2" }]
// //           },
// //           {
// //             featureType: "poi",
// //             elementType: "all",
// //             stylers: [{ visibility: "off" }]
// //           },
// //           {
// //             featureType: "road",
// //             elementType: "all",
// //             stylers: [{ saturation: -100 }, { lightness: 45 }]
// //           },
// //           {
// //             featureType: "road.highway",
// //             elementType: "all",
// //             stylers: [{ visibility: "simplified" }]
// //           },
// //           {
// //             featureType: "road.arterial",
// //             elementType: "labels.icon",
// //             stylers: [{ visibility: "off" }]
// //           },
// //           {
// //             featureType: "transit",
// //             elementType: "all",
// //             stylers: [{ visibility: "off" }]
// //           },
// //           {
// //             featureType: "water",
// //             elementType: "all",
// //             stylers: [{ color: "#5e72e4" }, { visibility: "on" }]
// //           }
// //         ]
// //       }}
// //     >
// //       <Marker position={{ lat: 40.748817, lng: -73.985428 }} />
// //     </GoogleMap>
// //   ))
// // );

// // class Maps extends React.Component {
// //   render() {
// //     return (
// //       <>
// //         <Header />
// //         {/* Page content */}
// //         <Container className="mt--7" fluid>
// //           <Row>
// //             <div className="col">
// //               <Card className="shadow border-0">
// //                 <MapWrapper
// //                   googleMapURL="https://maps.googleapis.com/maps/api/js?key=YOUR_KEY_HERE"
// //                   loadingElement={<div style={{ height: `100%` }} />}
// //                   containerElement={
// //                     <div
// //                       style={{ height: `600px` }}
// //                       className="map-canvas"
// //                       id="map-canvas"
// //                     />
// //                   }
// //                   mapElement={
// //                     <div style={{ height: `100%`, borderRadius: "inherit" }} />
// //                   }
// //                 />
// //               </Card>
// //             </div>
// //           </Row>
// //         </Container>
// //       </>
// //     );
// //   }
// // }

// // export default Maps;

// /*!

// =========================================================
// * Argon Dashboard React - v1.1.0
// =========================================================

// * Product Page: https://www.creative-tim.com/product/argon-dashboard-react
// * Copyright 2019 Creative Tim (https://www.creative-tim.com)
// * Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

// * Coded by Creative Tim

// =========================================================

// * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

// */
// // import React from "react";
// import React, { useRef } from "react";
// import { compose, withProps, withStateHandlers } from "recompose";
// // react plugin used to create google maps
// import {
//   withScriptjs,
//   withGoogleMap,
//   GoogleMap,
//   Marker,
//   Polyline,
// } from "react-google-maps";

// // reactstrap components
// import { Card, Container, Row } from "reactstrap";
// import Parse from "parse";
// import moment from "moment";

// // core components
// import HeaderNormal from "components/Headers/HeaderNormal.js";

// import { getLeaderId } from "utils";
// import { toInteger, concat } from "lodash";

// // mapTypeId={google.maps.MapTypeId.ROADMAP}

// // const locationArr = [
// //   [-6.2407535, 106.8558205],
// //   [-6.2128274, 106.8100491],
// //   [-6.2028274, 106.8000491],
// //   [-6.1703274, 106.7600491],
// // ];

// const path = [
//   {
//     // lat: -6.2407535,
//     // lng: 106.8558205,
//     lat: -6.2407857,
//     lng: 106.854221,
//   },
//   {
//     // lat: -6.2128274,
//     // lng: 106.8100491,
//     lat: -6.2407857,
//     lng: 106.854221,
//   },
//   {
//     // lat: -6.2028274,
//     // lng: 106.8000491,
//     lat: -6.2407857,
//     lng: 106.854221,
//   },
//   {
//     // lat: -6.1703274,
//     // lng: 106.7600491,
//     lat: -6.2407857,
//     lng: 106.854221,
//   },
// ];

// const path2 = [
//   {
//     lat: -6.2607535,
//     lng: 106.8558205,
//   },
//   {
//     lat: -6.2428274,
//     lng: 106.8100491,
//   },
//   {
//     lat: -6.2328274,
//     lng: 106.8000491,
//   },
//   {
//     lat: -6.1903274,
//     lng: 106.7600491,
//   },
// ];

// [path, path2].map((x, i) => {
//   console.log("lat", x[i]["lat"]);
//   console.log("long", x[i]["lng"]);
// });

// class Maps extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       locationArr: [
//         [-6.2407535, 106.8558205],
//         [-6.2128274, 106.8100491],
//         [-6.2028274, 106.8000491],
//       ],
//       absence: [],
//       late: [],
//       loading: false,
//     };
//   }

//   componentDidMount() {
//     this.getLocation();
//     this.getDaftarAbsen();
//     this.getDataLate();
//   }

//   getDataLate = () => {
//     this.setState({ loading: true });
//     const id = this.props.match.params.id;
//     console.log("iddd2", id);
//     const Late = Parse.Object.extend("Late");
//     const query = new Parse.Query(Late);

//     const d = new Date();
//     const start = new moment(d);
//     start.startOf("day");
//     const finish = new moment(start);
//     finish.add(1, "day");

//     query.equalTo("leaderIdNew", {
//       __type: "Pointer",
//       className: "_User",
//       objectId: getLeaderId(),
//     });
//     query.equalTo("user", {
//       __type: "Pointer",
//       className: "_User",
//       objectId: id,
//     });
//     query.notContainedIn("roles", ["admin", "Admin", "Leader", "leader"]);
//     // query.equalTo("status", 3);
//     query.greaterThanOrEqualTo("createdAt", start.toDate());
//     query.lessThan("createdAt", finish.toDate());
//     query.include("user");
//     query.descending("createdAt");
//     query
//       .find()
//       .then((x) => {
//         x.map((y) => (y.select = false));
//         console.log(x);
//         this.setState({ late: x, loading: false });
//       })
//       .catch((err) => {
//         alert(err.message);
//         this.setState({ loading: false });
//       });
//   };

//   getDaftarAbsen = () => {
//     this.setState({ loading: true });
//     const id = this.props.match.params.id;
//     console.log("iddd", id);
//     const Absence = Parse.Object.extend("Absence");
//     const Leader = Parse.Object.extend("Leader");
//     const leader = new Leader();
//     const query = new Parse.Query(Absence);

//     const d = new Date();
//     const start = new moment(d);
//     start.startOf("day");
//     const finish = new moment(start);
//     finish.add(1, "day");

//     query.equalTo("leaderIdNew", {
//       __type: "Pointer",
//       className: "_User",
//       objectId: getLeaderId(),
//     });
//     query.equalTo("user", {
//       __type: "Pointer",
//       className: "_User",
//       objectId: id,
//     });
//     query.descending("createdAt");
//     // query.equalTo("objectId", "CstZklBz6l");
//     query.greaterThanOrEqualTo("createdAt", start.toDate());
//     query.lessThan("createdAt", finish.toDate());
//     query.notContainedIn("roles", ["admin", "Admin", "leader", "Leader"]);
//     // query.include("EarlyLeave");
//     query.include("Late");
//     query.include("user");
//     query
//       .find()
//       .then((x) => {
//         console.log("user", x);
//         this.setState({ absence: x, loading: false });
//       })
//       .catch((err) => {
//         alert(err.message);
//         this.setState({ loading: false });
//       });
//   };

//   getLocation = () => {
//     this.state.locationArr.map((x, i) => {
//       console.log();
//       console.log(x[0]);
//     });
//   };

//   render() {
//     const { locationArr, absence, late } = this.state;

//     const MapWrapper = withScriptjs(
//       withGoogleMap((props) => (
//         <GoogleMap
//           defaultZoom={12}
//           defaultCenter={{ lat: -6.2407535, lng: 106.8558205 }}
//           defaultOptions={{
//             scrollwheel: false,
//             // styles: [
//             //   {
//             //     featureType: "administrative",
//             //     elementType: "labels.text.fill",
//             //     stylers: [{ color: "#444444" }],
//             //   },
//             //   {
//             //     featureType: "landscape",
//             //     elementType: "all",
//             //     stylers: [{ color: "#f2f2f2" }],
//             //   },
//             //   {
//             //     featureType: "poi",
//             //     elementType: "all",
//             //     stylers: [{ visibility: "off" }],
//             //   },
//             //   {
//             //     featureType: "road",
//             //     elementType: "all",
//             //     stylers: [{ saturation: -100 }, { lightness: 45 }],
//             //   },
//             //   {
//             //     featureType: "road.highway",
//             //     elementType: "all",
//             //     stylers: [{ visibility: "simplified" }],
//             //   },
//             //   {
//             //     featureType: "road.arterial",
//             //     elementType: "labels.icon",
//             //     stylers: [{ visibility: "off" }],
//             //   },
//             //   {
//             //     featureType: "transit",
//             //     elementType: "all",
//             //     stylers: [{ visibility: "off" }],
//             //   },
//             //   {
//             //     featureType: "water",
//             //     elementType: "all",
//             //     stylers: [{ color: "#5e72e4" }, { visibility: "on" }],
//             //   },
//             // ],
//           }}
//         >
//           {console.log("print latitude", absence)}
//           {console.log("print path")}
//           {absence.concat(late).forEach((x, i) => {
//             console.log("concat", x.get("fullname"));
//             console.log("concat lat", parseFloat(x.get("latitude")));
//             console.log("concat lng", parseFloat(x.get("longitude")));
//           })}
//           {absence.concat(late).map((x, i) => (
//             // console.log("latitude nya", parseInt(x.get("latitude")));
//             // console.log("longitude nya", parseInt(x.get("longitude")));
//             <Marker
//               // title={x.get("fullname")}
//               title={x.get("fullname")}
//               position={{
//                 lat: parseFloat(x.get("latitude")),
//                 lng: parseFloat(x.get("longitude")),
//                 // lat: -6.2841043,
//                 // lng: 106.9178463,
//               }}
//               label={{
//                 text: x.get("fullname"),
//                 color: x.className === "Late" ? "red" : "green",
//               }}
//               icon={{
//                 // url:
//                 //   "https://mt.google.com/vt/icon?psize=30&font=fonts/arialuni_t.ttf&color=ff304C13&name=icons/spotlight/spotlight-waypoint-a.png&ax=43&ay=48&text=%E2%80%A2",
//                 // url:
//                 //   "https://maps.gstatic.com/mapfiles/ms2/micons/green-dot.png",
//                 url:
//                   x.className === "Late"
//                     ? "https://maps.gstatic.com/mapfiles/ms2/micons/red-dot.png"
//                     : "https://maps.gstatic.com/mapfiles/ms2/micons/green-dot.png",
//                 labelOrigin: new window.google.maps.Point(11, 50),
//                 // size: new window.google.maps.Size(22, 40),
//                 origin: new window.google.maps.Point(0, 0),
//                 anchor: new window.google.maps.Point(11, 40),
//               }}
//             />
//           ))}

//           {/* {[path, path2].map((x, i) => (
//             <Polyline
//               options={{
//                 strokeColor: "#ff2527",
//                 strokeOpacity: 0.75,
//                 strokeWeight: 2,
//               }}
//               path={x}
//             />
//           ))} */}
//         </GoogleMap>
//       ))
//     );

//     return (
//       <React.Fragment>
//         <HeaderNormal />
//         {/* Page content */}
//         <Container className="mt--8" fluid>
//           <Row>
//             <div className="col">
//               <Card className="shadow border-0">
//                 {this.state.loading ? (
//                   <div style={{ height: `100%`, textAlign: "center" }}>
//                     Loading map...
//                   </div>
//                 ) : absence.length < 1 ? (
//                   <div style={{ height: `100%`, textAlign: "center" }}>
//                     Tidak ada data absen hari ini
//                   </div>
//                 ) : (
//                   <MapWrapper
//                     googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyC5tj-2X6b7kwGTqGZkB7sofZdMhpyE75Q"
//                     loadingElement={<div style={{ height: `100%` }} />}
//                     containerElement={
//                       <div
//                         style={{ height: `600px` }}
//                         className="map-canvas"
//                         id="map-canvas"
//                       />
//                     }
//                     mapElement={
//                       <div
//                         style={{ height: `100%`, borderRadius: "inherit" }}
//                       />
//                     }
//                   />
//                 )}
//               </Card>
//             </div>
//           </Row>
//         </Container>
//       </React.Fragment>
//     );
//   }
// }

// export default Maps;

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
import React, { useRef } from "react";
import { compose, withProps, withStateHandlers } from "recompose";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  Polyline,
  InfoWindow,
} from "react-google-maps";
// node.js library that concatenates classes (strings)
import classnames from "classnames";
// javascipt plugin for creating charts
import Chart from "chart.js";
// react plugin used to create charts
import { Line, Bar } from "react-chartjs-2";
// Parse library
import Parse from "parse";
import moment from "moment";
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
  Spinner,
} from "reactstrap";

// core components
import {
  chartOptions,
  parseOptions,
  chartExample1,
  chartExample2,
} from "variables/charts.js";

import Header from "components/Headers/Header.js";
import { getUsername } from "utils";
import { getLeaderId } from "utils";
import { Link } from "react-router-dom";
import { convertDate } from "utils";
import { slicename } from "utils/slice";
import HeaderNormal from "components/Headers/HeaderNormal";
import { getUserRole } from "utils";

const MapWrapper = compose(
  withStateHandlers(
    () => ({
      isOpen: false,
      markerId: "",
    }),
    {
      onToggleOpen: ({ isOpen, markerId }) => (markerID) => ({
        isOpen: !isOpen,
        markerId: markerID,
      }),
    }
  ),
  withScriptjs,
  withGoogleMap
)((props) => (
  <GoogleMap
    defaultZoom={12}
    defaultCenter={{
      lat: parseFloat(props.avgLat),
      lng: parseFloat(props.avgLng),
    }}
    center={{ lat: parseFloat(props.avgLat), lng: parseFloat(props.avgLng) }}
    defaultOptions={{
      scrollwheel: false,
    }}
  >
    {props.userPosition.map((x) => (
      <Marker
        onClick={() => props.onToggleOpen(x.id)}
        icon={{
          labelOrigin: new window.google.maps.Point(11, 50),
          // url:
          //   x.className === "Late"
          //     ? "https://maps.gstatic.com/mapfiles/ms2/micons/red-dot.png"
          //     : "https://maps.gstatic.com/mapfiles/ms2/micons/green-dot.png",
          url: require(`views/GmapsIcon/${
            x.get("user").attributes.color === undefined
              ? "red"
              : x.get("user").attributes.color
          }-dot.png`),
          //size: new window.google.maps.Size(22, 40),
          origin: new window.google.maps.Point(0, 0),
          anchor: new window.google.maps.Point(11, 40),
        }}
        // icon={require(`./GmapsIcon/${x.get('user').attributes.color === undefined
        // 	? 'red'
        // 	: x.get('user').attributes.color}-dot.png`)}
        title={`${x.get("fullname")} absen masuk: ${convertDate(
          x.get("absenMasuk"),
          "HH:mm"
        )}`}
        position={{
          lat: parseFloat(x.get("latitude")),
          lng: parseFloat(x.get("longitude")),
        }}
        label={{
          text: slicename(x.get("fullname")),
          fontWeight: "bold",
        }}
      >
        {props.markerId === x.id && props.isOpen && (
          <InfoWindow onCloseClick={props.onToggleOpen}>
            <div>
              <img src={x.get("selfieImage").url()} height={100} width={100} />

              <br />
              <br />
              {/* {x.className === "Late" && <p>Terlambat</p>} */}
              {x.get("lateTimes") === undefined ? "" : <p>Terlambat</p>}
              <p>
                Absen masuk:{" "}
                <span
                  // style={{ color: x.className === "Late" ? "red" : "blue" }}
                  style={{
                    color: x.get("lateTimes") === undefined ? "red" : "blue",
                  }}
                >
                  {x.get("lateTimes") !== undefined
                    ? convertDate(x.get("lateTimes"), "HH:mm")
                    : convertDate(x.get("absenMasuk"), "HH:mm")}
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

const MapWrapper2 = withScriptjs(
  withGoogleMap((props) => (
    <GoogleMap
      defaultZoom={12}
      defaultCenter={{
        lat: parseFloat(props.avgLat),
        lng: parseFloat(props.avgLng),
      }}
      center={{ lat: parseFloat(props.avgLat), lng: parseFloat(props.avgLng) }}
      defaultOptions={{
        scrollwheel: false,
      }}
    >
      {props.userPosition.map((x) => (
        <Marker
          icon={{
            labelOrigin: new window.google.maps.Point(11, 50),
            url:
              x.className === "Late"
                ? "https://maps.gstatic.com/mapfiles/ms2/micons/red-dot.png"
                : "https://maps.gstatic.com/mapfiles/ms2/micons/green-dot.png",
            // url: require(`./GmapsIcon/${
            //   x.get("user").attributes.color === undefined
            //     ? "red"
            //     : x.get("user").attributes.color
            // }-dot.png`),
            //size: new window.google.maps.Size(22, 40),
            origin: new window.google.maps.Point(0, 0),
            anchor: new window.google.maps.Point(11, 40),
          }}
          // icon={require(`./GmapsIcon/${x.get('user').attributes.color === undefined
          // 	? 'red'
          // 	: x.get('user').attributes.color}-dot.png`)}
          title={`${x.get("fullname")} absen masuk: ${convertDate(
            x.get("absenMasuk"),
            "HH:mm:ss"
          )}`}
          position={{
            lat: parseFloat(x.get("latitude")),
            lng: parseFloat(x.get("longitude")),
          }}
          label={{
            text: slicename(x.get("fullname")),
            fontWeight: "bold",
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
    this.lcoationRef = React.createRef();
    this.state = {
      activeNav: 1,
      chartExample1Data: "data1",
      loading: false,
      totalStaff: 0,
      daftarRequest: [],
      daftarLeader: [],
      dataAbsen: [],
      late: [],
      avgLat: 0,
      avgLng: 0,
    };
    if (window.Chart) {
      parseOptions(Chart, chartOptions());
    }
  }

  componentDidMount() {
    // this.getDaftarRequest();
    // this.getDaftarLeader();
    // this.getLeaderStaff();
    // this.getDataTerlambat();
    this.getDaftarAbsenByLevel2();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.dataAbsen !== this.state.dataAbsen) {
      console.log(this.state.dataAbsen);
      // this.getCenterAverage(this.state.dataAbsen.concat(this.state.late));
      this.getCenterAverage(this.state.dataAbsen);
    }
  }

  scrollToMyRef = () => window.scrollTo(0, this.lcoationRef.offsetTop);

  getCenterAverage = (arr) => {
    let avgLat = arr.reduce((acc, currentValue) => {
      return acc + parseFloat(currentValue.get("latitude"));
    }, 0);

    let avgLng = arr.reduce((acc, currentValue) => {
      return acc + parseFloat(currentValue.get("longitude"));
    }, 0);

    console.log(avgLat + " " + avgLng);

    this.setState({
      avgLat: avgLat / arr.length,
      avgLng: avgLng / arr.length,
    });
  };

  toggleNavs = (e, index) => {
    e.preventDefault();
    this.setState({
      activeNav: index,
      chartExample1Data:
        this.state.chartExample1Data === "data1" ? "data2" : "data1",
    });
  };

  // getDaftarLeader = () => {
  //   this.setState({ loading: true });
  //   const User = new Parse.User();
  //   const query = new Parse.Query(User);

  //   query.equalTo("roles", "leader" || "Leader");
  //   query
  //     .find({ useMasterKey: true })
  //     .then((x) => {
  //       this.setState({ daftarLeader: x, loading: false });
  //     })
  //     .catch((err) => {
  //       console.log(err.message);
  //     });
  // };

  // getDaftarRequest = () => {
  //   const ChangeRequest = Parse.Object.extend("ChangeRequest");
  //   const query = new Parse.Query(ChangeRequest);

  //   query.equalTo("statusApprove", 3);
  //   query.exclude("createdAt");
  //   query.exclude("updatedAt");

  //   query.include("userId");
  //   query
  //     .find()
  //     .then((x) => {
  //       // let data = x[1].attributes;
  //       // console.log(x);
  //       // for (var i in data) {
  //       // 	console.log(i);
  //       // 	console.log(data[i]);
  //       // }
  //       this.setState({ daftarRequest: x });
  //     })
  //     .catch(({ message }) => {
  //       this.setState({ loading: false });
  //       console.log(message);

  //       //window.location.reload(false);
  //       return;
  //     });
  // };

  getDataTerlambat = () => {
    this.setState({ loading: true });
    const id = this.props.match.params.id;
    const Late = Parse.Object.extend("Late");
    const query = new Parse.Query(Late);

    const d = new Date();
    const start = new moment(d);
    start.startOf("day");
    const finish = new moment(start);
    finish.add(1, "day");

    // query.equalTo("status", 3);
    query.equalTo("user", {
      __type: "Pointer",
      className: "_User",
      objectId: id,
    });
    query.equalTo("leaderIdNew", {
      __type: "Pointer",
      className: "_User",
      objectId: getLeaderId(),
    });
    query.greaterThanOrEqualTo("time", start.toDate());
    query.lessThan("time", finish.toDate());
    query.include("user");
    query
      .find()
      .then((x) => {
        x.map((y) => (y.isOpen = false));
        console.log(x);
        this.setState({ late: x, loading: false });
      })
      .catch((err) => {
        alert(err.message);
        this.setState({ loading: false });
      });
  };

  getLeaderStaff = () => {
    this.setState({ loading: true });
    const id = this.props.match.params.id;

    const Absence = Parse.Object.extend("Absence");
    const query = new Parse.Query(Absence);

    const d = new Date();
    const start = new moment(d);
    start.startOf("day");
    const finish = new moment(start);
    finish.add(1, "day");

    query.equalTo("user", {
      __type: "Pointer",
      className: "_User",
      objectId: id,
    });
    query.equalTo("leaderIdNew", {
      __type: "Pointer",
      className: "_User",
      objectId: getLeaderId(),
    });
    query.greaterThanOrEqualTo("createdAt", start.toDate());
    query.lessThan("createdAt", finish.toDate());
    query.include("user");
    query
      .find()
      .then((x) => {
        x.map((y) => (y.isOpen = false));
        console.log(x);
        this.setState({ dataAbsen: x, loading: false });
      })
      .catch((err) => {
        console.log(err);
        this.setState({ loading: false });
      });
  };

  // Query Absen
  queryAbsenByLevel = (rolesIdKey, containedRoles, userId) => {
    const hierarki = new Parse.User();
        const hierarkiQuery = new Parse.Query(hierarki);
        hierarkiQuery.containedIn("roles", containedRoles);
        hierarkiQuery.equalTo(rolesIdKey, {
          __type: "Pointer",
          className: "_User",
          objectId: getLeaderId(),
        });

        const Absence = Parse.Object.extend("Absence");
        const query = new Parse.Query(Absence);

        const d = new Date();
        const start = new moment(d);
        start.startOf("day");
        const finish = new moment(start);
        finish.add(1, "day");

        // query.equalTo('leaderIdNew', {
        //   __type: 'Pointer',
        //   className: '_User',
        //   objectId: getLeaderId()
        // });
        query.ascending("createdAt");
        query.greaterThanOrEqualTo("createdAt", start.toDate());
        query.lessThan("createdAt", finish.toDate());
        query.matchesQuery("user", hierarkiQuery);
        query.include("user");
        query.equalTo("user", {
          __type: "Pointer",
          className: "_User",
          objectId: userId,
        });
        query
          .find()
          .then((x) => {
            console.log("user", x);
            this.setState({ dataAbsen: x, loading: false });
          })
          .catch((err) => {
            alert(err.message);
            this.setState({ loading: false });
          });
  };

  getDaftarAbsenByLevel2 = () => {
    this.setState({ loading: true });
    const userRole = getUserRole();
    const id = this.props.match.params.id;

    switch (userRole) {
      case "leader":
        this.queryAbsenByLevel("leaderIdNew", ["staff", "Staff"], id);
        break;
      case "supervisor":
        this.queryAbsenByLevel("supervisorID", ["staff", "leader"], id);
        break;
      case "manager":
        this.queryAbsenByLevel("managerID", ["staff", "leader", "supervisor"], id);
        break;
      case "head":
        this.queryAbsenByLevel("headID", [
          "staff",
          "leader",
          "supervisor",
          "manager",
        ], id);
        break;
      case "gm":
        this.queryAbsenByLevel("headID", [
          "staff",
          "leader",
          "supervisor",
          "manager",
          "head",
        ], id);
        break;

      default:
        break;
    }
  };

  getDaftarAbsenByLevel = () => {
    this.setState({ loading: true });
    const userRole = getUserRole();
    const id = this.props.match.params.id;

    switch (userRole) {
      case "leader":
        const hierarki = new Parse.User();
        const hierarkiQuery = new Parse.Query(hierarki);
        hierarkiQuery.containedIn("roles", ["staff", "Staff"]);
        hierarkiQuery.equalTo("leaderIdNew", {
          __type: "Pointer",
          className: "_User",
          objectId: getLeaderId(),
        });

        const Absence = Parse.Object.extend("Absence");
        const query = new Parse.Query(Absence);

        const d = new Date();
        const start = new moment(d);
        start.startOf("day");
        const finish = new moment(start);
        finish.add(1, "day");

        // query.equalTo('leaderIdNew', {
        //   __type: 'Pointer',
        //   className: '_User',
        //   objectId: getLeaderId()
        // });
        query.ascending("createdAt");
        // query.greaterThanOrEqualTo("createdAt", start.toDate());
        // query.lessThan("createdAt", finish.toDate());
        query.matchesQuery("user", hierarkiQuery);
        query.include("user");
        query.equalTo("user", {
          __type: "Pointer",
          className: "_User",
          objectId: id,
        });
        query
          .find()
          .then((x) => {
            console.log("user", x);
            this.setState({ dataAbsen: x, loading: false });
          })
          .catch((err) => {
            alert(err.message);
            this.setState({ loading: false });
          });
        break;
      case "supervisor":
        break;
      case "manager":
        break;
      case "head":
        break;
      case "gm":
        break;

      default:
        break;
    }
  };

  setCenterMaps = (lat, lng) => {
    this.setState({ avgLat: parseFloat(lat), avgLng: parseFloat(lng) });
  };

  render() {
    const { daftarRequest, loading, daftarLeader } = this.state;
    console.log(this.state.dataAbsen.concat(this.state.late));

    return (
      <React.Fragment>
        <HeaderNormal />
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
                  <div style={{ height: `100%`, textAlign: "center" }}>
                    Loading map...
                  </div>
                ) : this.state.dataAbsen.concat(this.state.late).length ===
                  0 ? (
                  <div style={{ height: `100%`, textAlign: "center" }}>
                    Tidak ada data absen hari ini
                  </div>
                ) : (
                  <MapWrapper
                    userPosition={this.state.dataAbsen}
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
                          borderRadius: "inherit",
                        }}
                      />
                    }
                  />
                )}
              </Card>
            </Col>
            {/* <Col xl="6" className="mb-5">
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
                        <td colSpan={4} style={{ textAlign: "center" }}>
                          <Spinner
                            as="span"
                            animation="grow"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                          />{" "}
                          <Spinner
                            as="span"
                            animation="grow"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                          />{" "}
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
                        <td colSpan={4} style={{ textAlign: "center" }}>
                          No data found...
                        </td>
                      </tr>
                    ) : (
                      daftarRequest.map((prop, key) => (
                        <tr>
                          <td>{prop.get("userId").attributes.nik}</td>
                          <td>{prop.get("userId").attributes.fullname}</td>
                          <td
                            style={{
                              color: `${
                                prop.attributes.statusApprove === 3
                                  ? "blue"
                                  : `${
                                      prop.attributes.statusApprove === 1
                                        ? "green"
                                        : "red"
                                    }`
                              }`,
                            }}
                          >
                            <strong>
                              {prop.get("statusApprove") === 3
                                ? "Waiting"
                                : prop.get("statusApprove") === 1
                                ? "Approved".toUpperCase()
                                : "Rejected".toUpperCase()}
                            </strong>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </Card>
            </Col> */}
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
                        <td colSpan={3} style={{ textAlign: "center" }}>
                          <Spinner
                            as="span"
                            animation="grow"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                          />{" "}
                          <Spinner
                            as="span"
                            animation="grow"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                          />{" "}
                          <Spinner
                            as="span"
                            animation="grow"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                          />
                        </td>
                      </tr>
                    ) : this.state.dataAbsen.map < 1 ? (
                      <tr>
                        <td colSpan={3} style={{ textAlign: "center" }}>
                          No data found...
                        </td>
                      </tr>
                    ) : (
                      this.state.dataAbsen
                        .concat(this.state.late)
                        .map((prop, key) => (
                          <tr
                            onClick={() => {
                              this.setCenterMaps(
                                prop.get("latitude"),
                                prop.get("longitude")
                              );
                              this.scrollToMyRef();
                            }}
                          >
                            <td>{prop.get("user").attributes.nik}</td>
                            <td>{prop.get("user").attributes.fullname}</td>
                            <td>
                              {/* {prop.className === "Late" ? (
                                <div>
                                  <span style={{ color: "red" }}>
                                    {convertDate(prop.get("time"), "HH:mm")}
                                  </span>
                                </div>
                              ) : (
                                convertDate(prop.get("absenMasuk"), "HH:mm")
                              )} */}
                              {prop.get("lateTimes") !== undefined ? (
                                <div>
                                  <span style={{ color: "red" }}>
                                    {convertDate(
                                      prop.get("lateTimes"),
                                      "HH:mm"
                                    )}
                                  </span>
                                </div>
                              ) : (
                                convertDate(prop.get("absenMasuk"), "HH:mm")
                              )}
                            </td>
                          </tr>
                        ))
                    )}
                  </tbody>
                </Table>
              </Card>
            </Col>
          </Row>
        </Container>
      </React.Fragment>
    );
  }
}

// export const Indexz = React.memo(Maps);
export default Maps;
