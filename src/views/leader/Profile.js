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
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  Container,
  Row,
  Col
} from 'reactstrap';
// core components
import UserHeader from 'components/Headers/UserHeader.js';
import Parse from 'parse';
import moment from 'moment';
import _ from 'lodash/lang';
import { getLeaderId } from 'utils';
import { slicename } from 'utils/slice';
import { Link } from 'react-router-dom';
import { getUserRole } from 'utils';
import Pagination from 'react-js-pagination';

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      daftarStaff: [],
      loading: false,
      resPerPage: 20,
      page: 1,
      totalData: 0,
    };
  }

  componentDidMount() {
    //this.getAbsenStaff();
    this.getDaftarAbsenByLevel();
  }

  queryStaffByLevel = (pageNumber = 1, rolesIDKey, containedRoles) => {
    this.setState({page: pageNumber})
    const { resPerPage, page } = this.state;
    const User = new Parse.User();
    const query = new Parse.Query(User);

    query.equalTo(rolesIDKey, {
      __type: 'Pointer',
      className: '_User',
      objectId: getLeaderId()
    });
    query.ascending('roles');
    query.containedIn('roles', containedRoles);

    query.skip(resPerPage * pageNumber - resPerPage);
    query.limit(resPerPage);
    query.withCount();

    query
      .find({ useMasterKey: true })
      .then((x) => {
        this.setState({ daftarStaff: x.results, totalData: x.count, loading: false });
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  getDaftarAbsenByLevel = (pageNumber, startDate = 'today', userRole = getUserRole(), filterType = 'day') => {
    this.setState({ loading: true });
    //const userRole = getUserRole();

    switch (userRole) {
      case 'leader':
        this.queryStaffByLevel(pageNumber, 'leaderIdNew', ['staff']);
        break;
      case 'supervisor':
        this.queryStaffByLevel(pageNumber, 'supervisorID', ['staff', 'leader']);
        break;
      case 'manager':
        this.queryStaffByLevel(pageNumber, 'managerID', ['staff', 'leader', 'supervisor']);
        break;
      case 'head':
        this.queryStaffByLevel(pageNumber, 'headID', ['staff', 'leader', 'supervisor', 'manager']);
        break;
      case 'gm':
        this.queryStaffByLevel(pageNumber, 'headID', ['staff', 'leader', 'supervisor', 'manager', 'head']);
        break;

      default:
        break;
    }
  };

  getAbsenStaff() {
    const User = new Parse.User();
    const query = new Parse.Query(User);

    query.equalTo('supervisorID', {
      __type: 'Pointer',
      className: '_User',
      objectId: getLeaderId()
    });
    query.notContainedIn('roles', [getUserRole()]);

    query
      .find({ useMasterKey: true })
      .then((x) => {
        this.setState({ daftarStaff: x });
      })
      .catch((err) => {
        alert(err.message);
      });
  }

  render() {
    const { daftarStaff } = this.state;
    return (
      <React.Fragment>
        <UserHeader />
        {/* Page content */}
        <Container className="mt-2" fluid>
          <Row>
            {daftarStaff.map((staff) => (
              <Col md={4} className="mt-5">
                <Card className="card-profile shadow">
                  <Row className="justify-content-center">
                    <Col className="order-lg-2" lg="3">
                      <div className="card-profile-image">
                        <a href={staff.get('fotoWajah').url()}>
                          <img
                            alt="..."
                            style={{ height: '150px', width: '150px' }}
                            className="rounded-circle"
                            src={staff.get('fotoWajah').url()}
                          />
                        </a>
                      </div>
                    </Col>
                  </Row>
                  <CardHeader className="text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4" />
                  <CardBody className="pt-0 pt-md-4">
                    <div className="text-center mt-md-5">
                      <h3>{slicename(staff.get('fullname'))}</h3>
                      <h2>{staff.get('roles')}</h2>
                      <div className="h5 font-weight-300">
                        <i className="ni location_pin mr-2" />
                        {staff.get('nik')}
                      </div>
                      <div className="h5">
                        {/* <i className="ni business_briefcase-24 mr-2" /> */}
                        {!_.isEmpty(staff.get('email')) ? staff.get('email') : '-'}
                      </div>
                      <Link to={`/leader/view-history/${staff.id}`}>
                        <Button outline color="primary" size="sm" className="">
                          <i className="ni ni-spaceship" /> View History
                        </Button>
                      </Link>
                      <Link to={`/leader/exportexcelid/${staff.id}`}>
                        <Button outline color="primary" size="sm" className="ml-1">
                          <i className="ni ni-single-copy-04" /> Report Data
                        </Button>
                      </Link>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            ))}
          </Row>
          <Pagination
            activePage={this.state.page}
            itemsCountPerPage={this.state.resPerPage}
            totalItemsCount={this.state.totalData}
            pageRangeDisplayed={5}
            onChange={(pageNumber) => this.getDaftarAbsenByLevel(pageNumber)}
            innerClass="pagination justify-content-end p-4"
            itemClass="page-item mt-2"
            linkClass="page-link"
            prevPageText="<"
            nextPageText=">"
          />
        </Container>
      </React.Fragment>
    );
  }
}

export default Profile;
