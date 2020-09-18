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
  InputGroup,
  InputGroupAddon,
  InputGroupText,
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
import { padStart } from 'lodash';
import Alerts from 'components/Alert/Alert';
import { getUserRole } from 'utils';

class PulangCepat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      leave: [],
      loading: false,
      approvalMode: false,
      rejectMode: false,
      counter: 0,
      loadingModal: false,
      fullnames: '',
      userIndex: 0,
      userId: '',
      reason: '',
      checkId: [],
      approveAllMode: false,
      rejectAllMode: false,
      startDate: '',
      messageApprove: '',
      alerts: 2,
      status: 3
    };
  }

  componentDidMount() {
    this.getDataByLevel();
  }

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

    if (parseInt(this.state.statusWaktu) === 4) {
      const d = new Date();
      const start = new moment(this.state.startDate);
      start.startOf('day');
      const finish = new moment(start);
      finish.add(1, 'day');
      query.exists('earlyTimes');
      query.greaterThanOrEqualTo('earlyTimes', start.toDate());
      query.lessThan('earlyTimes', finish.toDate());
    }
    if (parseInt(this.state.statusWaktu) === 5) {
      const d = new Date();
      const start = new moment(this.state.startDate);
      start.startOf('week');
      const finish = new moment(start);
      finish.add(1, 'week');
      query.exists('earlyTimes');
      query.greaterThanOrEqualTo('earlyTimes', start.toDate());
      query.lessThan('earlyTimes', finish.toDate());
    }
    if (parseInt(this.state.statusWaktu) === 6) {
      const d = new Date();
      const start = new moment(this.state.startDate);
      start.startOf('month');
      const finish = new moment(start);
      finish.add(1, 'month');
      query.exists('earlyTimes');
      query.greaterThanOrEqualTo('earlyTimes', start.toDate());
      query.lessThan('earlyTimes', finish.toDate());
    }
    if (parseInt(this.state.status) === 3 || status === 3) {
      if (startDate !== 'today') {
      } else if (startDate === 'today') {
        const d = new Date();
        const start = new moment(d);
        start.startOf(filterType);
        const finish = new moment(start);
        finish.add(1, filterType);
        query.exists('earlyTimes');
        query.greaterThanOrEqualTo('earlyTimes', start.toDate());
        query.lessThan('earlyTimes', finish.toDate());
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
      query.exists('earlyTImes');
    }

    query.exists('earlyTimes');
    query.equalTo(rolesIDKey, {
      __type: 'Pointer',
      className: '_User',
      objectId: getLeaderId()
    });
    query.notContainedIn('roles', containedRoles);
    // if (
    //   parseInt(this.state.status) === 1 ||
    //   parseInt(this.state.status) === 0
    // ) {
    query.equalTo('approvalEarly', status);
    // }
    // query.equalTo("status", parseInt(this.state.status));
    // query.greaterThanOrEqualTo("createdAt", start.toDate());
    // query.lessThan("createdAt", finish.toDate());
    query.include('user');
    query
      .find()
      .then((x) => {
        x.map((y) => (y.select = false));
        console.log(x);
        this.setState({ leave: x, loading: false });
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
    query.exists('earlyTimes');
    query.descending('createdAt');
    query.equalTo('approvalEarly', 3);
    query.greaterThanOrEqualTo('createdAt', start.toDate());
    query.lessThan('createdAt', finish.toDate());
    query.notContainedIn('roles', ['admin', 'Admin', 'Leader', 'leader']);
    query
      .find()
      .then((x) => {
        x.map((y) => (y.select = false));
        console.log(x);
        this.setState({ leave: x, loading: false });
      })
      .catch((err) => {
        alert(err.message);
        this.setState({ loading: false });
      });
  };

  handleFilter = (e) => {
    e.preventDefault();
    this.setState({ loading: true });
    this.getDataByLevel(this.state.startDate, getUserRole(), 'fox', parseInt(this.state.status));
  };

  closeLoading = () => {
    this.setState({ loadingModal: false });
  };

  handleApproval = (e, approvalMode) => {
    e.preventDefault();
    this.setState({ loadingModal: true });
    const Absence = Parse.Object.extend('Absence');
    const query = new Parse.Query(Absence);

    query
      .get(this.state.userId)
      .then((x) => {
        x.set('approvalEarly', approvalMode ? 1 : 0);
        if (!approvalMode) x.set('alasanRejectEarly', this.state.reason);
        x.save()
          .then(() => {
            let newArr = [...this.state.leave];
            newArr.splice(this.state.userIndex, 1);
            this.setState({
              counter: this.state.counter + 1,
              leave: newArr,
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
    let leave = this.state.leave;
    let collecId = [];

    leave.map((x) => {
      x.select = e.target.checked;
      if (x.select) {
        collecId.push(x.id);
      } else {
        collecId = [];
      }

      return x;
    });

    this.setState({ leave: leave, checkId: collecId }, () => console.log(this.state.checkId));
  };

  handleChildCheck = (e) => {
    let { leave } = this.state;
    const { checkId } = this.state;
    let checked = e.target.value;
    leave.map((x) => {
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

    this.setState({ leave: leave });
  };

  handleApproveAll = (e) => {
    this.setState({ loading: true });
    const Absence = Parse.Object.extend('Absence');
    const query = new Parse.Query(Absence);

    query.get(e).then((x) => {
      x.set('approvalEarly', 1);
      x.save().then(() => {
        const newArr = [...this.state.leave];
        newArr.splice(this.state.userIndex, 1);
        this.setState({
          leave: newArr,
          approvalMode: false,
          loading: false
        });
      });
    });
  };

  handleRejectAll = (e) => {
    this.setState({ loading: true });
    const Absence = Parse.Object.extend('Absence');
    const query = new Parse.Query(Absence);

    query.get(e).then((x) => {
      x.set('approvalEarly', 0);
      x.save().then(() => {
        const newArr = [...this.state.leave];
        newArr.splice(this.state.userIndex, 1);
        this.setState({
          leave: newArr,
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
        x.set('approvalEarly', 1);
        x.save().then(() => {
          totalData = totalData + 1;
          if (totalData === checkId.length) {
            // alert("Berhasil Approve");
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
        x.set('approvalEarly', 0);
        x.set('alasanRejectEarly', this.state.reason);
        x.save().then(() => {
          totalData = totalData + 1;
          if (totalData === checkId.length) {
            // alert("Berhasil reject");
            this.setState({
              messageApprove: 'Reject ' + totalData + ' Data',
              alerts: 1,
              loadingModal: false,
              closeLoading: false,
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
      leave,
      loading,
      approvalMode,
      rejectMode,
      counter,
      loadingModal,
      fullnames,
      rejectAllMode,
      approveAllMode,
      startDate
    } = this.state;

    return (
      <React.Fragment>
        <HeaderNormal leaveCounter={counter} />
        {/* Page content */}
        <Container className="mt--8" fluid>
          {/* Table */}
          <Row>
            <div className="col">
              <Card className="shadow">
                <CardHeader className="border-0">
                  <h3 className="mb-0">Request pulang cepat</h3>
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
                                placeholder: 'Date Picker Here',
                                required: true,
                                readOnly: true
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
                  {leave.length === 0 ? (
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
                      {parseInt(this.state.status) === 0 || parseInt(this.state.status) === 1 ? (
                        <th>
                          <input
                            type="checkbox"
                            // onChange={this.handleAllCheck}
                            disabled="true"
                          />
                        </th>
                      ) : (
                        <th>
                          <input type="checkbox" onChange={this.handleAllCheck} />
                        </th>
                      )}
                      <th scope="col">NIK</th>
                      <th scope="col">Nama</th>
                      <th scope="col">Alasan</th>
                      <th scope="col">Approve</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <td colSpan={5} style={{ textAlign: 'center' }}>
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
                    ) : leave.length < 1 ? (
                      <td colSpan={5} style={{ textAlign: 'center' }}>
                        No data found...
                      </td>
                    ) : (
                      leave.map((prop, key) => (
                        <tr>
                          {prop.get('approvalEarly') === 3 ? (
                            <td>
                              <input
                                type="checkbox"
                                value={prop.id}
                                checked={prop.select}
                                onChange={this.handleChildCheck}
                              />
                            </td>
                          ) : (
                            <td>
                              <input
                                type="checkbox"
                                // value={prop.id}
                                // checked={prop.select}
                                // onChange={this.handleChildCheck}
                                disabled="true"
                              />
                            </td>
                          )}
                          <td>{prop.get('user').attributes.nik}</td>
                          <td>{prop.get('fullname')}</td>
                          <td>{prop.get('alasan')}</td>
                          {prop.get('approvalEarly') === 1 ? (
                            <td>Approved</td>
                          ) : prop.get('approvalEarly') === 0 ? (
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
          footer={true}
          handleHide={() => this.toggle('approvalMode')}
          title="Approval Confirmation"
          body={`Approve pulang cepat ${fullnames} ?`}
          handleSubmit={(e) => this.handleApproval(e, true)}
        />

        {/* reject modal */}
        <ModalHandler
          show={rejectMode}
          footer={false}
          handleHide={() => this.toggle('rejectMode')}
          title="Reject Confirmation"
          body={
            <div>
              <h3 className="mb-4">{`Reject pulang cepat ${fullnames} ?`}</h3>
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
              <h3 className="mb-4">{`Approve Pulang Cepat ${this.state.checkId.length} data ?`}</h3>
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
              <h3 className="mb-4">{`Reject Pulang Cepat ${this.state.checkId.length} data ?`}</h3>
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

export default PulangCepat;
