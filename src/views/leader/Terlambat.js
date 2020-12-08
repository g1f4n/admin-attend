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

// react plugin used to create datetimepicker
import ReactDatetime from 'react-datetime';

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
  InputGroupText,
  InputGroupAddon,
  InputGroup,
  Table,
  Container,
  Row,
  UncontrolledTooltip,
  Spinner,
  Button,
  Form,
  FormGroup,
  Input,
  Col
} from 'reactstrap';
// core components
// import Header from "components/Headers/Header.js";
import Parse from 'parse';
import moment from 'moment';
import { getLeaderId } from 'utils';
import ModalHandler from 'components/Modal/Modal';
import { handleSelect } from 'utils';
import HeaderNormal from 'components/Headers/HeaderNormal';
import Alerts from 'components/Alert/Alert';
import { getUserRole } from 'utils';

class Terlambat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      late: [],
      loading: false,
      approvalMode: false,
      rejectMode: false,
      counter: 0,
      loadingModal: false,
      fullnames: '',
      userIndex: 0,
      userId: '',
      reason: '',
      startDate: '',
      checkId: [],
      approveAllMode: false,
      rejectAllMode: false,
      messageApprove: '',
      alerts: 2,
      status: 3
    };
  }

  componentDidMount() {
    //this.getData();
    this.getDataByLevel();
  }

  getData = () => {
    this.setState({ loading: true });
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
      objectId: getLeaderId()
    });
    query.notContainedIn('roles', ['admin', 'Admin', 'Leader', 'leader']);
    query.equalTo('approvalLate', 3);
    query.exists('lateTimes');
    query.greaterThanOrEqualTo('createdAt', start.toDate());
    query.lessThan('createdAt', finish.toDate());
    query.include('user');
    query.descending('createdAt');
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

  closeLoading = () => {
    this.setState({ loadingModal: false });
  };

  queryEarlyLeavesByLevel = (
    rolesIDKey,
    containedRoles,
    startDate = 'today',
    filterType = 'day',
    status = this.state.status
  ) => {
    // contained roles must be array
    const Absence = new Parse.Object.extend('Absence');
    const query = new Parse.Query(Absence);

    const hierarki = new Parse.User();
    const hierarkiQuery = new Parse.Query(hierarki);

    if (parseInt(this.state.statusWaktu) === 4) {
      const d = new Date();
      const start = new moment(this.state.startDate);
      start.startOf('day');
      const finish = new moment(start);
      finish.add(1, 'day');
      query.exists('lateTimes');
      query.greaterThanOrEqualTo('lateTimes', start.toDate());
      query.lessThan('lateTimes', finish.toDate());
    }
    if (parseInt(this.state.statusWaktu) === 5) {
      const d = new Date();
      const start = new moment(this.state.startDate);
      start.startOf('week');
      const finish = new moment(start);
      finish.add(1, 'week');
      query.exists('lateTimes');
      query.greaterThanOrEqualTo('lateTimes', start.toDate());
      query.lessThan('lateTimes', finish.toDate());
    }
    if (parseInt(this.state.statusWaktu) === 6) {
      const d = new Date();
      const start = new moment(this.state.startDate);
      start.startOf('month');
      const finish = new moment(start);
      finish.add(1, 'month');
      query.exists('lateTimes');
      query.greaterThanOrEqualTo('lateTimes', start.toDate());
      query.lessThan('lateTimes', finish.toDate());
    }
    if (parseInt(this.state.status) === 3 || status === 3) {
      if (startDate !== 'today') {
      } else if (startDate === 'today') {
        const d = new Date();
        const start = new moment(d);
        start.startOf(filterType);
        const finish = new moment(start);
        finish.add(1, filterType);
        query.exists('lateTimes');
        query.greaterThanOrEqualTo('lateTimes', start.toDate());
        query.lessThan('lateTimes', finish.toDate());
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
    if (parseInt(this.state.status) === 1 || parseInt(this.state.status) === 0) {
      query.descending('updatedAt');
      query.exists('lateTimes');
    }

    query.exists('lateTimes');
    hierarkiQuery.equalTo(rolesIDKey, {
      __type: 'Pointer',
      className: '_User',
      objectId: getLeaderId()
    });
    query.matchesQuery('user', hierarkiQuery);
    hierarkiQuery.notContainedIn('roles', containedRoles);
    // if (
    //   parseInt(this.state.status) === 1 ||
    //   parseInt(this.state.status) === 0
    // ) {
    query.equalTo('approvalLate', status);
    // }
    // query.equalTo("status", parseInt(this.state.status));
    // query.greaterThanOrEqualTo("createdAt", start.toDate());
    // query.lessThan("createdAt", finish.toDate());
    // query.notContainedIn('roles', ['admin', 'Admin', 'Leader', 'leader']);
    query.include('user');
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

  getDataByLevel = (
    startDate = 'today',
    userRole = getUserRole(),
    filterType = 'day',
    status = this.state.status
  ) => {
    switch (userRole) {
      case 'leader':
        this.queryEarlyLeavesByLevel('leaderIdNew', ['staff'], startDate, filterType, status);
        break;
      case 'supervisor':
        this.queryEarlyLeavesByLevel(
          'supervisorID',
          ['staff', 'leader'],
          startDate,
          filterType,
          status
        );
        break;
      case 'manager':
        this.queryEarlyLeavesByLevel(
          'managerID',
          ['staff', 'leader', 'supervisor'],
          startDate,
          filterType,
          status
        );
        break;
      case 'head':
        this.queryEarlyLeavesByLevel(
          'headID',
          ['staff', 'leader', 'supervisor', 'manager'],
          startDate,
          filterType,
          status
        );
        break;
      case 'gm':
        this.queryEarlyLeavesByLevel(
          'headID',
          ['staff', 'leader', 'supervisor', 'manager', 'head'],
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
    this.getDataByLevel(this.state.startDate, getUserRole(), 'fox', parseInt(this.state.status));
  };

  handleApproval = (e, approvalMode) => {
    e.preventDefault();
    this.setState({ loadingModal: true });
    const Absence = Parse.Object.extend('Absence');
    const query = new Parse.Query(Absence);

    query
      .get(this.state.userId)
      .then((x) => {
        x.set('approvalLate', approvalMode ? 1 : 0);
        if (!approvalMode) x.set('alasanRejectTerlambat', this.state.reason);
        x.save()
          .then(() => {
            let newArr = [...this.state.late];
            newArr.splice(this.state.userIndex, 1);
            this.setState({
              counter: this.state.counter + 1,
              late: newArr,
              [approvalMode ? 'approvalMode' : 'rejectMode']: false,
              loadingModal: false,
              messageApprove: approvalMode ? 'approve' : 'reject',
              alerts: 1
            });
            // alert(`Berhasil ${approvalMode ? "approve" : "reject"}`);
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
    let late = this.state.late;
    let collecId = [];

    late.map((x) => {
      x.select = e.target.checked;
      if (x.select) {
        collecId.push(x.id);
      } else {
        collecId = [];
      }

      return x;
    });

    this.setState({ late: late, checkId: collecId }, () => console.log(this.state.checkId));
  };

  handleChildCheck = (e) => {
    let { late } = this.state;
    const { checkId } = this.state;
    let checked = e.target.value;
    late.map((x) => {
      console.log('bandingkan', x.id === e.target.value);
      if (x.id === e.target.value) {
        console.log('sama');
        x.select = e.target.checked;
        if (x.select) {
          this.setState(
            (prevState) => ({
              checkId: [...this.state.checkId, checked]
            }),
            () => console.log(this.state.checkId)
          );
        } else {
          const index = checkId.indexOf(checked);
          if (index > -1) {
            checkId.splice(index, 1);
            this.setState(
              (prevState) => ({
                checkId: checkId
              }),
              () => console.log(this.state.checkId)
            );
          }
        }
      }
    });

    this.setState({ late: late });
  };

  handleApproveAll = (e) => {
    this.setState({ loading: true });
    const Late = Parse.Object.extend('Late');
    const query = new Parse.Query(Late);

    query.get(e).then((x) => {
      x.set('approvalLate', 1);
      x.save().then(() => {
        const newArr = [...this.state.late];
        newArr.splice(this.state.userIndex, 1);
        this.setState({
          late: newArr,
          approvalMode: false,
          loading: false
        });
      });
    });
  };

  handleRejectAll = (e) => {
    this.setState({ loading: true });
    const Late = Parse.Object.extend('Late');
    const query = new Parse.Query(Late);

    query.get(e).then((x) => {
      x.set('approvalLate', 0);
      x.save().then(() => {
        const newArr = [...this.state.late];
        newArr.splice(this.state.userIndex, 1);
        this.setState({
          late: newArr,
          rejectMode: false,
          loading: false
        });
      });
    });
  };

  approveChecked = (e) => {
    this.setState({ loadingModal: true });
    const { checkId } = this.state;
    let totalData = 0;

    checkId.map((id) => {
      const Absence = Parse.Object.extend('Absence');
      const query = new Parse.Query(Absence);

      query.get(id).then((x) => {
        x.set('approvalLate', 1);
        x.save().then(() => {
          totalData = totalData + 1;
          if (totalData === checkId.length) {
            // alert("Berhasil approve");
            this.setState({
              messageApprove: 'Approve ' + totalData + ' Data',
              alerts: 1,
              loadingModal: false,
              approveAllMode: false
            });
            // return;
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
      const Absence = Parse.Object.extend('Absence');
      const query = new Parse.Query(Absence);

      query.get(id).then((x) => {
        x.set('approvalLate', 0);
        x.set('alasanRejectTerlambat', this.state.reason);
        x.save().then(() => {
          totalData = totalData + 1;
          if (totalData === checkId.length) {
            // alert("Berhasil reject");
            this.setState({
              messageApprove: 'Reject ' + totalData + ' Data',
              alerts: 1,
              loadingModal: false,
              approveAllMode: false
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

  render() {
    const {
      late,
      loading,
      fullnames,
      loadingModal,
      counter,
      approvalMode,
      rejectMode,
      approveAllMode,
      rejectAllMode,
      startDate
    } = this.state;

    return (
      <React.Fragment>
        <HeaderNormal lateCounter={counter} />
        {/* Page content */}
        <Container className="mt--8" fluid>
          {/* Table */}
          <Row>
            <div className="col">
              <Card className="shadow">
                <CardHeader className="border-0">
                  <h3 className="mb-0">Request datang terlambat</h3>
                  {parseInt(this.state.alerts) === 2 ? (
                    ''
                  ) : (
                    <Alerts
                      show={true}
                      icon="ni ni-like-2"
                      alert="success"
                      message={`Berhasil ${this.state.messageApprove}`}
                    />
                  )}
                  <Form role="form" onSubmit={this.handleFilter} className="mt-3">
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
                                console.log(e.target.value);
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
                                console.log(e.target.value);
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
                                placeholder: 'Date Picker Here',
                                required: true,
                                // readOnly: true
                                disabled:
                                  parseInt(this.state.statusWaktu) === 4 ||
                                  parseInt(this.state.statusWaktu) === 5 ||
                                  parseInt(this.state.statusWaktu) === 6
                                    ? false
                                    : true,
                              }}
                              viewMode={parseInt(this.state.statusWaktu) === 6 ? 'months' : 'days'}
                              dateFormat={
                                parseInt(this.state.statusWaktu) === 6 ? 'MM/YYYY' : 'MM/DD/YYYY'
                              }
                              timeFormat={false}
                              value={startDate}
                              onChange={(e) => {
                                this.setState({
                                  startDate: e.toDate()
                                });
                              }}
                            />
                          </InputGroup>
                        </FormGroup>
                      </div>
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
                  {late.length === 0 ? (
                    ''
                  ) : this.state.checkId.length === 0 ? (
                    ''
                  ) : (
                    <Col sm={{ span: 0 }} className="float-none">
                      <Button
                        color="primary"
                        size="sm"
                        type="submit"
                        disable={loading ? 'true' : 'false'}
                        className="mr-2 m-1"
                        // onClick={this.approveChecked}
                        onClick={() => this.setState({ approveAllMode: true })}
                      >
                        <i className="fa fa-check" /> {loading ? 'Fetching...' : 'Approve'}
                      </Button>
                      <Button
                        color="primary"
                        type="submit"
                        size="sm"
                        className="m-1"
                        disable={loading ? 'true' : 'false'}
                        // onClick={this.rejectChecked}
                        onClick={() => this.setState({ rejectAllMode: true })}
                      >
                        <i className="fa fa-times" /> {loading ? 'Fetching...' : 'Reject'}
                      </Button>
                    </Col>
                  )}
                  {/* <input type="text" placeholder="input" /> */}
                </CardHeader>
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      {/* {parseInt(this.state.status) === 0 ||
                      parseInt(this.state.status) === 1 ? (
                        <th>
                          <input
                            type="checkbox"
                            onChange={this.handleAllCheck}
                            disabled="true"
                          />
                        </th>
                      ) : ( */}
                      <th>
                        <input
                          type="checkbox"
                          onChange={this.handleAllCheck}
                          disabled={
                            parseInt(this.state.status) === 1 || parseInt(this.state.status) === 0
                              ? true
                              : false
                          }
                        />
                      </th>
                      {/* )} */}
                      <th scope="col">NIK</th>
                      <th scope="col">Nama</th>
                      <th scope="col">Alasan</th>
                      <th scope="col">Approve</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <td colSpan={4} style={{ textAlign: 'center' }}>
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
                    ) : late.length < 1 ? (
                      <td colSpan={4} style={{ textAlign: 'center' }}>
                        No data found...
                      </td>
                    ) : (
                      late.map((prop, key) => (
                        <tr>
                          <td>
                            <input
                              type="checkbox"
                              value={prop.id}
                              checked={prop.select}
                              onChange={this.handleChildCheck}
                              disabled={prop.get('approvalLate') === 3 ? false : true}
                            />
                          </td>
                          <td>{prop.get('user').attributes.nik}</td>
                          <td>{prop.get('fullname')}</td>
                          <td>{prop.get('alasanMasuk')}</td>
                          {prop.get('approvalLate') === 1 ? (
                            <td>Approved</td>
                          ) : prop.get('approvalLate') === 0 ? (
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
                                    userIndex: key,
                                    fullnames: prop.get('fullname')
                                  });
                                }}
                              >
                                <i className="fa fa-check" />
                              </Button>
                              <UncontrolledTooltip delay={0} placement="top" target="t1">
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
                              <UncontrolledTooltip delay={0} placement="top" target="t2">
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

        <ModalHandler
          show={approvalMode}
          loading={loadingModal}
          handleHide={() => this.toggle('approvalMode')}
          footer={true}
          title="Approval Confirmation"
          body={`Approve terlambat ${fullnames} ?`}
          handleSubmit={(e) => this.handleApproval(e, true)}
        />

        {/* reject modal */}
        <ModalHandler
          show={rejectMode}
          loading={loadingModal}
          handleHide={() => this.toggle('rejectMode')}
          title="Reject Confirmation"
          body={
            <div>
              <h3 className="mb-4">{`Reject terlambat ${fullnames} ?`}</h3>
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
              <h3 className="mb-4">{`Approve Terlambat ${this.state.checkId.length} data ?`}</h3>
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

export default Terlambat;
