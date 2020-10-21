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
  Button,
  Input,
  FormGroup,
  Pagination,
  PaginationItem,
  PaginationLink,
  Label,
  Form,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Col,
} from "reactstrap";
// core components
// import Header from "components/Headers/Header.js";
import HeaderNormal from "components/Headers/HeaderNormal.js";
import Parse from "parse";
import moment from "moment";
import { getLeaderId } from "utils";
import ModalHandler from "components/Modal/Modal";
import { convertDate } from "utils";
import { handleSelect } from "utils";
import { flatMap } from "lodash";
import Alerts from "components/Alert/Alert";
import { getUserRole } from "utils";

class Cuti extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cuti: [],
      hariCuti: [],
      loading: false,
      rejectMode: false,
      approvalMode: false,
      approveAllMode: false,
      rejectAllMode: false,
      fullnames: "",
      loadingModal: false,
      userIndex: 0,
      minus: false,
      counter: 0,
      userId: "",
      startDate: "",
      reason: "",
      checkId: [],
      messageApprove: "",
      alerts: 2,
    };
  }

  componentDidMount() {
    //this.getData();
    this.getDataByLevel();
    this.getHariCuti();
  }

  getData = () => {
    this.setState({ loading: true });
    const Izin = Parse.Object.extend("Izin");
    const query = new Parse.Query(Izin);

    const d = new Date();
    const start = new moment(d);
    start.startOf("day");
    const finish = new moment(start);
    finish.add(1, "day");

    query.include("user");
    query.greaterThanOrEqualTo("createdAt", start.toDate());
    // query.lessThan("createdAt", finish.toDate());
    query.equalTo("statusIzin", 2);
    query.equalTo("status", 3);
    query.equalTo("leaderIdNew", {
      __type: "Pointer",
      className: "_User",
      objectId: getLeaderId(),
    });
    query.notContainedIn("roles", ["admin", "Admin", "Leader", "leader"]);
    query.descending("createdAt");
    query
      .find()
      .then((x) => {
        x.map((y) => (y.select = false));
        this.setState({ cuti: x, loading: false });
      })
      .catch(({ message }) => {
        this.setState({ loading: false });
        alert(message);
      });
  };

  getTotalIzin = () => {
    this.setState({ loading: true });
    const Izin = Parse.Object.extend("Izin");
    const query = new Parse.Query(Izin);

    const d = new Date();
    const start = new moment(d);
    start.startOf("day");
    const finish = new moment(start);
    finish.add(1, "day");

    query.include("user");
    query.equalTo("statusIzin", 1);
    query.greaterThanOrEqualTo("createdAt", start.toDate());
    // query.lessThan("createdAt", finish.toDate());
    query.equalTo("status", 3);
    query.descending("createdAt");
    query.equalTo("leaderIdNew", {
      __type: "Pointer",
      className: "_User",
      objectId: getLeaderId(),
    });
    query.notContainedIn("roles", ["admin", "Admin", "Leader", "leader"]);
    query
      .find()
      .then((x) => {
        x.map((y) => (y.select = false));
        this.setState({ cuti: x, loading: false });
      })
      .catch(({ message }) => {
        this.setState({ loading: false });
        alert(message);
        window.location.reload(false);
      });
  };

  queryLateByLevel = (
    rolesIDKey,
    containedRoles,
    startDate = "today",
    filterType = "day",
    status = this.state.status
  ) => {
    // contained roles must be array
    const Izin = new Parse.Object.extend("Izin");
    const query = new Parse.Query(Izin);

    const hierarki = new Parse.User();
    const hierarkiQuery = new Parse.Query(hierarki);

    query.equalTo("statusIzin", 2);

    if (parseInt(this.state.statusWaktu) === 4) {
      const d = new Date();
      const start = new moment(this.state.startDate);
      start.startOf("day");
      const finish = new moment(start);
      finish.add(1, "day");
      query.greaterThanOrEqualTo("createdAt", start.toDate());
      query.lessThan("createdAt", finish.toDate());
    }
    if (parseInt(this.state.statusWaktu) === 5) {
      const d = new Date();
      const start = new moment(this.state.startDate);
      start.startOf("week");
      const finish = new moment(start);
      finish.add(1, "week");
      query.greaterThanOrEqualTo("createdAt", start.toDate());
      query.lessThan("createdAt", finish.toDate());
    }
    if (parseInt(this.state.statusWaktu) === 6) {
      const d = new Date();
      const start = new moment(this.state.startDate);
      start.startOf("month");
      const finish = new moment(start);
      finish.add(1, "month");
      query.greaterThanOrEqualTo("createdAt", start.toDate());
      query.lessThan("createdAt", finish.toDate());
    }
    if (parseInt(this.state.status) === 3 || status === 3) {
      if (startDate !== "today") {
      } else if (startDate === "today") {
        const d = new Date();
        const start = new moment(d);
        start.startOf(filterType);
        const finish = new moment(start);
        finish.add(1, filterType);
        query.greaterThanOrEqualTo("createdAt", start.toDate());
        query.lessThan("createdAt", finish.toDate());
      }
      // const d = new Date();
      // const start = new moment(d);
      // start.startOf('day');
      // const finish = new moment(start);
      // finish.add(1, 'day');
      // query.greaterThanOrEqualTo('createdAt', start.toDate());
      // query.lessThan('createdAt', finish.toDate());
      // query.exists('lateTimes');
      // query.descending('createdAt');
      // query.equalTo('approvalLate', 3);
    }
    if (
      parseInt(this.state.status) === 1 ||
      parseInt(this.state.status) === 0
    ) {
      query.descending("updatedAt");
    }

    hierarkiQuery.equalTo(rolesIDKey, {
      __type: "Pointer",
      className: "_User",
      objectId: getLeaderId(),
    });
    // query.notContainedIn("roles", containedRoles);
    hierarkiQuery.containedIn("roles", containedRoles);
    // if (
    //   parseInt(this.state.status) === 1 ||
    //   parseInt(this.state.status) === 0
    // ) {
    query.equalTo("status", status);
    // }
    // query.equalTo("status", parseInt(this.state.status));
    // query.greaterThanOrEqualTo("createdAt", start.toDate());
    // query.lessThan("createdAt", finish.toDate());
    // query.notContainedIn("roles", ["admin", "Admin", "Leader", "leader"]);
    query.matchesQuery('user', hierarkiQuery);
    query.include("user");
    query
      .find()
      .then((x) => {
        x.map((y) => (y.select = false));
        console.log(x);
        this.setState({ cuti: x, loading: false });
      })
      .catch((err) => {
        alert(err.message);
        this.setState({ loading: false });
      });
  };

  getDataByLevel = (
    startDate = "today",
    userRole = getUserRole(),
    filterType = "day",
    status = this.state.status
  ) => {
    switch (userRole) {
      case "leader":
        this.queryLateByLevel(
          "leaderIdNew",
          ["staff"],
          startDate,
          filterType,
          status
        );
        break;
      case "supervisor":
        this.queryLateByLevel(
          "supervisorID",
          ["staff", "leader"],
          startDate,
          filterType,
          status
        );
        break;
      case "manager":
        this.queryLateByLevel(
          "managerID",
          ["staff", "leader", "supervisor"],
          startDate,
          filterType,
          status
        );
        break;
      case "head":
        this.queryLateByLevel(
          "headID",
          ["staff", "leader", "supervisor", "manager"],
          startDate,
          filterType,
          status
        );
        break;
      case "gm":
        this.queryLateByLevel(
          "headID",
          ["staff", "leader", "supervisor", "manager", "head"],
          startDate,
          filterType,
          status
        );
        break;

      default:
        break;
    }
  };

  handleFilter = (e) => {
    e.preventDefault();
    this.setState({ loading: true });
    this.getDataByLevel(
      this.state.startDate,
      getUserRole(),
      "fox",
      parseInt(this.state.status)
    );
  };

  // hari Cuti
  getHariCuti = () => {
    this.setState({ loading: true });
    const HariCuti = Parse.Object.extend("HariCuti");
    const query = new Parse.Query(HariCuti);
    query
      .find()
      .then((x) => {
        x.map((y) => (y.select = false));
        this.setState({ hariCuti: x, loading: false });
      })
      .catch(({ message }) => {
        this.setState({ loading: false });
        alert(message);
      });
  };

  handleFilter2 = (e) => {
    e.preventDefault();
    this.setState({ loading: true });
    const Izin = Parse.Object.extend("Izin");
    const query = new Parse.Query(Izin);

    if (parseInt(this.state.statusWaktu) === 4) {
      const d = new Date();
      const start = new moment(this.state.startDate);
      start.startOf("day");
      const finish = new moment(start);
      finish.add(1, "day");
      query.greaterThanOrEqualTo("createdAt", start.toDate());
      query.lessThan("createdAt", finish.toDate());
    } else if (parseInt(this.state.statusWaktu) === 5) {
      const d = new Date();
      const start = new moment(this.state.startDate);
      start.startOf("week");
      const finish = new moment(start);
      finish.add(1, "week");
      query.greaterThanOrEqualTo("createdAt", start.toDate());
      query.lessThan("createdAt", finish.toDate());
    } else if (parseInt(this.state.statusWaktu) === 6) {
      const d = new Date();
      const start = new moment(this.state.startDate);
      start.startOf("month");
      const finish = new moment(start);
      finish.add(1, "month");
      query.greaterThanOrEqualTo("createdAt", start.toDate());
      query.lessThan("createdAt", finish.toDate());
    }
    if (
      parseInt(this.state.status) === 1 ||
      parseInt(this.state.status) === 0
    ) {
      query.descending("updatedAt");
    }
    if (parseInt(this.state.status) === 3) {
      query.descending("createdAt");
    }
    // if (parseInt(this.state.status) === 3) {
    //   const d = new Date();
    //   const start = new moment(d);
    //   start.startOf("day");
    //   const finish = new moment(start);
    //   finish.add(1, "day");
    //   query.greaterThanOrEqualTo("createdAt", start.toDate());
    // }

    query.include("user");
    // query.descending("status");
    query.equalTo("statusIzin", 2);
    // if (
    //   parseInt(this.state.status) === 1 ||
    //   parseInt(this.state.status) === 0
    // ) {
    query.equalTo("status", parseInt(this.state.status));
    // }
    query.equalTo("leaderIdNew", {
      __type: "Pointer",
      className: "_User",
      objectId: getLeaderId(),
    });
    query.notContainedIn("roles", ["admin", "Admin", "Leader", "leader"]);
    query
      .find()
      .then((x) => {
        x.map((y) => (y.select = false));
        this.setState({ cuti: x, loading: false });
      })
      .catch(({ message }) => {
        this.setState({ loading: false });
        alert(message);
      });
  };

  closeLoading = () => {
    this.setState({ loadingModal: false });
  };

  countDays = (dari, sampai) => {
    let fr = convertDate(dari, "YYYY/MM/DD");
    let tooo = convertDate(sampai, "YYYY/MM/DD");
    var dari = moment(fr);
    var sampai = moment(tooo);
    const countDays = sampai.diff(dari, "days") + 1;
    return countDays;
  };

  // parseDate = (e, str) => {
  //   const myd = str.split("/");
  //   return new Date(myd[2], myd[0] - 1, myd[1]);
  // };

  // dateDiff = (e, fromm, too) => {
  //   return Math.round((too - fromm) / (1000 * 60 * 60 * 24));
  // };

  handleApproval = (e, approvalMode) => {
    console.log(this.state.user);
    console.log(this.state.userId);
    e.preventDefault();
    this.setState({ loadingModal: true });
    const Izin = Parse.Object.extend("Izin");
    const query = new Parse.Query(Izin);

    let fr = convertDate(this.state.fromm, "YYYY/MM/DD");
    let tooo = convertDate(this.state.too, "YYYY/MM/DD");
    var dari = moment(fr);
    var sampai = moment(tooo);
    const countDays = sampai.diff(dari, "days");

    query
      .get(this.state.userId)
      .then((x) => {
        const User = new Parse.User();
        const query = new Parse.Query(User);
        query.get(this.state.user).then((v) => {
          console.log("leaderId", this.state.userId);
          console.log("userId", this.state.user);
          let sisaCuti = parseInt(v.get("jumlahCuti"));
          console.log("jumlah Cuti", sisaCuti);
          console.log("jumlah hari", parseInt(countDays));
          if (v.get("jumlahCuti") === 0) {
            // alert("Sisa cuti habis");
            this.setState({
              loadingModal: false,
              // approvalMode: false,
              messageApprove: "Sisa Cuti Anda Telah Habis",
            });
            return;
          }
          if (sisaCuti < countDays) {
            // alert("Kouta Cuti Tidak Mecukupi");
            this.setState({
              loadingModal: false,
              // approvalMode: false,
              messageApprove: "Kouta Cuti Tidak Mencukupi",
            });
            return;
          }
          x.set("status", approvalMode ? 1 : 0);
          if (!approvalMode) x.set("alasanReject", this.state.reason);
          x.save()
            .then(() => {
              console.log(approvalMode);
              if (!approvalMode) {
                v.set("jumlahCuti", parseInt(sisaCuti) - 0);
              } else {
                // v.set("jumlahCuti", parseInt(sisaCuti) - parseInt(countDays));
                console.log(
                  "Libur Nasional",
                  this.getLiburNasional(
                    x.get("dari"),
                    x.get("sampai"),
                    this.state.hariCuti
                  )
                );
                v.set(
                  "jumlahCuti",
                  parseInt(sisaCuti) -
                    parseInt(
                      this.getLiburNasional(
                        x.get("dari"),
                        x.get("sampai"),
                        this.state.hariCuti
                      )
                    )
                );
              }
              v.save(null, { useMasterKey: true }).then(() => {
                let newArr = [...this.state.cuti];
                newArr.splice(this.state.userIndex, 1);
                this.setState({
                  counter: this.state.counter + 1,
                  cuti: newArr,
                  [approvalMode ? "approvalMode" : "rejectMode"]: false,
                  loadingModal: false,
                  alerts: 1,
                  messageApprove: approvalMode ? "approve" : "reject",
                });
                // alert(`Berhasil ${approvalMode ? "approve" : "reject"}`);
                return;
              });
            })
            .catch((err) => {
              alert(err.message);
              this.closeLoading();
              return;
            });
        });
      })
      .catch((err) => {
        alert(err.message);
        this.closeLoading();
        return;
      });
  };

  toggle = (state) => {
    this.setState({
      [state]: !this.state[state],
    });
  };

  handleAllCheck = (e) => {
    let cuti = this.state.cuti;
    let collecId = [];

    cuti.map((x) => {
      x.select = e.target.checked;
      if (x.select) {
        collecId.push(x.id);
      } else {
        collecId = [];
      }

      return x;
    });

    this.setState({ cuti: cuti, checkId: collecId }, () =>
      console.log(this.state.checkId)
    );
  };

  handleChildCheck = (e) => {
    let { cuti } = this.state;
    const { checkId } = this.state;
    let checked = e.target.value;
    cuti.map((x) => {
      console.log("bandingkan", x.id === e.target.value);
      if (x.id === e.target.value) {
        console.log("sama");
        x.select = e.target.checked;
        if (x.select) {
          this.setState(
            (prevState) => ({
              checkId: [...this.state.checkId, checked],
            }),
            () => console.log(this.state.checkId)
          );
        } else {
          const index = checkId.indexOf(checked);
          if (index > -1) {
            checkId.splice(index, 1);
            this.setState(
              (prevState) => ({
                checkId: checkId,
              }),
              () => console.log(this.state.checkId)
            );
          }
        }
      }
    });

    this.setState({ cuti: cuti });
  };

  handleApproveAll = (e) => {
    this.setState({ loading: true });
    const Izin = Parse.Object.extend("Izin");
    const query = new Parse.Query(Izin);

    query.get(e).then((x) => {
      x.set("status", 1);
      x.save().then(() => {
        const newArr = [...this.state.cuti];
        newArr.splice(this.state.userIndex, 1);
        this.setState({
          cuti: newArr,
          approvalMode: false,
          loading: false,
        });
      });
    });
  };

  handleRejectAll = (e) => {
    this.setState({ loading: true });
    const Cuti = Parse.Object.extend("Overtime");
    const query = new Parse.Query(Cuti);

    query.get(e).then((x) => {
      x.set("status", 0);
      x.save().then(() => {
        const newArr = [...this.state.cuti];
        newArr.splice(this.state.userIndex, 1);
        this.setState({
          cuti: newArr,
          rejectMode: false,
          loading: false,
        });
      });
    });
  };

  approveChecked = (e) => {
    this.setState({ loadingModal: true });
    const { checkId } = this.state;
    let totalData = 0;

    checkId.map((id) => {
      const Izin = Parse.Object.extend("Izin");
      const query = new Parse.Query(Izin);

      query.include("user");

      query.get(id).then((x) => {
        let userId = x.get("user").id;
        let from = x.get("dari");
        let to = x.get("sampai");
        let fr = convertDate(from, "YYYY/MM/DD");
        let tooo = convertDate(to, "YYYY/MM/DD");
        var dari = moment(fr);
        var sampai = moment(tooo);
        let countDays = sampai.diff(dari, "days");
        x.set("status", 1);
        x.save().then(() => {
          const User = new Parse.User();
          const query = new Parse.Query(User);
          query.get(userId).then((z) => {
            let jumlahCuti = z.get("jumlahCuti");
            console.log("sisa", parseInt(jumlahCuti) - parseInt(countDays));
            // z.set("jumlahCuti", parseInt(jumlahCuti) - parseInt(countDays));
            z.set(
              "jumlahCuti",
              parseInt(jumlahCuti) -
                this.getLiburNasional(
                  x.get("dari"),
                  x.get("sampai"),
                  this.state.hariCuti
                )
            );
            z.save(null, { useMasterKey: true }).then(() => {
              totalData = totalData + 1;
              if (totalData === checkId.length) {
                this.setState({ loadingModal: false });
                // alert("Berhasil reject");
                this.setState({
                  messageApprove: "Approve " + totalData + " Data",
                  alerts: 1,
                  loadingModal: false,
                  approveAllMode: false,
                });
                // return;
                return window.location.reload(false);
              }
            });
          });
        });
      });
    });
  };

  rejectChecked = (e) => {
    e.preventDefault();
    this.setState({ loadingModal: true });
    const { checkId } = this.state;
    let totalData = 0;

    checkId.map((id) => {
      const Izin = Parse.Object.extend("Izin");
      const query = new Parse.Query(Izin);

      query.get(id).then((x) => {
        x.set("status", 1);
        x.save().then(() => {
          totalData = totalData + 1;
          if (totalData === checkId.length) {
            // alert("Berhasil reject");
            this.setState({
              messageApprove: "Reject " + totalData + " Data",
              alerts: 1,
              loadingModal: false,
              approveAllMode: false,
            });
            // return;
            return window.location.reload(false);
          }
          // const newArr = [ ...this.state.izin ];
          // newArr.splice(this.state.userIndex, 1);
          // this.setState({
          // 	izin: newArr,
          // 	approvalMode: false,
          // 	loading: false
          // });
        });
      });
    });
  };

  getDatesBetweenDates = (startDate, endDate) => {
    // let dates = [];
    // //to avoid modifying the original date
    // const theDate = moment(startDate);
    // const stopDate = moment(endDate);
    // while (theDate <= stopDate) {
    //   dates.push(moment(theDate).format("DD/MM/YYYY"));
    //   theDate = moment(theDate).add(1, "days");
    // }
    // return dates;

    var dateArray = [];
    var currentDate = moment(startDate);
    var stopDate = moment(endDate);
    while (currentDate <= stopDate) {
      dateArray.push(moment(currentDate).format("YYYY-MM-DD"));
      currentDate = moment(currentDate).add(1, "days");
    }
    return dateArray;
  };

  getLiburNasional = (dari, sampai, arrayHariCuti) => {
    let jumlahLibur = 0;
    let hasil;
    let dates;

    // tampung request tgl cuti
    dates = this.getDatesBetweenDates(dari, sampai);
    console.log("dates", dates.length);
    // looping data hari Cuti
    arrayHariCuti.map((dataCuti, key2) => {
      for (let i = 0; i <= dates.length; i++) {
        if (dates[i] === convertDate(dataCuti.get("hariCuti"), "YYYY-MM-DD")) {
          jumlahLibur += 1;
        } else {
          jumlahLibur += 0;
        }
        console.log("jumlah Libur libur", jumlahLibur);
      }
    });
    if (jumlahLibur > 0) {
      hasil = dates.length - jumlahLibur;
    } else {
      hasil = dates.length;
    }
    jumlahLibur = 0;
    return hasil;
  };

  render() {
    const {
      cuti,
      hariCuti,
      minus,
      rejectAllMode,
      approveAllMode,
      loading,
      loadingModal,
      approvalMode,
      rejectMode,
      fullnames,
      startDate,
      counter,
    } = this.state;

    // let jumlahLibur = 0;
    // let hasil;
    // let dates;
    // cuti.map((prop, key) => {
    //   console.log("--------------get date beetween date---------");
    //   dates = this.getDatesBetweenDates(prop.get("dari"), prop.get("sampai"));
    //   console.log("dari", convertDate(prop.get("dari"), "YYYY-MM-DD"));
    //   console.log("sampai", convertDate(prop.get("sampai"), "YYYY-MM-DD"));
    //   console.log(
    //     "hasil pengurangan cuti",
    //     this.getLiburNasional(
    //       prop.get("dari"),
    //       prop.get("sampai"),
    //       this.state.hariCuti
    //     )
    //   );
    //   // hariCuti.map((dataCuti, key2) => {
    //   //   for (let i = 0; i <= dates.length; i++) {
    //   //     if (
    //   //       dates[i] === convertDate(dataCuti.get("hariCuti"), "YYYY-MM-DD")
    //   //     ) {
    //   //       jumlahLibur += 1;
    //   //     } else {
    //   //       jumlahLibur += 0;
    //   //     }
    //   //   }
    //   // });
    //   // console.log("libur nasional", jumlahLibur);
    //   // if (jumlahLibur > 0) {
    //   //   hasil = dates.length - jumlahLibur;
    //   // } else {
    //   //   hasil = jumlahLibur;
    //   // }
    //   // console.log("hasil pengurangan", hasil);
    //   // jumlahLibur = 0;
    // });

    return (
      <React.Fragment>
        <HeaderNormal cuti={counter} />
        {/* Page content */}
        <Container className="mt--8" fluid>
          {/* Table */}
          <Row>
            <div className="col">
              <Card className="shadow">
                <CardHeader className="border-0">
                  <h3 className="mb-2">Request cuti</h3>
                  {parseInt(this.state.alerts) === 2 ? (
                    ""
                  ) : (
                    <Alerts
                      show={true}
                      icon="ni ni-like-2"
                      alert="success"
                      message={`Berhasil ${this.state.messageApprove}`}
                    />
                  )}
                  <Form
                    role="form"
                    onSubmit={this.handleFilter}
                    className="mt-3"
                  >
                    <div className="row">
                      <div className="col-md-2 col-sm-12">
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
                                this.setState({ status: e.target.value });
                              }}
                            >
                              <option value="">Pilih Kategori</option>
                              {[3, 1, 0].map((x) => (
                                <option value={x}>{handleSelect(x)}</option>
                              ))}
                            </Input>
                          </InputGroup>
                        </FormGroup>
                      </div>
                      <div className="col-md-2 col-sm-12">
                        <FormGroup>
                          <InputGroup className="input-group-alternative">
                            <Input
                              type="select"
                              className="fa-pull-right"
                              // required={true}
                              onChange={(e) => {
                                this.setState({ statusWaktu: e.target.value });
                              }}
                            >
                              <option value="">Pilih Waktu</option>
                              {[4, 5, 6].map((x) => (
                                <option value={x}>{handleSelect(x)}</option>
                              ))}
                            </Input>
                          </InputGroup>
                        </FormGroup>
                      </div>
                      <div className="col-md-4 col-sm-12">
                        <FormGroup>
                          <InputGroup className="input-group-alternative">
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText>
                                <i className="ni ni-calendar-grid-58" />
                              </InputGroupText>
                            </InputGroupAddon>
                            <ReactDatetime
                              inputProps={{
                                placeholder: "Date Picker Here",
                                required: true,
                                readOnly: true,
                              }}
                              viewMode={
                                parseInt(this.state.statusWaktu) === 6
                                  ? "months"
                                  : "days"
                              }
                              dateFormat={
                                parseInt(this.state.statusWaktu) === 6
                                  ? "MM/YYYY"
                                  : "MM/DD/YYYY"
                              }
                              timeFormat={false}
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
                  {cuti.length === 0 ? (
                    ""
                  ) : this.state.checkId.length === 0 ? (
                    ""
                  ) : (
                    <Col sm={{ span: 0 }} className="float-none">
                      <Button
                        color="primary"
                        size="sm"
                        type="submit"
                        disable={loading ? "true" : "false"}
                        className="mr-2 m-1"
                        onClick={() => this.setState({ approveAllMode: true })}
                      >
                        <i className="fa fa-check" />{" "}
                        {loading ? "Fetching..." : "Approve"}
                      </Button>
                      <Button
                        color="primary"
                        type="submit"
                        size="sm"
                        className="m-1"
                        disable={loading ? "true" : "false"}
                        onClick={() => this.setState({ rejectAllMode: true })}
                      >
                        <i className="fa fa-times" />{" "}
                        {loading ? "Fetching..." : "Reject"}
                      </Button>
                    </Col>
                  )}
                  {/* <input type="text" placeholder="input" /> */}
                </CardHeader>
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      {parseInt(this.state.status) === 1 ||
                      parseInt(this.state.status) === 0 ? (
                        <th>
                          <input
                            type="checkbox"
                            onChange={this.handleAllCheck}
                            disabled="true"
                          />
                        </th>
                      ) : (
                        <th>
                          <input
                            type="checkbox"
                            onChange={this.handleAllCheck}
                          />
                        </th>
                      )}
                      <th scope="col">NIK</th>
                      <th scope="col">Nama</th>
                      <th scope="col">Alasan</th>
                      <th scope="col">Tanggal Request</th>
                      <th scope="col">Dari</th>
                      <th scope="col">Sampai</th>
                      <th scope="col">Jumlah Hari</th>
                      <th scope="col">Sisa Cuti</th>
                      <th scope="col">Keterangan</th>
                      <th scope="col">Approve</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={9} style={{ textAlign: "center" }}>
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
                    ) : cuti.length < 1 ? (
                      <tr>
                        <td colSpan={9} style={{ textAlign: "center" }}>
                          No data found...
                        </td>
                      </tr>
                    ) : (
                      cuti.map((prop, key) => (
                        <tr>
                          {prop.get("status") === 1 ||
                          prop.get("status") === 0 ? (
                            <td>
                              <input
                                type="checkbox"
                                // value={prop.id}
                                // checked={prop.select}
                                // onChange={this.handleChildCheck}
                                disabled="true"
                                style={{ color: "red" }}
                              />
                            </td>
                          ) : (
                            <td>
                              <input
                                type="checkbox"
                                value={prop.id}
                                checked={prop.select}
                                onChange={this.handleChildCheck}
                              />
                            </td>
                          )}
                          <td>{prop.get("user").attributes.nik}</td>
                          <td>{prop.get("fullname")}</td>
                          <td>{prop.get("alasanIzin")}</td>
                          <td>
                            {convertDate(prop.get("createdAt"), "DD/MM/YYYY")}
                          </td>
                          <td>{convertDate(prop.get("dari"), "DD/MM/YYYY")}</td>
                          <td>
                            {convertDate(prop.get("sampai"), "DD/MM/YYYY")}
                          </td>
                          <td>
                            {this.countDays(
                              prop.get("dari"),
                              prop.get("sampai")
                            )}{" "}
                            Hari
                          </td>
                          <td>{prop.get("user").attributes.jumlahCuti} Hari</td>
                          <td>{prop.get("descIzin")}</td>
                          {prop.get("status") === 1 ? (
                            <td>Approved</td>
                          ) : prop.get("status") === 0 ? (
                            <td>Rejected</td>
                          ) : (
                            <td>
                              <Button
                                id="t1"
                                color="primary"
                                className="btn-circle"
                                onClick={() => {
                                  this.setState({
                                    approvalMode: true,
                                    userId: prop.id,
                                    user: prop.get("user").id,
                                    fromm: prop.get("dari"),
                                    too: prop.get("sampai"),
                                    userIndex: key,
                                    fullnames: prop.get("fullname"),
                                  });
                                }}
                              >
                                <i className="fa fa-check" />
                              </Button>
                              <UncontrolledTooltip
                                delay={0}
                                placement="top"
                                target="t1"
                              >
                                Approve
                              </UncontrolledTooltip>

                              <Button
                                id="t2"
                                color="danger"
                                className="btn-circle"
                                onClick={(e) => {
                                  this.setState({
                                    rejectMode: true,
                                    userId: prop.id,
                                    user: prop.get("user").id,
                                    fromm: prop.get("dari"),
                                    too: prop.get("sampai"),
                                    userIndex: key,
                                    fullnames: prop.get("fullname"),
                                  });
                                }}
                              >
                                <i className="fa fa-times" />
                              </Button>
                              <UncontrolledTooltip
                                delay={0}
                                placement="top"
                                target="t2"
                              >
                                Reject
                              </UncontrolledTooltip>
                            </td>
                          )}
                        </tr>
                      ))
                    )}
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

        {/* approve modal */}
        <ModalHandler
          show={approvalMode}
          loading={loadingModal}
          footer={true}
          handleHide={() => this.toggle("approvalMode")}
          title="Approval Confirmation"
          body={`Approve cuti ${fullnames} ?`}
          handleSubmit={(e) => this.handleApproval(e, true)}
        />

        {/* reject modal */}
        <ModalHandler
          show={rejectMode}
          loading={loadingModal}
          handleHide={() => this.toggle("rejectMode")}
          title="Reject Confirmation"
          footer={false}
          body={
            <div>
              <h3 className="mb-4">{`Reject cuti ${fullnames} ?`}</h3>
              <Form onSubmit={(e) => this.handleApproval(e, false)}>
                <FormGroup>
                  <Input
                    id="exampleFormControlInput1"
                    placeholder="Masukkan alasan"
                    type="textarea"
                    required={true}
                    onChange={(e) => this.setState({ reason: e.target.value })}
                  />
                </FormGroup>
                <Button
                  color="secondary"
                  data-dismiss="modal"
                  type="button"
                  onClick={() => this.toggle("rejectMode")}
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
                      />{" "}
                      Submitting...
                    </div>
                  ) : (
                    "Submit"
                  )}
                </Button>
              </Form>
            </div>
          }
          handleSubmit={(e) => this.handleApproval(e, false)}
        />

        {/* Approve All Modal */}
        <ModalHandler
          show={approveAllMode}
          loading={loadingModal}
          footer={true}
          handleHide={() => this.toggle("approveAllMode")}
          title="Approve Confirmation"
          body={
            <div>
              <h3 className="mb-4">{`Approve cuti ${this.state.checkId.length} data ?`}</h3>
            </div>
          }
          handleSubmit={this.approveChecked}
        />

        {/* Reject All Modal */}
        <ModalHandler
          show={rejectAllMode}
          loading={loadingModal}
          footer={false}
          handleHide={() => this.toggle("rejectAllMode")}
          title="Reject Confirmation"
          body={
            <div>
              <h3 className="mb-4">{`Reject cuti ${this.state.checkId.length} data ?`}</h3>
              <Form onSubmit={(e) => this.rejectChecked(e)}>
                <FormGroup>
                  <Input
                    id="exampleFormControlInput1"
                    placeholder="Masukkan alasan"
                    type="textarea"
                    required={true}
                    onChange={(e) => this.setState({ reason: e.target.value })}
                  />
                </FormGroup>
                <Button
                  color="secondary"
                  data-dismiss="modal"
                  type="button"
                  onClick={() => this.toggle("rejectAllMode")}
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
                      />{" "}
                      Submitting...
                    </div>
                  ) : (
                    "Submit"
                  )}
                </Button>
              </Form>
            </div>
          }
          handleSubmit={this.rejectChecked}
        />
      </React.Fragment>
    );
  }
}

export default Cuti;
