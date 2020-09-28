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
  Label
} from 'reactstrap';
// core components
import Header from 'components/Headers/Header.js';
import Parse from 'parse';
import moment from 'moment';
import { getLeaderId } from 'utils';
import ModalHandler from 'components/Modal/Modal';
import HeaderNormal from 'components/Headers/HeaderNormal';
import Alertz from 'components/Alert/Alertz';
import Geocode from 'react-geocode';

class ManajemenPoint extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      point: [],
      placeName: '',
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
      visible: false,
      inputAddress: '',
      loadingGeocode: false
    };
  }

  componentDidMount() {
    this.getData();
    Geocode.setApiKey('AIzaSyC5tj-2X6b7kwGTqGZkB7sofZdMhpyE75Q');
    Geocode.setRegion('es');
  }

  getData = () => {
    this.setState({ loading: true });
    const ValidGeopoint = new Parse.Object.extend('ValidGeopoint');
    const query = new Parse.Query(ValidGeopoint);

    query.equalTo('status', 1);
    query
      .find()
      .then((x) => {
        this.setState({ point: x, loading: false });
      })
      .catch((err) => {
        alert(err.message);
        this.setState({ loading: false });
      });
  };

  handleAdd = (e) => {
    e.preventDefault();
    const { placeName, latitude, longitude } = this.state;
    this.setState({ loadingModal: true });

    const ValidGeopoint = Parse.Object.extend('ValidGeopoint');
    const query = new ValidGeopoint();
    query.set('placeName', placeName);
    query.set('latitude', latitude.toString());
    query.set('longitude', longitude.toString());

    query
      .save()
      .then((z) => {
        this.setState({
          addMode: false,
          loadingModal: false,
          point: this.state.point.concat(z)
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

    const ValidGeopoint = Parse.Object.extend('ValidGeopoint');
    const query = new Parse.Query(ValidGeopoint);

    query
      .get(id)
      .then(({ attributes }) => {
        this.setState({
          placeName: attributes.placeName,
          latitude: attributes.latitude,
          longitude: attributes.longitude,
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
    const { placeName, latitude, longitude } = this.state;
    this.setState({ loadingModal: true });

    const ValidGeopoint = Parse.Object.extend('ValidGeopoint');
    const query = new Parse.Query(ValidGeopoint);

    query
      .get(this.state.userId)
      .then((z) => {
        z.set('placeName', placeName);
        z.set('latitude', latitude.toString());
        z.set('longitude', longitude.toString());
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
          loadingMModal: false,
          message: 'Gagal update data, coba lagi',
          visible: true
        });
      });
  };

  handleRemove = (e) => {
    e.preventDefault();
    const { placeName } = this.state;
    this.setState({ loadingModal: true });

    const ValidGeopoint = Parse.Object.extend('ValidGeopoint');
    const query = new Parse.Query(ValidGeopoint);

    query
      .get(this.state.userId)
      .then((z) => {
        z.set('status', 0);
        z.save()
          .then((x) => {
            let newArr = [...this.state.point];
            newArr.splice(this.state.userIndex, 1);
            this.setState({
              deleteMode: false,
              loadingModal: false,
              point: newArr
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

  getLocationGeopoint = () => {
    this.setState({ loadingGeocode: true });
    const { inputAddress } = this.state;
    Geocode.fromAddress(inputAddress).then(
      (response) => {
        const { lat, lng } = response.results[0].geometry.location;
        console.log(lat, lng);
        this.setState({ latitude: lat, longitude: lng, loadingGeocode: false });
      },
      (error) => {
        console.error(error);
        this.setState({ loadingGeocode: false });
      }
    );
  };

  render() {
    const {
      point,
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
                      <th scope="col">Place Name</th>
                      <th scope="col">Latitude</th>
                      <th scope="col">Longitude</th>
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
                    ) : point.length < 1 ? (
                      <td colSpan={6} style={{ textAlign: 'center' }}>
                        No data found...
                      </td>
                    ) : (
                      point.map((prop, key) => (
                        <tr>
                          <td>{key + 1}</td>
                          <td>{prop.get('placeName')}</td>
                          <td>{prop.get('latitude')}</td>
                          <td>{prop.get('longitude')}</td>
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
                                  fullnames: prop.get('placeName')
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
          title="Tambah Absen Point"
          body={
            <div>
              <Form onSubmit={(e) => this.handleAdd(e)}>
                <FormGroup>
                  <Label>Tempat absen</Label>
                  <Input
                    id="zz1"
                    placeholder="Masukkan tempat absen"
                    className="form-control-alternitive"
                    type="text"
                    required={true}
                    onChange={(e) => this.setState({ placeName: e.target.value })}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Nama lokasi</Label>
                  <Input
                    id="zz1"
                    placeholder="Ex: DIKA 1"
                    className="form-control-alternitive"
                    type="text"
                    onChange={(e) => this.setState({ inputAddress: e.target.value })}
                  />
                </FormGroup>
                <Button
                  color="primary"
                  className="mb-4"
                  onClick={this.getLocationGeopoint}
                  disabled={this.state.inputAddress === ''}
                >
                  {this.state.loadingGeocode ? (
                    <div>
                      <Spinner
                        as="span"
                        animation="grow"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />{' '}
                      Mendapatkan geopoint...
                    </div>
                  ) : (
                    'Search'
                  )}
                </Button>
                <FormGroup>
                  <Label>Latitude</Label>
                  <Input
                    id="zz2"
                    placeholder="Masukkan latitude absen point"
                    type="text"
                    value={this.state.latitude}
                    required={true}
                    onChange={(e) => this.setState({ latitude: e.target.value })}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Longitude</Label>
                  <Input
                    id="zz3"
                    placeholder="Masukkan longitude absen point"
                    type="text"
                    value={this.state.longitude}
                    required={true}
                    onChange={(e) => this.setState({ longitude: e.target.value })}
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
          handleSubmit={(e) => this.handleAdd(e)}
        />

        {/* edit modal */}
        <ModalHandler
          show={editMode}
          loading={loadingModal}
          footer={false}
          handleHide={() => this.toggle('editMode')}
          title="Edit Absen Point"
          body={
            <div>
              <Form onSubmit={(e) => this.handleUpdate(e)}>
                <FormGroup>
                  <Label>Tempat absen</Label>
                  <Input
                    id="zz1"
                    placeholder="Masukkan tempat absen"
                    type="text"
                    value={this.state.placeName}
                    required={true}
                    onChange={(e) => this.setState({ placeName: e.target.value })}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Latitude</Label>
                  <Input
                    id="zz2"
                    placeholder="Masukkan latitude absen point"
                    type="text"
                    value={this.state.latitude}
                    required={true}
                    onChange={(e) => this.setState({ latitude: e.target.value })}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Longitude</Label>
                  <Input
                    id="zz3"
                    placeholder="Masukkan longitude absen point"
                    type="text"
                    value={this.state.longitude}
                    required={true}
                    onChange={(e) => this.setState({ longitude: e.target.value })}
                  />
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
              <h3 className="mb-4">{`Remove absen point ${fullnames} ?`}</h3>
            </div>
          }
          handleSubmit={(e) => this.handleRemove(e)}
        />

        {/* Reject All Modal */}
      </React.Fragment>
    );
  }
}

export default ManajemenPoint;
