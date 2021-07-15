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
  // Pagination,
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
  FormGroup
} from 'reactstrap';
// core components
// import Header from "components/Headers/Header.js";
import HeaderNormal from 'components/Headers/HeaderNormal.js';
import Parse from 'parse';
import moment from 'moment';
import { getLeaderId } from 'utils';
import { handleSelect } from 'utils';
import { convertDate } from 'utils';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import ExportExcel from 'components/Export/ExportExcel';
import { getUserRole } from 'utils';
import Pagination from 'react-js-pagination';

class HistoryAbsence extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      absence: [],
      loading: false,
      startDate: '',
      leave:'',
      resPerPage: 20,
      page: 1,
      totalData: 0,
      hitButtonExcel: false
    };
    this.btnRef = React.createRef();
  }

  componentDidMount() {
    this.getDaftarAbsenByLevel();
    this.getDataLeveByLevel();
  }

  queryLeaveByLevel = (
    rolesIDKey,
    containedRoles,
    startDate = 'today',
    filterType = 'day',
  ) => {
    const Leave = new Parse.Object.extend("Izin");
    const query = new Parse.Query(Leave);

    const hierarchy = new Parse.User();
    const hierarchyQuery = new Parse.Query(hierarchy);

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
    //   if (parseInt(this.state.status) === 3 || status === 3) {
    //     if (startDate !== "today") {
    //     } else if (startDate === "today") {
    //       const d = new Date();
    //       const start = new moment(d);
    //       start.startOf(filterType);
    //       const finish = new moment(start);
    //       finish.add(1, filterType);
    //       query.greaterThanOrEqualTo("createdAt", start.toDate());
    //       query.lessThan("createdAt", finish.toDate());
    //     }
    //   }
    //   if (
    //     parseInt(this.state.status) === 1 ||
    //     parseInt(this.state.status) === 0
    //   ) {
    //     query.descending("updatedAt");
    //   }
  
      hierarchyQuery.equalTo(rolesIDKey, {
        __type: "Pointer",
        className: "_User",
        objectId: getLeaderId(),
      });
      // query.notContainedIn("roles", containedRoles);
      hierarchyQuery.containedIn("roles", containedRoles);

    //   query.equalTo("status", status);
      query.matchesQuery('user', hierarchyQuery);
      query.include("user");
      query
        .find()
        .then((x) => {
          x.map((y) => (y.select = false));
        //   console.log(x);
          this.setState({ leave: x, loading: false });
        })
        .catch((err) => {
          alert(err.message);
          this.setState({ loading: false });
        });
  }

  queryAbsenByLevel = (pageNumber = 1, rolesIDKey, containedRoles, startDate = 'today', filterType = 'day') => {
    this.setState({page: pageNumber})
    const { resPerPage, page } = this.state;
    // contained roles must be array
    const Absence = Parse.Object.extend('Absence');
    const query = new Parse.Query(Absence);

    const hierarki = new Parse.User();
    const hierarkiQuery = new Parse.Query(hierarki);

    let start, finish;

    if (startDate !== 'today') {
      const d = new Date();
      start = new moment(startDate);
      start.startOf(filterType);
      finish = new moment(start);
      finish.add(1, filterType);
      query.greaterThanOrEqualTo('createdAt', start.toDate());
      query.lessThan('createdAt', finish.toDate());
    } else {
      const d = new Date();
      start = new moment(d);
      start.startOf(filterType);
      finish = new moment(start);
      finish.add(1, filterType);
    }

    hierarkiQuery.containedIn('roles', containedRoles);
    hierarkiQuery.equalTo(rolesIDKey, {
      __type: 'Pointer',
      className: '_User',
      objectId: getLeaderId()
    });

    query.skip(resPerPage * pageNumber - resPerPage);
    query.limit(resPerPage);
    query.withCount();

    query.descending('createdAt');
    // query.greaterThanOrEqualTo('absenMasuk', start.toDate());
    // query.lessThan('absenMasuk', finish.toDate());
    query.matchesQuery('user', hierarkiQuery);
    query.include('user');
    query
      .find()
      .then((x) => {
        console.log('user', x);
        this.setState({ absence: x.results, totalData: x.count, loading: false });
        // this.setState({ absence: x, loading: false });
      })
      .catch((err) => {
        alert(err.message);
        this.setState({ loading: false });
      });
  };

  getDataLeveByLevel = (startDate = 'today', userRole = getUserRole(), filterType = 'day') => {
    switch (userRole) {
        case "team leader":
          this.queryLeaveByLevel(
            "leaderIdNew",
            ["staff"],
            startDate,
            filterType
          );
          break;
        case "supervisor":
          this.queryLeaveByLevel(
            "supervisorID",
            ["staff", "team leader"],
            startDate,
            filterType
          );
          break;
        case "manager":
          this.queryLeaveByLevel(
            "managerID",
            ["staff", "team leader", "supervisor"],
            startDate,
            filterType
          );
          break;
        case "head":
          this.queryLeaveByLevel(
            "headID",
            ["staff", "team leader", "supervisor", "manager"],
            startDate,
            filterType
          );
          break;
        case "gm":
          this.queryLeaveByLevel(
            "headID",
            ["staff", "team leader", "supervisor", "manager", "head"],
            startDate,
            filterType
          );
          break;
  
        default:
          break;
      }
  }

  getDaftarAbsenByLevel = (pageNumber = 1, startDate = 'today', userRole = getUserRole(), filterType = 'day') => {
    this.setState({ loading: true });
    //const userRole = getUserRole();

    console.log("startDate", startDate);
    console.log("startDate2", filterType);

    switch (userRole) {
      case 'team leader':
        this.queryAbsenByLevel(pageNumber, 'leaderIdNew', ['staff'], startDate, filterType);
        break;
      case 'supervisor':
        this.queryAbsenByLevel(pageNumber, 'supervisorID', ['staff', 'team leader'], startDate, filterType);
        break;
      case 'manager':
        this.queryAbsenByLevel(
          pageNumber,
          'managerID',
          ['staff', 'team leader', 'supervisor'],
          startDate,
          filterType
        );
        break;
      case 'head':
        this.queryAbsenByLevel(
          pageNumber,
          'headID',
          ['staff', 'team leader', 'supervisor', 'manager'],
          startDate,
          filterType
        );
        break;
      case 'gm':
        this.queryAbsenByLevel(
          pageNumber,
          'headID',
          ['staff', 'team leader', 'supervisor', 'manager', 'head'],
          startDate,
          filterType
        );
        break;

      default:
        break;
    }
  };

  handleFilter = (e, pageNumber = 1) => {
    e.preventDefault();
    this.setState({ loading: true });
    const Absence = Parse.Object.extend('Absence');
    const query = new Parse.Query(Absence);

    if (parseInt(this.state.status) === 4) {
      this.getDaftarAbsenByLevel(pageNumber, this.state.startDate, getUserRole(), 'day');
      // const d = new Date();
      // const start = new moment(this.state.startDate);
      // start.startOf('day');
      // const finish = new moment(start);
      // finish.add(1, 'day');

      // query.equalTo('leaderIdNew', {
      //   __type: 'Pointer',
      //   className: '_User',
      //   objectId: getLeaderId()
      // });
      // query.ascending('absenMasuk');
      // query.greaterThanOrEqualTo('createdAt', start.toDate());
      // query.lessThan('createdAt', finish.toDate());
      // query.include('user');
      // query
      //   .find()
      //   .then((x) => {
      //     console.log('user', x);
      //     this.setState({ absence: x, loading: false });
      //   })
      //   .catch((err) => {
      //     alert(err.message);
      //     this.setState({ loading: false });
      //   });
    } else if (parseInt(this.state.status) === 5) {
      this.getDaftarAbsenByLevel(pageNumber, this.state.startDate, getUserRole(), 'week');
      // const d = new Date();
      // const start = new moment(this.state.startDate);
      // start.startOf('week');
      // const finish = new moment(start);
      // finish.add(1, 'week');

      // query.equalTo('leaderIdNew', {
      //   __type: 'Pointer',
      //   className: '_User',
      //   objectId: getLeaderId()
      // });
      // query.ascending('absenMasuk');
      // query.greaterThanOrEqualTo('createdAt', start.toDate());
      // query.lessThan('createdAt', finish.toDate());
      // query.include('user');
      // query
      //   .find()
      //   .then((x) => {
      //     console.log('user', x);
      //     this.setState({ absence: x, loading: false });
      //   })
      //   .catch((err) => {
      //     alert(err.message);
      //     this.setState({ loading: false });
      //   });
    } else if (parseInt(this.state.status) === 6) {
      this.getDaftarAbsenByLevel(pageNumber, this.state.startDate, getUserRole(), 'month');
      // const d = new Date();
      // const start = new moment(this.state.startDate);
      // start.startOf('month');
      // const finish = new moment(start);
      // finish.add(1, 'month');

      // query.equalTo('leaderIdNew', {
      //   __type: 'Pointer',
      //   className: '_User',
      //   objectId: getLeaderId()
      // });
      // query.ascending('absenMasuk');
      // query.greaterThanOrEqualTo('createdAt', start.toDate());
      // query.lessThan('createdAt', finish.toDate());
      // query.include('user');
      // query
      //   .find()
      //   .then((x) => {
      //     console.log('user', x);
      //     this.setState({ absence: x, loading: false });
      //   })
      //   .catch((err) => {
      //     alert(err.message);
      //     this.setState({ loading: false });
      //   });
    }
  };

  getDaftarAbsen = () => {
    this.setState({ loading: true });
    const Absence = Parse.Object.extend('Absence');
    const Leader = Parse.Object.extend('Leader');
    const leader = new Leader();
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
    query.ascending('absenMasuk');
    query.greaterThanOrEqualTo('createdAt', start.toDate());
    query.lessThan('createdAt', finish.toDate());
    query.notContainedIn('roles', ['admin', 'Admin', 'team leader', 'Team Leader']);
    query.include('user');
    query
      .find()
      .then((x) => {
        console.log('user', x);
        this.setState({ absence: x, loading: false });
      })
      .catch((err) => {
        alert(err.message);
        this.setState({ loading: false });
      });
  };

  render() {
    const { absence, loading, startDate, leave } = this.state;

    // absence.concat(leave).map((data) => {
    //     data.className === "Izin"
    // })

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
                  <h3 className="mb-0">History Absen</h3>
                  <Form role="form" onSubmit={this.handleFilter} className="mt-3">
                    <div className="row">
                      <div className="col-md-2 col-sm-12">
                        <p>Filter By</p>
                      </div>
                      <div className="col-md-3 col-sm-12">
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
                                placeholder: 'Date Picker Here',
                                // required: true,
                                // readOnly: true,
                                required: this.state.startDate === '' ? true : false,
                                readOnly: this.state.startDate === '' ? false : true
                              }}
                              timeFormat={false}
                              viewMode={parseInt(this.state.status) === 6 ? 'months' : 'days'}
                              dateFormat={
                                parseInt(this.state.status) === 6 ? 'MM/YYYY' : 'MM/DD/YYYY'
                              }
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
                  {/* <input type="text" placeholder="input" /> */}
                  {/* <ReactHTMLTableToExcel
                    id="eskport"
                    className="btn btn-primary"
                    table="data"
                    filename="Absensi"
                    sheet="Absensi"
                    buttonText="Ekspor Excel"
                    // ref={this.btnRef}
                  /> */}
                  {/* {this.btnRef ? <ExportExcel table="data" /> : ""} */}
                  {/* <ExportExcel table="data" /> */}
                </CardHeader>
                <Table className="align-items-center table-flush" id="ekspor" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">NIK</th>
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
                          <td>{prop.get('user').attributes.nik}</td>
                          <td>{prop.get('fullname')}</td>
                          <td style={{color : prop.get('lateTimes') !== undefined ? 'red' : 'black'}}>
                            {/* {prop.get('absenMasuk') === undefined
                              ? ''
                              : convertDate(prop.get('absenMasuk'), 'DD/MM/YYYY HH:mm:ss')} */}
                            {
                                prop.get('lateTimes') !== undefined
                                ? 'Terlambat'
                                : prop.get('absenMasuk') !== undefined
                                ? convertDate(prop.get('absenMasuk'), 'DD/MM/YYYY HH:mm:ss')
                                : "Belum Absen"
                            }
                          </td>
                          <td style={{color: prop.get('earlyTimes') !== undefined ? 'red' : 'black'}}>
                            {/* {prop.get('absenKeluar') === undefined
                              ? ''
                              : convertDate(prop.get('absenKeluar'), 'DD/MM/YYYY HH:mm:ss')} */}
                            {
                                prop.get('earlyTimes') !== undefined
                                ? "Pulang Lebih Awal"
                                : prop.get('overtimeOut') !== undefined
                                ? "Lembur"
                                : prop.get('absenKeluar') !== undefined
                                ? convertDate(prop.get('absenKeluar'), 'DD/MM/YYYY HH:mm:ss')
                                : "-"
                            }
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
                <Pagination
                  activePage={this.state.page}
                  itemsCountPerPage={this.state.resPerPage}
                  totalItemsCount={this.state.totalData}
                  pageRangeDisplayed={5}
                  onChange={(pageNumber) => parseInt(this.state.status) === 6 ? 
                                              this.getDaftarAbsenByLevel(pageNumber, this.state.startDate, getUserRole(), 'month') 
                                            : 
                                            parseInt(this.state.status) === 5 ? 
                                              this.getDaftarAbsenByLevel(pageNumber, this.state.startDate, getUserRole(), 'week')
                                            :
                                            parseInt(this.state.status) === 4 ?
                                              this.getDaftarAbsenByLevel(pageNumber, this.state.startDate, getUserRole(), 'day')
                                            :
                                              this.getDaftarAbsenByLevel(pageNumber)
                                          }
                  innerClass="pagination justify-content-end p-4"
                  itemClass="page-item mt-2"
                  linkClass="page-link"
                  prevPageText="<"
                  nextPageText=">"
                />
              </Card>
            </div>
          </Row>
        </Container>
      </React.Fragment>
    );
  }
}

export default HistoryAbsence;
