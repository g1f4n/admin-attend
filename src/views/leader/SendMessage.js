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
import React, {useState} from 'react';

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
  InputGroup,
  InputGroupAddon,
  InputGroupText,
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
import { convertDate } from "utils";
import { getUserRole } from "utils";
import ReactDatetime from "react-datetime";
import { Multiselect } from 'multiselect-react-dropdown';
import Select from 'react-select';
import Geocode from 'react-geocode';
import SweetAlert from 'sweetalert2-react';
import cron from 'node-cron';
import { compose, withProps, withStateHandlers,  withHandlers } from "recompose";

class SendMessage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      todoList: [],
      daftarStaff: [],
      inputDept: '',
      deskripsi: '',
      tglWaktu: '',
      delegasi: '',
      latitude: '',
      longitude: '',
      inputAddress: '',
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
      messageType: 100,
      visible: false,
      multiDelegasi:[],
      selectedOption: [],
      sendMessageMode: false,
      titleUpdate: '',
      multiselect: [],
    };
  }

  componentDidMount() {
    this.getData();
    this.getDaftarAbsenByLevel();
    // this.scheduler();
  }

  // // scheduler 
  // scheduler = (e) => {
  //   // var cron = require('node-cron');

  //   cron.schedule('* * * * * *', () => {
  //     console.log('every second');
  //   });
  // }

  getData = () => {
    this.setState({ loading: true });
    const Messaging = new Parse.Object.extend('Messaging');
    const query = new Parse.Query(Messaging);

    // datetime
    const d = new Date();
    const today = new moment();
    
    // query.equalTo('status', 0);
    if(getUserRole() === 'staff') {
      query.equalTo('ke', {
        __type: 'Pointer',
        className: '_User',
        objectId: getLeaderId()
      });      
      query.include('ke');
    } else {
      query.equalTo('dari', {
        __type: 'Pointer',
        className: '_User',
        objectId: getLeaderId()
      });
      query.include('dari');
    }
    query.descending("createdAt");
    query.find().then((x) => {

      this.setState({ todoList: x, loading: false });
    }).catch((err) => {
      alert(err.message);
      this.setState({ loading: false });
    })
  };

  // get data staff
  queryStaffByLevel = (rolesIDKey, containedRoles) => {
    const User = new Parse.User();
    const query = new Parse.Query(User);

    query.equalTo(rolesIDKey, {
      __type: 'Pointer',
      className: '_User',
      objectId: getLeaderId()
    });
    query.ascending('roles');
    query.containedIn('roles', containedRoles);

    query
      .find({ useMasterKey: true })
      .then((x) => {
        this.setState({ daftarStaff: x });
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  getDaftarAbsenByLevel = (startDate = 'today', userRole = getUserRole(), filterType = 'day') => {
    this.setState({ loading: true });
    //const userRole = getUserRole();

    switch (userRole) {
      case 'leader':
        this.queryStaffByLevel('leaderIdNew', ['staff']);
        break;
      case 'supervisor':
        this.queryStaffByLevel('supervisorID', ['staff', 'leader']);
        break;
      case 'manager':
        this.queryStaffByLevel('managerID', ['staff', 'leader', 'supervisor']);
        break;
      case 'head':
        this.queryStaffByLevel('headID', ['staff', 'leader', 'supervisor', 'manager']);
        break;
      case 'gm':
        this.queryStaffByLevel('headID', ['staff', 'leader', 'supervisor', 'manager', 'head']);
        break;

      default:
        break;
    }
  };



  getDetail = (e, id) => {
    e.preventDefault();

    const Messaging = Parse.Object.extend('Messaging');
    const query = new Parse.Query(Messaging);

    query.include('ke');
    query
      .get(id)
      .then(({ attributes }) => {
        this.setState({ 
          inputDept: attributes.judul,
          deskripsi: attributes.deskripsi,
          messageType: attributes.messageType,
          delegasi: attributes.ke.id,
          editMode: true 
        });
      })
      .catch((err) => {
        alert(err.message);
        this.setState({ loadingModal: false });
      });
  };

  handleUpdate = (e) => {
    e.preventDefault();
    const { inputDept, messageType, deskripsi, delegasi } = this.state;
    this.setState({ loadingModal: true });

    const Messaging = Parse.Object.extend('Messaging');
    const query = new Parse.Query(Messaging);

    query.equalTo('status', 0);
    query.include("ke");
    query.include("dari");
    query.equalTo("judul", this.state.titleUpdate);
    query.find().then((x) => {
      x.map((y) => {
        y.set('judul', inputDept);
        y.set('deskripsi', deskripsi);
        y.set('messageType', messageType);
        if(y.id === this.state.userId) {
          y.set('ke', {
            __type: 'Pointer',
            className: '_User',
            objectId: delegasi
          });
        }

        y.save().then((z) => {
          this.setState({
            // todoList: newArr,
            editMode: false,
            loadingModal: false,
            message: 'Berhasil update data',
            visible: true,
            color: 'success'
          });
          window.location.href="/leader/sendMessage"

        }).catch((err) => {
          console.log(err.message);
          this.setState({
            loadingModal: false,
            message: 'Gagal update data, coba lagi',
            visible: true
          });
        });
      })
    }).catch((err) => {
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

    const Messaging = Parse.Object.extend('Messaging');
    const query = new Parse.Query(Messaging);

    query.equalTo("judul", this.state.fullnames);
    query.find().then((x) =>{
      x.map((y) => {
        y.set('status', 1);
        y.save()
          .then((x) => {
            let newArr = [...this.state.todoList];
            newArr.splice(this.state.userIndex, 1);
            this.setState({
              deleteMode: false,
              loadingModal: false,
              todoList: newArr
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
    }).catch((err) => {
      console.log(err.message);
      this.setState({
        loadingModal: false,
        message: 'Gagal hapus data, coba lagi',
        visible: true
      });
    });
  };

  // send message
  handleSendMessage = (e) => {
    e.preventDefault();

    const { inputDept, tglWaktu, deskripsi, delegasi, messageType } = this.state;
    this.setState({ loadingModal: true });

    // console.log("multidelegate", this.state.multiDelegasi);
    // this.state.multiDelegasi.map((data) => {
    //   console.log("datass", data);
    // })

    let implodeTaskTo = [];
    let testArray = []

    const Messaging = Parse.Object.extend('Messaging');
    const queryMessaging = new Messaging();

    this.state.multiDelegasi.map((data) => {
      implodeTaskTo.push(data.id);
    });


    

    // Parse.Cloud.run('notifWeb', {title: 'Message', alert: inputDept, priority: "high", taskTo: implodeTaskTo}).then((response) => {
    //   console.log("multidelegasi", implodeTaskTo);
    // })
    // console.log("implodeTaskTo", implodeTaskTo);
    
    this.state.multiDelegasi.map((id) => {
      const Messaging = Parse.Object.extend('Messaging');
      const queryMessaging = new Messaging();

      queryMessaging.set('judul', inputDept);
      queryMessaging.set('deskripsi', deskripsi);
      if(messageType !== '') {
        queryMessaging.set('messageType', parseInt(messageType));
      } else {
        queryMessaging.set("messageType", 100)
      }
      // queryMessaging.set('messagingType', 0);
      queryMessaging.set('status', 0);
      // queryMessaging.set('objecIdItem', id.id);
      queryMessaging.set('dari', {
        __type: "Pointer",
        className: "_User",
        objectId: getLeaderId()
      });
      queryMessaging.set('ke', {
        __type: "Pointer",
        className: "_User",
        objectId: id.id
      });
      testArray.push(queryMessaging)
      // // queryMessaging.save().then((y) => {
        
      // //   // Parse.Cloud.run('notif', {title: 'Message', alert: inputDept, priority: "high"}).then((response) => {
      // //   //   console.log("response");
      // //   // })
      // //   console.log("user", id.id);
      // //   Parse.Cloud.run('notifWeb', {title: 'Message', alert: inputDept, priority: "high", taskTo: id.id}).then((response) => {
      // //     console.log("response");
      // //   })
      // //   this.setState({
      // //     sendMessageMode: false,
      // //     loadingModal: false,
      // //     // todoList: this.state.todoList.concat(y),
      // //     message: 'Berhasil send message',
      // //     multiDelegasi: [],
      // //     visible: true,
      // //     color: 'success'
      // //   });
      //   // window.location.href = '/leader/sendMessage'
      //   // window.location.reload(false);
      // })
      //   .catch((err) => {
      //     console.log(err.message);
      //     this.setState({
      //       loadingModal: false,
      //       message: 'Gagal tambah data, coba lagi',
      //       visible: true
      //     });
      //   });
    })

    console.log("testArray", testArray);
    Parse.Object.saveAll(testArray, {
      success: "sucess",
      error: "error",
    }).then((response) => {
        Parse.Cloud.run('notifWeb', {title: 'Message', alert: inputDept, priority: "high", taskTo: implodeTaskTo}).then((response) => {
          console.log("multidelegasi", implodeTaskTo);
        })
        this.setState({
          sendMessageMode: false,
          loadingModal: false,
          // todoList: this.state.todoList.concat(y),
          message: 'Berhasil send message',
          multiDelegasi: [],
          visible: true,
          color: 'success'
        });
        // window.location.reload(false);
    }).catch((error) => {
      console.log(error.message);
      this.setState({
        loadingModal: false,
        message: 'Gagal tambah data, coba lagi',
        visible: true
      });
    });
  }

  

  toggle = (state) => {
    this.setState({
      [state]: !this.state[state]
    });
  };

  toggleAlert = (state) => {
    this.setState({
      [state]: !this.state[state]
    });
    window.location.reload(false);
  };

  // getLocation
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

  // before dates
  beforeDates = (current) => {
    const yesterday = moment().subtract(1, 'day');
    return current.isAfter(yesterday);
  }

  // multiselected
  handleMultiSelect = (e) => {
    
    let value = e.target.value;
    this.state.selectedOption.push(value);

    this.setState({multiDelegasi: this.state.selectedOption});

  };

  onSelect = (selectedList, selectedItem) => {
    this.state.multiDelegasi.push(selectedItem);
    // this.setState({multiDelegasi: selectedList});
  }

  onRemove = (selectedList, removedItem) =>  {
    // console.log("selectList", selectedList);
    // console.log("removeItem", removedItem);
    let multidelegate = []
    this.state.multiDelegasi.slice(1, removedItem);
    // multidelegate.push(selectedList);
    this.setState({multiDelegasi: selectedList})
    // this.state.multiDelegasi.slice(1, removedItem);
  }

  render() {
    const {
      todoList,
      loading,
      inputDept,
      tglWaktu,
      deskripsi,
      delegasi,
      rejectMode,
      loadingModal,
      fullnames,
      daftarStaff,
      addMode,
      deleteMode,
      messageType,
      selectedOption,
      multiselect,
      editMode,
      sendMessageMode
    } = this.state;

    daftarStaff.map((row) => {
      multiselect.push({
        id: row.id,
        fullname: row.get('fullname')
      })
    })

    // const multiselect = [];
    // daftarStaff.map((x) => {
    //   multiselect.push({
    //     id: x.id,
    //     fullname: x.get('fullname')
    //   })
    // })

    return (
      <React.Fragment>
        <HeaderNormal />
        {/* Page content */}
        <Container className="mt--8" fluid>
          {/* Table */}
          <Row>
            <div className="col">
              <div>
                <SweetAlert
                  show={this.state.visible}
                  title="Information"
                  text={this.state.message}
                  onConfirm={() => this.toggleAlert('visible')}
                />
              </div>
              {/* <Alertz
                color={this.state.color}
                message={this.state.message}
                open={this.state.visible}
                togglez={() => this.toggle('visible')}
              /> */}
              <Card className="shadow">
                <CardHeader className="border-0">
                  {/* <Row> */}
                    {/* {getUserRole() === 'supervisor' ?  */}
                    {/* <Button
                      className="ml-2"
                      color="primary"
                      data-dismiss="modal"
                      type="button"
                      onClick={() => this.setState({ addMode: true })}
                    >
                      <i className="fa fa-plus" /> Tambah
                    </Button> */}

                    {/* <Button
                      className="ml-2"
                      color="primary"
                      data-dismiss="modal"
                      type="button"
                      onClick={() => this.setState({ sendMessageMode: true })}
                    >
                      <i className="fa fa-paper-plane" /> Send Message
                    </Button> */}
                    {/* : ''} */}
                    {/* <div> */}
                      <Form onSubmit={(e) => this.handleSendMessage(e)}>
                        <FormGroup row={true}>
                          <Label sm={2}>Penerima</Label>
                          {/* <InputGroup className="input-group-alternative"> */}
                            <Col sm={10}>
                              <Multiselect
                                options={multiselect} // Options to display in the dropdown
                                displayValue="fullname"
                                // displayValue="key"
                                onSelect={this.onSelect}
                                onRemove={this.onRemove}
                              />
                              {console.log("users", this.state.multiDelegasi)}
                            </Col>
                          {/* </InputGroup> */}
                        </FormGroup>

                        <FormGroup row={true}>
                          <Label sm={2}>Judul</Label>
                          <Col sm={10}>
                            <Input
                              id="zz1"
                              placeholder="Masukkan Judul"
                              type="text"
                              required={true}
                              onChange={(e) => this.setState({ inputDept: e.target.value })}
                            />
                          </Col>
                        </FormGroup>

                        <FormGroup row={true}>
                          <Label sm={2}>Pesan</Label>
                          <Col sm={10}>
                            <Input
                              id="zz1"
                              placeholder="Masukkan pesan"
                              type="textarea"
                              aria-rowspan={10}
                              required={true}
                              onChange={(e) => this.setState({ deskripsi: e.target.value })}
                            />  
                          </Col>
                        </FormGroup>

                        <FormGroup row={true}>
                          <Label sm={2}>Message Type</Label>
                          <Col sm={10}>
                            <Input
                              id="zz1"
                              placeholder="Masukkan Judul"
                              type="select"
                              // required={true}
                              onChange={(e) => this.setState({ messageType: e.target.value })}
                            >
                              <option value={100}>Information</option>
                              <option value={101}>Warning</option>
                            </Input>
                          </Col>
                        </FormGroup>

                        {/* <Button
                          color="secondary"
                          data-dismiss="modal"
                          type="button"
                          onClick={() => this.toggle('rejectMode')}
                        >
                          Close
                        </Button> */}
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
                    {/* </div> */}
                  {/* </Row> */}

                  {/* <input type="text" placeholder="input" /> */}
                </CardHeader>
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">Nama</th>
                      <th scope="col">Judul</th>
                      <th scope="col">Tanggal</th>
                      <th scope="col">Status</th>
                      <th scope="col">Tanggal di baca</th>
                      {/* <th scope="col">{getUserRole() === 'staff' ? 'Task From' : 'Delegasi'}</th>
                      <th scope="col">Message Type</th>
                      <th scope="col">Aksi</th> */}
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
                    ) : todoList.length < 1 ? (
                      <td colSpan={6} style={{ textAlign: 'center' }}>
                        No data found...
                      </td>
                    ) : (
                      todoList.map((prop, key) => (
                        <tr>
                          <td>{prop.get('ke') === undefined ? "-" : prop.get('ke').attributes.fullname}</td>
                          <td style={{fontWeight: prop.get("status") === 0 ? "bold" : "normal"}}>
                            {prop.get('judul')}
                          </td>
                          <td>{convertDate(prop.get('createdAt'), "DD/MM/YYYY HH:mm")}</td>
                          <td>{parseInt(prop.get("status")) === 0 ? "belum di baca" : "dibaca"}</td>
                          <td>{prop.get("readOn") !== undefined ? convertDate(prop.get('readOn'), "DD/MM/YYYY HH:mm") : '-'}</td>

                          {/* <td>{prop.get('deskripsi') === undefined ? "-" : prop.get('deskripsi')}</td>
                          <td>{parseInt(prop.get('messageType')) === 0 ? "default" : "Peringatan"}</td> */}
                          {/* <td>
                            <Button
                                id="t1"
                                color="primary"
                                className="btn-circle"
                                onClick={(e) => {
                                    this.setState({
                                      titleUpdate: prop.get("judul"),
                                    userId: prop.id,
                                    userIndex: key,
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
                                    fullnames: prop.get('judul')
                                    });
                                }}
                                >
                                <i className="fa fa-trash" />
                                </Button>
                                <UncontrolledTooltip delay={0} placement="top" target="t2">
                                Hapus data
                                </UncontrolledTooltip>
                            </td> */}
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </Card>
            </div>
          </Row>
        </Container>


        {/* edit modal */}
        {/* <ModalHandler
          show={editMode}
          loading={loadingModal}
          footer={false}
          handleHide={() => this.toggle('editMode')}
          title="Edit Data"
          body={
            <Form onSubmit={(e) => this.handleUpdate(e)}>
              <FormGroup>
                <Label>Judul</Label>
                <Input
                  id="zz1"
                  placeholder="Masukkan judul"
                  value={this.state.inputDept}
                  type="text"
                  required={true}
                  onChange={(e) => this.setState({ inputDept: e.target.value })}
                />
              </FormGroup>

              <FormGroup>
                  <Label>Deskripsi</Label>
                  <Input
                    id="zz1"
                    placeholder="Masukkan deskripsi"
                    value={this.state.deskripsi}
                    type="textarea"
                    required={true}
                    onChange={(e) => this.setState({ deskripsi: e.target.value })}
                  />
                </FormGroup>

                <FormGroup>
                  <InputGroup className="input-group-alternative">
                    <Input
                      type="select"
                      className="fa-pull-right"
                      required={true}
                      onChange={(e) => {
                        this.setState({ delegasi: e.target.value });
                      }}
                    >
                      // <option value="">Delagasi Staff</option>
                      {daftarStaff.map((x) => (
                        <option selected={this.state.delegasi === x.id} value={x.id}>{x.get('fullname')}</option>
                      ))}
                    </Input>
                  </InputGroup>
                </FormGroup>

                <FormGroup>
                  <InputGroup className="input-group-alternative">
                    <Input
                      type="select"
                      className="fa-pull-right"
                      required={true}
                      onChange={(e) => {
                        this.setState({ messageType: e.target.value });
                      }}
                    >
                      <option value="">Message Type</option>
                      <option selected={this.state.messageType === 0} value={0}>Default</option>
                      <option selected={this.state.messageType === 1} value={0}>Peringatan</option>
                    </Input>
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
              <h3 className="mb-4">{`Remove Tugas ${fullnames} ?`}</h3>
            </div>
          }
          handleSubmit={(e) => this.handleRemove(e)}
        /> */}

        {/* Send Message */}
        {/* <ModalHandler
          size="col-md-12"
          show={sendMessageMode}
          loading={loadingModal}
          footer={false}
          handleHide={() => this.toggle('sendMessageMode')}
          title="Send Message"
          body={
            <div>
              <Form onSubmit={(e) => this.handleSendMessage(e)}>
                <FormGroup>
                  <Label>Judul</Label>
                  <Input
                    id="zz1"
                    placeholder="Masukkan Judul"
                    type="text"
                    required={true}
                    onChange={(e) => this.setState({ inputDept: e.target.value })}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Deskripsi</Label>
                  <Input
                    id="zz1"
                    placeholder="Masukkan deskripsi"
                    type="textarea"
                    required={true}
                    onChange={(e) => this.setState({ deskripsi: e.target.value })}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Delegasi Ke</Label>
                  <InputGroup className="input-group-alternative">
                    <Multiselect
                      options={multiselect} // Options to display in the dropdown
                      displayValue="fullname"
                      onSelect={this.onSelect}
                      onRemove={this.onRemove}
                    />
                  </InputGroup>
                </FormGroup>

                <FormGroup>
                  <Label>Message Type</Label>
                  <Input
                    id="zz1"
                    placeholder="Masukkan Alamat Lokasi"
                    className="form-control-alternitive"
                    type="select"
                    required={true}
                    onChange={(e) => this.setState({ inputAddress: e.target.value })}
                  >
                    <option value="">Message Type</option>
                    <option value={0}>Default</option>
                    <option value={1}>Peringatan</option>
                  </Input>
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
          handleSubmit={(e) => this.handleSendMessage(e)}
        /> */}

        {/* Send Message */}
        {/* <ModalHandler
          size="col-md-12"
          show={sendMessageMode}
          loading={loadingModal}
          footer={false}
          handleHide={() => this.toggle('sendMessageMode')}
          title="Message Center"
          body={
            <div>
              <Form onSubmit={(e) => this.handleSendMessage(e)}>
                <FormGroup>
                  <Label>Penerima</Label>
                  <InputGroup className="input-group-alternative">
                    <Multiselect
                      options={multiselect} // Options to display in the dropdown
                      displayValue="fullname"
                      onSelect={this.onSelect}
                      onRemove={this.onRemove}
                    />
                  </InputGroup>
                </FormGroup>

                <FormGroup>
                  <Label>Judul</Label>
                  <Input
                    id="zz1"
                    placeholder="Masukkan Judul"
                    type="text"
                    required={true}
                    onChange={(e) => this.setState({ inputDept: e.target.value })}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Pesan</Label>
                  <Input
                    id="zz1"
                    placeholder="Masukkan pesan"
                    type="textarea"
                    aria-rowspan={10}
                    required={true}
                    onChange={(e) => this.setState({ deskripsi: e.target.value })}
                    
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Message Type</Label>
                  <Input
                    id="zz1"
                    placeholder="Masukkan Alamat Lokasi"
                    className="form-control-alternitive"
                    type="select"
                    required={true}
                    onChange={(e) => this.setState({ inputAddress: e.target.value })}
                  >
                    <option value="">Message Type</option>
                    <option value={0}>Default</option>
                    <option value={1}>Peringatan</option>
                  </Input>
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
          handleSubmit={(e) => this.handleSendMessage(e)}
        /> */}
      </React.Fragment>
    );
  }
}

export default SendMessage;
