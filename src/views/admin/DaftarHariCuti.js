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
  Button,
  Form,
  FormGroup,
  Input,
  Col,
  Label,
  InputGroup,
  InputGroupAddon,
  InputGroupText
} from 'reactstrap';
// core components
import Header from 'components/Headers/Header.js';
import ReactDatetime from 'react-datetime';
import Parse from 'parse';
import moment from 'moment';
import { getLeaderId } from 'utils';
import ModalHandler from 'components/Modal/Modal';
import HeaderNormal from 'components/Headers/HeaderNormal';
import Alertz from 'components/Alert/Alertz';
import { convertDate } from 'utils';

class DaftarHariCuti extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      hariCuti: null,
      detail: {},
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
      addMode: false,
      editMode: false,
      deleteMode: false,
      deleteCounter: 0,
      latitude: 0,
      longitude: 0,
      message: '',
      color: 'danger',
      visible: false
    };
  }

  componentDidMount() {
    this.getData();
  }

  getData = () => {
    this.setState({ loading: true });
    const HariCuti = new Parse.Object.extend('HariCuti');
    const query = new Parse.Query(HariCuti);

    query.equalTo('status', 1);
    query
      .find()
      .then((x) => {
        this.setState({ data: x, loading: false });
      })
      .catch((err) => {
        console.log(err.message);
        this.setState({
          loading: false,
          message: 'Gagal memuat data',
          visible: true
        });
      });
  };

  handleAdd = (e) => {
    e.preventDefault();
    const { hariCuti } = this.state;
    this.setState({ loadingModal: true });

    const HariCuti = Parse.Object.extend('HariCuti');
    const query = new HariCuti();
    query.set('hariCuti', moment(hariCuti).add(10, 'h').toDate());

    query
      .save()
      .then((z) => {
        this.setState({
          addMode: false,
          loadingModal: false,
          data: this.state.data.concat(z)
        });
      })
      .catch((err) => {
        console.log(err.message);
        this.setState({
          loadingModal: false,
          message: 'Gagal tambah data, coba lagi',
          visible: true
        });
      });
  };

  getDetail = (e, id) => {
    e.preventDefault();

    const HariCuti = Parse.Object.extend('HariCuti');
    const query = new Parse.Query(HariCuti);

    query
      .get(id)
      .then(({ attributes }) => {
        this.setState({
          hariCuti: attributes.hariCuti,
          editMode: true
        });
      })
      .catch((err) => {
        alert(err.message);
        this.setState({ loading: false });
      });
  };

  handleUpdate = (e) => {
    e.preventDefault();
    const { hariCuti } = this.state;
    this.setState({ loadingModal: true });

    const HariCuti = Parse.Object.extend('HariCuti');
    const query = new Parse.Query(HariCuti);

    query
      .get(this.state.userId)
      .then((z) => {
        z.set('hariCuti', hariCuti);
        z.save()
          .then((x) => {
            this.setState({
              editMode: false,
              loadingModal: false
            });
          })
          .catch((err) => {
            console.log(err.message);
            this.setState({
              loadingModal: false,
              message: 'Gagal update data, coba lagi',
              visible: true
            });
          });
      })
      .catch((err) => {
        console.log(err.message);
        this.setState({
          loadingModal: false,
          message: 'Gagal update data, coba lagi',
          visible: true
        });
      });
  };

  handleRemove = (e) => {
    e.preventDefault();
    this.setState({ loadingModal: true });

    const HariCuti = Parse.Object.extend('HariCuti');
    const query = new Parse.Query(HariCuti);

    query
      .get(this.state.userId)
      .then((z) => {
        z.set('status', 0);
        z.save()
          .then((x) => {
            let newArr = [...this.state.data];
            newArr.splice(this.state.userIndex, 1);
            this.setState({
              deleteMode: false,
              loadingModal: false,
              data: newArr
            });
          })
          .catch((err) => {
            console.log(err.message);
            this.setState({
              loadingModal: false,
              message: 'Gagal hapus data, coba lagi',
              visible: true
            });
          });
      })
      .catch((err) => {
        console.log(err.message);
        this.setState({
          loadingModal: false,
          message: 'Gagal hapus data, coba lagi',
          visible: true
        });
      });
  };

  toggle = (state) => {
    this.setState({
      [state]: !this.state[state]
    });
  };

  render() {
    const {
      data,
      loading,
      addMode,
      editMode,
      loadingModal,
      fullnames,
      detail,
      deleteMode,
      approveAllMode,
      rejectAllMode
    } = this.state;

    return (
      <React.Fragment>
        <HeaderNormal />
        {/* Page content */}
        <Container className="mt--8" fluid>
          {/* Table */}
          <Row>
            <div className="col">
              <Alertz
                color={this.state.color}
                message={this.state.message}
                open={this.state.visible}
                togglez={() => this.toggle('visible')}
              />
              <Card className="shadow">
                <CardHeader className="border-0">
                  <Row>
                    <Button
                      className="ml-2"
                      color="primary"
                      data-dismiss="modal"
                      type="button"
                      onClick={() => this.setState({ addMode: true })}
                    >
                      <i className="fa fa-plus" /> Tambah
                    </Button>
                  </Row>

                  {/* <input type="text" placeholder="input" /> */}
                </CardHeader>
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">No</th>
                      <th scope="col">Hari Cuti</th>
                      <th scope="col">Aksi</th>
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
                    ) : data.length < 1 ? (
                      <td colSpan={6} style={{ textAlign: 'center' }}>
                        No data found...
                      </td>
                    ) : (
                      data.map((prop, key) => (
                        <tr>
                          <td>{key + 1}</td>
                          <td>{convertDate(prop.get('hariCuti'), 'DD/MM/YYYY')}</td>
                          <td>
                            <Button
                              id="t1"
                              color="primary"
                              className="btn-circle"
                              onClick={(e) => {
                                this.setState({
                                  userId: prop.id,
                                  userIndex: key
                                });
                                this.getDetail(e, prop.id);
                              }}
                            >
                              <i className="fa fa-edit" />
                            </Button>
                            <UncontrolledTooltip delay={0} placement="top" target="t1">
                              Ubah data
                            </UncontrolledTooltip>

                            <Button
                              id="t2"
                              className="btn-circle btn-danger"
                              onClick={(e) => {
                                this.setState({
                                  deleteMode: true,
                                  userId: prop.id,
                                  userIndex: key,
                                  fullnames: prop.get('hariCuti')
                                });
                              }}
                            >
                              <i className="fa fa-trash" />
                            </Button>
                            <UncontrolledTooltip delay={0} placement="top" target="t2">
                              Hapus data
                            </UncontrolledTooltip>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </Card>
            </div>
          </Row>
        </Container>

        {/* add modal */}
        <ModalHandler
          show={addMode}
          loading={loadingModal}
          footer={false}
          handleHide={() => this.toggle('addMode')}
          title="Tambah Daftar Hari Cuti"
          body={
            <div>
              <Form onSubmit={(e) => this.handleAdd(e)}>
                <FormGroup>
                  <Label>Set Hari Cuti</Label>
                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-calendar-grid-58" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <ReactDatetime
                      inputProps={{
                        placeholder: 'Set hari cuti disini'
                      }}
                      timeFormat={false}
                      // viewMode={
                      // 	parseInt(this.state.status) === 6 ? (
                      // 		'months'
                      // 	) : (
                      // 		'days'
                      // 	)
                      // }
                      dateFormat={'DD/MM/YYYY'}
                      value={this.state.hariCuti}
                      onChange={(dateTime) => {
                        this.setState({
                          hariCuti: dateTime.toDate()
                        });
                        console.log(dateTime.toDate());
                      }}
                    />
                  </InputGroup>
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
          handleSubmit={(e) => this.handleAdd(e)}
        />

        {/* edit modal */}
        <ModalHandler
          show={editMode}
          loading={loadingModal}
          footer={false}
          handleHide={() => this.toggle('editMode')}
          title="Edit Hari Cuti"
          body={
            <div>
              <Form onSubmit={(e) => this.handleUpdate(e)}>
                <FormGroup>
                  <Label>Set hari cuti</Label>
                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-calendar-grid-58" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <ReactDatetime
                      inputProps={{
                        placeholder: 'Set hari cuti disini'
                      }}
                      timeFormat={false}
                      // viewMode={
                      // 	parseInt(this.state.status) === 6 ? (
                      // 		'months'
                      // 	) : (
                      // 		'days'
                      // 	)
                      // }
                      dateFormat={'DD/MM/YYYY'}
                      value={this.state.hariCuti}
                      onChange={(dateTime) => {
                        this.setState({
                          hariCuti: dateTime.toDate()
                        });
                        console.log(dateTime.toDate());
                      }}
                    />
                  </InputGroup>
                </FormGroup>

                <Button
                  color="secondary"
                  data-dismiss="modal"
                  type="button"
                  onClick={() => this.toggle('editMode')}
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
          handleSubmit={(e) => this.handleUpdate(e)}
        />

        <ModalHandler
          show={deleteMode}
          loading={loadingModal}
          footer={true}
          handleHide={() => this.toggle('deleteMode')}
          title="Remove Confirmation"
          body={
            <div>
              <h3 className="mb-4">{`Remove tanggal cuti ${fullnames} ?`}</h3>
            </div>
          }
          handleSubmit={(e) => this.handleRemove(e)}
        />

        {/* Reject All Modal */}
      </React.Fragment>
    );
  }
}

export default DaftarHariCuti;
