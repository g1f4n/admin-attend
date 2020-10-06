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

// react plugin used to create datetimepicker
import ReactDatetime from "react-datetime";

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
  Form,
  Col,
  Button,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  FormGroup,
} from "reactstrap";
// core components
// import Header from "components/Headers/Header.js";
import HeaderNormal from "components/Headers/HeaderNormal.js";
import Parse from "parse";
import moment from "moment";
import { getLeaderId } from "utils";
import { convertDate } from "utils";
// import ReactHTMLTableToExcel from "react-html-table-to-excel";
import ReactHTMLTableToExcel from "../../react-html-table-to-excel/index";
import { handleSelect } from "utils";
import _ from "lodash/lang";

class AllAbsen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      absence: [],
      loading: false,
      startDate: "",
      employeeName: "",
      employeeID: "",
      sisaJam: 0,
      sisaJamLate: 0,
      sisaJamOvertime: 0,
      sisaJamTotalMinutes: 0,
      minutesEarly: 0,
      minutesTotal: 0,
      jamEarly: 0,
      minutesLate: 0,
      hoursLate: 0,
      minutesOvertime: 0,
      jamOvertime: 0,
      jamTotal: 0,
    };
  }

  componentDidMount() {
    this.getDaftarAbsen();
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log(nextState);
    return nextState.absence.length > 0;
  }

  handleFilter = (e) => {
    e.preventDefault();
    this.setState({ loading: true, exportButton: true });
    const Absence = Parse.Object.extend("Absence");
    const query = new Parse.Query(Absence);

    const id = this.props.match.params.id;

    if (parseInt(this.state.status) === 4) {
      const d = new Date();
      const start = new moment(this.state.startDate);
      start.startOf("day");
      const finish = new moment(start);
      finish.add(1, "day");

      query.equalTo("user", {
        __type: "Pointer",
        className: "_User",
        objectId: id,
      });
      query.ascending("absenMasuk");
      query.greaterThanOrEqualTo("absenMasuk", start.toDate());
      query.lessThan("absenMasuk", finish.toDate());
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
    } else if (parseInt(this.state.status) === 5) {
      const d = new Date();
      const start = new moment(this.state.startDate);
      start.startOf("week");
      const finish = new moment(start);
      finish.add(1, "week");

      query.equalTo("user", {
        __type: "Pointer",
        className: "_User",
        objectId: id,
      });
      query.ascending("absenMasuk");
      query.greaterThanOrEqualTo("absenMasuk", start.toDate());
      query.lessThan("absenMasuk", finish.toDate());
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
    } else if (parseInt(this.state.status) === 6) {
      const d = new Date();
      const start = new moment(this.state.startDate);
      start.startOf("month");
      const finish = new moment(start);
      finish.add(1, "month");

      query.equalTo("user", {
        __type: "Pointer",
        className: "_User",
        objectId: id,
      });
      query.ascending("absenMasuk");
      query.greaterThanOrEqualTo("absenMasuk", start.toDate());
      query.lessThan("absenMasuk", finish.toDate());
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
    } else if (parseInt(this.state.status) === 7) {
      const d = new Date();
      const start = new moment(this.state.startDate);
      //start.startOf('month');
      const finish = new moment(this.state.endDate);
      //finish.add(1, 'month');

      query.equalTo("user", {
        __type: "Pointer",
        className: "_User",
        objectId: id,
      });
      query.ascending("absenMasuk");
      query.greaterThanOrEqualTo("absenMasuk", start.toDate());
      query.lessThan("absenMasuk", finish.toDate());
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
    }
  };

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

  getDaftarAbsen = () => {
    this.setState({ loading: true });
    const Absence = Parse.Object.extend("Absence");
    const Leader = Parse.Object.extend("Leader");
    const leader = new Leader();
    const query = new Parse.Query(Absence);

    const id = this.props.match.params.id;

    const nullData = "Data tidak ditemukan";

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
    query.ascending("absenMasuk");
    query.exists("absenMasuk");
    // query.greaterThanOrEqualTo('createdAt', start.toDate());
    // query.lessThan('createdAt', finish.toDate());
    query.notContainedIn("roles", ["admin", "Admin", "leader", "Leader"]);
    query.include("user");
    query
      .find()
      .then((x) => {
        console.log("user", x);
        let early = [];
        let hours = [];
        let lateTimesMinute = [];
        let lateTimesHours = [];
        let overtimeMinutes = [];
        let overtimeHours = [];
        let totalHours = [];
        let totalMinutes = [];
        x.filter((z) => {
          if (z.get("earlyTimes") === undefined) {
            return false;
          }
          // else if (z.get("lateTimes") === undefined) {
          //   return false;
          // } else if (z.get("overtimeOut") === undefined) {
          //   return false;
          // }
          return true;
        }).map((value, index) => {
          early.push(
            moment
              .duration(`${value.get("user").attributes.jamKeluar}:00`, "HH:mm")
              .subtract(
                moment.duration(
                  convertDate(value.get("earlyTimes"), "HH:mm"),
                  "HH:mm"
                )
              )
              .minutes()
          );
          hours.push(
            moment
              .duration(`${value.get("user").attributes.jamKeluar}:00`, "HH:mm")
              .subtract(
                moment.duration(
                  convertDate(value.get("earlyTimes"), "HH:mm"),
                  "HH:mm"
                )
              )
              .hours()
          );
          console.log("early departure", early);
        });
        // late times map
        x.filter((a) => {
          if (a.get("lateTimes") === undefined) {
            return false;
          }
          return true;
        }).map((value, index) => {
          // lateTime
          lateTimesMinute.push(
            moment
              .duration(convertDate(value.get("lateTimes"), "HH:mm"), "HH:mm")
              .subtract(
                moment.duration(
                  `${value.get("user").attributes.jamMasuk}:00`,
                  "HH:mm"
                )
              )
              .minutes()
          );
          lateTimesHours.push(
            moment
              .duration(convertDate(value.get("lateTimes"), "HH:mm"), "HH:mm")
              .subtract(
                moment.duration(
                  `${value.get("user").attributes.jamMasuk}:00`,
                  "HH:mm"
                )
              )
              .hours()
          );
          console.log("value late", lateTimesMinute);
        });

        // overtime
        x.filter((d) => {
          if (d.get("overtimeOut") === undefined) {
            return false;
          }
          return true;
        }).map((value, index) => {
          overtimeMinutes.push(
            moment
              .duration(convertDate(value.get("absenKeluar"), "HH:mm"), "HH:mm")
              .subtract(
                moment.duration(
                  `${value.get("user").attributes.jamKeluar}:00`,
                  "HH:mm"
                )
              )
              .minutes()
          );
          overtimeHours.push(
            moment
              .duration(convertDate(value.get("absenKeluar"), "HH:mm"), "HH:mm")
              .subtract(
                moment.duration(
                  `${value.get("user").attributes.jamKeluar}:00`,
                  "HH:mm"
                )
              )
              .hours()
          );
        });

        // Total Hours
        x.map((value, index) => {
          totalMinutes.push(
            moment
              .duration(convertDate(value.get("absenKeluar"), "HH:mm"), "HH:mm")
              .subtract(
                moment.duration(
                  convertDate(value.get("absenMasuk"), "HH:mm"),
                  "HH:mm"
                )
              )
              .minutes()
          );
          totalHours.push(
            moment
              .duration(convertDate(value.get("absenKeluar"), "HH:mm"), "HH:mm")
              .subtract(
                moment.duration(
                  convertDate(value.get("absenMasuk"), "HH:mm"),
                  "HH:mm"
                )
              )
              .hours()
          );
        });

        // console.log("total hours", totalMinutes);

        // if (early.length < 1 || hours.length < 1) {
        //   return false;
        // }
        // if (lateTimesMinute.length < 1 || lateTimesHours < 1) {
        //   return false;
        // }
        if (early.length === 1) {
          // early.reduce((acc, curr) => {
          //   console.log(acc);
          //   console.log(curr);
          //   console.log("minutes", (parseInt(acc) + parseInt(curr)) % 60);
          //   console.log(
          //     "sisaJam",
          //     Math.floor((parseInt(acc) + parseInt(curr)) / 60)
          //   );
          //   this.setState({
          //     sisaJam: Math.floor((parseInt(acc) + parseInt(curr)) / 60),
          //     minutesEarly: (parseInt(acc) + parseInt(curr)) % 60,
          //   });
          // }, 0);
          let jumlahEarly = early.reduce((acc, curr) => {
            return acc + curr;
          }, 0);
          const minutesEarly = jumlahEarly % 60;
          const sisaJam = Math.floor(jumlahEarly / 60);
          this.setState({
            sisaJam: sisaJam,
            minutesEarly: minutesEarly,
          });
          console.log("reduce baru menit", minutesEarly);
          console.log("reduce baru jam sisa", sisaJam);
        } else if (early.length > 1) {
          let jumlahEarly = early.reduce((acc, curr) => {
            return acc + curr;
          }, 0);
          const minutesEarly = jumlahEarly % 60;
          const sisaJam = Math.floor(jumlahEarly / 60);
          this.setState({
            sisaJam: sisaJam,
            minutesEarly: minutesEarly,
          });
          // early.reduce((acc, curr) => {
          //   console.log(acc);
          //   console.log(curr);
          //   console.log("minutes", parseFloat(acc) + parseFloat(curr));
          //   console.log(
          //     "sisaJam",
          //     Math.floor((parseInt(acc) + parseInt(curr)) / 60)
          //   );
          //   return this.setState({
          //     sisaJam: Math.floor((parseInt(acc) + parseInt(curr)) / 60),
          //     minutesEarly: (parseInt(acc) + parseInt(curr)) % 60,
          //   });
          // });
          // console.log("minutes early", this.state.minutesEarly);
          // console.log("sisa jam early", this.state.sisaJam);
        } else {
          this.setState({ minutesEarly: 0, sisaJam: 0 });
        }

        if (hours.length === 1) {
          // hours
          //   .filter((val) => {
          //     if (val === "") {
          //       return false;
          //     }
          //     return true;
          //   })
          //   .reduce((acc, curr) => {
          //     console.log(
          //       "hours",
          //       parseInt(acc) + parseInt(curr) + this.state.sisaJam
          //     );
          //     this.setState({
          //       jamEarly: parseInt(acc) + parseInt(curr) + this.state.sisaJam,
          //     });
          //   }, 0);
          let jumlahHours = hours.reduce((acc, curr) => {
            return acc + curr;
          }, 0);
          const jamEarly = jumlahHours + this.state.sisaJam;
          this.setState({
            jamEarly: jamEarly,
          });
        } else if (hours.length > 1) {
          // hours
          //   .filter((val) => {
          //     if (val === "") {
          //       return false;
          //     }
          //     return true;
          //   })
          //   .reduce((acc, curr) => {
          //     console.log(
          //       "hours sisa",
          //       parseInt(acc) + parseInt(curr) + this.state.sisaJam
          //     );
          //     this.setState({
          //       jamEarly: parseInt(acc) + parseInt(curr) + this.state.sisaJam,
          //     });
          //   });
          // console.log("test jam", this.state.sisaJam);
          let jumlahHours = hours.reduce((acc, curr) => {
            return acc + curr;
          }, 0);
          const jamEarly = jumlahHours + this.state.sisaJam;
          this.setState({
            jamEarly: jamEarly,
          });
        } else {
          this.setState({ jamEarly: 0 });
        }
        // late Times
        console.log("late times ", lateTimesHours);
        if (lateTimesMinute.length === 1) {
          // lateTimesMinute.reduce((acc, curr) => {
          //   this.setState({
          //     sisaJamLate: Math.floor((parseInt(acc) + parseInt(curr)) / 60),
          //     minutesLate: (parseInt(acc) + parseInt(curr)) % 60,
          //   });
          //   console.log("sisa Jam Late", this.state.sisaJamLate);
          //   console.log("menit Late", this.state.minutesLate);
          // }, 0);
          let jumlahLateMinutes = lateTimesMinute.reduce((acc, curr) => {
            return acc + curr;
          }, 0);
          const minutesLate = jumlahLateMinutes % 60;
          const sisaJamLate = Math.floor(jumlahLateMinutes / 60);
          this.setState({
            sisaJamLate: sisaJamLate,
            minutesLate: minutesLate,
          });
        } else if (lateTimesMinute.length > 1) {
          // console.log("nilai", lateTimesMinute);
          // // let coba = [52, 28];
          // lateTimesMinute.reduce((acc, curr) => {
          //   this.setState({
          //     sisaJamLate: Math.floor((parseInt(acc) + parseInt(curr)) / 60),
          //     minutesLate: (parseInt(acc) + parseInt(curr)) % 60,
          //   });
          //   console.log("sisa Jam Late", this.state.sisaJamLate);
          //   console.log("menit Late", this.state.coba);
          // });
          let jumlahLateMinutes = lateTimesMinute.reduce((acc, curr) => {
            return acc + curr;
          }, 0);
          const minutesLate = jumlahLateMinutes % 60;
          const sisaJamLate = Math.floor(jumlahLateMinutes / 60);
          this.setState({
            sisaJamLate: sisaJamLate,
            minutesLate: minutesLate,
          });
        } else {
          this.setState({
            sisaJamLate: 0,
            minutesLate: 0,
          });
        }
        if (lateTimesHours.length === 1) {
          // lateTimesHours.reduce((acc, curr) => {
          //   this.setState({
          //     hoursLate:
          //       parseInt(acc) + parseInt(curr) + this.state.sisaJamLate,
          //   });
          //   console.log("jamLate", this.state.hoursLate);
          // }, 0);
          let jumlahHoursLate = lateTimesHours.reduce((acc, curr) => {
            return acc + curr;
          }, 0);
          const jamLate = jumlahHoursLate + this.state.sisaJamLate;
          this.setState({
            hoursLate: jamLate,
          });
        } else if (lateTimesHours.length > 1) {
          // let coba = [8, 7, 2, 0];
          // lateTimesHours.reduce((acc, curr) => {
          //   this.setState({
          //     hoursLate:
          //       parseInt(acc) + parseInt(curr) + this.state.sisaJamLate,
          //   });
          //   console.log("jamLate", this.state.hoursLate);
          //   console.log("sisaJamLate", parseInt(this.state.sisaJamLate));
          // });
          let jumlahHoursLate = lateTimesHours.reduce((acc, curr) => {
            return acc + curr;
          }, 0);
          const jamLate = jumlahHoursLate + this.state.sisaJamLate;
          this.setState({
            hoursLate: jamLate,
          });
        } else {
          this.setState({ hoursLate: 0 });
        }
        // overtime
        if (overtimeMinutes.length === 1) {
          // overtimeMinutes.reduce((acc, curr) => {
          //   this.setState(
          //     {
          //       sisaJamOvertime: Math.floor(
          //         (parseInt(acc) + parseInt(curr)) / 60
          //       ),
          //       minutesOvertime: (parseInt(acc) + parseInt(curr)) % 60,
          //     },
          //     () => console.log(this.state.minutesOvertime)
          //   );
          // }, 0);
          let jumlahOvertimeOutMinutes = overtimeMinutes.reduce((acc, curr) => {
            return acc + curr;
          }, 0);
          const minutesOvertime = jumlahOvertimeOutMinutes % 60;
          const sisaJamOvertime = Math.floor(jumlahOvertimeOutMinutes / 60);
          this.setState({
            sisaJamOvertime: sisaJamOvertime,
            minutesOvertime: minutesOvertime,
          });
        } else if (overtimeMinutes.length > 1) {
          // overtimeMinutes.reduce((acc, curr) => {
          //   this.setState(
          //     {
          //       sisaJamOvertime: Math.floor(
          //         (parseInt(acc) + parseInt(curr)) / 60
          //       ),
          //       minutesOvertime: (parseInt(acc) + parseInt(curr)) % 60,
          //     },
          //     () => console.log(this.state.minutesOvertime)
          //   );
          // });
          let jumlahOvertimeOutMinutes = overtimeMinutes.reduce((acc, curr) => {
            return acc + curr;
          }, 0);
          const minutesOvertime = jumlahOvertimeOutMinutes % 60;
          const sisaJamOvertime = Math.floor(jumlahOvertimeOutMinutes / 60);
          this.setState({
            sisaJamOvertime: sisaJamOvertime,
            minutesOvertime: minutesOvertime,
          });
        } else {
          this.setState({ minutesOvertime: 0, sisaJam: 0 });
        }
        if (overtimeHours.length === 1) {
          // overtimeHours.reduce((acc, curr) => {
          //   this.setState({
          //     jamOvertime:
          //       parseInt(acc) + parseInt(curr) + this.state.sisaJamOvertime,
          //   });
          // }, 0);
          let jumlahHoursOvertime = overtimeHours.reduce((acc, curr) => {
            return acc + curr;
          }, 0);
          const jamOvertime = jumlahHoursOvertime + this.state.sisaJamOvertime;
          this.setState({
            jamOvertime: jamOvertime,
          });
        } else if (overtimeHours.length > 1) {
          // overtimeHours.reduce((acc, curr) => {
          //   this.setState({
          //     jamOvertime:
          //       parseInt(acc) + parseInt(curr) + this.state.sisaJamOvertime,
          //   });
          // });
          let jumlahHoursOvertime = overtimeHours.reduce((acc, curr) => {
            return acc + curr;
          }, 0);
          const jamOvertime = jumlahHoursOvertime + this.state.sisaJamOvertime;
          this.setState({
            jamOvertime: jamOvertime,
          });
        } else {
          this.setState({
            jamOvertime: "0",
          });
        }
        if (totalMinutes.length === 1) {
          // totalMinutes.reduce((acc, curr) => {
          //   this.setState({
          //     sisaJamTotalMinutes: Math.floor(
          //       (parseInt(acc) + parseInt(curr)) / 60
          //     ),
          //     minutesTotal: (parseFloat(acc) + parseFloat(curr)) % 60,
          //   });
          // }, 0);
          // console.log("total minutes", totalMinutes);
          // console.log("total minutes2", this.state.minutesTotal);

          let totalJumlahMenit = totalMinutes.reduce((acc, currz) => {
            return parseInt(acc) + parseInt(currz);
          }, 0);
          const sisaJamTotalMinutes = Math.floor(totalJumlahMenit / 60);
          const minutesTotal = totalJumlahMenit % 60;
          this.setState({
            sisaJamTotalMinutes: sisaJamTotalMinutes,
            minutesTotal: minutesTotal,
          });
        } else if (totalMinutes.length > 1) {
          // totalMinutes.reduce((acc, curr) => {
          //   this.setState({
          //     sisaJamTotalMinutes: Math.floor(
          //       (parseInt(acc) + parseInt(curr)) / 60
          //     ),
          //     minutesTotal: (parseFloat(acc) + parseFloat(curr)) % 60,
          //   });
          // });
          let totalJumlahMenit = totalMinutes.reduce((acc, currz) => {
            return parseInt(acc) + parseInt(currz);
          }, 0);
          const sisaJamTotalMinutes = Math.floor(totalJumlahMenit / 60);
          const minutesTotal = totalJumlahMenit % 60;
          this.setState({
            sisaJamTotalMinutes: sisaJamTotalMinutes,
            minutesTotal: minutesTotal,
          });
        } else {
          this.setState({ minutesTotal: 0, sisaJamTotalMinutes: 0 });
        }
        if (totalHours.length === 1) {
          // totalHours.reduce((acc, curr) => {
          //   this.setState({
          //     jamTotal:
          //       parseInt(acc) +
          //       parseInt(curr) +
          //       this.state.sisaJamTotalMinutes,
          //   });
          // }, 0);
          let totalJumlah = totalHours.reduce((exe, croz) => {
            return exe + croz;
          }, 0);
          const jamTotal = totalJumlah + this.state.sisaJamTotalMinutes;
          this.setState({
            jamTotal: jamTotal,
          });
        } else if (totalHours.length > 1) {
          // totalHours.reduce((acc, curr) => {
          //   this.setState({
          //     jamTotal:
          //       parseInt(acc) +
          //       parseInt(curr) +
          //       this.state.sisaJamTotalMinutes,
          //   });
          // });
          let totalJumlah = totalHours.reduce((exe, croz) => {
            return exe + croz;
          }, 0);
          const jamTotal = totalJumlah + this.state.sisaJamTotalMinutes;
          this.setState({
            jamTotal: jamTotal,
          });
        } else {
          this.setState({
            jamTotal: "0",
          });
        }
        this.setState({
          absence: x,
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

  render() {
    const { absence, loading, startDate, endDate } = this.state;
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
                  <h3 className="mb-0">Reporting</h3>
                  <Form
                    role="form"
                    onSubmit={this.handleFilter}
                    className="mt-3"
                  >
                    <div className="row">
                      <div className="col-md-1 col-sm-12">
                        <p>Filter By</p>
                      </div>
                      <div className="col-md-2 col-sm-12">
                        <FormGroup>
                          <InputGroup className="input-group-alternative">
                            <Input
                              type="select"
                              className="fa-pull-right"
                              required={true}
                              onChange={(e) => {
                                this.setState({
                                  status: e.target.value,
                                });
                              }}
                            >
                              <option value="">Pilih Waktu</option>
                              {[4, 5, 6, 7].map((x) => (
                                <option value={x}>{handleSelect(x)}</option>
                              ))}
                            </Input>
                          </InputGroup>
                        </FormGroup>
                      </div>
                      <div className="col-md-3 col-sm-12">
                        <FormGroup>
                          <InputGroup className="input-group-alternative">
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText>
                                <i className="ni ni-calendar-grid-58" />
                              </InputGroupText>
                            </InputGroupAddon>
                            {/* <Input
                              type="date"
                              placeholder="Date Picker Here"
                              required={true}
                              value={startDate}
                              onChange={(e) => {
                                this.setState({
                                  startDate: e.target.value,
                                });
                              }}
                            /> */}
                            <ReactDatetime
                              inputProps={{
                                placeholder: `${
                                  parseInt(this.state.status) === 7
                                    ? "Set start date"
                                    : "Set tanggal"
                                }`,
                                required: true,
                                readOnly: true,
                              }}
                              timeFormat={false}
                              viewMode={
                                parseInt(this.state.status) === 6
                                  ? "months"
                                  : "days"
                              }
                              dateFormat={
                                parseInt(this.state.status) === 6
                                  ? "MM/YYYY"
                                  : "MM/DD/YYYY"
                              }
                              value={startDate}
                              onChange={(e) => {
                                this.setState({
                                  startDate: e.toDate(),
                                });
                              }}
                            />
                          </InputGroup>
                        </FormGroup>
                      </div>
                      {parseInt(this.state.status) === 7 ? (
                        <div className="col-md-3 col-sm-12">
                          <FormGroup>
                            <InputGroup className="input-group-alternative">
                              <InputGroupAddon addonType="prepend">
                                <InputGroupText>
                                  <i className="ni ni-calendar-grid-58" />
                                </InputGroupText>
                              </InputGroupAddon>
                              {/* <Input
                              type="date"
                              placeholder="Date Picker Here"
                              required={true}
                              value={startDate}
                              onChange={(e) => {
                                this.setState({
                                  startDate: e.target.value,
                                });
                              }}
                            /> */}
                              <ReactDatetime
                                inputProps={{
                                  placeholder: "Set end date",
                                  required: true,
                                  readOnly: true,
                                }}
                                timeFormat={false}
                                viewMode={
                                  parseInt(this.state.status) === 6
                                    ? "months"
                                    : "days"
                                }
                                dateFormat={
                                  parseInt(this.state.status) === 6
                                    ? "MM/YYYY"
                                    : "MM/DD/YYYY"
                                }
                                value={endDate}
                                onChange={(e) => {
                                  this.setState({
                                    endDate: e.toDate(),
                                  });
                                }}
                              />
                            </InputGroup>
                          </FormGroup>
                        </div>
                      ) : (
                        ""
                      )}
                      <div className="text-center mt--4">
                        <Button
                          className="my-4"
                          color="primary"
                          type="submit"
                          disabled={loading}
                        >
                          {loading ? (
                            <div>
                              <Spinner
                                as="span"
                                animation="grow"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                              />{" "}
                              Loading
                            </div>
                          ) : (
                            "Search"
                          )}
                        </Button>
                      </div>
                    </div>
                  </Form>
                  {/* <input type="text" placeholder="input" /> */}
                  {this.state.exportButton & !this.state.loading ? (
                    <ReactHTMLTableToExcel
                      id="eskport"
                      className="btn btn-primary"
                      table="ekspor"
                      filename={this.state.employeeName}
                      sheet="Absensi"
                      buttonText=" Ekspor Excel"
                      multipleTables={[
                        {
                          tableId: "ekspor",
                          fileName: this.state.employeeName,
                        },
                      ]}
                    />
                  ) : (
                    ""
                  )}
                  {/* <ExportExcel
                    id="eskport"
                    className="btn btn-primary"
                    // Table="data"
                    filename="Absensi"
                    sheet="Absensi"
                    buttonText="Ekspor To .xls"
                  /> */}
                </CardHeader>
                {/* <Table
                  className="align-items-center table-flush"
                  id="ekspor"
                  responsive
                >
                  <thead>
                    <tr>
                      <th scope="col" style={{ border: 'none' }}>
                        Employee ID
                      </th>
                      <th scope="col" style={{ border: 'none' }}>
                        {this.state.employeeID}
                      </th>
                    </tr>
                  </thead>
                  <thead className="border-0">
                    <tr>
                      <th scope="col" style={{ border: 'none' }}>
                        Employee Name
                      </th>
                      <th scope="col" style={{ border: 'none' }}>
                        {this.state.employeeName}
                      </th>
                    </tr>
                  </thead>
                  <thead className="border-0">
                    <tr>
                      <th scope="col" style={{ border: 'none' }}>
                        Employee Title
                      </th>
                      <th scope="col" style={{ border: 'none' }}>
                        {this.state.employeeTitle}
                      </th>
                    </tr>
                  </thead>
                  <thead className="border-0 mb-2">
                    <tr>
                      <th scope="col" style={{ border: 'none' }}>
                        Department Title
                      </th>
                      <th
                        scope="col"
                        className="mb-2"
                        style={{ border: 'none' }}
                      >
                        {this.state.employeeDepartment}
                      </th>
                    </tr>
                  </thead>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">Tanggal</th>
                      <th scope="col">Nama</th>
                      <th scope="col">Absen Masuk</th>
                      <th scope="col">Absen Keluar</th>
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
                    ) : absence.length < 1 ? (
                      <tr>
                        <td colSpan={4} style={{ textAlign: 'center' }}>
                          No data found...
                        </td>
                      </tr>
                    ) : (
                      absence.map((prop, key) => (
                        <tr>
                          <td>
                            {convertDate(
                              prop.get('createdAt'),
                              'DD/MM/YYYY'
                            )}
                          </td>
                          <td>{prop.get('fullname')}</td>
                          <td
                            style={{
                              color:
                                prop.get('lateTimes') !== undefined
                                  ? 'red'
                                  : ''
                            }}
                          >
                            {prop.get('lateTimes') !== undefined ? (
                              convertDate(
                                prop.get('lateTimes'),
                                'HH:mm:ss'
                              )
                            ) : (
                              convertDate(
                                prop.get('absenMasuk'),
                                'HH:mm:ss'
                              )
                            )}
                          </td>
                          <td>
                            {convertDate(
                              prop.get('absenKeluar'),
                              'HH:mm:ss'
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                    {!_.isEmpty(absence) && (
                      <tr>
                        <th colSpan={2} style={{ textAlign: 'center' }}>
                          Total
                        </th>
                      </tr>
                    )}
                  </tbody>
                </Table> */}
                <Table
                  className="align-items-center table-flush"
                  id="ekspor"
                  responsive
                  // hidden
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
                      <th
                        scope="col"
                        className="mb-2"
                        style={{ border: "none" }}
                      >
                        {this.state.employeeDepartment}
                      </th>
                    </tr>
                  </thead>
                  <thead
                    className="thead-light"
                    style={{ textAlign: "center" }}
                  >
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
                    ) : absence.length < 1 ? (
                      // .concat(dataLate)
                      // .concat(dataOvertime)
                      // .concat(dataEarlyLeave).length < 1 ? (
                      <tr>
                        <td colSpan={14} style={{ textAlign: "center" }}>
                          No data found...
                        </td>
                      </tr>
                    ) : (
                      absence
                        // .concat(dataLate)
                        // .concat(dataOvertime)
                        // .concat(dataEarlyLeave)
                        .map((prop, key) => (
                          <tr>
                            {/* Day */}
                            <td>
                              {convertDate(prop.get("absenMasuk"), "ddd")}
                            </td>

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
                                prop.get("user").attributes.jamMasuk < 10
                                  ? "0"
                                  : ""
                              }${prop.get("user").attributes.jamMasuk}:00` +
                                " - " +
                                `${prop.get("user").attributes.jamKeluar}:00`}
                            </td>

                            {/* Dutty On Hours */}
                            <td
                              style={{
                                color:
                                  prop.get("lateTimes") !== undefined
                                    ? "red"
                                    : "",
                              }}
                            >
                              {/* {prop.className === "Late"
                        ? convertDate(prop.get("time"), "k")
                        : prop.className === "Absence"
                        ? convertDate(prop.get("absenMasuk"), "k")
                        : ""} */}
                              {prop.get("lateTimes") !== undefined
                                ? convertDate(prop.get("lateTimes"), "k")
                                : prop.get("absenMasuk") !== undefined
                                ? convertDate(prop.get("absenMasuk"), "k")
                                : ""}
                            </td>

                            {/* Dutty On Minutes */}
                            <td
                              style={{
                                color:
                                  prop.get("lateTimes") !== undefined
                                    ? "red"
                                    : "",
                              }}
                            >
                              {/* {prop.className === "Late"
                        ? convertDate(prop.get("time"), "m")
                        : prop.className === "Absence"
                        ? convertDate(prop.get("absenMasuk"), "m")
                        : ""} */}
                              {prop.get("lateTimes") !== undefined
                                ? convertDate(prop.get("lateTimes"), "m")
                                : prop.get("absenMasuk") !== undefined
                                ? convertDate(prop.get("absenMasuk"), "m")
                                : ""}
                            </td>

                            {/* Dutty Off Hours */}
                            <td
                              style={{
                                color:
                                  prop.get("earlyTimes") !== undefined
                                    ? "red"
                                    : "",
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
                                : prop.get("absenKeluar") !== undefined
                                ? convertDate(prop.get("absenKeluar"), "k")
                                : ""}
                            </td>

                            {/* Dutty off Minutes */}
                            <td
                              style={{
                                color:
                                  prop.get("earlyTimes") !== undefined
                                    ? "red"
                                    : "",
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
                                : prop.get("absenKeluar") !== undefined
                                ? convertDate(prop.get("absenKeluar"), "m")
                                : ""}
                            </td>

                            {/* Late In Hours */}
                            <td className="lateInHours">
                              {/* {prop.get("lateTimes") === undefined
                                ? ""
                                : this.subtractHourLate(
                                    prop.get("user").attributes.jamMasuk,
                                    convertDate(prop.get("lateTimes"), "k"),
                                    "Late"
                                  )} */}
                              {prop.get("lateTimes") === undefined
                                ? ""
                                : moment
                                    .duration(
                                      convertDate(
                                        prop.get("lateTimes"),
                                        "HH:mm"
                                      ),
                                      "HH:mm"
                                    )
                                    .subtract(
                                      moment.duration(
                                        `${
                                          prop.get("user").attributes.jamMasuk
                                        }:00`,
                                        "HH:mm"
                                      )
                                    )
                                    .hours()}
                            </td>

                            {/* Late In Minutes */}
                            <td>
                              {/* {prop.get("lateTimes") === undefined
                                ? ""
                                : this.subtractHourLate(
                                    0,
                                    convertDate(prop.get("lateTimes"), "m"),
                                    "Late"
                                  )} */}
                              {prop.get("lateTimes") === undefined
                                ? ""
                                : moment
                                    .duration(
                                      convertDate(
                                        prop.get("lateTimes"),
                                        "HH:mm"
                                      ),
                                      "HH:mm"
                                    )
                                    .subtract(
                                      moment.duration(
                                        `${
                                          prop.get("user").attributes.jamMasuk
                                        }:00`,
                                        "HH:mm"
                                      )
                                    )
                                    .minutes()}
                            </td>

                            {/* Early Derparture Hours */}
                            <td>
                              {/* {prop.className === "EarlyLeave"
                        ? this.subtractHourLate(
                            17,
                            convertDate(prop.get("time"), "k"),
                            "EarlyLeave"
                          )
                        : ""} */}
                              {prop.get("earlyTimes") === undefined
                                ? ""
                                : moment
                                    .duration(
                                      `${
                                        prop.get("user").attributes.jamKeluar
                                      }:00`,
                                      "HH:mm"
                                    )
                                    .subtract(
                                      moment.duration(
                                        convertDate(
                                          prop.get("earlyTimes"),
                                          "HH:mm"
                                        ),
                                        "HH:mm"
                                      )
                                    )
                                    .hours()}
                            </td>

                            {/* Early Derparture Minutes */}
                            <td className="earlyminutes">
                              {prop.get("earlyTimes") === undefined
                                ? ""
                                : moment
                                    .duration(
                                      `${
                                        prop.get("user").attributes.jamKeluar
                                      }:00`,
                                      "HH:mm"
                                    )
                                    .subtract(
                                      moment.duration(
                                        convertDate(
                                          prop.get("earlyTimes"),
                                          "HH:mm"
                                        ),
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
                              {prop.get("absenKeluar") === undefined
                                ? ""
                                : prop.get("overtimeOut") !== undefined
                                ? moment
                                    .duration(
                                      convertDate(
                                        prop.get("overtimeOut"),
                                        "HH:mm"
                                      ),
                                      "HH:mm"
                                    )
                                    .subtract(
                                      moment.duration(
                                        `${
                                          prop.get("user").attributes.jamKeluar
                                        }:00`,
                                        "HH:mm"
                                      )
                                    )
                                    .hours()
                                : ""}
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
                              {prop.get("absenKeluar") === undefined
                                ? ""
                                : prop.get("overtimeOut") !== undefined
                                ? moment
                                    .duration(
                                      convertDate(
                                        prop.get("absenKeluar"),
                                        "HH:mm"
                                      ),
                                      "HH:mm"
                                    )
                                    .subtract(
                                      moment.duration(
                                        `${
                                          prop.get("user").attributes.jamKeluar
                                        }:00`,
                                        "HH:mm"
                                      )
                                    )
                                    .minutes()
                                : ""}
                            </td>

                            {/* Total Hour Hours */}
                            {/* <td>{prop.get("fullname")}</td> */}
                            <td>
                              {prop.get("absenKeluar") === undefined
                                ? 0
                                : moment
                                    .duration(
                                      convertDate(
                                        prop.get("absenKeluar"),
                                        "HH:mm"
                                      ),
                                      "HH:mm"
                                    )
                                    .subtract(
                                      moment.duration(
                                        convertDate(
                                          prop.get("absenMasuk"),
                                          "HH:mm"
                                        ),
                                        "HH:mm"
                                      )
                                    )
                                    .hours()}
                            </td>

                            {/* Total Hour Minutes */}
                            <td>
                              {moment
                                .duration(
                                  convertDate(prop.get("absenKeluar"), "HH:mm"),
                                  "HH:mm"
                                )
                                .subtract(
                                  moment.duration(
                                    convertDate(
                                      prop.get("absenMasuk"),
                                      "HH:mm"
                                    ),
                                    "HH:mm"
                                  )
                                )
                                .minutes()}
                            </td>

                            {/* Notes */}
                            <td>
                              {prop.get("overtimeIn") !== undefined
                                ? "Working Overtime"
                                : prop.get("lateTimes") !== undefined
                                ? "Late"
                                : prop.get("earlyTimes") !== undefined
                                ? "Early Depature"
                                : "Working Hour"}
                            </td>
                          </tr>
                        ))
                    )}
                    <tr>
                      <td colSpan="7">Total</td>
                      <td>
                        {/* {this.getTotalHours(
                          absence,
                          "hours",
                          "lateTimes"
                        ).reduce(this.getSum, 0)} */}
                        {this.state.hoursLate}
                      </td>
                      <td>
                        {/* {this.getTotalHours(
                          absence,
                          "minutes",
                          "lateTimes"
                        ).reduce(this.getSum, 0)} */}
                        {this.state.minutesLate}
                      </td>
                      <td>
                        {/* {this.getTotalHours(
                          absence,
                          "hours",
                          "earlyTimes"
                        ).reduce(this.getSum, 0)} */}
                        {this.state.jamEarly}
                      </td>
                      <td>
                        {/* {this.getTotalHours(
                          absence,
                          "minutes",
                          "earlyTimes"
                        ).reduce(this.getSum, 0)} */}
                        {this.state.minutesEarly}
                      </td>
                      <td>
                        {/* {this.getTotalHours(
                          absence,
                          "hours",
                          "overtimeOut"
                        ).reduce(this.getSum, 0)} */}
                        {this.state.jamOvertime.toString()}
                      </td>
                      <td>
                        {/* {this.getTotalHours(
                          absence,
                          "minutes",
                          "overtimeOut"
                        ).reduce(this.getSum, 0)} */}
                        {this.state.minutesOvertime.toString()}
                      </td>
                      <td>
                        {/* {this.getTotalHours(
                          absence,
                          "hours",
                          "totalHours"
                        ).reduce(this.getSum, 0)} */}
                        {this.state.jamTotal}
                      </td>
                      <td>
                        {/* {this.getTotalHours(
                          absence,
                          "hours",
                          "totalHours"
                        ).reduce(this.getSum, 0)} */}
                        {this.state.minutesTotal}
                      </td>
                      <td />
                    </tr>
                  </tbody>
                </Table>

                {/* <nav aria-label="Page navigation example">
                  <Pagination
                    className="pagination justify-content-end"
                    listClassName="justify-content-end"
                  >
                    <PaginationItem className="disabled">
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                        tabIndex="-1"
                      >
                        <i className="fa fa-angle-left" />
                        <span className="sr-only">Previous</span>
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem className="active">
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                      >
                        1
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                      >
                        2
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                      >
                        3
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                      >
                        <i className="fa fa-angle-right" />
                        <span className="sr-only">Next</span>
                      </PaginationLink>
                    </PaginationItem>
                  </Pagination>
                </nav> */}
              </Card>
            </div>
          </Row>
        </Container>
      </React.Fragment>
    );
  }
}

export const AllAbsenz = React.memo(AllAbsen);
