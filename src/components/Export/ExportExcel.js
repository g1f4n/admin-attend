import React, { Component } from "react";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
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
  Form,
  Col,
  Button,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  FormGroup,
} from "reactstrap";
import { getLeaderId } from "utils";
import Parse from "parse";
import moment from "moment";
import { handleSelect } from "utils";
import { convertDate } from "utils";
import { Collapse } from "reactstrap";
import _ from "lodash/lang";
import { at } from "lodash";

class ExportExcel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      daftarStaff: [],
      dataLate: [],
      dataOvertime: [],
      dataEarlyLeave: [],
      loading: false,
      employeeName: "",
      employeeID: "",
    };
  }

  getdaftarStaff = () => {
    const userId = "aKyuHcDwSe";
    const User = new Parse.User();
    const query = new Parse.Query(User);

    query.equalTo("leaderIdNew", {
      __type: "Pointer",
      className: "_User",
      objectId: getLeaderId(),
    });
    query.equalTo("objectId", userId);
    query.notContainedIn("roles", ["admin", "leader"]);

    query
      .find({ useMasterKey: true })
      .then((x) => {
        this.setState({ daftarStaff: x });
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  getDaftarAbsen = () => {
    this.setState({ loading: true });
    //const userId = this.props.match.params.id;
    // const { idds } = this.state;
    console.log("idds", this.props.startDateExcelFrom);
    console.log("iddss", this.props.status);
    const nullData = "Data tidak ditemukan";
    const userId = "LEDw8FUJeQ";
    const Absence = Parse.Object.extend("Absence");
    const Leader = Parse.Object.extend("Leader");
    const leader = new Leader();
    const query = new Parse.Query(Absence);

    //
    if (parseInt(this.props.status) === 6) {
      const d = new Date();
      const start = new moment(this.props.startDateExcelFrom);
      start.startOf("month");
      const finish = new moment(start);
      finish.add(1, "month");
      query.greaterThanOrEqualTo("absenMasuk", start.toDate());
      query.lessThan("absenMasuk", finish.toDate());
    } else if (parseInt(this.props.status) === 5) {
      const d = new Date();
      const start = new moment(this.props.startDateExcelFrom);
      start.startOf("week");
      const finish = new moment(start);
      finish.add(1, "week");
      query.greaterThanOrEqualTo("absenMasuk", start.toDate());
      query.lessThan("absenMasuk", finish.toDate());
    } else if (parseInt(this.props.status) === 4) {
      const d = new Date();
      const start = new moment(this.props.startDateExcelFrom);
      start.startOf("day");
      const finish = new moment(start);
      finish.add(1, "day");
      query.greaterThanOrEqualTo("absenMasuk", start.toDate());
      query.lessThan("absenMasuk", finish.toDate());
    } else {
      const d = new Date();
      const start = new moment(d);
      start.startOf("day");
      const finish = new moment(start);
      finish.add(1, "day");
    }

    query.equalTo("leaderIdNew", {
      __type: "Pointer",
      className: "_User",
      objectId: getLeaderId(),
    });
    query.equalTo("user", {
      __type: "Pointer",
      className: "_User",
      objectId: this.props.userId,
    });
    query.descending("absenMasuk");
    // query.greaterThanOrEqualTo("createdAt", start.toDate());
    // query.lessThan("createdAt", finish.toDate());
    // query.greaterThanOrEqualTo("absenMasuk", start.toDate());
    // query.lessThan("absenMasuk", finish.toDate());
    query.notContainedIn("roles", ["admin", "Admin", "leader", "Leader"]);
    query.include("user");
    query
      .find()
      .then((x) => {
        console.log("user", x);
        this.setState({
          data: x,
          loading: false,
          employeeName: _.isEmpty(x) ? nullData : x[0].get("fullname"),
          employeeID: _.isEmpty(x) ? nullData : x[0].get("user").attributes.nik,
          employeeTitle: _.isEmpty(x)
            ? nullData
            : x[0].get("user").attributes.level,
          employeeDepartment: _.isEmpty(x)
            ? nullData
            : x[0].get("user").attributes.posisi,
        });
      })
      .catch((err) => {
        alert(err.message);
        this.setState({ loading: false });
      });
  };

  getDaftarAbsenLate = () => {
    this.setState({ loading: true });
    // const userId = this.props.match.params.id;
    const nullData = "Data tidak ditemukan";
    const userId = "aKyuHcDwSe";
    const Late = Parse.Object.extend("Late");
    const Leader = Parse.Object.extend("Leader");
    const leader = new Leader();
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
    query.equalTo("user", {
      __type: "Pointer",
      className: "_User",
      objectId: userId,
    });
    query.descending("time");
    // query.greaterThanOrEqualTo("createdAt", start.toDate());
    // query.lessThan("createdAt", finish.toDate());
    query.notContainedIn("roles", ["admin", "Admin", "leader", "Leader"]);
    query.include("user");
    query
      .find()
      .then((x) => {
        console.log("user", x);
        this.setState({
          dataLate: x,
          loading: false,
          // employeeName: _.isEmpty(x) ? nullData : x[0].get("fullname"),
          // employeeID: _.isEmpty(x) ? nullData : x[0].get("user").attributes.nik,
          // employeeTitle: _.isEmpty(x)
          //   ? nullData
          //   : x[0].get("user").attributes.level,
          // employeeDepartment: _.isEmpty(x)
          //   ? nullData
          //   : x[0].get("user").attributes.posisi,
        });
      })
      .catch((err) => {
        alert(err.message);
        this.setState({ loading: false });
      });
  };

  getDaftarOvertime = () => {
    this.setState({ loading: true });
    // const userId = this.props.match.params.id;
    const nullData = "Data tidak ditemukan";
    const userId = "aKyuHcDwSe";
    const Overtime = Parse.Object.extend("Overtime");
    const Leader = Parse.Object.extend("Leader");
    const leader = new Leader();
    const query = new Parse.Query(Overtime);

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
    query.equalTo("user", {
      __type: "Pointer",
      className: "_User",
      objectId: userId,
    });
    query.descending("time");
    // query.greaterThanOrEqualTo("createdAt", start.toDate());
    // query.lessThan("createdAt", finish.toDate());
    query.notContainedIn("roles", ["admin", "Admin", "leader", "Leader"]);
    query.include("user");
    query
      .find()
      .then((x) => {
        console.log("user", x);
        this.setState({
          dataOvertime: x,
          loading: false,
          // employeeName: _.isEmpty(x) ? nullData : x[0].get("fullname"),
          // employeeID: _.isEmpty(x) ? nullData : x[0].get("user").attributes.nik,
          // employeeTitle: _.isEmpty(x)
          //   ? nullData
          //   : x[0].get("user").attributes.level,
          // employeeDepartment: _.isEmpty(x)
          //   ? nullData
          //   : x[0].get("user").attributes.posisi,
        });
      })
      .catch((err) => {
        alert(err.message);
        this.setState({ loading: false });
      });
  };

  getDaftarEarlyLeave = () => {
    this.setState({ loading: true });
    // const userId = this.props.match.params.id;
    const nullData = "Data tidak ditemukan";
    const userId = "aKyuHcDwSe";
    const EarlyLeave = Parse.Object.extend("EarlyLeave");
    const Leader = Parse.Object.extend("Leader");
    const leader = new Leader();
    const query = new Parse.Query(EarlyLeave);

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
    query.equalTo("user", {
      __type: "Pointer",
      className: "_User",
      objectId: userId,
    });
    query.descending("time");
    // query.greaterThanOrEqualTo("createdAt", start.toDate());
    // query.lessThan("createdAt", finish.toDate());
    query.notContainedIn("roles", ["admin", "Admin", "leader", "Leader"]);
    query.include("user");
    query
      .find()
      .then((x) => {
        console.log("user", x);
        this.setState({
          dataEarlyLeave: x,
          loading: false,
          // employeeName: _.isEmpty(x) ? nullData : x[0].get("fullname"),
          // employeeID: _.isEmpty(x) ? nullData : x[0].get("user").attributes.nik,
          // employeeTitle: _.isEmpty(x)
          //   ? nullData
          //   : x[0].get("user").attributes.level,
          // employeeDepartment: _.isEmpty(x)
          //   ? nullData
          //   : x[0].get("user").attributes.posisi,
        });
      })
      .catch((err) => {
        alert(err.message);
        this.setState({ loading: false });
      });
  };

  componentDidMount() {
    this.getDaftarAbsen();
    this.getdaftarStaff();
    this.getDaftarAbsenLate();
    this.getDaftarOvertime();
    this.getDaftarEarlyLeave();
  }

  subtractHourLate = (workingHour, duttyOn, typeTime) => {
    let resultHours;
    // Jam terlambat masuk
    if (typeTime === "Late") {
      if (duttyOn > workingHour) {
        resultHours = duttyOn - workingHour;
      }
    }

    // jam lembur / overtime
    if (typeTime === "Overtime") {
      if (duttyOn > workingHour) {
        resultHours = duttyOn - workingHour;
      }
    }

    // jam early leave / pulang cepat
    if (typeTime === "EarlyLeave") {
      if (duttyOn < workingHour) {
        // kasus dutty on nya 16.45
        // 17.00 - 16.45 = 00.15 atau 0 jam 15 menit

        // kasus dutty on nya 16.00
        // 17.00 - 16.00 = 01.00 atau 1 jam 0 menit
        resultHours = workingHour - duttyOn;
      }
    }

    return resultHours;
  };

  // subtractHour And Minutes
  subtractHour = (workingHour, attendace, category, timer) => {
    // result
    let result;
    // early departure
    if (category === "earlyDeparture") {
      // Hour
      if (timer === "Hours") {
        result = Math.floor((workingHour - parseInt(attendace)) / 60000 / 60);
      }
      // minutes
      if (timer === "Minutes") {
        result = (workingHour - parseInt(attendace)) / 60000;
      }
    }
    console.log("working hours", typeof workingHour);
    console.log("attendance", typeof attendace);
    console.log("result", result);
    return result;
  };

  render() {
    const {
      data,
      daftarStaff,
      loading,
      dataLate,
      dataOvertime,
      dataEarlyLeave,
    } = this.state;

    // data.map((prop, key) => {
    //   console.log("Early Departure");
    //   console.log(
    //     "jam absen earlyTimes",
    //     prop.get("earlyTimes") === undefined
    //       ? ""
    //       : parseInt(convertDate(prop.get("earlyTimes"), "k"))
    //   );
    //   console.log("jam keluar kantor", prop.get("user").attributes.jamKeluar);
    //   console.log(
    //     "hasil Hours",
    //     this.subtractHour(
    //       prop.get("user").attributes.jamKeluar,
    //       prop.get("earlyTimes") === undefined
    //         ? ""
    //         : convertDate(prop.get("earlyTimes"), "k"),
    //       "earlyDeparture",
    //       "Hours"
    //     )
    //   );
    //   console.log(

    //   );
    //   console.log("------------------------");
    // });

    return (
      <div>
        {/* <ReactHTMLTableToExcel
          id={this.props.id}
          className={this.props.className}
          table={this.props.table}
          filename={this.props.filename}
          sheet={this.props.sheet}
          buttonText={this.props.buttonText}
        /> */}
        <Table
          className="align-items-center table-flush"
          id={this.props.table}
          responsive
          hidden
        >
          <thead>
            <tr>
              <th scope="col" style={{ border: "none" }}>
                Fingerprint ID
              </th>
              <th scope="col" style={{ border: "none" }}>
                {this.state.employeeID}
              </th>
            </tr>
          </thead>
          <thead className="border-0">
            <tr>
              <th scope="col" style={{ border: "none" }}>
                Employee Name
              </th>
              <th scope="col" style={{ border: "none" }}>
                {this.state.employeeName}
              </th>
            </tr>
          </thead>
          <thead className="border-0">
            <tr>
              <th scope="col" style={{ border: "none" }}>
                Employee Title
              </th>
              <th scope="col" style={{ border: "none" }}>
                {this.state.employeeTitle}
              </th>
            </tr>
          </thead>
          <thead className="border-0 mb-2">
            <tr>
              <th scope="col" style={{ border: "none" }}>
                Department Title
              </th>
              <th scope="col" className="mb-2" style={{ border: "none" }}>
                {this.state.employeeDepartment}
              </th>
            </tr>
          </thead>
          <thead className="thead-light" style={{ textAlign: "center" }}>
            <tr>
              <th scope="col" rowSpan="2">
                Day
              </th>
              <th scope="col" rowSpan="2">
                Date
              </th>
              <th scope="col" rowSpan="2">
                Working Hour
              </th>
              <th scope="col" colSpan="2">
                Dutty On
              </th>
              <th scope="col" colSpan="2">
                Dutty Off
              </th>
              <th scope="col" colSpan="2">
                Late In
              </th>
              <th scope="col" colSpan="2">
                Early Derparture
              </th>
              <th scope="col" colSpan="2">
                Over Time
              </th>
              <th scope="col" colSpan="2">
                Total Hour
              </th>
              <th scope="col" rowSpan="2">
                Notes
              </th>
            </tr>
            <tr>
              <th scope="col">Hours</th>
              <th scope="col">Minutes</th>
              <th scope="col">Hours</th>
              <th scope="col">Minutes</th>
              <th scope="col">Hours</th>
              <th scope="col">Minutes</th>
              <th scope="col">Hours</th>
              <th scope="col">Minutes</th>
              <th scope="col">Hours</th>
              <th scope="col">Minutes</th>
              <th scope="col">Hours</th>
              <th scope="col">Minutes</th>
            </tr>
          </thead>
          <tbody style={{ textAlign: "center" }}>
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
            ) : data.length < 1 ? (
              // .concat(dataLate)
              // .concat(dataOvertime)
              // .concat(dataEarlyLeave).length < 1 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: "center" }}>
                  No data found...
                </td>
              </tr>
            ) : (
              data
                // .concat(dataLate)
                // .concat(dataOvertime)
                // .concat(dataEarlyLeave)
                .map((prop, key) => (
                  <tr>
                    {/* Day */}
                    <td>{convertDate(prop.get("createdAt"), "ddd")}</td>

                    {/* Date */}
                    <td>
                      {/* {prop.className === "Late"
                        ? convertDate(prop.get("createdAt"), "DD/MM/YYYY")
                        : prop.className === "Absence"
                        ? convertDate(prop.get("createdAt"), "DD/MM/YYYY")
                        : prop.className === "Overtime"
                        ? convertDate(prop.get("createdAt"), "DD/MM/YYYY")
                        : prop.className === "EarlyLeave"
                        ? convertDate(prop.get("createdAt"), "DD/MM/YYYY")
                        : ""} */}
                      {convertDate(prop.get("createdAt"), "DD/MM/YYYY")}
                    </td>

                    {/* Working Hour */}
                    <td>
                      {`${
                        prop.get("user").attributes.jamMasuk < 10 ? "0" : ""
                      }${prop.get("user").attributes.jamMasuk}:00` +
                        " - " +
                        `${prop.get("user").attributes.jamKeluar}:00`}
                    </td>

                    {/* Dutty On Hours */}
                    <td
                      style={{
                        color: prop.get("lateTimes") !== undefined ? "red" : "",
                      }}
                    >
                      {/* {prop.className === "Late"
                        ? convertDate(prop.get("time"), "k")
                        : prop.className === "Absence"
                        ? convertDate(prop.get("absenMasuk"), "k")
                        : ""} */}
                      {prop.get("lateTimes") !== undefined
                        ? convertDate(prop.get("lateTimes"), "k")
                        : convertDate(prop.get("absenMasuk"), "k")}
                    </td>

                    {/* Dutty On Minutes */}
                    <td
                      style={{
                        color: prop.get("lateTimes") !== undefined ? "red" : "",
                      }}
                    >
                      {/* {prop.className === "Late"
                        ? convertDate(prop.get("time"), "m")
                        : prop.className === "Absence"
                        ? convertDate(prop.get("absenMasuk"), "m")
                        : ""} */}
                      {prop.get("lateTimes") !== undefined
                        ? convertDate(prop.get("lateTimes"), "m")
                        : convertDate(prop.get("absenMasuk"), "m")}
                    </td>

                    {/* Dutty Off Hours */}
                    <td
                      style={{
                        color:
                          prop.get("earlyTimes") !== undefined ? "red" : "",
                      }}
                    >
                      {/* {prop.className === "Overtime"
                        ? convertDate(prop.get("time"), "k")
                        : prop.className === "EarlyLeave"
                        ? convertDate(prop.get("time"), "k")
                        : prop.className === "Absence"
                        ? convertDate(prop.get("absenKeluar"), "k")
                        : ""} */}
                      {prop.get("earlyTimes") !== undefined
                        ? convertDate(prop.get("earlyTimes"), "k")
                        : prop.get("overtimeOut") !== undefined
                        ? convertDate(prop.get("overtimeOut"), "k")
                        : prop.get("absenKeluar") !== undefined
                        ? convertDate(prop.get("absenKeluar"), "k")
                        : ""}
                    </td>

                    {/* Dutty off Minutes */}
                    <td
                      style={{
                        color:
                          prop.get("earlyTimes") !== undefined ? "red" : "",
                      }}
                    >
                      {/* {prop.className === "Overtime"
                        ? convertDate(prop.get("time"), "m")
                        : prop.className === "EarlyLeave"
                        ? convertDate(prop.get("time"), "m")
                        : prop.className === "Absence"
                        ? convertDate(prop.get("absenKeluar"), "m")
                        : ""} */}
                      {prop.get("earlyTimes") !== undefined
                        ? convertDate(prop.get("earlyTimes"), "m")
                        : prop.get("overtimeOut") !== undefined
                        ? convertDate(prop.get("overtimeOut"), "k")
                        : prop.get("absenKeluar") !== undefined
                        ? convertDate(prop.get("absenKeluar"), "m")
                        : ""}
                    </td>

                    {/* Late In Hours */}
                    <td>
                      {prop.get("lateTimes") === undefined
                        ? ""
                        : moment
                            .duration(
                              convertDate(prop.get("lateTimes"), "HH:mm"),
                              "HH:mm"
                            )
                            .subtract(
                              moment.duration(
                                `${prop.get("user").attributes.jamMasuk}:00`,
                                "HH:mm"
                              )
                            )
                            .hours()}
                    </td>

                    {/* Late In Minutes */}
                    <td>
                      {prop.get("lateTimes") === undefined
                        ? ""
                        : moment
                            .duration(
                              convertDate(prop.get("lateTimes"), "HH:mm"),
                              "HH:mm"
                            )
                            .subtract(
                              moment.duration(
                                `${prop.get("user").attributes.jamMasuk}:00`,
                                "HH:mm"
                              )
                            )
                            .minutes()}
                    </td>

                    {/* Early Derparture Hours */}
                    <td>
                      {prop.get("earlyTimes") === undefined
                        ? ""
                        : moment
                            .duration(
                              `${prop.get("user").attributes.jamKeluar}:00`,
                              "HH:mm"
                            )
                            .subtract(
                              moment.duration(
                                convertDate(prop.get("earlyTimes"), "HH:mm"),
                                "HH:mm"
                              )
                            )
                            .hours()}
                    </td>

                    {/* Early Derparture Minutes */}
                    <td>
                      {prop.get("earlyTimes") === undefined
                        ? ""
                        : moment
                            .duration(
                              `${prop.get("user").attributes.jamKeluar}:00`,
                              "HH:mm"
                            )
                            .subtract(
                              moment.duration(
                                convertDate(prop.get("earlyTimes"), "HH:mm"),
                                "HH:mm"
                              )
                            )
                            .minutes()}
                    </td>

                    {/* Over Time Hours */}
                    <td>
                      {/* {prop.className === "Overtime"
                        ? this.subtractHourLate(
                            17,
                            convertDate(prop.get("time"), "k"),
                            "Overtime"
                          )
                        : ""} */}
                      {prop.get("overtimeIn") === undefined &&
                      prop.get("overtimeOut") === undefined
                        ? ""
                        : moment
                            .duration(
                              convertDate(prop.get("overtimeOut"), "HH:mm"),
                              "HH:mm"
                            )
                            .subtract(
                              moment.duration(
                                convertDate(prop.get("overtimeIn"), "HH:mm"),
                                "HH:mm"
                              )
                            )
                            .hours()}
                    </td>

                    {/* Over Time Minutes */}
                    <td>
                      {/* {prop.className === "Overtime"
                        ? this.subtractHourLate(
                            0,
                            convertDate(prop.get("time"), "m"),
                            "Overtime"
                          )
                        : ""} */}
                      {prop.get("overtimeIn") === undefined &&
                      prop.get("overtimeOut") === undefined
                        ? ""
                        : moment
                            .duration(
                              convertDate(prop.get("overtimeOut"), "HH:mm"),
                              "HH:mm"
                            )
                            .subtract(
                              moment.duration(
                                convertDate(prop.get("overtimeIn"), "HH:mm"),
                                "HH:mm"
                              )
                            )
                            .minutes()}
                    </td>

                    {/* Total Hour Hours */}
                    <td>
                      {moment
                        .duration(
                          prop.get("earlyTimes") !== undefined
                            ? convertDate(prop.get("earlyTimes"), "HH:mm")
                            : prop.get("overtimeOut") !== undefined
                            ? convertDate(prop.get("overtimeOut"), "HH:mm")
                            : prop.get("absenKeluar") !== undefined
                            ? convertDate(prop.get("absenKeluar"), "HH:mm")
                            : "",
                          "HH:mm"
                        )
                        .subtract(
                          moment.duration(
                            prop.get("lateTimes") !== undefined
                              ? convertDate(prop.get("lateTimes"), "HH:mm")
                              : convertDate(prop.get("absenMasuk"), "HH:mm"),
                            "HH:mm"
                          )
                        )
                        .hours()}
                    </td>

                    {/* Total Hour Minutes */}
                    <td>
                      {moment
                        .duration(
                          prop.get("earlyTimes") !== undefined
                            ? convertDate(prop.get("earlyTimes"), "HH:mm")
                            : prop.get("overtimeOut") !== undefined
                            ? convertDate(prop.get("overtimeOut"), "HH:mm")
                            : prop.get("absenKeluar") !== undefined
                            ? convertDate(prop.get("absenKeluar"), "HH:mm")
                            : "",
                          "HH:mm"
                        )
                        .subtract(
                          moment.duration(
                            prop.get("lateTimes") !== undefined
                              ? convertDate(prop.get("lateTimes"), "HH:mm")
                              : convertDate(prop.get("absenMasuk"), "HH:mm"),
                            "HH:mm"
                          )
                        )
                        .minutes()}
                    </td>

                    {/* Notes */}
                    <td>
                      {prop.get("overtimeIn") !== undefined &&
                      prop.get("overtimeOut") !== undefined
                        ? "Work-Over Time"
                        : "Working Hour"}
                    </td>
                  </tr>
                ))
            )}
            <tr>
              <td colSpan="7">Total</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </Table>
      </div>
    );
  }
}

export default ExportExcel;
