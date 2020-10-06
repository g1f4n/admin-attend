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
// import React from "react";
import React, { useRef } from "react";
import { compose, withProps, withStateHandlers } from "recompose";
// react plugin used to create google maps
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  Polyline,
  InfoWindow,
} from "react-google-maps";

// reactstrap components
import { Card, Container, Row } from "reactstrap";
import Parse from "parse";
import moment from "moment";

// core components
import HeaderNormal from "components/Headers/HeaderNormal.js";

import { getLeaderId } from "utils";
import { toInteger, concat } from "lodash";
import { convertDate } from "utils";
import { slicename } from "utils/slice";
import { getUserRole } from "utils";
const {
  MarkerClusterer,
} = require("react-google-maps/lib/components/addons/MarkerClusterer");

// mapTypeId={google.maps.MapTypeId.ROADMAP}

// const locationArr = [
//   [-6.2407535, 106.8558205],
//   [-6.2128274, 106.8100491],
//   [-6.2028274, 106.8000491],
//   [-6.1703274, 106.7600491],
// ];

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
              <img
                src={x.get("selfieImage").url()}
                height={100}
                width={100}
                alt="tidak Ada Gambar"
              />

              <br />
              <br />
              {/* {x.className === "Late" && <p>Terlambat</p>} */}
              {x.get("lateTimes") !== undefined ? <p>Terlambat</p> : ""}
              <p>
                Absen masuk:{" "}
                <span
                  // style={{ color: x.className === "Late" ? "red" : "blue" }}
                  style={{
                    color: x.get("lateTimes") === "Late" ? "red" : "blue",
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

const path = [
  {
    // lat: -6.2407535,
    // lng: 106.8558205,
    lat: -6.2407857,
    lng: 106.854221,
  },
  {
    // lat: -6.2128274,
    // lng: 106.8100491,
    lat: -6.2407857,
    lng: 106.854221,
  },
  {
    // lat: -6.2028274,
    // lng: 106.8000491,
    lat: -6.2407857,
    lng: 106.854221,
  },
  {
    // lat: -6.1703274,
    // lng: 106.7600491,
    lat: -6.2407857,
    lng: 106.854221,
  },
];

const path2 = [
  {
    lat: -6.2607535,
    lng: 106.8558205,
  },
  {
    lat: -6.2428274,
    lng: 106.8100491,
  },
  {
    lat: -6.2328274,
    lng: 106.8000491,
  },
  {
    lat: -6.1903274,
    lng: 106.7600491,
  },
];

[path, path2].map((x, i) => {
  console.log("lat", x[i]["lat"]);
  console.log("long", x[i]["lng"]);
});

class MapsDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      locationArr: [
        [-6.2407535, 106.8558205],
        [-6.2128274, 106.8100491],
        [-6.2028274, 106.8000491],
      ],
      absence: [],
      late: [],
      loading: false,
      isOpen: false,
      avgLat: 0,
      avgLng: 0,
    };
  }

  componentDidMount() {
    this.getLocation();
    // this.getDaftarAbsen();
    // this.getDataLate();
    this.getDaftarAbsenByLevel2();
  }

  // Query Absen
  queryAbsenByLevel = (rolesIdKey, containedRoles) => {
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
    query.ascending("absenMasuk");
    query.greaterThanOrEqualTo("createdAt", start.toDate());
    query.lessThan("createdAt", finish.toDate());
    query.matchesQuery("user", hierarkiQuery);
    query.include("user");
    query
      .find()
      .then((x) => {
        console.log("user", x);
        this.setState({ absence: x, loading: false });
      })
      .catch((err) => {
        alert(err.message);
        this.setState({ loading: false });
      });
  };

  getDaftarAbsenByLevel2 = () => {
    this.setState({ loading: true });
    const userRole = getUserRole();

    switch (userRole) {
      case "leader":
        this.queryAbsenByLevel("leaderIdNew", ["staff"]);
        break;
      case "supervisor":
        this.queryAbsenByLevel("supervisorID", ["staff", "leader"]);
        break;
      case "manager":
        this.queryAbsenByLevel("managerID", ["staff", "leader", "supervisor"]);
        break;
      case "head":
        this.queryAbsenByLevel("headID", [
          "staff",
          "leader",
          "supervisor",
          "manager",
        ]);
        break;
      case "gm":
        this.queryAbsenByLevel("headID", [
          "staff",
          "leader",
          "supervisor",
          "manager",
          "head",
        ]);
        break;

      default:
        break;
    }
  };

  getDaftarAbsenByLevel = () => {
    this.setState({ loading: true });
    const userRole = getUserRole();

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
        query.ascending("absenMasuk");
        query.greaterThanOrEqualTo("createdAt", start.toDate());
        query.lessThan("createdAt", finish.toDate());
        query.matchesQuery("user", hierarkiQuery);
        query.include("user");
        query
          .find()
          .then((x) => {
            console.log("user", x);
            this.setState({ absence: x, loading: false });
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

  getDataLate = () => {
    this.setState({ loading: true });
    const Late = Parse.Object.extend("Late");
    const query = new Parse.Query(Late);

    const d = new Date();
    const start = new moment(d);
    start.startOf("day");
    const finish = new moment(start);
    finish.add(1, "day");

    query.equalTo("leaderIdNew", {
      __type: "Pointer",
      className: "_User",
      objectId: getLeaderId(),
    });
    query.notContainedIn("roles", ["admin", "Admin", "Leader", "leader"]);
    // query.equalTo("status", 3);
    query.greaterThanOrEqualTo("createdAt", start.toDate());
    query.lessThan("createdAt", finish.toDate());
    query.include("user");
    query.ascending("createdAt");
    query
      .find()
      .then((x) => {
        x.map((y) => (y.select = false));
        console.log(x);
        this.setState({ late: x, loading: false });
      })
      .catch((err) => {
        alert(err.message);
        this.setState({ loading: false });
      });
  };

  getDaftarAbsen = () => {
    this.setState({ loading: true });
    const Absence = Parse.Object.extend("Absence");
    const Leader = Parse.Object.extend("Leader");
    const leader = new Leader();
    const query = new Parse.Query(Absence);

    const d = new Date();
    const start = new moment(d);
    start.startOf("day");
    const finish = new moment(start);
    finish.add(1, "day");

    query.equalTo("leaderIdNew", {
      __type: "Pointer",
      className: "_User",
      objectId: getLeaderId(),
    });
    query.ascending("createdAt");
    // query.equalTo("objectId", "CstZklBz6l");
    query.greaterThanOrEqualTo("createdAt", start.toDate());
    query.lessThan("createdAt", finish.toDate());
    query.notContainedIn("roles", ["admin", "Admin", "leader", "Leader"]);
    // query.include("EarlyLeave");
    query.include("Late");
    query.include("user");
    query
      .find()
      .then((x) => {
        console.log("user", x);
        this.setState({ absence: x, loading: false });
      })
      .catch((err) => {
        alert(err.message);
        this.setState({ loading: false });
      });
  };

  handleToggleOpen = (e, markerId) => {
    this.setState({
      isOpen: true,
    });
  };

  handleToggleClose = () => {
    this.setState({
      isOpen: false,
    });
  };

  getLocation = () => {
    this.state.locationArr.map((x, i) => {
      console.log();
      console.log(x[0]);
    });
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevState.absence !== this.state.absence) {
      console.log(this.state.absence);
      // this.getCenterAverage(this.state.absence.concat(this.state.late));
      this.getCenterAverage(this.state.absence);
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

  render() {
    const { locationArr, absence, late } = this.state;

    const iconBase = "https://maps.google.com/mapfiles/kml/shapes/";
    // var goldStar = {
    //   path: "M22-48h-44v43h16l6 5 6-5h16z",
    //   fillColor: "yellow",
    //   fillOpacity: 0.8,
    //   scale: 1,
    //   strokeColor: "gold",
    //   strokeWeight: 14,
    // };

    // const MapWrapper = withScriptjs(
    //   withGoogleMap((props) => (
    //     <GoogleMap
    //       defaultZoom={12}
    //       defaultCenter={{ lat: -6.2407535, lng: 106.8558205 }}
    //       defaultOptions={{
    //         scrollwheel: false,
    //         // styles: [
    //         //   {
    //         //     featureType: "administrative",
    //         //     elementType: "labels.text.fill",
    //         //     stylers: [{ color: "#444444" }],
    //         //   },
    //         //   {
    //         //     featureType: "landscape",
    //         //     elementType: "all",
    //         //     stylers: [{ color: "#f2f2f2" }],
    //         //   },
    //         //   {
    //         //     featureType: "poi",
    //         //     elementType: "all",
    //         //     stylers: [{ visibility: "off" }],
    //         //   },
    //         //   {
    //         //     featureType: "road",
    //         //     elementType: "all",
    //         //     stylers: [{ saturation: -100 }, { lightness: 45 }],
    //         //   },
    //         //   {
    //         //     featureType: "road.highway",
    //         //     elementType: "all",
    //         //     stylers: [{ visibility: "simplified" }],
    //         //   },
    //         //   {
    //         //     featureType: "road.arterial",
    //         //     elementType: "labels.icon",
    //         //     stylers: [{ visibility: "off" }],
    //         //   },
    //         //   {
    //         //     featureType: "transit",
    //         //     elementType: "all",
    //         //     stylers: [{ visibility: "off" }],
    //         //   },
    //         //   {
    //         //     featureType: "water",
    //         //     elementType: "all",
    //         //     stylers: [{ color: "#5e72e4" }, { visibility: "on" }],
    //         //   },
    //         // ],
    //       }}
    //     >
    //       {/* {console.log("print latitude", absence)}
    //       {console.log("print path")}
    //       {absence.concat(late).map((x, i) => {
    //         console.log("concat", x.get("fullname"));
    //         console.log("concat lat", parseFloat(x.get("latitude")));
    //         console.log("concat lng", parseFloat(x.get("longitude")));
    //       })} */}
    //       {absence.concat(late).map((x, i) => (
    //         // console.log("latitude nya", parseInt(x.get("latitude")));
    //         // console.log("longitude nya", parseInt(x.get("longitude")));

    //         <Marker
    //           // title={x.get("fullname")}
    //           //   title={x.get("fullname")}
    //           position={{
    //             lat: parseFloat(x.get("latitude")),
    //             lng: parseFloat(x.get("longitude")),
    //             // lat: -6.2841043,
    //             // lng: 106.9178463,
    //           }}
    //           label={{
    //             text: x.get("fullname"),
    //             color: x.className === "Late" ? "red" : "green",
    //           }}
    //           icon={{
    //             // url:
    //             //   "https://mt.google.com/vt/icon?psize=30&font=fonts/arialuni_t.ttf&color=ff304C13&name=icons/spotlight/spotlight-waypoint-a.png&ax=43&ay=48&text=%E2%80%A2",
    //             url:
    //               x.className === "Late"
    //                 ? require("views/GmapsIcon/red-dot.png")
    //                 : require("views/GmapsIcon/green-dot.png"),
    //             labelOrigin: new window.google.maps.Point(11, 50),
    //             // size: new window.google.maps.Size(22, 40),
    //             origin: new window.google.maps.Point(0, 0),
    //             anchor: new window.google.maps.Point(11, 40),
    //           }}
    //           onClick={() => this.handleToggleOpen(x.id)}
    //           //   icon={goldStar}
    //           //   icon={{ icon: iconBase + "library_maps.png" }}
    //           //   icon={{
    //           //     url:
    //           //       "https://static.vecteezy.com/system/resources/thumbnails/000/550/731/small/user_icon_004.jpg",
    //           //     fillOpacity: 0.8,
    //           //     scale: 1,
    //           //     strokeColor: "gold",
    //           //     strokeWeight: 14,
    //           //   }}
    //           // icon={{ path: google.maps.SymbolPath.CIRCLE, scale: 10 }}
    //         >
    //           {this.state.isOpen && (
    //             <InfoWindow onCloseClick={this.props.handleCloseCall}>
    //               <span>{x.get("fullname")}</span>
    //             </InfoWindow>
    //           )}
    //         </Marker>
    //       ))}

    //       {/* {[path, path2].map((x, i) => (
    //         <Polyline
    //           options={{
    //             strokeColor: "#ff2527",
    //             strokeOpacity: 0.75,
    //             strokeWeight: 2,
    //           }}
    //           path={x}
    //         />
    //       ))} */}
    //     </GoogleMap>
    //   ))
    // );

    return (
      <React.Fragment>
        {/* <HeaderNormal /> */}
        {/* Page content */}
        {/* <Container> */}
        <Row>
          <div className="col">
            <Card className="shadow border-0 pl--5">
              {this.state.loading ? (
                <div style={{ height: `100%`, textAlign: "center" }}>
                  Loading map...
                </div>
              ) : absence.concat(late).length < 1 ? (
                <div style={{ height: `100%`, textAlign: "center" }}>
                  Tidak ada data absen hari ini
                </div>
              ) : (
                <MapWrapper
                  userPosition={this.state.absence}
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
                    <div style={{ height: `100%`, borderRadius: "inherit" }} />
                  }
                />
              )}
            </Card>
          </div>
        </Row>
        {/* </Container> */}
      </React.Fragment>
    );
  }
}

export default MapsDashboard;
