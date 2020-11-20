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
import React from "react";
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
  UncontrolledTooltip,
} from "reactstrap";

// core components
import {
  chartOptions,
  parseOptions,
  chartExample1,
  chartExample2,
} from "variables/charts.js";

import LeaderHeader from "components/Headers/LeaderHeader.js";
import { getUsername } from "utils";
import { getLeaderId } from "utils";
import { Link } from "react-router-dom";
import { convertDate } from "utils";
import Maps from "./Maps";
import MapsDashboard from "./MapsDashboard";
import { getUserRole } from "utils";

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeNav: 1,
      chartExample1Data: "data1",
      totalAbsen: 0,
      totalTerlambat: 0,
      totalIzin: 0,
      totalSakit: 0,
      totalOvertime: 0,
      totalRequest: 0,
      percentage: {},
      loading: false,
      totalStaff: 0,
      absence: [],
      daftarStaff: [],
      late: [],
    };
    if (window.Chart) {
      parseOptions(Chart, chartOptions());
    }
  }

  componentDidMount() {
    this.getDaftarAbsenByLevel2();
    this.getDaftarStaffByLevel();
    // this.getDaftarStaff();
    // this.getDaftarAbsenLate();
  }

  toggleNavs = (e, index) => {
    e.preventDefault();
    this.setState({
      activeNav: index,
      chartExample1Data:
        this.state.chartExample1Data === "data1" ? "data2" : "data1",
    });
  };

  getDaftarStaff = () => {
    const User = new Parse.User();
    const query = new Parse.Query(User);

    query.equalTo("leaderIdNew", {
      __type: "Pointer",
      className: "_User",
      objectId: getLeaderId(),
    });
    // query.notContainedIn("roles", ["admin", "leader"]);
    query.notContainedIn("roles", ["admin", "Admin", "leader", "Leader"]);

    query
      .find({ useMasterKey: true })
      .then((x) => {
        this.setState({ daftarStaff: x });
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  // Query Staff
  queryStaffByLevel = (rolesIdKey, containedRoles) => {
    const User = new Parse.User();
    const query = new Parse.Query(User);

    query.equalTo(rolesIdKey, {
      __type: "Pointer",
      className: "_User",
      objectId: getLeaderId(),
    });
    // query.notContainedIn("roles", ["admin", "leader"]);
    query.containedIn("roles", containedRoles);

    query
      .find({ useMasterKey: true })
      .then((x) => {
        this.setState({ daftarStaff: x });
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  getDaftarStaffByLevel = (userRole = getUserRole()) => {
    switch (userRole) {
      case "leader":
        this.queryStaffByLevel("leaderIdNew", ["staff"]);
        break;
      case "supervisor":
        this.queryStaffByLevel("supervisorID", ["staff", "leader"]);
        break;
      case "manager":
        this.queryStaffByLevel("managerID", ["staff", "leader", "supervisor"]);
        break;
      case "head":
        this.queryStaffByLevel("headID", [
          "staff",
          "leader",
          "supervisor",
          "manager",
        ]);
        break;
      case "gm":
        this.queryStaffByLevel("headID", [
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

  // Query Absen Level
  queryAbsenByLevel = (rolesIDKey, containedRoles) => {
    const hierarki = new Parse.User();
    const hierarkiQuery = new Parse.Query(hierarki);
    hierarkiQuery.containedIn("roles", containedRoles);
    hierarkiQuery.equalTo(rolesIDKey, {
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

  getDaftarAbsen = () => {
    // this.setState({ loading: true });
    // const Absence = Parse.Object.extend("Absence");
    // const Leader = Parse.Object.extend("Leader");
    // const leader = new Leader();
    // const query = new Parse.Query(Absence);

    // const d = new Date();
    // const start = new moment(d);
    // start.startOf("day");
    // const finish = new moment(start);
    // finish.add(1, "day");

    // console.log(Parse.User.current().get("leaderId").id);

    // leader.id = Parse.User.current().get("leaderId").id;
    // query.equalTo("leaderId", {
    //   __type: "Pointer",
    //   className: "Leader",
    //   objectId: getLeaderId(),
    // });
    // query.ascending("absenMasuk");
    // query.greaterThanOrEqualTo("createdAt", start.toDate());
    // query.lessThan("createdAt", finish.toDate());
    // query.include("user");
    // query
    //   .find()
    //   .then((x) => {
    //     console.log("user", x);
    //     this.setState({ absence: x, loading: false });
    //   })
    //   .catch((err) => {
    //     alert(err.message);
    //     this.setState({ loading: false });
    //   });
    this.setState({ loading: true });
    const Absence = new Parse.Object.extend("Absence");
    // const Leader = Parse.Object.extend("Leader");
    // const leader = new Leader();
    const query = new Parse.Query(Absence);

    const d = new Date();
    const start = new moment(d);
    start.startOf("day");
    const finish = new moment(start);
    finish.add(1, "day");

    console.log("leaderid", getLeaderId());

    // leader.id = Parse.User.current().get("leaderId").id;
    // query.equalTo("leaderId", leader);
    query.equalTo("leaderIdNew", {
      __type: "Pointer",
      className: "_User",
      objectId: getLeaderId(),
    });
    query.ascending("absenMasuk");
    query.greaterThanOrEqualTo("createdAt", start.toDate());
    query.lessThan("createdAt", finish.toDate());
    query.include("user");
    query.notContainedIn("roles", ["admin", "Admin", "leader", "Leader"]);
    query
      .find()
      .then((x) => {
        console.log("user", x);
        this.setState({ absence: x, loading: false });
      })
      .catch((err) => {
        this.setState({ loading: false });
      });
  };

  getDaftarAbsenLate = () => {
    this.setState({ loading: true });
    const Late = new Parse.Object.extend("Late");
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
    query.ascending("createdAt");
    query.greaterThanOrEqualTo("createdAt", start.toDate());
    query.lessThan("createdAt", finish.toDate());
    query.include("user");
    query.notContainedIn("roles", ["admin", "Admin", "leader", "Leader"]);
    query
      .find()
      .then((x) => {
        console.log("lateeee", x);
        this.setState({ late: x, loading: false });
      })
      .catch((err) => {
        this.setState({ loading: false });
      });
  };

  render() {
    const { absence, late, loading, daftarStaff } = this.state;

    console.log(absence.concat(late));

    return (
      <React.Fragment>
        <LeaderHeader />
        {/* Page content */}
        <Container className="mt--8" fluid>
          <Row className="mt-5">
            <Col xl="5">
              <Card className="shadow">
                <CardHeader className="border-0">
                  <Row className="align-items-center">
                    <div className="col">
                      <h3 className="mb-0">Staff saya</h3>
                    </div>
                    <div className="col text-right">
                      <Link to="/leader/staff">
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
                      <th scope="col">Sisa cuti</th>
                      <th scope="col">Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
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
                    ) : daftarStaff.length < 1 ? (
                      <td colSpan={4} style={{ textAlign: "center" }}>
                        No data found...
                      </td>
                    ) : (
                      daftarStaff.map((prop, key) => (
                        <tr>
                          {/* <td>{prop.get("nik")}</td> */}
                          <td>{prop.get("employeeId")}</td>
                          <td>{prop.get("fullname")}</td>
                          {/* <td>{prop.get("jumlahCuti")}</td> */}
                          <td>{prop.get("totalLeave")}</td>
                          <td>{prop.get("email")}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
                {/* <Maps /> */}
              </Card>
            </Col>
            <Col className="mb-5 mb-xl-0" xl="7">
              <Card className="shadow">
                <CardHeader className="border-0">
                  <Row className="align-items-center">
                    <div className="col">
                      <h3 className="mb-0">Data Absen</h3>
                    </div>
                    <div className="col text-right">
                      <Link to="/leader/data-absen">
                        <Button
                          color="primary"
                          // href="#pablo"
                          // onClick={(e) => e.preventDefault()}
                          size="sm"
                        >
                          See all
                        </Button>
                      </Link>
                      {/* {console.log('leaderIdNewNew', getLeaderId())}
                      <Link to="/admin/maps/iIoJF9pqc6" className="ml-2">
                        <Button
                          color="primary"
                          // href="#pablo"
                          // onClick={(e) => e.preventDefault()}
                          size="sm"
                        >
                          View Location
                        </Button>
                      </Link> */}
                    </div>
                  </Row>
                </CardHeader>
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">NIK</th>
                      <th scope="col">Nama</th>
                      <th scope="col">Absen Masuk</th>
                      <th scope="col">Keterangan</th>
                      <th scope="col">Lokasi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
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
                    ) : absence.length < 1 ? (
                      <td colSpan={4} style={{ textAlign: "center" }}>
                        No data found...
                      </td>
                    ) : (
                      absence.map((prop, key) => (
                        <tr>
                          {/* <td>{prop.get("user").attributes.nik}</td> */}
                          <td>{prop.get("user").attributes.employeeId}</td>
                          <td>{prop.get("fullname")}</td>
                          <td>
                            {prop.get("lateTimes") !== undefined
                              ? `${convertDate(prop.get("lateTimes"), "HH:mm")}`
                              : prop.get("absenMasuk") === undefined
                              ? ""
                              : convertDate(prop.get("absenMasuk"), "HH:mm")}
                          </td>
                          <td
                            style={{
                              color:
                                prop.get("lateTimes") !== undefined
                                  ? "red"
                                  : "green",
                            }}
                          >
                            {/* {convertDate(prop.get("absenKeluar"), "HH:mm")} */}
                            {prop.get("lateTimes") !== undefined
                              ? `Terlambat`
                              : `Tepat Waktu`}
                          </td>
                          <td>
                            <Link
                              className="mr-2"
                              to={`/leader/maps/${prop.get("user").id}`}
                            >
                              <Button
                                id="t4"
                                color="yellow"
                                className="btn-circle"
                                // onClick={(e) => {
                                // 	this.setState({
                                // 		leaderId: prop.id
                                // 	});
                                // 	this.getLeaderStaff(e, prop.id);
                                // }}
                              >
                                <i className="fa fa-eye" />
                              </Button>
                              <UncontrolledTooltip
                                delay={0}
                                placement="top"
                                target="t4"
                              >
                                Lihat detail
                              </UncontrolledTooltip>
                            </Link>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </Card>
              {absence.length < 10 ? (
                <Card className="shadow mt-3">
                  <MapsDashboard />
                </Card>
              ) : (
                ""
              )}
            </Col>
          </Row>
          {absence.length >= 10 ? (
            <Card className="shadow mt-3">
              <MapsDashboard />
            </Card>
          ) : (
            ""
          )}
        </Container>
      </React.Fragment>
    );
  }
}

export default Index;
