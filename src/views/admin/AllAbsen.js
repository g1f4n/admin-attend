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
import { convertDate } from 'utils';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import { handleSelect } from 'utils';
import _ from 'lodash/lang';

class AllAbsen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      absence: [],
      loading: false,
      startDate: '',
      employeeName: '',
      employeeID: ''
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
    const Absence = Parse.Object.extend('Absence');
    const query = new Parse.Query(Absence);

    const id = this.props.match.params.id;

    if (parseInt(this.state.status) === 4) {
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
      query.ascending('absenMasuk');
      query.greaterThanOrEqualTo('absenMasuk', start.toDate());
      query.lessThan('absenMasuk', finish.toDate());
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
    } else if (parseInt(this.state.status) === 5) {
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
      query.ascending('absenMasuk');
      query.greaterThanOrEqualTo('absenMasuk', start.toDate());
      query.lessThan('absenMasuk', finish.toDate());
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
    } else if (parseInt(this.state.status) === 6) {
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
      query.ascending('absenMasuk');
      query.greaterThanOrEqualTo('absenMasuk', start.toDate());
      query.lessThan('absenMasuk', finish.toDate());
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
    } else if (parseInt(this.state.status) === 7) {
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
      query.ascending('absenMasuk');
      query.greaterThanOrEqualTo('absenMasuk', start.toDate());
      query.lessThan('absenMasuk', finish.toDate());
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
    }
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

  getDaftarAbsen = () => {
    this.setState({ loading: true });
    const Absence = Parse.Object.extend('Absence');
    const Leader = Parse.Object.extend('Leader');
    const leader = new Leader();
    const query = new Parse.Query(Absence);

    const id = this.props.match.params.id;

    const nullData = 'Data tidak ditemukan';

    const d = new Date();
    const start = new moment(d);
    start.startOf('day');
    const finish = new moment(start);
    finish.add(1, 'day');

    query.equalTo('user', {
      __type: 'Pointer',
      className: '_User',
      objectId: id
    });
    query.ascending('absenMasuk');
    // query.greaterThanOrEqualTo('createdAt', start.toDate());
    // query.lessThan('createdAt', finish.toDate());
    query.notContainedIn('roles', ['admin', 'Admin', 'leader', 'Leader']);
    query.include('user');
    query
      .find()
      .then((x) => {
        console.log('user', x);
        this.setState({
          absence: x,
          loading: false,
          employeeName: _.isEmpty(x) ? nullData : x[0].get('fullname'),
          employeeID: _.isEmpty(x) ? nullData : x[0].get('user').attributes.nik,
          employeeTitle: _.isEmpty(x) ? nullData : x[0].get('user').attributes.level,
          employeeDepartment: _.isEmpty(x) ? nullData : x[0].get('user').attributes.posisi
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
                  <Form role="form" onSubmit={this.handleFilter} className="mt-3">
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
                                  parseInt(this.state.status) === 7
                                    ? 'Set start date'
                                    : 'Set tanggal'
                                }`,
                                required: true,
                                readOnly: true
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
                                value={endDate}
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
                  {/* <input type="text" placeholder="input" /> */}
                  {this.state.exportButton & !this.state.loading ? (
                    <ReactHTMLTableToExcel
                      id="eskport"
                      className="btn btn-primary"
                      table="ekspor"
                      filename={this.state.employeeName}
                      sheet="Absensi"
                      buttonText=" Ekspor Excel"
                      multipleTables={['ekspor', 'ekspor1']}
                    />
                  ) : (
                    ''
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
                      <th scope="col" style={{ border: 'none' }}>
                        Fingerprint ID
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
                      <th scope="col" className="mb-2" style={{ border: 'none' }}>
                        {this.state.employeeDepartment}
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
                  <tbody style={{ textAlign: 'center' }}>
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
                      // .concat(dataLate)
                      // .concat(dataOvertime)
                      // .concat(dataEarlyLeave).length < 1 ? (
                      <tr>
                        <td colSpan={14} style={{ textAlign: 'center' }}>
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
                <Table
                  className="align-items-center table-flush"
                  id="ekspor1"
                  responsive
                  // hidden
                >
                  <thead>
                    <tr>
                      <th scope="col" style={{ border: 'none' }}>
                        Fingerprint ID
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
                      <th scope="col" className="mb-2" style={{ border: 'none' }}>
                        {this.state.employeeDepartment}
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
                  <tbody style={{ textAlign: 'center' }}>
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
                      // .concat(dataLate)
                      // .concat(dataOvertime)
                      // .concat(dataEarlyLeave).length < 1 ? (
                      <tr>
                        <td colSpan={14} style={{ textAlign: 'center' }}>
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
