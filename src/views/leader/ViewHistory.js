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

import Pagination from "react-js-pagination";

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
  // Pagination,
  PaginationItem,
  PaginationLink,
  Progress,
  Table,
  Container,
  Row,
  UncontrolledTooltip,
  InputGroup,
  Spinner,
  Button,
  Form,
  FormGroup,
  Input,
  Col,
  InputGroupAddon,
  InputGroupText,
} from "reactstrap";
// core components
// import Header from "components/Headers/Header.js";
import Parse from "parse";
import moment, { months } from "moment";
import { getLeaderId } from "utils";
import ModalHandler from "components/Modal/Modal";
import { handleConvert } from "utils";
import { convertDate } from "utils";
import HeaderNormal from "components/Headers/HeaderNormal";
import { handleSelect } from "utils";
import ExportExcel from "components/Export/ExportExcel";
// import reactHtmlTableToExcel from "react-html-table-to-excel";
import ReactHTMLTableToExcel from "react-html-table-to-excel";

class ViewHistory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [],
      loading: false,
      approvalMode: false,
      rejectMode: false,
      userIndex: 0,
      loadingModal: false,
      userId: "",
      fullnames: "",
      reason: "",
      checkId: [],
      rejectAllMode: false,
      approveAllMode: false,
      searchValue: "",
      searchBy: "Absen",
      excelMode: false,
      startDate: "",
      startDateExcelFrom: "",
      activePage: 1,
      itemCountPerPage: 10,
      pageRangeDisplayed: 10,
    };
  }

  handlePageChange = (pageNumber) => {
    console.log(`active page is ${pageNumber}`);
    this.setState({ activePage: pageNumber });
  };

  componentDidMount() {
    this.getData();
  }

  getData = () => {
    this.setState({ loading: true });
    const { searchBy, searchValue } = this.state;
    const userId = this.props.match.params.id;

    const Search = Parse.Object.extend(handleConvert(searchBy));
    const query = new Parse.Query(Search);

    let status;

    if (searchBy === "Absen") {
      // query.equalTo("leaderId", getLeaderId);
      query.equalTo("leaderIdNew", {
        __type: "Pointer",
        className: "_User",
        objectId: getLeaderId(),
      });
      // query.limit(this.state.pageRangeDisplayed);
      query.descending("absenMasuk");
      query.equalTo("user", {
        __type: "Pointer",
        className: "_User",
        objectId: userId,
      });

      query.include("user");
      query
        .find()
        .then((x) => {
          console.log("user", x);
          this.setState({ history: x, loading: false });
          return;
        })
        .catch((err) => {
          alert(err.message);
          console.log(err);
          this.setState({ loading: false });
          return;
        });
    }

    // if (searchBy === "Cuti") {
    //   query.descending("createdAt");
    //   query.equalTo("user", {
    //     __type: "Pointer",
    //     className: "_User",
    //     objectId: userId,
    //   });
    //   query.equalTo("leaderIdNew", {
    //     __type: "Pointer",
    //     className: "_User",
    //     objectId: getLeaderId(),
    //   });
    //   query.equalTo("statusIzin", 2);
    //   // query.equalTo("status", 3);
    //   query.include("user");
    //   // query.equalTo("leaderId", getLeaderId);
    //   query
    //     .find()
    //     .then((x) => {
    //       console.log("wew", x);
    //       x.map((y) => (y.select = false));
    //       this.setState({ history: x, loading: false });
    //       return;
    //     })
    //     .catch(({ message }) => {
    //       this.setState({ loading: false });
    //       alert(message);
    //       return;
    //     });
    // }

    // if (searchBy === "Izin") {
    //   query.descending("createdAt");
    //   query.include("user");
    //   query.equalTo("statusIzin", 1);
    //   // query.equalTo("status", 3);
    //   query.equalTo("user", {
    //     __type: "Pointer",
    //     className: "_User",
    //     objectId: userId,
    //   });
    //   query.equalTo("leaderIdNew", {
    //     __type: "Pointer",
    //     className: "_User",
    //     objectId: getLeaderId(),
    //   });
    //   // query.equalTo("leaderId", getLeaderId);
    //   query
    //     .find()
    //     .then((x) => {
    //       x.map((y) => (y.select = false));
    //       this.setState({ history: x, loading: false });
    //       return;
    //     })
    //     .catch(({ message }) => {
    //       this.setState({ loading: false });
    //       console.log("err", message);
    //       alert(message);
    //       return;
    //     });
    // }

    // if (searchBy === "Terlambat") {
    //   query.include("user");
    //   query.descending("time");
    //   query.equalTo("user", {
    //     __type: "Pointer",
    //     className: "_User",
    //     objectId: userId,
    //   });
    //   query.equalTo("leaderIdNew", {
    //     __type: "Pointer",
    //     className: "_User",
    //     objectId: getLeaderId(),
    //   });
    //   // query.equalTo("status", 3);
    //   // query.equalTo("leaderId", getLeaderId);
    //   query
    //     .find()
    //     .then((x) => {
    //       x.map((y) => (y.select = false));
    //       this.setState({ history: x, loading: false });
    //       return;
    //     })
    //     .catch(({ message }) => {
    //       this.setState({ loading: false });
    //       console.log("err", message);
    //       alert(message);
    //       return;
    //     });
    // }

    // if (searchBy === "Lembur") {
    //   query.include("user");
    //   query.descending("time");
    //   query.equalTo("user", {
    //     __type: "Pointer",
    //     className: "_User",
    //     objectId: userId,
    //   });
    //   query.equalTo("leaderIdNew", {
    //     __type: "Pointer",
    //     className: "_User",
    //     objectId: getLeaderId(),
    //   });
    //   // query.equalTo("leaderId", getLeaderId);
    //   query
    //     .find()
    //     .then((x) => {
    //       x.map((y) => (y.select = false));
    //       this.setState({ history: x, loading: false });
    //       return;
    //     })
    //     .catch(({ message }) => {
    //       this.setState({ loading: false });
    //       console.log("err", message);
    //       alert(message);
    //       return;
    //     });
    // }

    // if (searchBy === "Pulang Cepat") {
    //   query.include("user");
    //   query.descending("time");
    //   query.equalTo("user", {
    //     __type: "Pointer",
    //     className: "_User",
    //     objectId: userId,
    //   });
    //   query.equalTo("leaderIdNew", {
    //     __type: "Pointer",
    //     className: "_User",
    //     objectId: getLeaderId(),
    //   });
    //   // query.equalTo("leaderId", getLeaderId);
    //   query
    //     .find()
    //     .then((x) => {
    //       x.map((y) => (y.select = false));
    //       this.setState({ history: x, loading: false });
    //       return;
    //     })
    //     .catch(({ message }) => {
    //       this.setState({ loading: false });
    //       console.log("err", message);
    //       alert(message);
    //       return;
    //     });
    // }

    // const Search = Parse.Object.extend(handleConvert(searchBy));
    // const query = new Parse.Query(Search);

    // query.equalTo('leaderId', getLeaderId);
    // query.equalTo('status', 3);
    // query.equalTo('user', userId);
    // query
    // 	.find()
    // 	.then((x) => {
    // 		x.map((y) => (y.select = false));
    // 		console.log('zz', x);
    // 		this.setState({ history: x, loading: false });
    // 	})
    // 	.catch((err) => {
    // 		alert(err.message);
    // 		this.setState({ loading: false });
    // 	});
  };

  handleFilter = (e) => {
    e.preventDefault();
    this.setState({ loading: true });
    const { searchBy, searchValue } = this.state;
    const userId = this.props.match.params.id;

    const Search = Parse.Object.extend(handleConvert(searchBy));
    const query = new Parse.Query(Search);

    let status;

    if (searchBy === "Absen") {
      // query.equalTo("leaderId", getLeaderId);
      // jika pilih waktu dan tanggal terisi
      if (parseInt(this.state.status) === 4) {
        const d = new Date();
        const start = new moment(this.state.startDate);
        start.startOf("day");
        const finish = new moment(start);
        finish.add(1, "day");
        query.greaterThanOrEqualTo("absenMasuk", start.toDate());
        query.lessThan("absenMasuk", finish.toDate());
      }
      if (parseInt(this.state.status) === 5) {
        const d = new Date();
        const start = new moment(this.state.startDate);
        start.startOf("week");
        const finish = new moment(start);
        finish.add(1, "week");
        query.greaterThanOrEqualTo("absenMasuk", start.toDate());
        query.lessThan("absenMasuk", finish.toDate());
      }
      if (parseInt(this.state.status) === 6) {
        if (this.state.startDate === undefined) {
          alert("wajib pilih tanggal");
        }
        const d = new Date();
        const start = new moment(this.state.startDate);
        start.startOf("month");
        const finish = new moment(start);
        finish.add(1, "month");
        query.greaterThanOrEqualTo("absenMasuk", start.toDate());
        query.lessThan("absenMasuk", finish.toDate());
      }
      query.equalTo("leaderIdNew", {
        __type: "Pointer",
        className: "_User",
        objectId: getLeaderId(),
      });
      query.descending("absenMasuk");
      query.equalTo("user", {
        __type: "Pointer",
        className: "_User",
        objectId: userId,
      });
      query.include("user");
      query
        .find()
        .then((x) => {
          console.log("user", x);
          this.setState({ history: x, loading: false });
          return;
        })
        .catch((err) => {
          alert(err.message);
          console.log(err);
          this.setState({ loading: false });
          return;
        });
    }

    if (searchBy === "Cuti") {
      // jika pilih waktu dan tanggal terisi
      if (parseInt(this.state.status) === 4) {
        const d = new Date();
        const start = new moment(this.state.startDate);
        start.startOf("day");
        const finish = new moment(start);
        finish.add(1, "day");
        query.greaterThanOrEqualTo("createdAt", start.toDate());
        query.lessThan("createdAt", finish.toDate());
      }
      if (parseInt(this.state.status) === 5) {
        const d = new Date();
        const start = new moment(this.state.startDate);
        start.startOf("week");
        const finish = new moment(start);
        finish.add(1, "week");
        query.greaterThanOrEqualTo("createdAt", start.toDate());
        query.lessThan("createdAt", finish.toDate());
      }
      if (parseInt(this.state.status) === 6) {
        const d = new Date();
        const start = new moment(this.state.startDate);
        start.startOf("month");
        const finish = new moment(start);
        finish.add(1, "month");
        query.greaterThanOrEqualTo("createdAt", start.toDate());
        query.lessThan("createdAt", finish.toDate());
      }
      query.descending("createdAt");
      query.equalTo("user", {
        __type: "Pointer",
        className: "_User",
        objectId: userId,
      });
      query.equalTo("leaderIdNew", {
        __type: "Pointer",
        className: "_User",
        objectId: getLeaderId(),
      });
      // query.limit(this.state.pageRangeDisplayed);
      query.equalTo("statusIzin", 2);
      // query.equalTo("status", 3);
      query.include("user");
      // query.equalTo("leaderId", getLeaderId);
      query
        .find()
        .then((x) => {
          console.log("wew", x);
          x.map((y) => (y.select = false));
          this.setState({ history: x, loading: false });
          return;
        })
        .catch(({ message }) => {
          this.setState({ loading: false });
          alert(message);
          return;
        });
    }

    if (searchBy === "Izin") {
      // jika pilih waktu dan tanggal terisi
      if (parseInt(this.state.status) === 4) {
        const d = new Date();
        const start = new moment(this.state.startDate);
        start.startOf("day");
        const finish = new moment(start);
        finish.add(1, "day");
        query.greaterThanOrEqualTo("createdAt", start.toDate());
        query.lessThan("createdAt", finish.toDate());
      }
      if (parseInt(this.state.status) === 5) {
        const d = new Date();
        const start = new moment(this.state.startDate);
        start.startOf("week");
        const finish = new moment(start);
        finish.add(1, "week");
        query.greaterThanOrEqualTo("createdAt", start.toDate());
        query.lessThan("createdAt", finish.toDate());
      }
      if (parseInt(this.state.status) === 6) {
        const d = new Date();
        const start = new moment(this.state.startDate);
        start.startOf("month");
        const finish = new moment(start);
        finish.add(1, "month");
        query.greaterThanOrEqualTo("createdAt", start.toDate());
        query.lessThan("createdAt", finish.toDate());
      }
      query.descending("createdAt");
      query.include("user");
      query.equalTo("statusIzin", 1);
      // query.equalTo("status", 3);
      query.equalTo("user", {
        __type: "Pointer",
        className: "_User",
        objectId: userId,
      });
      query.equalTo("leaderIdNew", {
        __type: "Pointer",
        className: "_User",
        objectId: getLeaderId(),
      });
      // query.equalTo("leaderId", getLeaderId);
      query
        .find()
        .then((x) => {
          x.map((y) => (y.select = false));
          this.setState({ history: x, loading: false });
          return;
        })
        .catch(({ message }) => {
          this.setState({ loading: false });
          console.log("err", message);
          alert(message);
          return;
        });
    }

    if (searchBy === "Terlambat") {
      // jika pilih waktu dan tanggal terisi
      if (parseInt(this.state.status) === 4) {
        const d = new Date();
        const start = new moment(this.state.startDate);
        start.startOf("day");
        const finish = new moment(start);
        finish.add(1, "day");
        query.greaterThanOrEqualTo("createdAt", start.toDate());
        query.lessThan("createdAt", finish.toDate());
      }
      if (parseInt(this.state.status) === 5) {
        const d = new Date();
        const start = new moment(this.state.startDate);
        start.startOf("week");
        const finish = new moment(start);
        finish.add(1, "week");
        query.greaterThanOrEqualTo("createdAt", start.toDate());
        query.lessThan("createdAt", finish.toDate());
      }
      if (parseInt(this.state.status) === 6) {
        const d = new Date();
        const start = new moment(this.state.startDate);
        start.startOf("month");
        const finish = new moment(start);
        finish.add(1, "month");
        query.greaterThanOrEqualTo("createdAt", start.toDate());
        query.lessThan("createdAt", finish.toDate());
      }
      query.include("user");
      query.descending("time");
      query.equalTo("user", {
        __type: "Pointer",
        className: "_User",
        objectId: userId,
      });
      query.equalTo("leaderIdNew", {
        __type: "Pointer",
        className: "_User",
        objectId: getLeaderId(),
      });
      // query.equalTo("status", 3);
      // query.equalTo("leaderId", getLeaderId);
      query
        .find()
        .then((x) => {
          x.map((y) => (y.select = false));
          this.setState({ history: x, loading: false });
          return;
        })
        .catch(({ message }) => {
          this.setState({ loading: false });
          console.log("err", message);
          alert(message);
          return;
        });
    }

    if (searchBy === "Lembur") {
      // jika pilih waktu dan tanggal terisi
      if (parseInt(this.state.status) === 4) {
        const d = new Date();
        const start = new moment(this.state.startDate);
        start.startOf("day");
        const finish = new moment(start);
        finish.add(1, "day");
        query.greaterThanOrEqualTo("createdAt", start.toDate());
        query.lessThan("createdAt", finish.toDate());
      }
      if (parseInt(this.state.status) === 5) {
        const d = new Date();
        const start = new moment(this.state.startDate);
        start.startOf("week");
        const finish = new moment(start);
        finish.add(1, "week");
        query.greaterThanOrEqualTo("createdAt", start.toDate());
        query.lessThan("createdAt", finish.toDate());
      }
      if (parseInt(this.state.status) === 6) {
        const d = new Date();
        const start = new moment(this.state.startDate);
        start.startOf("month");
        const finish = new moment(start);
        finish.add(1, "month");
        query.greaterThanOrEqualTo("createdAt", start.toDate());
        query.lessThan("createdAt", finish.toDate());
      }
      query.include("user");
      query.descending("time");
      query.equalTo("user", {
        __type: "Pointer",
        className: "_User",
        objectId: userId,
      });
      query.equalTo("leaderIdNew", {
        __type: "Pointer",
        className: "_User",
        objectId: getLeaderId(),
      });
      // query.equalTo("leaderId", getLeaderId);
      query
        .find()
        .then((x) => {
          x.map((y) => (y.select = false));
          this.setState({ history: x, loading: false });
          return;
        })
        .catch(({ message }) => {
          this.setState({ loading: false });
          console.log("err", message);
          alert(message);
          return;
        });
    }

    if (searchBy === "Pulang Cepat") {
      // jika pilih waktu dan tanggal terisi
      if (parseInt(this.state.status) === 4) {
        const d = new Date();
        const start = new moment(this.state.startDate);
        start.startOf("day");
        const finish = new moment(start);
        finish.add(1, "day");
        query.greaterThanOrEqualTo("createdAt", start.toDate());
        query.lessThan("createdAt", finish.toDate());
      }
      if (parseInt(this.state.status) === 5) {
        const d = new Date();
        const start = new moment(this.state.startDate);
        start.startOf("week");
        const finish = new moment(start);
        finish.add(1, "week");
        query.greaterThanOrEqualTo("createdAt", start.toDate());
        query.lessThan("createdAt", finish.toDate());
      }
      if (parseInt(this.state.status) === 6) {
        const d = new Date();
        const start = new moment(this.state.startDate);
        start.startOf("month");
        const finish = new moment(start);
        finish.add(1, "month");
        query.greaterThanOrEqualTo("createdAt", start.toDate());
        query.lessThan("createdAt", finish.toDate());
      }
      query.include("user");
      query.descending("time");
      query.equalTo("user", {
        __type: "Pointer",
        className: "_User",
        objectId: userId,
      });
      query.equalTo("leaderIdNew", {
        __type: "Pointer",
        className: "_User",
        objectId: getLeaderId(),
      });
      // query.equalTo("leaderId", getLeaderId);
      query
        .find()
        .then((x) => {
          x.map((y) => (y.select = false));
          this.setState({ history: x, loading: false });
          return;
        })
        .catch(({ message }) => {
          this.setState({ loading: false });
          console.log("err", message);
          alert(message);
          return;
        });
    }

    // const Search = Parse.Object.extend(handleConvert(searchBy));
    // const query = new Parse.Query(Search);

    // query.equalTo('leaderId', getLeaderId);
    // query.equalTo('status', 3);
    // query.equalTo('user', userId);
    // query
    // 	.find()
    // 	.then((x) => {
    // 		x.map((y) => (y.select = false));
    // 		console.log('zz', x);
    // 		this.setState({ history: x, loading: false });
    // 	})
    // 	.catch((err) => {
    // 		alert(err.message);
    // 		this.setState({ loading: false });
    // 	});
  };

  closeLoading = () => {
    this.setState({ loadingModal: false });
  };

  handleApproval = (e, approvalMode) => {
    e.preventDefault();
    this.setState({ loadingModal: true });
    const Overtime = Parse.Object.extend("Overtime");
    const query = new Parse.Query(Overtime);

    query
      .get(this.state.userId)
      .then((x) => {
        x.set("status", approvalMode ? 1 : 0);
        if (!approvalMode) x.set("alasanReject", this.state.reason);
        x.save()
          .then(() => {
            let newArr = [...this.state.overtime];
            newArr.splice(this.state.userIndex, 1);
            this.setState({
              counter: this.state.counter + 1,
              overtime: newArr,
              [approvalMode ? "approvalMode" : "rejectMode"]: false,
              loadingModal: false,
            });
            alert(`Berhasil ${approvalMode ? "approve" : "reject"}`);
            return;
          })
          .catch((err) => {
            alert(err.message);
            this.closeLoading();
            return;
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
    let overtime = this.state.overtime;
    let collecId = [];

    overtime.map((x) => {
      x.select = e.target.checked;
      if (x.select) {
        collecId.push(x.id);
      } else {
        collecId = [];
      }

      return x;
    });

    this.setState({ overtime: overtime, checkId: collecId }, () =>
      console.log(this.state.checkId)
    );
  };

  handleChildCheck = (e) => {
    let { overtime } = this.state;
    const { checkId } = this.state;
    let checked = e.target.value;
    overtime.map((x) => {
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

    this.setState({ overtime: overtime });
  };

  handleApproveAll = (e) => {
    this.setState({ loading: true });
    const Overtime = Parse.Object.extend("Overtime");
    const query = new Parse.Query(Overtime);

    query.get(e).then((x) => {
      x.set("status", 1);
      x.save().then(() => {
        const newArr = [...this.state.overtime];
        newArr.splice(this.state.userIndex, 1);
        this.setState({
          overtime: newArr,
          approvalMode: false,
          loading: false,
        });
      });
    });
  };

  handleRejectAll = (e) => {
    this.setState({ loading: true });
    const Overtime = Parse.Object.extend("Overtime");
    const query = new Parse.Query(Overtime);

    query.get(e).then((x) => {
      x.set("status", 0);
      x.save().then(() => {
        const newArr = [...this.state.overtime];
        newArr.splice(this.state.userIndex, 1);
        this.setState({
          overtime: newArr,
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
      const Overtime = Parse.Object.extend("Overtime");
      const query = new Parse.Query(Overtime);

      query.get(id).then((x) => {
        x.set("status", 1);
        x.save().then(() => {
          totalData = totalData + 1;
          if (totalData === checkId.length) {
            alert("Berhasil reject");
            return window.location.reload(false);
          }
        });
      });
    });

    this.setState({ loadingModal: false });
  };

  rejectChecked = (e) => {
    e.preventDefault();
    this.setState({ loadingModal: true });
    const { checkId } = this.state;
    let totalData = 0;

    checkId.map((id) => {
      const Overtime = Parse.Object.extend("Overtime");
      const query = new Parse.Query(Overtime);

      query.get(id).then((x) => {
        x.set("status", 1);
        x.save().then(() => {
          totalData = totalData + 1;
          if (totalData === checkId.length) {
            alert("Berhasil reject");
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

  render() {
    const {
      history,
      loading,
      approvalMode,
      rejectMode,
      loadingModal,
      fullnames,
      approveAllMode,
      rejectAllMode,
      excelMode,
    } = this.state;

    const indexOfLastTodo = this.state.activePage * this.state.itemCountPerPage;
    const indexOfFirstTodo = indexOfLastTodo - this.state.itemCountPerPage;
    const renderedProjects = this.state.history.slice(
      indexOfFirstTodo,
      indexOfLastTodo
    );
    console.log(renderedProjects);

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
                  <h3 className="mb-0">History {this.state.searchBy}</h3>
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
                                this.setState({ searchBy: e.target.value });
                              }}
                            >
                              {/* <option value="">Pilih Kategori</option> */}
                              {[
                                "Absen",
                                "Izin",
                                "Cuti",
                                "Terlambat",
                                "Lembur",
                                "Pulang Cepat",
                              ].map((x) => (
                                <option value={x}>{x}</option>
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
                                this.setState({ status: e.target.value });
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
                                // readOnly: true,
                                disabled:
                                  parseInt(this.state.status) === 4 ||
                                  parseInt(this.state.status) === 5 ||
                                  parseInt(this.state.status) === 6
                                    ? false
                                    : true,
                              }}
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
                              timeFormat={false}
                              // value={startDate}
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
                  {/* {history.length === 0 ? (
                    ""
                  ) : this.state.checkId.length === 0 ? (
                    ""
                  ) : ( */}
                  <Col sm={{ span: 0 }} className="float-none">
                    {/* <ReactHTMLTableToExcel
                      id="eskport"
                      className="btn btn-primary"
                      table="ekspor"
                      filename={this.state.searchBy}
                      sheet={this.state.searchBy}
                      buttonText="Export To .xls"
                    /> */}
                    {/* <Button
                      color="primary"
                      size="md"
                      type="submit"
                      disable={loading ? "true" : "false"}
                      className="mr-2 m-1"
                      onClick={() => this.setState({ excelMode: true })}
                    >
                      <i className="fa fa-file-excel" />{" "}
                      {loading ? "Fetching..." : "Export Excel"}
                    </Button> */}
                    {/* <ReactHTMLTableToExcel
                      id="eskport"
                      className="btn btn-primary"
                      table="data"
                      filename="Absensi"
                      sheet="Absensi"
                      buttonText="Export To .xls"
                    />
                    <ExportExcel
                      table="data"
                      userId={this.props.match.params.id}
                      startDateExcelFrom={this.state.startDate}
                      status={this.state.status}
                    /> */}
                    {/* <Button
                      color="primary"
                      type="submit"
                      size="sm"
                      className="m-1"
                      disable={loading ? "true" : "false"}
                      // onClick={this.setState({ rejectAllMode: true })}
                    >
                      <i className="fa fa-times" />{" "}
                      {loading ? "Fetching..." : "Reject"}
                    </Button> */}
                  </Col>
                  {/* )} */}
                  {/* <input type="text" placeholder="input" /> */}
                </CardHeader>
                <Table
                  className="align-items-center table-flush"
                  id="ekspor"
                  responsive
                >
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">NIK</th>
                      <th scope="col">Nama</th>
                      <th scope="col">
                        {this.state.searchBy === "Absen"
                          ? "Tanggal Masuk"
                          : "Tanggal"}
                      </th>
                      {this.state.searchBy === "Absen" ? (
                        <th scope="col">Tanggal Keluar</th>
                      ) : (
                        <th hidden></th>
                      )}
                      {/* {this.state.searchBy === "Absen" ? ( */}
                      {/* <th hidden></th> */}
                      {/* ) : ( */}
                      <th scope="col">Status</th>
                      {/* )} */}
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <td colSpan={4} style={{ textAlign: "center" }}>
                        <Spinner
                          as="span"
                          cuti
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
                    ) : history.length < 1 ? (
                      <td colSpan={5} style={{ textAlign: "center" }}>
                        No data found...
                      </td>
                    ) : (
                      history.map((prop, key) => (
                        <tr>
                          <td>{prop.get("user").attributes.nik}</td>
                          <td>{prop.get("fullname")}</td>
                          <td>
                            {prop.get("lateTimes") !== undefined
                              ? convertDate(
                                  prop.get("lateTimes"),
                                  "DD/MM/YYYY HH:mm:ss"
                                )
                              : prop.get("absenMasuk") !== undefined
                              ? convertDate(
                                  prop.get("absenMasuk"),
                                  "DD/MM/YYYY HH:mm:ss"
                                )
                              : ""}
                          </td>
                          {this.state.searchBy === "Absen" ? (
                            <td>
                              {prop.get("absenKeluar") === undefined
                                ? "-"
                                : convertDate(
                                    prop.get("absenKeluar"),
                                    "DD/MM/YYYY HH:mm:ss"
                                  )}
                            </td>
                          ) : (
                            <td hidden></td>
                          )}
                          {this.state.searchBy === "Absen" ? (
                            <td
                              style={{
                                color: `${
                                  prop.get("lateTimes") === undefined ||
                                  prop.get("earlyTimes") === undefined ||
                                  prop.get("overtimeOut") === undefined
                                    ? "blue"
                                    : "red"
                                }`,
                              }}
                            >
                              {prop.get("lateTimes") !== undefined
                                ? "Terlambat"
                                : prop.get("earlyTimes") !== undefined
                                ? "Pulang Cepat"
                                : prop.get("overtimeOut") !== undefined
                                ? "Lembur"
                                : "Tepat Waktu"}
                            </td>
                          ) : (
                            <td
                              style={{
                                color: `${
                                  prop.get("status") === 0 ? "red" : "blue"
                                }`,
                              }}
                            >
                              {prop.get("status") === 3
                                ? "Menunggu konfirmasi"
                                : prop.get("status") === 0
                                ? "Rejected"
                                : "Approved"}
                            </td>
                          )}
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
                {/* <nav aria-label="Page navigation example"> */}
                {/* <Pagination
                    className="pagination justify-content-end"
                    listClassName="justify-content-end"
                    activePage={this.state.activePage}
                    itemsCountPerPage={this.state.itemCountPerPage}
                    totalItemsCount={history.length}
                    pageRangeDisplayed={this.state.pageRangeDisplayed}
                    onChange={this.handlePageChange}
                    itemClass="page-item"
                    linkClass="page-link"
                  > */}
                {/* <PaginationItem className="disabled">
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
                    </PaginationItem> */}
                {/* </Pagination>
                </nav> */}
              </Card>
            </div>
          </Row>
        </Container>

        <ModalHandler
          show={approvalMode}
          loading={loadingModal}
          footer={true}
          handleHide={() => this.toggle("approvalMode")}
          title="Approval Confirmation"
          body={`Approve lembur ${fullnames} ?`}
          handleSubmit={(e) => this.handleApproval(e, true)}
        />

        {/* reject modal */}
        <ModalHandler
          show={rejectMode}
          loading={loadingModal}
          footer={false}
          handleHide={() => this.toggle("rejectMode")}
          title="Reject Confirmation"
          body={
            <div>
              <h3 className="mb-4">{`Reject lembur ${fullnames} ?`}</h3>
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

        <ModalHandler
          show={approveAllMode}
          loading={loadingModal}
          footer={false}
          handleHide={() => this.toggle("approveAllMode")}
          title="Approve Confirmation"
          body={
            <div>
              <h3 className="mb-4">{`Approve lembur ${this.state.checkId.length} data ?`}</h3>
            </div>
          }
          handleSubmit={this.approveChecked}
        />

        <ModalHandler
          show={rejectAllMode}
          loading={loadingModal}
          footer={false}
          handleHide={() => this.toggle("rejectAllMode")}
          title="Reject Confirmation"
          body={
            <div>
              <h3 className="mb-4">{`Reject lembur ${this.state.checkId.length} data ?`}</h3>
              <Form onSubmit={this.rejectChecked}>
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
          handleSubmit={this.rejectChecked}
        />

        {/* Export Excel */}
        <ModalHandler
          show={excelMode}
          loading={loadingModal}
          footer={false}
          handleHide={() => this.setState({ excelMode: false })}
          title="Export Excel"
          body={
            <Form>
              <div className="col-md-12 col-sm-12">
                <FormGroup>
                  <InputGroup className="input-group-alternative">
                    <Input
                      type="select"
                      className="fa-pull-right"
                      onChange={(e) => {
                        this.setState({ status: e.target.value });
                      }}
                      required={true}
                    >
                      <option value="">Pilih Waktu</option>
                      {[4, 5, 6, 7].map((x) => (
                        <option value={x}>{handleSelect(x)}</option>
                      ))}
                    </Input>
                  </InputGroup>
                </FormGroup>
              </div>
              <div className="col-md-12 col-sm-12">
                <FormGroup>
                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-calendar-grid-58" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <ReactDatetime
                      inputProps={{
                        placeholder: "Pilih Tanggal",
                        required: true,
                        disabled:
                          parseInt(this.state.status) === 4 ||
                          parseInt(this.state.status) === 5 ||
                          parseInt(this.state.status) === 6 ||
                          parseInt(this.state.status) === 7
                            ? false
                            : true,
                      }}
                      viewMode={
                        parseInt(this.state.status) === 5
                          ? "days"
                          : parseInt(this.state.status) === 6
                          ? "months"
                          : "days"
                      }
                      dateFormat={
                        parseInt(this.state.status) === 6
                          ? "MM/YYYY"
                          : "MM/DD/YYYY"
                      }
                      timeFormat={false}
                      // value={startDate}
                      onChange={(e) => {
                        this.setState({
                          startDateExcelFrom: e.toDate(),
                        });
                      }}
                    />
                  </InputGroup>
                </FormGroup>
              </div>
              {parseInt(this.state.status) === 7 ? (
                <div className="col-md-12 col-sm-12">
                  <FormGroup>
                    <InputGroup className="input-group-alternative">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="ni ni-calendar-grid-58" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <ReactDatetime
                        inputProps={{
                          placeholder: "Pilih Tanggal",
                          required: true,
                          disabled:
                            parseInt(this.state.status) === 4 ||
                            parseInt(this.state.status) === 5 ||
                            parseInt(this.state.status) === 6 ||
                            parseInt(this.state.status) === 7
                              ? false
                              : true,
                        }}
                        viewMode={
                          parseInt(this.state.status) === 5
                            ? "days"
                            : parseInt(this.state.status) === 6
                            ? "months"
                            : "days"
                        }
                        dateFormat={
                          parseInt(this.state.status) === 6
                            ? "MM/YYYY"
                            : "MM/DD/YYYY"
                        }
                        timeFormat={false}
                        // value={startDate}
                        onChange={(e) => {
                          this.setState({
                            startDateExcelTo: e.toDate(),
                          });
                        }}
                      />
                    </InputGroup>
                  </FormGroup>
                </div>
              ) : (
                ""
              )}
              {/* <div className="col-sm-12 col-md-12">
                <h6 style={{ color: "red" }}>
                  Ket : Kosong kan Tanggal & Pilih Waktu Apabila Ingin Export
                  Seluruh Data
                </h6>
              </div> */}
              <ReactHTMLTableToExcel
                id="eskport"
                className="btn btn-primary"
                table="data"
                filename="Absensi"
                sheet="Absensi"
                buttonText="Export To .xls"
              />
              <ExportExcel
                table="data"
                userId={this.props.match.params.id}
                startDateExcelFrom={this.state.startDate}
                status={this.state.status}
              />
            </Form>
          }
          // handleSubmit={}
        />
      </React.Fragment>
    );
  }
}

export default ViewHistory;
