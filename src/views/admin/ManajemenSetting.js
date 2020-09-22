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
import ToggleButton from 'react-toggle-button';

class ManajemenSetting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posisi: [],
      inputTimer: 0,
      inputRadius: 0,
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
      deleteMode: false,
      editMode: false,
      deleteCounter: 0,
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
    const AppSetting = new Parse.Object.extend('AppSetting');
    const query = new Parse.Query(AppSetting);

    //query.equalTo('status', 1);
    query
      .find()
      .then((x) => {
        console.log(x);
        this.setState({ posisi: x, loading: false });
      })
      .catch((err) => {
        alert(err.message);
        this.setState({ loading: false });
      });
  };

  handleAdd = (e) => {
    e.preventDefault();
    const { inputRadius, inputTimer } = this.state;
    this.setState({ loadingModal: true });

    const AppSetting = Parse.Object.extend('AppSetting');
    const query = new AppSetting();
    query.set('validationTimer', parseInt(inputRadius));
    query.set('radiusAbsen', parseInt(inputTimer));

    query
      .save()
      .then((z) => {
        this.setState({
          addMode: false,
          loadingModal: false,
          posisi: this.state.posisi.concat(z),
          message: 'Berhasil tambah data',
          visible: true,
          color: 'success'
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

    const AppSetting = Parse.Object.extend('AppSetting');
    const query = new Parse.Query(AppSetting);

    query
      .get(id)
      .then(({ attributes }) => {
        this.setState({
          inputTimer: attributes.validationTimer,
          inputRadius: attributes.radiusAbsen,
          editMode: true
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

  handleUpdate = (e) => {
    e.preventDefault();
    const { inputTimer, inputRadius } = this.state;
    this.setState({ loadingModal: true });

    const AppSetting = Parse.Object.extend('AppSetting');
    const query = new Parse.Query(AppSetting);

    query
      .get(this.state.userId)
      .then((z) => {
        z.set('validationTimer', inputTimer);
        z.set('radiusAbsen', inputRadius);
        z.save()
          .then((x) => {
            this.setState({
              editMode: false,
              loadingModal: false,
              message: 'Berhasil update data',
              visible: true,
              color: 'success'
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
          message: 'Gagal hapus data, coba lagi',
          visible: true
        });
      });
  };

  handleLivenessToggle = (toggle) => {
    //e.preventDefault();

    const AppSetting = Parse.Object.extend('AppSetting');
    const query = new Parse.Query(AppSetting);

    query
      .get(this.state.posisi[0].id)
      .then((z) => {
        z.set('liveness', toggle);
        z.save()
          .then((x) => {
            this.setState({
              editMode: false,
              loadingModal: false,
              message: 'Berhasil update data',
              visible: true,
              color: 'success'
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
          message: 'Gagal hapus data, coba lagi',
          visible: true
        });
      });
  };

  handleRemove = (e) => {
    e.preventDefault();
    const { inputLevel } = this.state;
    this.setState({ loadingModal: true });

    const AppSetting = Parse.Object.extend('AppSetting');
    const query = new Parse.Query(AppSetting);

    query
      .get(this.state.userId)
      .then((z) => {
        z.set('status', 0);
        z.save()
          .then((x) => {
            let newArr = [...this.state.posisi];
            newArr.splice(this.state.userIndex, 1);
            this.setState({
              deleteMode: false,
              loadingModal: false,
              posisi: newArr,
              message: 'Berhasil hapus data',
              visible: true,
              color: 'success'
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
      posisi,
      loading,
      inputPosisi,
      rejectMode,
      loadingModal,
      fullnames,
      addMode,
      deleteMode,
      editMode
    } = this.state;

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
                  <Row>
                    <h3 className="ml-2">Manage Setting</h3>
                    {/* <Button
											className="ml-2"
											color="primary"
											data-dismiss="modal"
											type="button"
											onClick={() => this.setState({ addMode: true })}
										>
											<i className="fa fa-plus" /> Tambah
										</Button> */}
                  </Row>
                  <Alertz
                    color={this.state.color}
                    message={this.state.message}
                    open={this.state.visible}
                    togglez={() => this.toggle('visible')}
                  />
                  {/* <input type="text" placeholder="input" /> */}
                </CardHeader>
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">No</th>
                      <th scope="col">Validation Timer (Detik)</th>
                      <th scope="col">Radius Absen (Meter)</th>
                      <th scope="col">Liveness</th>
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
                    ) : posisi.length < 1 ? (
                      <td colSpan={6} style={{ textAlign: 'center' }}>
                        No data found...
                      </td>
                    ) : (
                      posisi.map((prop, key) => (
                        <tr>
                          <td>{key + 1}</td>
                          <td>{prop.get('validationTimer')}</td>
                          <td>{prop.get('radiusAbsen')}</td>
                          <td>
                            <ToggleButton
                              value={this.state.livenessToggle || false}
                              onToggle={(livenessToggle) => {
                                console.log(!livenessToggle);
                                this.setState({
                                  livenessToggle: !livenessToggle
                                });
                                this.handleLivenessToggle(!livenessToggle);
                              }}
                            />
                          </td>
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

                            {/* <Button
															id="t2"
															className="btn-circle btn-danger"
															onClick={(e) => {
																this.setState({
																	deleteMode: true,
																	userId: prop.id,
																	userIndex: key,
																	fullnames: prop.get('posisi')
																});
															}}
														>
															<i className="fa fa-trash" />
														</Button>
														<UncontrolledTooltip
															delay={0}
															placement="top"
															target="t2"
														>
															Hapus data
														</UncontrolledTooltip> */}
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
          title="Tambah Data"
          body={
            <div>
              <Form onSubmit={(e) => this.handleAdd(e)}>
                <FormGroup>
                  <Label>Posisi</Label>
                  <Input
                    id="zz1"
                    placeholder="Masukkan posisi"
                    type="text"
                    required={true}
                    onChange={(e) => this.setState({ inputPosisi: e.target.value })}
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
          title="Edit Data"
          body={
            <Form onSubmit={(e) => this.handleUpdate(e)}>
              <FormGroup>
                <Label>Validation Timer</Label>
                <Input
                  id="zz1"
                  placeholder="Masukkan validation timer"
                  value={this.state.inputTimer}
                  type="text"
                  required={true}
                  onChange={(e) => this.setState({ inputTimer: e.target.value })}
                />
              </FormGroup>

              <FormGroup>
                <Label>Radius Absen</Label>
                <Input
                  id="zz1"
                  placeholder="Masukkan radius absen"
                  value={this.state.inputRadius}
                  type="text"
                  required={true}
                  onChange={(e) => this.setState({ inputRadius: e.target.value })}
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
              <h3 className="mb-4">{`Remove level ${fullnames} ?`}</h3>
            </div>
          }
          handleSubmit={(e) => this.handleRemove(e)}
        />
      </React.Fragment>
    );
  }
}

export default ManajemenSetting;
