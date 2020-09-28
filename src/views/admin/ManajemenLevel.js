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

class ManajemenLevel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      level: [],
      inputLevel: '',
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
    const Level = new Parse.Object.extend('Level');
    const query = new Parse.Query(Level);

    query.equalTo('status', 1);
    query
      .find()
      .then((x) => {
        this.setState({ level: x, loading: false });
      })
      .catch((err) => {
        alert(err.message);
        this.setState({ loading: false });
      });
  };

  handleAdd = (e) => {
    e.preventDefault();
    const { inputLevel } = this.state;
    this.setState({ loadingModal: true });

    const Level = Parse.Object.extend('Level');
    const query = new Level();
    query.set('level', inputLevel);

    query
      .save()
      .then((z) => {
        this.setState({
          addMode: false,
          loadingModal: false,
          level: this.state.level.concat(z),
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

    const Level = Parse.Object.extend('Level');
    const query = new Parse.Query(Level);

    query
      .get(id)
      .then(({ attributes }) => {
        this.setState({ inputLevel: attributes.level, editMode: true });
      })
      .catch((err) => {
        alert(err.message);
        this.setState({ loadingModal: false });
      });
  };

  handleUpdate = (e) => {
    e.preventDefault();
    const { inputLevel } = this.state;
    this.setState({ loadingModal: true });

    const Level = Parse.Object.extend('Level');
    const query = new Parse.Query(Level);

    query
      .get(this.state.userId)
      .then((z) => {
        z.set('level', inputLevel);
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
          message: 'Gagal update data, coba lagi',
          visible: true
        });
      });
  };

  handleRemove = (e) => {
    e.preventDefault();
    const { inputLevel } = this.state;
    this.setState({ loadingModal: true });

    const Level = Parse.Object.extend('Level');
    const query = new Parse.Query(Level);

    query
      .get(this.state.userId)
      .then((z) => {
        z.set('status', 0);
        z.save()
          .then((x) => {
            let newArr = [...this.state.level];
            newArr.splice(this.state.userIndex, 1);
            this.setState({
              deleteMode: false,
              loadingModal: false,
              level: newArr,
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
      level,
      loading,
      inputLevel,
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
                      <th scope="col">Level</th>
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
                    ) : level.length < 1 ? (
                      <td colSpan={6} style={{ textAlign: 'center' }}>
                        No data found...
                      </td>
                    ) : (
                      level.map((prop, key) => (
                        <tr>
                          <td>{key + 1}</td>
                          <td>{prop.get('level')}</td>
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
                                  fullnames: prop.get('level')
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
          title="Tambah Data"
          body={
            <div>
              <Form onSubmit={(e) => this.handleAdd(e)}>
                <FormGroup>
                  <Label>Level</Label>
                  <Input
                    id="zz1"
                    placeholder="Masukkan level"
                    type="text"
                    required={true}
                    onChange={(e) => this.setState({ inputLevel: e.target.value })}
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
                <Label>Level</Label>
                <Input
                  id="zz1"
                  placeholder="Masukkan level"
                  value={inputLevel}
                  type="text"
                  required={true}
                  onChange={(e) => this.setState({ inputLevel: e.target.value })}
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

export default ManajemenLevel;
