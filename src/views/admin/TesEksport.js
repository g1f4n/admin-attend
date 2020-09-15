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
  Form,
  FormGroup,
  Input,
  Col,
  InputGroup,
  InputGroupAddon,
  InputGroupText
} from 'reactstrap';
// core components
import Header from 'components/Headers/Header.js';
import Parse from 'parse';
import ReactDatetime from 'react-datetime';
import moment from 'moment';
import { getLeaderId } from 'utils';
import ModalHandler from 'components/Modal/Modal';
import { convertDate } from 'utils';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import _ from 'lodash/lang';
import { handleSelect } from 'utils';

class TesEksport extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      daftarStaff: [],
      absence: [],
      tableData: [],
      fileData: [],
      excelMode: false,
      loading: false,
      approvalMode: false,
      rejectMode: false,
      counter: 0,
      loadingModal: false,
      fullnames: '',
      userId: '',
      userIndex: 0,
      reason: '',
      checkId: [],
      approveAllMode: false,
      rejectAllMode: false,
      deleteCounter: 0,
      searchBy: 'all',
      searchValue: '',
      resPerPage: 20,
      page: 1,
      totalData: 0,
      employeeName: [],
      employeeID: [],
      employeeDepartment: [],
      employeeTitle: []
    };
  }

  componentDidMount() {
    this.getData();
  }

  getData = (pageNumber = 1) => {
    this.setState({ loadingFilter: true });
    const { searchBy, searchValue } = this.state;
    const { resPerPage, page } = this.state;

    const User = new Parse.User();
    const query = new Parse.Query(User);

    query.notContainedIn('roles', ['admin', 'leader', 'Admin', 'Leader']);
    query.skip(resPerPage * pageNumber - resPerPage);
    query.limit(resPerPage);
    query.withCount();

    switch (searchBy) {
      case 'all':
        query
          .find({ useMasterKey: true })
          .then((x) => {
            x.results.map((y) => (y.select = false));
            this.setState({
              daftarStaff: x.results,
              totalData: x.count,
              loadingFilter: false
            });
          })
          .catch((err) => {
            this.setState({ loadingFilter: false });
            alert('cek koneksi anda');
          });
        break;

      case 'name':
        query.matches('fullname', searchValue, 'i');
        query
          .find({ useMasterKey: true })
          .then((x) => {
            x.results.map((y) => (y.select = false));
            this.setState({
              daftarStaff: x.results,
              totalData: x.count,
              loadingFilter: false
            });
          })
          .catch((err) => {
            this.setState({ loadingFilter: false });
            alert('cek koneksi anda');
          });
        break;

      case 'nik':
        query.equalTo('nik', searchValue);
        query
          .find({ useMasterKey: true })
          .then((x) => {
            x.results.map((y) => (y.select = false));
            this.setState({
              daftarStaff: x.results,
              totalData: x.count,
              loadingFilter: false
            });
          })
          .catch((err) => {
            this.setState({ loadingFilter: false });
            alert('cek koneksi anda');
          });
        break;

      case 'divisi':
        query.matches('posisi', searchValue, 'i');
        query
          .find({ useMasterKey: true })
          .then((x) => {
            x.results.map((y) => (y.select = false));
            this.setState({
              daftarStaff: x.results,
              totalData: x.count,
              loadingFilter: false
            });
          })
          .catch((err) => {
            this.setState({ loadingFilter: false });
            alert('cek koneksi anda');
          });
        break;

      case 'leader':
        const leader = new Parse.User();
        const leaderQuery = new Parse.Query(leader);
        leaderQuery.matches('fullname', searchValue, 'i');

        query.matchesQuery('leaderIdNew', leaderQuery);
        query
          .find({ useMasterKey: true })
          .then((x) => {
            x.results.map((y) => (y.select = false));
            this.setState({
              daftarStaff: x.results,
              totalData: x.count,
              loadingFilter: false
            });
          })
          .catch((err) => {
            this.setState({ loadingFilter: false });
            alert('cek koneksi anda');
          });
        break;
      default:
        break;
    }
  };

  closeLoading = () => {
    this.setState({ loadingModal: false });
  };

  handleApproval = (e, approvalMode) => {
    e.preventDefault();
    this.setState({ loadingModal: true });
    const Izin = Parse.Object.extend('Izin');
    const query = new Parse.Query(Izin);

    query
      .get(this.state.userId)
      .then((x) => {
        x.set('status', approvalMode ? 1 : 0);
        if (!approvalMode) x.set('alasanReject', this.state.reason);
        x.save()
          .then(() => {
            let newArr = [...this.state.izin];
            newArr.splice(this.state.userIndex, 1);
            this.setState({
              counter: this.state.counter + 1,
              izin: newArr,
              [approvalMode ? 'approvalMode' : 'rejectMode']: false,
              loadingModal: false
            });
            alert(`Berhasil ${approvalMode ? 'approve' : 'reject'}`);
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
      [state]: !this.state[state]
    });
  };

  handleAllCheck = (e) => {
    let daftarStaff = this.state.daftarStaff;
    let collecId = [];
    let fileData = [];

    daftarStaff.map((x, index) => {
      x.select = e.target.checked;
      if (x.select) {
        collecId.push(x.id);
        fileData.push({ fileName: x.get('fullname'), tableId: `ekspor${index}` });
      } else {
        collecId = [];
        fileData = [];
      }

      return x;
    });

    this.setState({ daftarStaff: daftarStaff, checkId: collecId, fileData: fileData }, () =>
      console.log(this.state.checkId)
    );
  };

  handleChildCheck = (e) => {
    let { daftarStaff } = this.state;
    const { checkId, fileData } = this.state;
    let checked = e.target.value;
    daftarStaff.map((x, index) => {
      console.log('bandingkan', x.id === e.target.value);
      if (x.id === e.target.value) {
        console.log('sama');
        x.select = e.target.checked;
        if (x.select) {
          this.setState(
            (prevState) => ({
              checkId: [...this.state.checkId, checked],
              fileData: [
                ...this.state.fileData,
                { fileName: x.get('fullname'), tableId: `ekspor${index}` }
              ]
            }),
            () => {
              console.log(this.state.checkId);
              console.log(this.state.fileData);
            }
          );
        } else {
          const index = checkId.indexOf(checked);
          const fileDataIndex = fileData
            .map((x) => {
              return x.fileName;
            })
            .indexOf(x.get('fullname'));
          if (index > -1 || fileDataIndex > -1) {
            checkId.splice(index, 1);
            fileData.splice(fileDataIndex, 1);
            this.setState(
              (prevState) => ({
                checkId: checkId,
                fileData: fileData
              }),
              () => {
                console.log(this.state.checkId);
                console.log(this.state.fileData);
              }
            );
          }
        }
      }
    });

    this.setState({ daftarStaff: daftarStaff });
  };

  handleApproveAll = (e) => {
    this.setState({ loading: true });
    const Izin = Parse.Object.extend('Izin');
    const query = new Parse.Query(Izin);

    query.get(e).then((x) => {
      x.set('status', 1);
      x.save().then(() => {
        const newArr = [...this.state.izin];
        newArr.splice(this.state.userIndex, 1);
        this.setState({
          izin: newArr,
          counter: this.state.counter + 1,
          approvalMode: false,
          loading: false
        });
      });
    });
  };

  handleRejectAll = (e) => {
    this.setState({ loading: true });
    const Izin = Parse.Object.extend('Izin');
    const query = new Parse.Query(Izin);

    query.get(e).then((x) => {
      x.set('status', 0);
      x.set('alasanReject', this.state.reason);
      x.save().then(() => {
        const newArr = [...this.state.izin];
        newArr.splice(this.state.userIndex, 1);
        this.setState({
          counter: this.state.counter + 1,
          izin: newArr
        });
      });
    });
  };

  approveChecked = (e) => {
    this.setState({ loadingModal: true });
    const { checkId } = this.state;
    let totalData = 0;

    checkId.map((id) => {
      const Izin = Parse.Object.extend('Izin');
      const query = new Parse.Query(Izin);

      query.get(id).then((x) => {
        x.set('status', 1);
        x.save().then(() => {
          totalData = totalData + 1;
          if (totalData === checkId.length) {
            alert('Berhasil reject');
            return window.location.reload(false);
          }
        });
      });
    });

    this.setState({ loadingModal: false });
  };

  getDataAbsen = (e) => {
    e.preventDefault();
    this.setState({ loading: true });
    this.setState({ absence: [], tableData: [] });
    const { checkId } = this.state;
    const nullData = 'DATA TIDAK DITEMUKAN';
    let totalData = 0;

    if (parseInt(this.state.status) === 4) {
      checkId.map((id) => {
        const Absence = Parse.Object.extend('Absence');
        const query = new Parse.Query(Absence);
        const d = new Date();
        const start = new moment(this.state.startDate);
        start.startOf('day');
        const finish = new moment(start);
        finish.add(1, 'day');

        query.equalTo('user', {
          __type: 'Pointer',
          className: '_User',
          objectId: id
        });
        query.ascending('createdAt');
        query.greaterThanOrEqualTo('createdAt', start.toDate());
        query.lessThan('createdAt', finish.toDate());
        query.include('user');
        query
          .find()
          .then((x) => {
            console.log('user', x);
            let newArr = [...this.state.absence];
            newArr.splice(totalData, 0, x);
            let tableArr = [...this.state.tableData];
            tableArr.splice(totalData, 0, {
              fileName: _.isEmpty(x[0])
                ? this.state.fileData[totalData].fileName
                : x[0].get('fullname'),
              tableId: `ekspor${totalData}`
            });
            this.setState({
              absence: newArr,
              tableData: tableArr,
              employeeName: _.isEmpty(x)
                ? this.state.employeeName.concat(nullData)
                : this.state.employeeName.concat(x[0].get('fullname')),
              employeeID: _.isEmpty(x)
                ? this.state.employeeID.concat(nullData)
                : this.state.employeeID.concat(x[0].get('user').attributes.nik),
              employeeTitle: _.isEmpty(x)
                ? this.state.employeeTitle.concat(nullData)
                : this.state.employeeTitle.concat(x[0].get('user').attributes.level),
              employeeDepartment: _.isEmpty(x)
                ? this.state.employeeDepartment.concat(nullData)
                : this.state.employeeDepartment.concat(x[0].get('user').attributes.posisi)
            });
            totalData = totalData + 1;
            if (totalData === checkId.length) {
              this.setState({ loading: false });
            }
          })
          .catch((err) => {
            alert(err.message);
            this.setState({ loading: false });
          });
      });
    } else if (parseInt(this.state.status) === 5) {
      checkId.map((id) => {
        const Absence = Parse.Object.extend('Absence');
        const query = new Parse.Query(Absence);
        const d = new Date();
        const start = new moment(this.state.startDate);
        start.startOf('week');
        const finish = new moment(start);
        finish.add(1, 'week');

        query.equalTo('user', {
          __type: 'Pointer',
          className: '_User',
          objectId: id
        });
        query.ascending('createdAt');
        query.greaterThanOrEqualTo('createdAt', start.toDate());
        query.lessThan('createdAt', finish.toDate());
        query.include('user');
        query
          .find()
          .then((x) => {
            console.log('user', x);
            let newArr = [...this.state.absence];
            newArr.splice(totalData, 0, x);
            let tableArr = [...this.state.tableData];
            tableArr.splice(totalData, 0, {
              fileName: _.isEmpty(x[0])
                ? this.state.fileData[totalData].fileName
                : x[0].get('fullname'),
              tableId: `ekspor${totalData}`
            });
            this.setState({
              absence: newArr,
              loading: false,
              tableData: tableArr,
              employeeName: _.isEmpty(x)
                ? this.state.employeeName.concat(nullData)
                : this.state.employeeName.concat(x[0].get('fullname')),
              employeeID: _.isEmpty(x)
                ? this.state.employeeID.concat(nullData)
                : this.state.employeeID.concat(x[0].get('user').attributes.nik),
              employeeTitle: _.isEmpty(x)
                ? this.state.employeeTitle.concat(nullData)
                : this.state.employeeTitle.concat(x[0].get('user').attributes.level),
              employeeDepartment: _.isEmpty(x)
                ? this.state.employeeDepartment.concat(nullData)
                : this.state.employeeDepartment.concat(x[0].get('user').attributes.posisi)
            });
            totalData = totalData + 1;
            if (totalData === checkId.length) {
              this.setState({ loading: false });
            }
          })
          .catch((err) => {
            alert(err.message);
            this.setState({ loading: false });
          });
      });
    } else if (parseInt(this.state.status) === 6) {
      checkId.map((id) => {
        const Absence = Parse.Object.extend('Absence');
        const query = new Parse.Query(Absence);
        const d = new Date();
        const start = new moment(this.state.startDate);
        start.startOf('month');
        const finish = new moment(start);
        finish.add(1, 'month');

        query.equalTo('user', {
          __type: 'Pointer',
          className: '_User',
          objectId: id
        });
        query.ascending('createdAt');
        query.greaterThanOrEqualTo('createdAt', start.toDate());
        query.lessThan('createdAt', finish.toDate());
        query.include('user');
        query
          .find()
          .then((x) => {
            console.log('user', x);
            let newArr = [...this.state.absence];
            newArr.splice(totalData, 0, x);
            let tableArr = [...this.state.tableData];
            tableArr.splice(totalData, 0, {
              fileName: _.isEmpty(x[0])
                ? this.state.fileData[totalData].fileName
                : x[0].get('fullname'),
              tableId: `ekspor${totalData}`
            });
            this.setState({
              absence: newArr,
              loading: false,
              tableData: tableArr,
              employeeName: _.isEmpty(x)
                ? this.state.employeeName.concat(nullData)
                : this.state.employeeName.concat(x[0].get('fullname')),
              employeeID: _.isEmpty(x)
                ? this.state.employeeID.concat(nullData)
                : this.state.employeeID.concat(x[0].get('user').attributes.nik),
              employeeTitle: _.isEmpty(x)
                ? this.state.employeeTitle.concat(nullData)
                : this.state.employeeTitle.concat(x[0].get('user').attributes.level),
              employeeDepartment: _.isEmpty(x)
                ? this.state.employeeDepartment.concat(nullData)
                : this.state.employeeDepartment.concat(x[0].get('user').attributes.posisi)
            });
            totalData = totalData + 1;
            if (totalData === checkId.length) {
              this.setState({ loading: false });
            }
          })
          .catch((err) => {
            alert(err.message);
            this.setState({ loading: false });
          });
      });
    } else if (parseInt(this.state.status) === 7) {
      checkId.map((id) => {
        const Absence = Parse.Object.extend('Absence');
        const query = new Parse.Query(Absence);
        const d = new Date();
        const start = new moment(this.state.startDate);
        //start.startOf('month');
        const finish = new moment(this.state.endDate);
        //finish.add(1, 'month');

        query.equalTo('user', {
          __type: 'Pointer',
          className: '_User',
          objectId: id
        });
        query.ascending('createdAt');
        query.greaterThanOrEqualTo('createdAt', start.toDate());
        query.lessThan('createdAt', finish.toDate());
        query.include('user');
        query
          .find()
          .then((x) => {
            console.log('user', x);
            let newArr = [...this.state.absence];
            newArr.splice(totalData, 0, x);
            let tableArr = [...this.state.tableData];
            tableArr.splice(totalData, 0, {
              fileName: _.isEmpty(x[0])
                ? this.state.fileData[totalData].fileName
                : x[0].get('fullname'),
              tableId: `ekspor${totalData}`
            });
            this.setState(
              {
                absence: newArr,
                loading: false,
                tableData: tableArr,
                employeeName: _.isEmpty(x)
                  ? this.state.employeeName.concat(nullData)
                  : this.state.employeeName.concat(x[0].get('fullname')),
                employeeID: _.isEmpty(x)
                  ? this.state.employeeID.concat(nullData)
                  : this.state.employeeID.concat(x[0].get('user').attributes.nik),
                employeeTitle: _.isEmpty(x)
                  ? this.state.employeeTitle.concat(nullData)
                  : this.state.employeeTitle.concat(x[0].get('user').attributes.level),
                employeeDepartment: _.isEmpty(x)
                  ? this.state.employeeDepartment.concat(nullData)
                  : this.state.employeeDepartment.concat(x[0].get('user').attributes.posisi)
              },
              () => {
                console.log(this.state.absence);
                console.log(this.state.tableData);
              }
            );
            totalData = totalData + 1;
            if (totalData === checkId.length) {
              this.setState({ loading: false });
            }
          })
          .catch((err) => {
            alert(err.message);
            this.setState({ loading: false });
          });
      });
    }

    // checkId.map((id) => {
    //   const Absence = Parse.Object.extend('Absence');
    //   const query = new Parse.Query(Absence);

    //   //const id = this.props.match.params.id;

    //   const nullData = 'Data tidak ditemukan';

    //   const d = new Date();
    //   const start = new moment(d);
    //   start.startOf('day');
    //   const finish = new moment(start);
    //   finish.add(1, 'day');

    //   query.equalTo('user', {
    //     __type: 'Pointer',
    //     className: '_User',
    //     objectId: id
    //   });
    //   query.ascending('absenMasuk');
    //   // query.greaterThanOrEqualTo('createdAt', start.toDate());
    //   // query.lessThan('createdAt', finish.toDate());
    //   query.notContainedIn('roles', [ 'admin', 'Admin', 'leader', 'Leader' ]);
    //   query.include('user');
    //   query
    //     .find()
    //     .then((x) => {
    //       console.log('user', x);
    //       let newArr = [ ...this.state.absence ];
    //       newArr.splice(totalData, 0, x);
    //       let tableArr = [ ...this.state.tableData ];
    //       tableArr.splice(totalData, 0, {
    //         fileName: x[0].get('fullname'),
    //         tableId: `ekspor${totalData}`
    //       });
    //       this.setState(
    //         {
    //           absence: newArr,
    //           tableData: tableArr,
    //           loading: false
    //           // employeeName: _.isEmpty(x) ? nullData : x[0].get('fullname'),
    //           // employeeID: _.isEmpty(x) ? nullData : x[0].get('user').attributes.nik,
    //           // employeeTitle: _.isEmpty(x) ? nullData : x[0].get('user').attributes.level,
    //           // employeeDepartment: _.isEmpty(x) ? nullData : x[0].get('user').attributes.posisi
    //         },
    //         () => {
    //           console.log(this.state.absence);
    //           console.log(this.state.tableData);
    //         }
    //       );
    //       totalData = totalData + 1;
    //       if (totalData === checkId.length) {
    //         alert('Berhasil check');
    //       }
    //     })
    //     .catch((err) => {
    //       alert(err.message);
    //       this.setState({ loading: false });
    //     });
    // });
  };

  subtractHourLate = (workingHour, duttyOn, typeTime) => {
    let resultHours;
    // Jam terlambat masuk
    if (typeTime === 'Late') {
      if (duttyOn > workingHour) {
        resultHours = duttyOn - workingHour;
      }
    }

    // jam lembur / overtime
    if (typeTime === 'Overtime') {
      if (duttyOn > workingHour) {
        resultHours = duttyOn - workingHour;
      }
    }

    // jam early leave / pulang cepat
    if (typeTime === 'EarlyLeave') {
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

  rejectChecked = (e) => {
    e.preventDefault();
    this.setState({ loadingModal: true });
    const { checkId } = this.state;
    let totalData = 0;

    checkId.map((id) => {
      const Izin = Parse.Object.extend('Izin');
      const query = new Parse.Query(Izin);

      query.get(id).then((x) => {
        x.set('status', 1);
        x.set('alasanReject', this.state.reason);
        x.save().then(() => {
          totalData = totalData + 1;
          if (totalData === checkId.length) {
            alert('Berhasil reject');
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
      daftarStaff,
      loading,
      approvalMode,
      rejectMode,
      loadingModal,
      fullnames,
      counter,
      approveAllMode,
      rejectAllMode
    } = this.state;

    return (
      <React.Fragment>
        <Header izin={counter} />
        {/* Page content */}
        <Container className="mt--7" fluid>
          {/* Table */}
          <Row>
            <div className="col">
              <Card className="shadow">
                <CardHeader className="border-0">
                  <h3 className="mb-2">Export data karyawan</h3>

                  {daftarStaff.length === 0 ? (
                    ''
                  ) : this.state.checkId.length === 0 ? (
                    ''
                  ) : (
                    <Col sm={{ span: 0 }} className="float-none">
                      <Button
                        color="primary"
                        type="submit"
                        size="sm"
                        className="m-1"
                        disable={loading ? 'true' : 'false'}
                        onClick={() => this.setState({ excelMode: true })}
                      >
                        <i className="ni ni-single-copy-04" /> Export to excel
                      </Button>
                    </Col>
                  )}
                  {/* <input type="text" placeholder="input" /> */}
                </CardHeader>
                <Table className="align-items-center table-flush" responsive id="ekspor">
                  <thead className="thead-light">
                    <tr>
                      <th>
                        <input type="checkbox" onChange={this.handleAllCheck} />
                      </th>
                      <th scope="col">NIK</th>
                      <th scope="col">Nama</th>
                      <th scope="col">Level</th>
                      <th scope="col">Divisi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <td colSpan={6} style={{ textAlign: 'center' }}>
                        <Spinner
                          as="span"
                          cuti
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
                    ) : daftarStaff.length < 1 ? (
                      <td colSpan={6} style={{ textAlign: 'center' }}>
                        No data found...
                      </td>
                    ) : (
                      daftarStaff.map((prop, key) => (
                        <tr>
                          <td>
                            <input
                              type="checkbox"
                              value={prop.id}
                              checked={prop.select}
                              onChange={this.handleChildCheck}
                            />
                          </td>
                          <td>{prop.get('nik')}</td>
                          <td>{prop.get('fullname')}</td>
                          <td>{prop.get('level')}</td>
                          <td>{prop.get('posisi')}</td>
                          {/* <td>
                            <Button
                              id="t1"
                              color="primary"
                              className="btn-circle"
                              onClick={() => {
                                this.setState({
                                  approvalMode: true,
                                  userId: prop.id,
                                  userIndex: key,
                                  fullnames: prop.get('fullname')
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
                              className="btn-circle btn-danger"
                              onClick={(e) => {
                                this.setState({
                                  rejectMode: true,
                                  userId: prop.id,
                                  userIndex: key,
                                  fullnames: prop.get('fullname')
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
                          </td> */}
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </Card>
              <Card>
                {this.state.absence.map((rowResult, index) => (
                  <Table responsive className="mt-4" id={`ekspor${index}`} hidden>
                    <thead>
                      <tr>
                        <th scope="col" style={{ border: 'none' }}>
                          Fingerprint ID
                        </th>
                        <th scope="col" style={{ border: 'none' }}>
                          {this.state.employeeID[index]}
                        </th>
                      </tr>
                    </thead>
                    <thead className="border-0">
                      <tr>
                        <th scope="col" style={{ border: 'none' }}>
                          Employee Name
                        </th>
                        <th scope="col" style={{ border: 'none' }}>
                          {this.state.employeeName[index]}
                        </th>
                      </tr>
                    </thead>
                    <thead className="border-0">
                      <tr>
                        <th scope="col" style={{ border: 'none' }}>
                          Employee Title
                        </th>
                        <th scope="col" style={{ border: 'none' }}>
                          {this.state.employeeTitle[index]}
                        </th>
                      </tr>
                    </thead>
                    <thead className="border-0 mb-2">
                      <tr>
                        <th scope="col" style={{ border: 'none' }}>
                          Department Title
                        </th>
                        <th scope="col" className="mb-2" style={{ border: 'none' }}>
                          {this.state.employeeDepartment[index]}
                        </th>
                      </tr>
                    </thead>
                    <thead className="thead-light" style={{ textAlign: 'center' }}>
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
                    <tbody>
                      {rowResult.length < 1 ? (
                        <tr>
                          <td colSpan={14} style={{ textAlign: 'center' }}>
                            Data absen tidak ditemukan
                          </td>
                        </tr>
                      ) : (
                        rowResult.map((prop) => (
                          <tr>
                            {/* Day */}
                            <td>{convertDate(prop.get('absenMasuk'), 'ddd')}</td>

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
                              {convertDate(prop.get('absenMasuk'), 'DD/MM/YYYY')}
                            </td>

                            {/* Working Hour */}
                            <td>
                              {`${prop.get('user').attributes.jamMasuk < 10 ? '0' : ''}${
                                prop.get('user').attributes.jamMasuk
                              }:00` +
                                ' - ' +
                                `${prop.get('user').attributes.jamKeluar}:00`}
                            </td>

                            {/* Dutty On Hours */}
                            <td
                              style={{
                                color: prop.get('lateTimes') !== undefined ? 'red' : ''
                              }}
                            >
                              {/* {prop.className === "Late"
                      ? convertDate(prop.get("time"), "k")
                      : prop.className === "Absence"
                      ? convertDate(prop.get("absenMasuk"), "k")
                      : ""} */}
                              {prop.get('lateTimes') !== undefined
                                ? convertDate(prop.get('lateTimes'), 'k')
                                : convertDate(prop.get('absenMasuk'), 'k')}
                            </td>

                            {/* Dutty On Minutes */}
                            <td
                              style={{
                                color: prop.get('lateTimes') !== undefined ? 'red' : ''
                              }}
                            >
                              {/* {prop.className === "Late"
                      ? convertDate(prop.get("time"), "m")
                      : prop.className === "Absence"
                      ? convertDate(prop.get("absenMasuk"), "m")
                      : ""} */}
                              {prop.get('lateTimes') !== undefined
                                ? convertDate(prop.get('lateTimes'), 'm')
                                : convertDate(prop.get('absenMasuk'), 'm')}
                            </td>

                            {/* Dutty Off Hours */}
                            <td
                              style={{
                                color: prop.get('earlyTimes') !== undefined ? 'red' : ''
                              }}
                            >
                              {/* {prop.className === "Overtime"
                      ? convertDate(prop.get("time"), "k")
                      : prop.className === "EarlyLeave"
                      ? convertDate(prop.get("time"), "k")
                      : prop.className === "Absence"
                      ? convertDate(prop.get("absenKeluar"), "k")
                      : ""} */}
                              {prop.get('earlyTimes') !== undefined
                                ? convertDate(prop.get('earlyTimes'), 'k')
                                : convertDate(prop.get('absenKeluar'), 'k')}
                            </td>

                            {/* Dutty off Minutes */}
                            <td
                              style={{
                                color: prop.get('earlyTimes') !== undefined ? 'red' : ''
                              }}
                            >
                              {/* {prop.className === "Overtime"
                      ? convertDate(prop.get("time"), "m")
                      : prop.className === "EarlyLeave"
                      ? convertDate(prop.get("time"), "m")
                      : prop.className === "Absence"
                      ? convertDate(prop.get("absenKeluar"), "m")
                      : ""} */}
                              {prop.get('earlyTimes') !== undefined
                                ? convertDate(prop.get('earlyTimes'), 'm')
                                : convertDate(prop.get('absenKeluar'), 'm')}
                            </td>

                            {/* Late In Hours */}
                            <td>
                              {prop.get('lateTimes') === undefined
                                ? ''
                                : this.subtractHourLate(
                                    prop.get('user').attributes.jamMasuk,
                                    convertDate(prop.get('lateTimes'), 'k'),
                                    'Late'
                                  )}
                            </td>

                            {/* Late In Minutes */}
                            <td>
                              {prop.get('lateTimes') === undefined
                                ? ''
                                : this.subtractHourLate(
                                    0,
                                    convertDate(prop.get('lateTimes'), 'm'),
                                    'Late'
                                  )}
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
                              {prop.get('earlyTimes') === undefined
                                ? ''
                                : moment
                                    .duration(
                                      `${prop.get('user').attributes.jamKeluar}:00`,
                                      'HH:mm'
                                    )
                                    .subtract(
                                      moment.duration(
                                        convertDate(prop.get('earlyTimes'), 'HH:mm'),
                                        'HH:mm'
                                      )
                                    )
                                    .hours()}
                            </td>

                            {/* Early Derparture Minutes */}
                            <td>
                              {prop.get('earlyTimes') === undefined
                                ? ''
                                : moment
                                    .duration(
                                      `${prop.get('user').attributes.jamKeluar}:00`,
                                      'HH:mm'
                                    )
                                    .subtract(
                                      moment.duration(
                                        convertDate(prop.get('earlyTimes'), 'HH:mm'),
                                        'HH:mm'
                                      )
                                    )
                                    .minutes()}
                            </td>

                            {/* Over Time Hours */}
                            <td>
                              {prop.get('overtimeIn') === undefined &&
                              prop.get('overtimeOut') === undefined
                                ? ''
                                : moment
                                    .duration(
                                      convertDate(prop.get('overtimeOut'), 'HH:mm'),
                                      'HH:mm'
                                    )
                                    .subtract(
                                      moment.duration(
                                        convertDate(prop.get('overtimeIn'), 'HH:mm'),
                                        'HH:mm'
                                      )
                                    )
                                    .hours()}
                            </td>

                            {/* Over Time Minutes */}
                            <td>
                              {prop.get('overtimeIn') === undefined &&
                              prop.get('overtimeOut') === undefined
                                ? ''
                                : moment
                                    .duration(
                                      convertDate(prop.get('overtimeOut'), 'HH:mm'),
                                      'HH:mm'
                                    )
                                    .subtract(
                                      moment.duration(
                                        convertDate(prop.get('overtimeIn'), 'HH:mm'),
                                        'HH:mm'
                                      )
                                    )
                                    .minutes()}
                            </td>

                            {/* Total Hour Hours */}
                            <td>
                              {moment
                                .duration(
                                  prop.get('earlyTimes') !== undefined
                                    ? convertDate(prop.get('earlyTimes'), 'HH:mm')
                                    : prop.get('overtimeOut') !== undefined
                                    ? convertDate(prop.get('overtimeOut'), 'HH:mm')
                                    : prop.get('absenKeluar') !== undefined
                                    ? convertDate(prop.get('absenKeluar'), 'HH:mm')
                                    : '',
                                  'HH:mm'
                                )
                                .subtract(
                                  moment.duration(
                                    prop.get('lateTimes') !== undefined
                                      ? convertDate(prop.get('lateTimes'), 'HH:mm')
                                      : convertDate(prop.get('absenMasuk'), 'HH:mm'),
                                    'HH:mm'
                                  )
                                )
                                .hours()}
                            </td>
                            {/* <td>{prop.get("fullname")}</td> */}

                            {/* Total Hour Minutes */}
                            <td>
                              {moment
                                .duration(
                                  prop.get('earlyTimes') !== undefined
                                    ? convertDate(prop.get('earlyTimes'), 'HH:mm')
                                    : prop.get('overtimeOut') !== undefined
                                    ? convertDate(prop.get('overtimeOut'), 'HH:mm')
                                    : prop.get('absenKeluar') !== undefined
                                    ? convertDate(prop.get('absenKeluar'), 'HH:mm')
                                    : '',
                                  'HH:mm'
                                )
                                .subtract(
                                  moment.duration(
                                    prop.get('lateTimes') !== undefined
                                      ? convertDate(prop.get('lateTimes'), 'HH:mm')
                                      : convertDate(prop.get('absenMasuk'), 'HH:mm'),
                                    'HH:mm'
                                  )
                                )
                                .minutes()}
                            </td>

                            {/* Notes */}
                            <td>
                              {prop.get('overtimeIn') !== undefined
                                ? 'Working Overtime'
                                : 'Working Hour'}
                            </td>
                          </tr>
                        ))
                      )}
                      <tr>
                        <td colSpan="7">Total</td>
                        <td />
                        <td />
                        <td />
                        <td />
                        <td />
                        <td />
                        <td />
                        <td />
                        <td />
                      </tr>
                    </tbody>
                  </Table>
                ))}
              </Card>
            </div>
          </Row>
        </Container>

        <ModalHandler
          size="lg"
          show={this.state.excelMode}
          loading={loadingModal}
          footer={true}
          disabled={this.state.tableData.length < 1}
          handleHide={() => {
            this.toggle('excelMode');
            this.setState({ tableData: [] });
          }}
          title={`Export ${this.state.checkId.length} data to excel`}
          body={
            <div>
              <Form role="form" onSubmit={this.getDataAbsen} className="mt-3">
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
                              status: e.target.value
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
                              parseInt(this.state.status) === 7 ? 'Set start date' : 'Set tanggal'
                            }`,
                            required: true,
                            readOnly: true
                          }}
                          timeFormat={false}
                          viewMode={parseInt(this.state.status) === 6 ? 'months' : 'days'}
                          dateFormat={parseInt(this.state.status) === 6 ? 'MM/YYYY' : 'MM/DD/YYYY'}
                          value={this.state.startDate}
                          onChange={(e) => {
                            this.setState({
                              startDate: e.toDate()
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
                              placeholder: 'Set end date',
                              required: true,
                              readOnly: true
                            }}
                            timeFormat={false}
                            viewMode={parseInt(this.state.status) === 6 ? 'months' : 'days'}
                            dateFormat={
                              parseInt(this.state.status) === 6 ? 'MM/YYYY' : 'MM/DD/YYYY'
                            }
                            value={this.state.endDate}
                            onChange={(e) => {
                              this.setState({
                                endDate: e.toDate()
                              });
                            }}
                          />
                        </InputGroup>
                      </FormGroup>
                    </div>
                  ) : (
                    ''
                  )}
                  <div className="text-center mt--4">
                    <Button className="my-4" color="primary" type="submit" disabled={loading}>
                      {loading ? (
                        <div>
                          <Spinner
                            as="span"
                            animation="grow"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                          />{' '}
                          Loading
                        </div>
                      ) : (
                        'Search'
                      )}
                    </Button>
                  </div>
                </div>
              </Form>
              <Row>
                {this.state.tableData.length > 0 ? (
                  <ReactHTMLTableToExcel
                    id="test-table-xls-button"
                    className="btn btn-primary ml-2"
                    table="ekspor1"
                    multipleTables={this.state.tableData}
                    filename="tablexls"
                    sheet="tablexls"
                    buttonText="Data siap di export"
                  />
                ) : (
                  ''
                )}
              </Row>
            </div>
          }
          handleSubmit={(e) => this.handleApproval(e, true)}
        />
        {/* excel modal */}
        <ModalHandler
          show={approvalMode}
          loading={loadingModal}
          footer={true}
          handleHide={() => this.toggle('approvalMode')}
          title="Approval Confirmation"
          body={`Approve izin ${fullnames} ?`}
          handleSubmit={(e) => this.handleApproval(e, true)}
        />

        {/* reject modal */}
        <ModalHandler
          show={rejectMode}
          loading={loadingModal}
          footer={false}
          handleHide={() => this.toggle('rejectMode')}
          title="Reject Confirmation"
          body={
            <div>
              <h3 className="mb-4">{`Reject izin ${fullnames} ?`}</h3>
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
                  onClick={() => this.toggle('rejectMode')}
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
                      />{' '}
                      Submitting...
                    </div>
                  ) : (
                    'Submit'
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
          handleHide={() => this.toggle('approveAllMode')}
          title="Approve Confirmation"
          body={
            <div>
              <h3 className="mb-4">{`Approve izin ${this.state.checkId.length} data ?`}</h3>
            </div>
          }
          handleSubmit={this.approveChecked}
        />

        {/* Reject All Modal */}
        <ModalHandler
          show={rejectAllMode}
          loading={loadingModal}
          footer={false}
          handleHide={() => this.toggle('rejectAllMode')}
          title="Reject Confirmation"
          body={
            <div>
              <h3 className="mb-4">{`Reject izin ${this.state.checkId.length} data ?`}</h3>
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
                  onClick={() => this.toggle('rejectAllMode')}
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
                      />{' '}
                      Submitting...
                    </div>
                  ) : (
                    'Submit'
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

export default TesEksport;
