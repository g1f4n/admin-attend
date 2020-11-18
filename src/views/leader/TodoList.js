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
import { compose, withProps, withStateHandlers,  withHandlers } from "recompose";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  Polyline,
  InfoWindow,
} from "react-google-maps";
import { take } from 'lodash';

const { MarkerClusterer } = require("react-google-maps/lib/components/addons/MarkerClusterer");
const MapWithAMarkerClusterer = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyC5tj-2X6b7kwGTqGZkB7sofZdMhpyE75Q&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  withHandlers({
    onMarkerClustererClick: () => (markerClusterer) => {
      const clickedMarkers = markerClusterer.getMarkers()
      console.log(`Current clicked markers length: ${clickedMarkers.length}`)
      console.log(clickedMarkers)
    },
  }),
  withScriptjs,
  withGoogleMap
)(props =>
  <GoogleMap
    defaultZoom={12}
    defaultCenter={{ lat: -6.2242898, lng: 106.8331518 }}
  >
    <MarkerClusterer
      onClick={props.onMarkerClustererClick}
      averageCenter
      enableRetinaIcons
      gridSize={60}
    >
      {/* {props.markers.map(marker => (
        <Marker
          key={marker.photo_id}
          position={{ lat: marker.latitude, lng: marker.longitude }}
        />
      ))} */}
      <Marker
        position={{lat: props.latitude, lng: props.longitude}}
      />
    </MarkerClusterer>
  </GoogleMap>
);

class TodoList extends React.Component {
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
      titleUrl: '',
      formUrl: '',
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
      visible: false,
      multiDelegasi:[],
      selectedOption: [],
      sendMessageMode: false,
      titleUpdate: '',
    };
  }

  componentDidMount() {
    this.getData();
    this.getDaftarAbsenByLevel();
    Geocode.setApiKey('AIzaSyC5tj-2X6b7kwGTqGZkB7sofZdMhpyE75Q');
    Geocode.setRegion('es');
  }

  getData = () => {
    this.setState({ loading: true });
    const TodoList = new Parse.Object.extend('TodoList');
    const query = new Parse.Query(TodoList);

    // datetime
    const d = new Date();
    const today = new moment();
    
    query.equalTo('status', 1);
    if(getUserRole() === 'staff') {
      query.equalTo('delegasi', {
        __type: 'Pointer',
        className: '_User',
        objectId: getLeaderId()
      });      
      query.include('delegasi');
    } else {
      query.equalTo('taskFrom', {
        __type: 'Pointer',
        className: '_User',
        objectId: getLeaderId()
      });
      query.include('taskFrom');
    }
    query.descending("createdAt");
    query.find().then((x) => {
      // expire date
      // console.log("dates", x.get("tglWaktu"));
      this.setState({ todoList: x, loading: false });
      // query.find().then((y) => {
      //   this.setState({todoList: x, loading: false});
      // })
    }).catch((err) => {
      alert(err.message);
      this.setState({ loading: false });
    })
    // query
    //   .find()
    //   .then((x) => {
    //     this.setState({ todoList: x, loading: false });
    //   })
    //   .catch((err) => {
    //     alert(err.message);
    //     this.setState({ loading: false });
    //   });
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

  handleAdd = (e) => {
    e.preventDefault();
    console.log("idds", this.state.multiDelegasi);
    
    const { inputDept, tglWaktu, deskripsi, delegasi, titleUrl, formUrl } = this.state;
    this.setState({ loadingModal: true });
    
    this.state.multiDelegasi.map((id) => {
      const TodoList = Parse.Object.extend('TodoList');
      const query = new TodoList();

      const Messaging = Parse.Object.extend('Messaging');
      const queryMessaging = new Messaging();

      query.set('namaTugas', inputDept);
      query.set('tglWaktu', tglWaktu);
      query.set('deskripsi', deskripsi);
      // query.set('googleFormUrlTitle', titleUrl);
      if(formUrl !== '') {
        query.set('googleFormUrl', formUrl);
        query.set('taskType', 1);
      } else {
        query.set('googleFormUrl', '-');
        query.set('taskType', 0);
      }
      query.set('lokasi', this.state.inputAddress);
      query.set('latitude', this.state.latitude.toString());
      query.set('longitude', this.state.longitude.toString());
      query.set('fullname', id.fullname);
      query.set('delegasi', {
        __type: "Pointer",
        className: "_User",
        objectId: id.id
      });
      query.set('statusTodo', 0);
      query.set('status', 1);
      query.set('taskFrom', {
        __type: "Pointer",
        className: "_User",
        objectId: getLeaderId()
      });

      // query.descending("createdAt");
      query
        .save()
        .then((z) => {
          const Messaging = Parse.Object.extend('Messaging');
          const queryMessaging = new Messaging();

          queryMessaging.set('judul', inputDept);
          if(formUrl !== '') {
            queryMessaging.set('messageType', 1);
          } else {
            queryMessaging.set('messageType', 0);
          }
          queryMessaging.set('status', 0);
          queryMessaging.set('objecIdItem', z.id);
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
          queryMessaging.save().then((y) => {
            Parse.Cloud.run('notif', {title: 'New Task', priority: "high"}).then((response) => {
              console.log("response", response);
            })
            this.setState({
              addMode: false,
              loadingModal: false,
              // todoList: this.state.todoList.concat(z),
              message: 'Berhasil tambah data',
              multiDelegasi: [],
              visible: true,
              color: 'success'
            });
            window.location.href = "/leader/todolist"
          })
        })
        .catch((err) => {
          console.log(err.message);
          this.setState({
            loadingModal: false,
            message: 'Gagal tambah data, coba lagi',
            visible: true
          });
        });
    })
  };

  getDetail = (e, id) => {
    e.preventDefault();

    const TodoList = Parse.Object.extend('TodoList');
    const query = new Parse.Query(TodoList);

    query.include('delegasi');
    query
      .get(id)
      .then(({ attributes }) => {
        this.setState({ 
          inputDept: attributes.namaTugas,
          deskripsi: attributes.deskripsi,
          tglWaktu: attributes.tglWaktu,
          delegasi: attributes.delegasi.id,
          latitude: attributes.latitude,
          longitude: attributes.longitude,
          placeName: attributes.lokasi,
          formUrl: attributes.googleFormUrl,
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
    const { inputDept, tglWaktu, deskripsi, delegasi, formUrl } = this.state;
    this.setState({ loadingModal: true });

    const TodoList = Parse.Object.extend('TodoList');
    const query = new Parse.Query(TodoList);

    query.equalTo('status', 1);
    query.include("delegasi");
    query.include("taskFrom");
    query.equalTo("namaTugas", this.state.titleUpdate);
    query.find().then((x) => {
      x.map((y) => {
        y.set('namaTugas', inputDept);
        y.set('deskripsi', deskripsi);
        y.set('tglWaktu', tglWaktu);
        if(formUrl !== '') {
          y.set('googleFormUrl', formUrl);
        } else {
          y.set('googleFormUrl', '-');
          // y.set('taskType', 0);
        }
        if(this.state.inputAddress !== '') {
          y.set('lokasi', this.state.inputAddress);
        }
        y.set('latitude', this.state.latitude.toString());
        y.set('longitude', this.state.longitude.toString());
        if(y.id === this.state.userId) {
          y.set('delegasi', {
            __type: 'Pointer',
            className: '_User',
            objectId: delegasi
          });
        }

        y.save().then((z) => {
          // update ke message
          // const Messaging = Parse.Object.extend('Messaging');
          // const queryMessaging = new Messaging();
          
          // queryMessaging.set('judul', inputDept);
          // queryMessaging.set('messageType', 0);
          // queryMessaging.set('messagingType', 0);
          // queryMessaging.set('status', 0);
          
          // if(y.id === this.state.userId) {
          //   queryMessaging.set('delegasi', {
          //     __type: 'Pointer',
          //     className: '_User',
          //     objectId: delegasi
          //   });
          // }
          // queryMessaging.save().then((v) => {
          //   this.setState({
          //     // todoList: newArr,
          //     editMode: false,
          //     loadingModal: false,
          //     message: 'Berhasil update data',
          //     visible: true,
          //     color: 'success'
          //   });
          //   window.location.href="/leader/todolist"
          // }).catch((err) => {
          //   console.log(err.message);
          //   this.setState({
          //     loadingModal: false,
          //     message: 'Gagal update data, coba lagi',
          //     visible: true
          //   });
          // });
          // Parse.Cloud.run('notif', {title: 'Update Task', priority: "high"}).then((response) => {
          //   console.log("response", response);
          // })
          // Parse.Cloud.run('notif', {title: 'Update Task', priority: "high"}).then((response) => {
          //   console.log("response", response);
          // })
          this.setState({
            // todoList: newArr,
            editMode: false,
            loadingModal: false,
            message: 'Berhasil update data',
            visible: true,
            color: 'success'
          });
          window.location.href="/leader/todolist"

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

    // query
    //   .get(this.state.userId)
    //   .then((z) => {
    //     z.set('namaTugas', inputDept);
    //     z.set('deskripsi', deskripsi);
    //     z.set('tglWaktu', tglWaktu);
    //     if(this.state.inputAddress !== '') {
    //       z.set('lokasi', this.state.inputAddress);
    //     }
    //     z.set('latitude', this.state.latitude.toString());
    //     z.set('longitude', this.state.longitude.toString());
    //     z.set('delegasi', {
    //       __type: 'Pointer',
    //       className: '_User',
    //       objectId: delegasi
    //     });
    //     z.save()
    //       .then((x) => {
    //         console.log('tesuser', x);
    //         // update ke message
    //         // const Messaging = Parse.Object.extend('Messaging');
    //         // const queryMessaging = new Messaging();

    //         // queryMessaging.set('judul', inputDept);
    //         // queryMessaging.set('messageType', 0);
    //         // queryMessaging.set('messagingType', 0);
    //         // queryMessaging.set('status', 0);
    //         // queryMessaging.set('objecIdItem', z.id);
    //         // queryMessaging.set('dari', {
    //         //   __type: "Pointer",
    //         //   className: "_User",
    //         //   objectId: getLeaderId()
    //         // });
    //         // queryMessaging.set('ke', {
    //         //   __type: "Pointer",
    //         //   className: "_User",
    //         //   objectId: id.id
    //         // });

    //         this.setState({
    //           // todoList: newArr,
    //           editMode: false,
    //           loadingModal: false,
    //           message: 'Berhasil update data',
    //           visible: true,
    //           color: 'success'
    //         });
    //       })
    //       .catch((err) => {
    //         console.log(err.message);
    //         this.setState({
    //           loadingModal: false,
    //           message: 'Gagal update data, coba lagi',
    //           visible: true
    //         });
    //       });
    //   })
    //   .catch((err) => {
    //     console.log(err.message);
    //     this.setState({
    //       loadingModal: false,
    //       message: 'Gagal update data, coba lagi',
    //       visible: true
    //     });
    //   });
  };

  handleRemove = (e) => {
    e.preventDefault();
    this.setState({ loadingModal: true });

    const TodoList = Parse.Object.extend('TodoList');
    const query = new Parse.Query(TodoList);

    const Messaging = Parse.Object.extend('Messaging');
    const queryMessaging = new Parse.Query(Messaging);

    query.equalTo("namaTugas", this.state.fullnames);
    query.find().then((x) =>{
      x.map((y) => {
        y.set('status', 0);
        y.save()
          .then((x) => {
            // queryMessaging.equalTo("judul", y.get('namaTugas'));
            // queryMessaging.find().then((z) => {
            //   console.log("a", z)
            //   z.map((data) => {
            //     data.set("status", 0);
            //     data.save().then((res) => {
            //       let newArr = [...this.state.todoList];
            //       newArr.splice(this.state.userIndex, 1);
            //       this.setState({
            //         deleteMode: false,
            //         loadingModal: false,
            //         todoList: newArr
            //       });
            //     })
            //   })
            // })
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

    // query
    //   .get(this.state.userId)
    //   .then((z) => {
    //     z.set('status', 0);
    //     z.save()
    //       .then((x) => {
    //         let newArr = [...this.state.todoList];
    //         newArr.splice(this.state.userIndex, 1);
    //         this.setState({
    //           deleteMode: false,
    //           loadingModal: false,
    //           todoList: newArr
    //         });
    //       })
    //       .catch((err) => {
    //         console.log(err.message);
    //         this.setState({
    //           loadingModal: false,
    //           message: 'Gagal hapus data, coba lagi',
    //           visible: true
    //         });
    //       });
    //   })
    //   .catch((err) => {
    //     console.log(err.message);
    //     this.setState({
    //       loadingModal: false,
    //       message: 'Gagal hapus data, coba lagi',
    //       visible: true
    //     });
    //   });
  };

  // send message
  handleSendMessage = (e) => {
    e.preventDefault();

    const { inputDept, tglWaktu, deskripsi, delegasi } = this.state;
    this.setState({ loadingModal: true });
    
    this.state.multiDelegasi.map((id) => {
      const Messaging = Parse.Object.extend('Messaging');
      const queryMessaging = new Messaging();

      queryMessaging.set('judul', inputDept);
      queryMessaging.set('deskripsi', deskripsi);
      queryMessaging.set('messageType', parseInt(this.state.inputAddress));
      queryMessaging.set('messagingType', parseInt(this.state.inputAddress));
      queryMessaging.set('status', 0);
      queryMessaging.set('objecIdItem', id.id);
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

      queryMessaging.save().then((y) => {
        Parse.Cloud.run('notif', {title: 'New Task', delegasi:id, priority: "high"}).then((response) => {
          console.log("response", response);
        })
        this.setState({
          sendMessageMode: false,
          loadingModal: false,
          // todoList: this.state.todoList.concat(z),
          message: 'Berhasil send message',
          multiDelegasi: [],
          visible: true,
          color: 'success'
        });
        // window.location.href = '/leader/todolist'
      })
        .catch((err) => {
          console.log(err.message);
          this.setState({
            loadingModal: false,
            message: 'Gagal tambah data, coba lagi',
            visible: true
          });
        });
    })
  }

  toggle = (state) => {
    this.setState({
      [state]: !this.state[state]
    });
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
    this.setState({multiDelegasi: selectedList});
  }

  onRemove = (selectedList, removedItem) =>  {
    this.state.multiDelegasi.slice(1, removedItem);
    this.setState({multiDelegasi: selectedList});
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
      selectedOption,
      editMode,
      sendMessageMode
    } = this.state;

    const multiselect = [];
    daftarStaff.map((x) => {
      multiselect.push({
        id: x.id,
        fullname: x.get('fullname')
      })
    })

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
                    {/* {getUserRole() === 'supervisor' ?  */}
                    <Button
                      className="ml-2"
                      color="primary"
                      data-dismiss="modal"
                      type="button"
                      onClick={() => this.setState({ addMode: true })}
                    >
                      <i className="fa fa-plus" /> Tambah
                    </Button>

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
                  </Row>

                  {/* <input type="text" placeholder="input" /> */}
                </CardHeader>
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">Nama Tugas</th>
                      <th scope="col">Description</th>
                      <th scope="col">Tanggal Dan Jam Tugas</th>
                      <th scope="col">Lokasi</th>
                      <th scope="col">{getUserRole() === 'staff' ? 'Task From' : 'Delegasi'}</th>
                      <th scope="col">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {console.log('todoList', todoList)}
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
                          <td>{prop.get('namaTugas')}</td>
                          <td>{prop.get('deskripsi')}</td>
                          <td>{convertDate(prop.get('tglWaktu'), "DD/MM/YYYY HH:mm")}</td>
                          <td>{prop.get('lokasi')}</td>
                          {/* <td>{getUserRole() === 'staff' ? "-" : prop.get('delegasi').attributes.fullname}</td> */}
                          <td>{prop.get('fullname') !== undefined ? prop.get('fullname') : '-'}</td>
                          {parseInt(prop.get('statusTodo')) === 0 ?
                            <td>
                                <Button
                                id="t1"
                                color="primary"
                                className="btn-circle"
                                onClick={(e) => {
                                    this.setState({
                                      titleUpdate: prop.get("namaTugas"),
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
                                    fullnames: prop.get('namaTugas')
                                    });
                                }}
                                >
                                <i className="fa fa-trash" />
                                </Button>
                                <UncontrolledTooltip delay={0} placement="top" target="t2">
                                Hapus data
                                </UncontrolledTooltip>
                            </td>
                            : parseInt(prop.get('statusTodo')) === 1 ? <td>Sudah di baca</td> : 
                            parseInt(prop.get('statusTodo')) === 2 ? <td>Sedang di kerjakan</td> :
                            parseInt(prop.get('statusTodo')) === 3 ? <td>Selesai</td> : 
                            <td>Waktu Habis</td>}
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
          size="col-md-12"
          show={addMode}
          loading={loadingModal}
          footer={false}
          handleHide={() => this.toggle('addMode')}
          title="Tambah Data"
          body={
            <div>
              <Form onSubmit={(e) => this.handleAdd(e)}>
                <FormGroup>
                  <Label>Nama Tugas</Label>
                  <Input
                    id="zz1"
                    placeholder="Masukkan nama tugas"
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
                  <Label>Tanggal dan jam</Label>
                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-calendar-grid-58" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <ReactDatetime
                      inputProps={{
                        placeholder: "Masukkan tanggal dan jam",
                        required: this.state.tglWaktu === '' ? true : false,
                        readOnly: this.state.tglWaktu === '' ? false : true
                      }}
                      timeFormat="HH:mm"
                      value={this.state.tglWaktu}
                      onChange={(e) => {
                        this.setState({tglWaktu: e.toDate()})
                      }}
                      isValidDate={this.beforeDates}
                      viewMode="time"
                    />
                  </InputGroup>
                </FormGroup>

                <FormGroup>
                  <Label>Delegasi Ke</Label>
                  <InputGroup className="input-group-alternative">
                    {/* <Input
                      name="selectOption"
                      type="select"
                      // value={this.state.selectedOption}
                      multiple
                      className="fa-pull-right"
                      required={true}
                      // onChange={this.handleMultiSelect}
                      // onChange={(e) => {
                      //   this.setState({ delegasi: e.target.value });
                      // }}
                      onClick={this.handleMultiSelect}
                    >
                      <option value="">Delagasi Staff</option>
                      {daftarStaff.map((x) => (
                        <option value={x.id}>{x.get('fullname')}</option>
                      ))}
                    </Input> */}
                    <Multiselect
                      options={multiselect} // Options to display in the dropdown
                      displayValue="fullname"
                      onSelect={this.onSelect}
                      onRemove={this.onRemove}
                    />
                    {/* <Select
                      isMulti
                      // isClearable
                      // value={selectedOption}
                      options={multiselect}
                      onChange={this.handleMultiSelect}
                      placeholder="Delegasi Ke"
                      // className="dropdown"
                    /> */}
                  </InputGroup>
                </FormGroup>

                <FormGroup>
                  <Label>Nama Tempat</Label>
                  <Input
                    id="zz1"
                    placeholder="Masukkan Alamat Lokasi"
                    className="form-control-alternitive"
                    type="text"
                    required={true}
                    onChange={(e) => this.setState({ placeName: e.target.value })}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Search Geopoint Alamat</Label>
                  <Input
                    id="zz1"
                    placeholder="Ex: PT DIKA"
                    className="form-control-alternitive"
                    required={true}
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
                <FormGroup hidden>
                  <Label>Latitude</Label>
                  <Input
                    id="zz2"
                    placeholder="0"
                    type="text"
                    value={this.state.latitude}
                    required={true}
                    onChange={(e) => this.setState({ latitude: e.target.value })}
                  />
                </FormGroup>
                <FormGroup hidden>
                  <Label>Longitude</Label>
                  <Input
                    id="zz3"
                    placeholder="0"
                    type="text"
                    value={this.state.longitude}
                    required={true}
                    onChange={(e) => this.setState({ longitude: e.target.value })}
                  />
                </FormGroup>

                <FormGroup>
                  <MapWithAMarkerClusterer 
                    latitude={this.state.latitude}
                    longitude={this.state.longitude} 
                  />
                </FormGroup>

                {/* <FormGroup>
                  <Label>Judul Form Url</Label>
                  <Input
                    id="zz1"
                    placeholder="Masukkan Judul Form Url"
                    type="text"
                    required={true}
                    onChange={(e) => this.setState({ titleUrl: e.target.value })}
                  />
                </FormGroup> */}

                <FormGroup>
                  <Label>Google Form Url</Label>
                  <Input
                    id="zz1"
                    placeholder="Masukkan Url"
                    type="text"
                    required={true}
                    onChange={(e) => this.setState({ formUrl: e.target.value })}
                  />
                  <h6 style={{color: 'red'}}>Apabila ingin di kosongkan isikan "-"</h6>
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
                <Label>Nama Tugas</Label>
                <Input
                  id="zz1"
                  placeholder="Masukkan nama tugas"
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
                  <Label>Tanggal dan jam</Label>
                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-calendar-grid-58" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <ReactDatetime
                      inputProps={{
                        placeholder: "Masukkan tanggal dan jam",
                        required: this.state.tglWaktu === '' ? true : false,
                        readOnly: this.state.tglWaktu === '' ? false : true
                      }}
                      timeFormat="HH:mm"
                      value={this.state.tglWaktu}
                      onChange={(e) => {
                        this.setState({tglWaktu: e.toDate()})
                      }}
                      isValidDate={this.beforeDates}
                      viewMode="time"
                    />
                  </InputGroup>
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
                  <Label>Nama Tempat</Label>
                  <Input
                    id="zz1"
                    placeholder="Masukkan Alamat Lokasi"
                    className="form-control-alternitive"
                    type="text"
                    value={this.state.placeName}
                    required={true}
                    onChange={(e) => this.setState({ placeName: e.target.value })}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Search Geopoint Alamat</Label>
                  <Input
                    id="zz1"
                    placeholder="Ex: PT DIKA"
                    className="form-control-alternitive"
                    type="text"
                    onChange={(e) => this.setState({ inputAddress: e.target.value })}
                  />
                  <h6 style={{color: 'red'}}>Silahkan di isi jika ingin merubah titik lokasi</h6>
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
                <FormGroup hidden>
                  <Label>Latitude</Label>
                  <Input
                    id="zz2"
                    placeholder="0"
                    type="text"
                    value={this.state.latitude}
                    required={true}
                    onChange={(e) => this.setState({ latitude: e.target.value })}
                  />
                </FormGroup>
                <FormGroup hidden>
                  <Label>Longitude</Label>
                  <Input
                    id="zz3"
                    placeholder="0"
                    type="text"
                    value={this.state.longitude}
                    required={true}
                    onChange={(e) => this.setState({ longitude: e.target.value })}
                  />
                </FormGroup>

                <FormGroup>
                  <MapWithAMarkerClusterer 
                    latitude={this.state.latitude}
                    longitude={this.state.longitude} 
                  />
                </FormGroup>

                {/* <FormGroup>
                  <Label>Judul Form Url</Label>
                  <Input
                    id="zz1"
                    placeholder="Masukkan Judul Form Url"
                    type="text"
                    required={true}
                    onChange={(e) => this.setState({ titleUrl: e.target.value })}
                  />
                </FormGroup> */}

                <FormGroup>
                  <Label>Google Form Url</Label>
                  <Input
                    id="zz1"
                    placeholder="Masukkan Url"
                    type="text"
                    value={this.state.formUrl}
                    required={true}
                    onChange={(e) => this.setState({ formUrl: e.target.value })}
                  />
                  <h6 style={{color: 'red'}}>Apabila ingin di kosongkan isikan "-"</h6>
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
        />

        {/* Send Message */}
        <ModalHandler
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

                {/* <FormGroup>
                  <Label>Tanggal dan jam</Label>
                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-calendar-grid-58" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <ReactDatetime
                      inputProps={{
                        placeholder: "Masukkan tanggal dan jam",
                        required: this.state.tglWaktu === '' ? true : false,
                        readOnly: this.state.tglWaktu === '' ? false : true
                      }}
                      timeFormat="HH:mm"
                      value={this.state.tglWaktu}
                      onChange={(e) => {
                        this.setState({tglWaktu: e.toDate()})
                      }}
                      isValidDate={this.beforeDates}
                      viewMode="time"
                    />
                  </InputGroup>
                </FormGroup> */}

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
        />
      </React.Fragment>
    );
  }
}

export default TodoList;
