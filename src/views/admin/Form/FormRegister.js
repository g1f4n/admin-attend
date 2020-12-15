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
import React from "react";

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
  Col,
  Label,
  FormText,
  Spinner,
} from "reactstrap";
// core components
import UserHeader from "components/Headers/UserHeader.js";
import HeaderNormal from "components/Headers/HeaderNormal";
import Parse from "parse";
import Axios from "axios";
import md5 from "md5";
import Alertz from "components/Alert/Alertz";
import { Link } from "react-router-dom";
import SweetAlert from 'sweetalert2-react';

class FormRegister extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      daftarStaff: [],
      daftarLeader: [],
      daftarTipe: [],
      daftarPosisi: [],
      daftarLevel: [],
      daftarSupervisor: [],
      daftarManager: [],
      daftarHead: [],
      daftarGM: [],
      resPerPage: 20,
      first: {},
      loading: false,
      approvalMode: false,
      rejectMode: false,
      counter: 0,
      loadingModal: false,
      fullnames: "",
      fullname: "",
      userId: "",
      userIndex: 0,
      reason: "",
      checkId: [],
      addMode: false,
      editMode: false,
      deleteCounter: 0,
      loadingReco: false,
      message: "",
      level: "",
      fotoWajah: "",
      message: "",
      loadingReco: false,
      nama: "",
      nik: "",
      tipeKaryawan: "",
      posisi: "",
      imei: "",
      jamKerja: "",
      lokasiKerja: "",
      jumlahCuti: 0,
      lembur: "ya",
      username: "",
      password: "",
      selectLeader: "",
      selectSupervisor: "",
      selectManager: "",
      selectHead: "",
      selectGM: "",
      statusReco: 0,
      email: "",
      fotoWajahObject: {},
      daftarShifting: [],
      shifting: {},
      leader: {},
      absenPointObject: {},
      message: "",
      color: "",
      visible: false,
      message: "",
      color: "danger",
      absenPoint: [],
      daftarPoint: [],
      idPoint: "",
      imeiMessage: "",
      searchBy: "all",
      searchValue: "",
      jamMasuk: 0,
      jamKeluar: 0,
      dept: [],
      deptName: "",
    };
  }

  componentDidMount() {
    //this.getStaff();
    //this.handleFilterPagination();
    this.getDepartment();
    this.getLeader();
    this.getSupervisor();
    this.getManager();
    this.getHead();
    this.getGM();
    this.getLevel();
    this.getPosisi();
    this.getTipe();
    //this.getShifting();
    this.getPoint();
    //this.testRelasi();
  }

  getPoint = () => {
    const ValidGeopoint = new Parse.Object.extend("ValidGeopoint");
    const query = new Parse.Query(ValidGeopoint);

    query.equalTo("status", 1);
    query
      .find()
      .then((x) => {
        this.setState({ daftarPoint: x, loading: false });
      })
      .catch((err) => {
        alert(err.message);
        this.setState({ loading: false });
      });
  };

  getTipe = () => {
    this.setState({ loading: true });
    const EmployeeType = new Parse.Object.extend("EmployeeType");
    const query = new Parse.Query(EmployeeType);

    query.equalTo("status", 1);
    query
      .find()
      .then((x) => {
        this.setState({ daftarTipe: x, loading: false });
      })
      .catch((err) => {
        alert(err.message);
        this.setState({ loading: false });
      });
  };

  // testRelasi = () => {
  // 	// Declare the types.
  // 	var Post = Parse.Object.extend('Post');
  // 	var Comment = Parse.Object.extend('Comment');

  // 	// Create the post
  // 	var myPost = new Post();
  // 	myPost.set('title', "I'm Hungry");
  // 	myPost.set('content', 'Where should we go for lunch?');

  // 	// Create the comment
  // 	var myComment = new Comment();
  // 	myComment.set('content', "Let's do Sushirrito.");

  // 	// Add the post as a value in the comment
  // 	myComment.set('parent', myPost);

  // 	// This will save both myPost and myComment
  // 	myComment.save();
  // };

  getPosisi = () => {
    this.setState({ loading: true });
    const Position = new Parse.Object.extend("Position");
    const query = new Parse.Query(Position);

    query.equalTo("status", 1);
    query
      .find()
      .then((x) => {
        this.setState({ daftarPosisi: x, loading: false });
      })
      .catch((err) => {
        alert(err.message);
        this.setState({ loading: false });
      });
  };

  getLevel = () => {
    this.setState({ loading: true });
    const Level = new Parse.Object.extend("Level");
    const query = new Parse.Query(Level);

    query.equalTo("status", 1);
    query
      .find()
      .then((x) => {
        this.setState({ daftarLevel: x, loading: false });
      })
      .catch((err) => {
        alert(err.message);
        this.setState({ loading: false });
      });
  };

  getDepartment = () => {
    this.setState({ loading: true });
    const Department = new Parse.Object.extend("Departemen");
    const query = new Parse.Query(Department);

    query.equalTo("status", 1);
    query
      .find()
      .then((x) => {
        this.setState({ dept: x, loading: false });
      })
      .catch((err) => {
        alert(err.message);
        this.setState({ loading: false });
      });
  };

  getStaff = () => {
    this.setState({ loading: true });
    const User = new Parse.User();
    const query = new Parse.Query(User);

    query
      .find({ useMasterKey: true })
      .then((x) => {
        this.setState({ daftarStaff: x, loading: false });
      })
      .catch((err) => {
        this.setState({ loading: false });
        alert("cek koneksi anda");
      });
  };

  getData = () => {
    this.setState({ loading: true });
    const User = new Parse.User();
    const query = new Parse.Query(User);

    query
      .find({ useMasterKey: true })
      .then((x) => {
        this.setState({ daftarStaff: x, loading: false });
      })
      .catch((err) => {
        this.setState({ loading: false });
        alert("cek koneksi anda");
      });
  };

  handleFilter = (e) => {
    e.preventDefault();
    this.setState({ loadingFilter: true });
    const { searchBy, searchValue } = this.state;
    const { resPerPage, page } = this.state;

    const User = new Parse.User();
    const query = new Parse.Query(User);

    // query.notContainedIn('roles', [ 'admin', 'leader', 'Admin', 'Leader' ]);
    query.skip(resPerPage * page - resPerPage);
    query.limit(resPerPage);
    query.withCount();

    switch (searchBy) {
      case "all":
        query
          .find({ useMasterKey: true })
          .then((x) => {
            this.setState({
              daftarStaff: x.results,
              totalData: x.count,
              loadingFilter: false,
            });
          })
          .catch((err) => {
            this.setState({ loadingFilter: false });
            alert("cek koneksi anda");
          });
        break;

      case "name":
        query.matches("fullname", searchValue, "i");
        query
          .find({ useMasterKey: true })
          .then((x) => {
            this.setState({
              daftarStaff: x.results,
              totalData: x.count,
              loadingFilter: false,
            });
          })
          .catch((err) => {
            this.setState({ loadingFilter: false });
            alert("cek koneksi anda");
          });
        break;

      case "nik":
        query.equalTo("nik", searchValue);
        query
          .find({ useMasterKey: true })
          .then((x) => {
            this.setState({
              daftarStaff: x.results,
              totalData: x.count,
              loadingFilter: false,
            });
          })
          .catch((err) => {
            this.setState({ loadingFilter: false });
            alert("cek koneksi anda");
          });
        break;

      case "divisi":
        query.matches("posisi", searchValue, "i");
        query
          .find({ useMasterKey: true })
          .then((x) => {
            this.setState({
              daftarStaff: x.results,
              totalData: x.count,
              loadingFilter: false,
            });
          })
          .catch((err) => {
            this.setState({ loading: false });
            alert("cek koneksi anda");
          });
        break;

      case "level":
        query.matches("level", searchValue, "i");
        query
          .find({ useMasterKey: true })
          .then((x) => {
            this.setState({
              daftarStaff: x.results,
              totalData: x.count,
              loadingFilter: false,
            });
          })
          .catch((err) => {
            this.setState({ loadingFilter: false });
            alert("cek koneksi anda");
          });
        break;

      case "leader":
        const leader = new Parse.User();
        const leaderQuery = new Parse.Query(leader);
        leaderQuery.matches("fullname", searchValue, "i");

        query.matchesQuery("leaderIdNew", leaderQuery);
        query
          .find({ useMasterKey: true })
          .then((x) => {
            this.setState({
              daftarStaff: x.results,
              totalData: x.count,
              loadingFilter: false,
            });
          })
          .catch((err) => {
            this.setState({ loadingFilter: false });
            alert("cek koneksi anda");
          });
        break;
      default:
        break;
    }
  };

  getShifting = () => {
    const Shifting = Parse.Object.extend("Shifting");
    const query = new Parse.Query(Shifting);

    query.equalTo("status", 1);
    query
      .find()
      .then((x) => {
        this.setState({ daftarShifting: x });
      })
      .catch((err) => {
        alert("cek koneksi anda");
      });
  };

  getLeader = () => {
    this.setState({ loading: true });
    const User = new Parse.User();
    const query = new Parse.Query(User);

    query.equalTo("roles", "leader" || "Leader");

    query
      .find({ useMasterKey: true })
      .then((x) => {
        this.setState({ daftarLeader: x, loading: false });
      })
      .catch((err) => {
        this.setState({ loading: false });
        alert("cek koneksi anda");
      });
  };

  getSupervisor = () => {
    this.setState({ loading: true });
    const User = new Parse.User();
    const query = new Parse.Query(User);

    query.equalTo("roles", "supervisor");

    query
      .find({ useMasterKey: true })
      .then((x) => {
        this.setState({ daftarSupervisor: x, loading: false });
      })
      .catch((err) => {
        this.setState({ loading: false });
        alert("cek koneksi anda");
      });
  };

  getManager = () => {
    this.setState({ loading: true });
    const User = new Parse.User();
    const query = new Parse.Query(User);

    query.equalTo("roles", "manager");

    query
      .find({ useMasterKey: true })
      .then((x) => {
        this.setState({ daftarManager: x, loading: false });
      })
      .catch((err) => {
        this.setState({ loading: false });
        alert("cek koneksi anda");
      });
  };

  getHead = () => {
    this.setState({ loading: true });
    const User = new Parse.User();
    const query = new Parse.Query(User);

    query.equalTo("roles", "head");

    query
      .find({ useMasterKey: true })
      .then((x) => {
        this.setState({ daftarHead: x, loading: false });
      })
      .catch((err) => {
        this.setState({ loading: false });
        alert("cek koneksi anda");
      });
  };

  getGM = () => {
    this.setState({ loading: true });
    const User = new Parse.User();
    const query = new Parse.Query(User);

    query.equalTo("roles", "gm");

    query
      .find({ useMasterKey: true })
      .then((x) => {
        this.setState({ daftarGM: x, loading: false });
      })
      .catch((err) => {
        this.setState({ loading: false });
        alert("cek koneksi anda");
      });
  };

  hans = () => {};

  handleFace = (e) => {
    this.setState({
      loadingReco: true,
      statusReco: 0,
      fotoWajah: e.target.files[0],
    });
    const formData = new FormData();
    formData.append("knax", e.target.files[0]);
    Axios.post("http://52.77.8.120:4000/api/face-check", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then(({ data }) => {
        if (data.status === 1)
          return this.setState({
            statusReco: 1,
            message: `✔️ ${data.message}`,
            loadingReco: false,
          });
        return this.setState({
          statusReco: 0,
          message: `✖️ ${data.message}`,
          loadingReco: false,
        });
      })
      .catch((err) => alert("Terjadi error..."));
  };

  handleCheckImei = (e, imei) => {
    e.preventDefault();
    this.setState({ loadingModal: true });

    const user = new Parse.User();
    const query = new Parse.Query(user);

    query.equalTo("imei", imei);
    query
      .first()
      .then((x) => {
        if (x) {
          this.setState({
            imeiMessage: "Imei telah terdaftar",
            loadingModal: false,
          });
          return;
        } else {
          this.handleSubmit();
        }
      })
      .catch((err) => {
        console.log(err);
        this.setState({ loadingModal: false });
      });
  };

  // send data to textfile
  handleTextFile = (req) => {
    let user = req;
    let data = JSON.stringify(user, null, 2);
    
    const formData = new FormData();
    formData.append("data", data);
    Axios.post("http://52.77.8.120:3005/api/updateUserData", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }).then(({response}) => {
      console.log("success");
    })
  }

  handleSubmit = () => {
    this.setState({ loading: true });
    const {
      name,
      nik,
      tipeKaryawan,
      posisi,
      level,
      imei,
      jamKerja,
      lokasiKerja,
      jumlahCuti,
      lembur,
      fotoWajah,
      username,
      password,
      email,
      deptName
    } = this.state;

    const user = new Parse.User();

    const setLeader = (columnName, leaderState) => {
      user.set(columnName, {
        __type: "Pointer",
        className: "_User",
        objectId: this.state[leaderState],
      });
    };

    if (level.toLowerCase() === "staff") {
      if (this.state.selectLeader !== "") {
        setLeader("leaderIdNew", "selectLeader");
      }
      if (this.state.selectSupervisor !== "") {
        setLeader("supervisorID", "selectSupervisor");
      }
      if (this.state.selectManager !== "") {
        setLeader("managerID", "selectManager");
      }
      if (this.state.selectHead !== "") {
        setLeader("headID", "selectHead");
      }
      if (this.state.selectGM !== "") {
        setLeader("gmID", "selectGM");
      }
    }

    if (level.toLowerCase() === "leader") {
      if (this.state.selectSupervisor !== "") {
        setLeader("supervisorID", "selectSupervisor");
      }
      if (this.state.selectManager !== "") {
        setLeader("managerID", "selectManager");
      }
      if (this.state.selectHead !== "") {
        setLeader("headID", "selectHead");
      }
      if (this.state.selectGM !== "") {
        setLeader("gmID", "selectGM");
      }
    }

    if (level.toLowerCase() === "supervisor") {
      if (this.state.selectManager !== "") {
        setLeader("managerID", "selectManager");
      }
      if (this.state.selectHead !== "") {
        setLeader("headID", "selectHead");
      }
      if (this.state.selectGM !== "") {
        setLeader("gmID", "selectGM");
      }
    }

    if (level.toLowerCase() === "manager") {
      if (this.state.selectHead !== "") {
        setLeader("headID", "selectHead");
      }
      if (this.state.selectGM !== "") {
        setLeader("gmID", "selectGM");
      }
    }

    if (level.toLowerCase() === "head") {
      if (this.state.selectGM !== "") {
        setLeader("gmID", "selectGM");
      }
    }

    if (this.state.idPoint !== "")
      user.set("absenPoint", {
        __type: "Pointer",
        className: "ValidGeopoint",
        objectId: this.state.idPoint,
      });
    //user.set('shifting', Shifting.createWithoutData(this.state.shifting));
    user.set("fullname", name);
    user.set("email", email);
    user.set("username", username);
    user.set("password", md5(password));
    user.set("passwordClone", md5(password));
    user.set("nik", nik.toUpperCase());
    user.set("tipe", tipeKaryawan);
    user.set("posisi", posisi);
    user.set("level", level.toLowerCase());
    user.set("imei", imei);
    user.set("jamKerja", jamKerja);
    user.set("lokasiKerja", lokasiKerja);
    user.set("department", deptName);
    if (this.state.jamMasuk === 0) {
      user.set("jamMasuk", 8);
    } else {
      user.set("jamMasuk", parseInt(this.state.jamMasuk));
    }
    if (this.state.jamKeluar === 0) {
      user.set("jamKeluar", 17);
    } else {
      user.set("jamKeluar", parseInt(this.state.jamKeluar));
    }
    user.set("jumlahCuti", parseInt(jumlahCuti));
    user.set("lembur", lembur);
    user.set("roles", level.toLowerCase());
    user.set("fotoWajah", new Parse.File("profile.jpg", fotoWajah));
    user
      .save()
      .then((x) => {
        const updateUser = new Parse.User();
        const queryUser = new Parse.Query(updateUser);

        // send textfile to server
        let users = {
          objectId: x.id,
          absenPoint: this.state.idPoint,
          fullname: x.get("fullname"),
          email: x.get("email"),
          username: x.get("username"),
          passwordClone: x.get("passwordClone"),
          nik: x.get("nik"),
          tipe: x.get("tipe"),
          posisi: x.get("posisi"),
          level: x.get("level"),
          imei: x.get("imei"),
          jamKerja:  x.get("jamKerja"),
          lokasiKerja: x.get("lokasiKerja"),
          jamMasuk: x.get("jamMasuk"),
          jumlahCuti: x.get("jumlahCuti"),
          lembur: x.get("lembur"),
          roles: x.get("roles"),
          fotoWajah: x.get("fotoWajah"),
          exclude: x.get("exclude"),
          appSetting: x.get("appSetting"),
          createdAt: x.get("createdAt"),
          updatedAt: x.get("updatedAt"),
          jamKeluar: x.get("jamKeluar"),
          leaderIdNew: x.get("leaderIdNew"),
          supervisorID: x.get("supervisorID"),
          managerID: x.get("managerID"),
          headID: x.get("headID"),
          gmID: x.get("gmID"),
          userId: x.id,
          statusUser: x.get("statusUser"),
          ACL: x.get("ACL"),
        }

        queryUser.get(x.id).then((y) => {
          y.set("userId", {
            __type: "Pointer",
            className: "_User",
            objectId: x.id,
          });
          y.save(null, { useMasterKey: true }).then((x) => {
            this.handleTextFile(users);
            this.setState({
              // daftarStaff: this.state.daftarStaff.concat(x),
              addMode: false,
              loadingModal: false,
              message: "Berhasil tambah data",
              visible: true,
              color: "success",
            });
          });
        });
      })
      .catch((err) => {
        this.setState({
          addMode: false,
          loadingModal: false,
          message: err.message,
          visible: true,
        });
        console.log(err.message);
      });
  };

  handleUpdate = (e) => {
    e.preventDefault();
    this.setState({ loadingModal: true });
    const {
      name,
      nik,
      tipeKaryawan,
      posisi,
      level,
      imei,
      jamKerja,
      lokasiKerja,
      jumlahCuti,
      lembur,
      fotoWajah,
      username,
      password,
      email,
    } = this.state;

    const user = new Parse.User();
    const query = new Parse.Query(user);

    query
      .get(this.state.userId)
      .then((x) => {
        const setLeader = (columnName, leaderState) => {
          user.set(columnName, {
            __type: "Pointer",
            className: "_User",
            objectId: this.state[leaderState],
          });
        };

        // if (this.state.selectLeader !== '')
        // 	setLeader('leaderIdNew', 'selectLeader')

        if (level.toLowerCase() === "staff") {
          if (this.state.selectLeader !== "") {
            setLeader("leaderIdNew", "selectLeader");
          }
          if (this.state.selectSupervisor !== "") {
            setLeader("supervisorID", "selectSupervisor");
          }
          if (this.state.selectManager !== "") {
            setLeader("managerID", "selectManager");
          }
          if (this.state.selectHead !== "") {
            setLeader("headID", "selectHead");
          }
          if (this.state.selectGM !== "") {
            setLeader("gmID", "selectGM");
          }
        }

        if (level.toLowerCase() === "leader") {
          if (this.state.selectSupervisor !== "") {
            setLeader("supervisorID", "selectSupervisor");
          }
          if (this.state.selectManager !== "") {
            setLeader("managerID", "selectManager");
          }
          if (this.state.selectHead !== "") {
            setLeader("headID", "selectHead");
          }
          if (this.state.selectGM !== "") {
            setLeader("gmID", "selectGM");
          }
        }

        if (level.toLowerCase() === "supervisor") {
          if (this.state.selectManager !== "") {
            setLeader("managerID", "selectManager");
          }
          if (this.state.selectHead !== "") {
            setLeader("headID", "selectHead");
          }
          if (this.state.selectGM !== "") {
            setLeader("gmID", "selectGM");
          }
        }

        if (level.toLowerCase() === "manager") {
          if (this.state.selectHead !== "") {
            setLeader("headID", "selectHead");
          }
          if (this.state.selectGM !== "") {
            setLeader("gmID", "selectGM");
          }
        }

        if (level.toLowerCase() === "head") {
          if (this.state.selectGM !== "") {
            setLeader("gmID", "selectGM");
          }
        }

        if (this.state.idPoint !== "")
          user.set("absenPoint", {
            __type: "Pointer",
            className: "ValidGeopoint",
            objectId: this.state.idPoint,
          });
        // if (this.state.shifting !== '')
        // 	x.set('shifting', {
        // 		__type: 'Pointer',
        // 		className: 'Shifting',
        // 		objectId: this.state.shifting
        // 	});
        x.set("fullname", this.state.fullname);
        x.set("email", email);
        x.set("username", username);
        x.set("jamMasuk", this.state.jamMasuk);
        x.set("jamKeluar", this.state.jamKeluar);
        x.set("username", username);
        if (password !== "") {
          x.set("password", md5(password));
          x.set("passwordClone", md5(password));
        }
        x.set("nik", nik.toUpperCase());
        x.set("tipe", tipeKaryawan);
        x.set("posisi", posisi);
        x.set("level", level.toLowerCase());
        x.set("imei", imei);
        x.set("jamKerja", jamKerja);
        x.set("lokasiKerja", lokasiKerja);
        x.set("jumlahCuti", parseInt(jumlahCuti));
        x.set("lembur", lembur);
        x.set("roles", level.toLowerCase());
        if (fotoWajah !== "")
          x.set("fotoWajah", new Parse.File("profile.jpg", fotoWajah));
        x.save(null, { useMasterKey: true })
          .then((x) => {
            this.setState({
              editMode: false,
              loadingModal: false,
              message: "Berhasil update data",
              visible: true,
              color: "success",
            });
          })
          .catch((err) => {
            this.setState({
              editMode: false,
              loadingModal: false,
              message: "Gagal update data, coba lagi",
              visible: true,
            });
            console.log(err.message);
          });
      })
      .catch((err) => {
        this.setState({
          editMode: false,
          loadingModal: false,
          message: err.message,
          visible: true,
        });
        console.log(err.message);
      });
  };

  getDetail = (e, id) => {
    e.preventDefault();
    const user = new Parse.User();
    const query = new Parse.Query(user);

    query.include("leaderIdNew");
    query.include("supervisorID");
    query.include("managerID");
    query.include("headID");
    query.include("gmID");
    query.include("absenPoint");
    query
      .get(id, { useMasterKey: true })
      .then(({ attributes }) => {
        console.log(attributes);
        // for (let i in attributes) {
        // 	console.log(`${i} : ${attributes[i]}`);
        // 	this.setState({ i: attributes[i] === undefined ? '' : attributes[i] });
        // }
        // console.log(attributes);
        this.setState({
          nik: attributes.nik,
          name: attributes.fullname,
          username: attributes.username,
          imei: attributes.imei,
          email: attributes.email,
          tipeKaryawan: attributes.tipe,
          posisi: attributes.posisi,
          jamKerja: attributes.jamKerja,
          lokasiKerja: attributes.lokasiKerja,
          jumlahCuti: attributes.jumlahCuti,
          jamMasuk: attributes.jamMasuk === undefined ? 0 : attributes.jamMasuk,
          jamKeluar:
            attributes.jamKeluar === undefined ? 0 : attributes.jamKeluar,
          absenPointObject:
            attributes.absenPoint === undefined ? "" : attributes.absenPoint,
          shifting:
            attributes.shifting === undefined ? "" : attributes.shifting,
          lembur: attributes.lembur,
          level: attributes.roles.toLowerCase(),
          leader:
            attributes.leaderIdNew === undefined ? "" : attributes.leaderIdNew,
          supervisor:
            attributes.supervisorID === undefined
              ? ""
              : attributes.supervisorID,
          manager:
            attributes.managerID === undefined ? "" : attributes.managerID,
          head: attributes.headID === undefined ? "" : attributes.headID,
          gm: attributes.gmID === undefined ? "" : attributes.gmID,
          editMode: true,
        });
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  toggle = (state) => {
    this.setState({
      [state]: !this.state[state],
    });
  };

  handleIdAbsen = (e) => {
    var element_input = document.getElementById("myoptions");
    var element_datalist = document.getElementById("data");
    var opSelected = element_datalist.querySelector(
      `[value="${element_input.value}"]`
    );
    if (opSelected.getAttribute("data-key") !== null) {
      var id = opSelected.getAttribute("data-key");
      console.log(id);
      console.log(e.target.value);
      this.setState({
        selectLeader: id,
      });
    }
  };

  toggleAlert = (state) => {
    this.setState({
      [state]: !this.state[state]
    });
    window.location.reload(false);
  };

  render() {
    const {
      daftarStaff,
      loading,
      loadingReco,
      message,
      level,
      email,
      fullname,
      imei,
      jamKerja,
      jumlahCuti,
      lokasiKerja,
      shifting,
      lembur,
      tipeKaryawan,
      nik,
      posisi,
      daftarPoint,
      loadingModal,
      fullnames,
      addMode,
      leader,
      photoMode,
      statusReco,
      daftarShifting,
      daftarLevel,
      daftarPosisi,
      daftarTipe,
      dept,
      editMode,
    } = this.state;

    const leaderForm = (
      <FormGroup controlId="formLeaders">
        <Label className="form-control-label">Pilih leader</Label>
        <Input
          type="select"
          className="form-control-alternative"
          required={true}
          onChange={(e) => {
            this.setState({ selectLeader: e.target.value });
          }}
        >
          <option selected disabled hidden>
            Pilih leader
          </option>
          {this.state.daftarLeader.map((x, i) => (
            <option key={i} value={x.id}>
              {x.get("fullname")}
            </option>
          ))}
        </Input>
      </FormGroup>
    );

    const supervisorForm = (
      <FormGroup controlId="formLeaders">
        <Label className="form-control-label">Pilih supervisor</Label>
        <Input
          className="form-control-alternative"
          type="select"
          required={true}
          onChange={(e) => {
            this.setState({ selectSupervisor: e.target.value });
          }}
        >
          <option selected disabled hidden>
            Pilih supervisor
          </option>
          {this.state.daftarSupervisor.map((x, i) => (
            <option key={i} value={x.id}>
              {x.get("fullname") === undefined ? "" : x.get("fullname")}
            </option>
          ))}
        </Input>
      </FormGroup>
    );

    const managerForm = (
      <FormGroup controlId="formLeaders">
        <Label className="form-control-label">Pilih manager</Label>
        <Input
          className="form-control-alternative"
          type="select"
          required={true}
          onChange={(e) => {
            this.setState({ selectManager: e.target.value });
          }}
        >
          <option selected disabled hidden>
            Pilih manager
          </option>
          {this.state.daftarManager.map((x, i) => (
            <option key={i} value={x.id}>
              {x.get("fullname")}
            </option>
          ))}
        </Input>
      </FormGroup>
    );

    const headForm = (
      <FormGroup controlId="formLeaders">
        <Label className="form-control-label">Pilih head</Label>
        <Input
          className="form-control-alternative"
          type="select"
          required={true}
          onChange={(e) => {
            this.setState({ selectHead: e.target.value });
          }}
        >
          <option selected disabled hidden>
            Pilih head
          </option>
          {this.state.daftarHead.map((x, i) => (
            <option key={i} value={x.id}>
              {x.get("fullname")}
            </option>
          ))}
        </Input>
      </FormGroup>
    );

    const gmForm = (
      <FormGroup controlId="formLeaders">
        <Label className="form-control-label">Pilih GM</Label>
        <Input
          className="form-control-alternative"
          type="select"
          required={true}
          onChange={(e) => {
            this.setState({ selectGM: e.target.value });
          }}
        >
          <option selected disabled hidden>
            Pilih GM
          </option>
          {this.state.daftarGM.map((x, i) => (
            <option key={i} value={x.id}>
              {x.get("fullname")}
            </option>
          ))}
        </Input>
      </FormGroup>
    );

    const staffSelectDropdown = (
      <React.Fragment>
        <Row>
          <Col lg="4">{leaderForm}</Col>

          <Col lg="4">{supervisorForm}</Col>

          <Col lg="4">{managerForm}</Col>
        </Row>
        <Row>
          <Col lg="4">{headForm}</Col>

          <Col lg="4">{gmForm}</Col>
        </Row>
      </React.Fragment>
    );

    const leaderSelectDropdown = (
      <React.Fragment>
        <Row>
          <Col lg="4">{supervisorForm}</Col>
          <Col lg="4">{managerForm}</Col>
          <Col lg="4">{headForm}</Col>
        </Row>
        <Row>
          <Col lg="4">{gmForm}</Col>
        </Row>
      </React.Fragment>
    );

    const supervisorSelectDropdown = (
      <React.Fragment>
        <Row>
          <Col lg="4">{managerForm}</Col>
          <Col lg="4">{headForm}</Col>
          <Col lg="4">{gmForm}</Col>
        </Row>
      </React.Fragment>
    );

    const managerSelectDropdown = (
      <React.Fragment>
        <Row>
          <Col lg="4">{headForm}</Col>
          <Col lg="4">{gmForm}</Col>
        </Row>
      </React.Fragment>
    );

    const headSelectDropdown = (
      <React.Fragment>
        <FormGroup controlId="formLeaders">
          <Label>Pilih GM</Label>
          <Input
            type="select"
            required={true}
            onChange={(e) => {
              this.setState({ selectGM: e.target.value });
            }}
          >
            <option selected disabled hidden>
              Pilih GM
            </option>
            {this.state.daftarGM.map((x, i) => (
              <option key={i} value={x.id}>
                {x.get("fullname")}
              </option>
            ))}
          </Input>
        </FormGroup>
      </React.Fragment>
    );

    const getDropdownByLevel = (userSelectLevel) => {
      switch (userSelectLevel.toLowerCase()) {
        case "staff":
          return staffSelectDropdown;
        case "team leader":
          return leaderSelectDropdown;
        case "supervisor":
          return supervisorSelectDropdown;
        case "manager":
          return managerSelectDropdown;
        case "head":
          return headSelectDropdown;
        default:
          return;
      }
    };

    const selectForm = (
      <FormGroup controlId="formlvl">
        <Input
          className="form-control-alternative"
          type="select"
          required={true}
          onChange={(e) =>
            this.setState({
              searchValue: e.target.value,
            })
          }
        >
          <option selected disabled hidden>
            Pilih {this.state.searchBy}
          </option>
          {this.state.searchBy === "leader"
            ? daftarLevel.map((x, i) => (
                <option key={i} value={x.get("level")}>
                  {x.get("level")}
                </option>
              ))
            : this.state.daftarPosisi.map((x, i) => (
                <option key={i} value={x.get("position")}>
                  {x.get("position")}
                </option>
              ))}
        </Input>
      </FormGroup>
    );

    const textForm = (
      <FormGroup>
        <Input
          type="text"
          className="form-control-alternative"
          disabled={this.state.searchBy === "all"}
          placeholder={
            this.state.searchBy === "all"
              ? ""
              : `Masukkan ${this.state.searchBy}`
          }
          onChange={(e) =>
            this.setState({
              searchValue: e.target.value,
            })
          }
        />
      </FormGroup>
    );

    return (
      <React.Fragment>
        <HeaderNormal />

        {/* Page content */}
        <Container className="mt--8" fluid>
          <Row>
            <Col className="order-xl-1" xl="12">
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
                togglez={() => this.toggle("visible")}
              /> */}
              <Card className="bg-secondary shadow">
                <CardHeader className="bg-white border-0">
                  <Row className="align-items-center">
                    <Col xs="8">
                      <h3 className="mb-0">
                        Daftarin anggota karyawanmu disini!
                      </h3>
                    </Col>
                    <Col className="text-right" xs="4">
                      <Link color="inherit" to="/admin/staff">
                        <Button color="primary" size="sm">
                          Lihat seluruh anggota karyawan? Klik disini!
                        </Button>
                      </Link>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <Form
                    onSubmit={(e) => this.handleCheckImei(e, this.state.imei)}
                    autoComplete="off"
                  >
                    <h6 className="heading-small text-muted mb-4">
                      User information
                    </h6>
                    <div className="pl-lg-4">
                      <Row>
                        <Col lg="6">
                          <FormGroup controlId="formCategory">
                            <Label className="form-control-label">
                              Foto wajah
                            </Label>
                            <Input
                              type="file"
                              label="Foto wajah"
                              required={true}
                              onChange={this.handleFace}
                            />
                            <FormText
                              className={loadingReco ? "text-muted" : ""}
                              style={{
                                color: `${
                                  this.state.statusReco == 0 ? "red" : "green"
                                }`,
                              }}
                            >
                              {loadingReco ? "processing..." : message}
                            </FormText>
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-username"
                            >
                              Username
                            </label>
                            <Input
                              className="form-control-alternative"
                              autoComplete="off"
                              id="input-username"
                              placeholder="Username"
                              type="text"
                              onChange={(e) =>
                                this.setState({ username: e.target.value })
                              }
                            />
                          </FormGroup>
                        </Col>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-email"
                            >
                              Email address
                            </label>
                            <Input
                              className="form-control-alternative"
                              id="input-email"
                              placeholder="email@kamu.com"
                              type="email"
                              onChange={(e) =>
                                this.setState({ email: e.target.value })
                              }
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg="12">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-first-name"
                            >
                              Full Name
                            </label>
                            <Input
                              className="form-control-alternative"
                              id="input-first-name"
                              placeholder="Nama lengkap"
                              type="text"
                              onChange={(e) =>
                                this.setState({ name: e.target.value })
                              }
                            />
                          </FormGroup>
                        </Col>
                        {/* <Col lg="6">
                          <FormGroup>
                            <label className="form-control-label" htmlFor="input-last-name">
                              Last name
                            </label>
                            <Input
                              className="form-control-alternative"
                              defaultValue="Jesse"
                              id="input-last-name"
                              placeholder="Last name"
                              type="text"
                            />
                          </FormGroup>
                        </Col> */}
                      </Row>
                      <Row>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-password"
                            >
                              Password
                            </label>
                            <Input
                              className="form-control-alternative"
                              autoComplete="off"
                              id="input-password"
                              placeholder="Password kamu"
                              type="password"
                              minLength={8}
                              onChange={(e) =>
                                this.setState({ password: e.target.value })
                              }
                            />
                          </FormGroup>
                        </Col>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-imei"
                            >
                              IMEI
                            </label>
                            <Input
                              className="form-control-alternative"
                              id="input-imei"
                              placeholder="IMEI Hp"
                              type="text"
                              onChange={(e) =>
                                this.setState({ imei: e.target.value })
                              }
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                    </div>
                    <hr className="my-4" />
                    {/* Address */}
                    <h6 className="heading-small text-muted mb-4">
                      Job information
                    </h6>
                    <div className="pl-lg-4">
                      <Row>
                        <Col lg="4">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-address"
                            >
                              NIK
                            </label>
                            <Input
                              className="form-control-alternative"
                              // defaultValue="Bld Mihail Kogalniceanu, nr. 8 Bl 1, Sc 1, Ap 09"
                              id="input-nik"
                              placeholder="NIK Karyawan"
                              type="text"
                              onChange={(e) =>
                                this.setState({ nik: e.target.value })
                              }
                            />
                          </FormGroup>
                        </Col>
                        <Col lg="4">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-address"
                            >
                              Level
                            </label>
                            <Input
                              className="form-control-alternative"
                              type="select"
                              required={true}
                              onChange={(e) =>
                                this.setState({
                                  level: e.target.value,
                                })
                              }
                            >
                              <option disabled hidden>
                                Pilih level
                              </option>
                              {daftarLevel.map((x, i) => (
                                <option key={i} value={x.get("level")}>
                                  {x.get("level")}
                                </option>
                              ))}
                            </Input>
                          </FormGroup>
                        </Col>
                        <Col lg="4">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-address"
                            >
                              Tipe karyawan
                            </label>
                            <Input
                              className="form-control-alternative"
                              type="select"
                              required={true}
                              onChange={(e) =>
                                this.setState({
                                  tipeKaryawan: e.target.value,
                                })
                              }
                            >
                              <option selected disabled hidden>
                                Pilih tipe karyawan
                              </option>
                              {daftarTipe.map((x, i) => (
                                <option key={i} value={x.get("tipe")}>
                                  {x.get("tipe")}
                                </option>
                              ))}
                            </Input>
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg="4">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-deptName"
                            >
                              Departemen
                            </label>
                            <Input
                              className="form-control-alternative"
                              id="input-deptName"
                              type="select"
                              onChange={(e) =>
                                this.setState({
                                  deptName: e.target.value.toUpperCase(),
                                })
                              }
                            >
                              <option selected disabled hidden>
                                Pilih Departemen
                              </option>
                              {dept.map((x, i) => (
                                <option key={i} value={x.get("deptName")}>
                                  {x.get("deptName")}
                                </option>
                              ))}
                            </Input>
                          </FormGroup>
                        </Col>
                        <Col lg="4">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-posisi"
                            >
                              Posisi kerja
                            </label>
                            <Input
                              className="form-control-alternative"
                              id="input-posisi"
                              type="select"
                              onChange={(e) =>
                                this.setState({
                                  posisi: e.target.value.toUpperCase(),
                                })
                              }
                            >
                              <option selected disabled hidden>
                                Pilih posisi
                              </option>
                              {daftarPosisi.map((x, i) => (
                                <option key={i} value={x.get("position")}>
                                  {x.get("position")}
                                </option>
                              ))}
                            </Input>
                          </FormGroup>
                        </Col>
                        <Col lg="4">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-jam-kerja"
                            >
                              Jam kerja
                            </label>
                            <Input
                              className="form-control-alternative"
                              id="input-jam-kerja"
                              type="select"
                              onChange={(e) =>
                                this.setState({
                                  jamKerja: e.target.value,
                                })
                              }
                            >
                              <option selected disabled hidden>
                                Pilih jam kerja
                              </option>
                              {["Jam tetap", "Jam fleksibel", "Jam bebas"].map(
                                (x) => (
                                  <option value={x}>{x}</option>
                                )
                              )}
                            </Input>
                          </FormGroup>
                        </Col>
                        
                      </Row>
                      <Row>
                        <Col lg="4">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-lokasi"
                            >
                              Lokasi kerja
                            </label>
                            <Input
                              className="form-control-alternative"
                              id="input-lokasi"
                              type="select"
                              onChange={(e) =>
                                this.setState({
                                  lokasiKerja: e.target.value,
                                })
                              }
                            >
                              <option selected disabled hidden>
                                Pilih lokasi kerja
                              </option>
                              {["Tetap", "Bebas (mobile)"].map((x) => (
                                <option value={x}>{x}</option>
                              ))}
                            </Input>
                          </FormGroup>
                        </Col>
                        <Col lg="4">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-lembur"
                            >
                              Lembur ?
                            </label>
                            <Input
                              className="form-control-alternative"
                              id="input-lembur"
                              type="select"
                              onChange={(e) =>
                                this.setState({
                                  lembur: e.target.value,
                                })
                              }
                            >
                              <option selected disabled hidden>
                                Pilih tipe lembur
                              </option>
                              {["ya", "tidak"].map((x) => (
                                <option value={x}>{x}</option>
                              ))}
                            </Input>
                          </FormGroup>
                        </Col>
                        <Col lg="4">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-cuti"
                            >
                              Jumlah Cuti
                            </label>
                            <Input
                              className="form-control-alternative"
                              id="input-lokasi"
                              type="number"
                              value={jumlahCuti}
                              onChange={(e) =>
                                this.setState({
                                  jumlahCuti: e.target.value,
                                })
                              }
                            ></Input>
                          </FormGroup>
                        </Col>
                      </Row>
                      {this.state.jamKerja !== "" &&
                      this.state.jamKerja !== "Jam bebas" ? (
                        <Row>
                          <Col lg="12">
                            <FormGroup controlId="formJam">
                              <Label className="form-control-label">
                                Jam masuk dan keluar
                              </Label>
                              <Row>
                                <Col md={4}>
                                  <Input
                                    className="form-control-alternative"
                                    type="number"
                                    required={true}
                                    placeholder="Jam Masuk"
                                    onChange={(e) =>
                                      this.setState({
                                        jamMasuk: e.target.value,
                                      })
                                    }
                                  />
                                </Col>
                                <Col md={4}>
                                  <Input
                                    className="form-control-alternative"
                                    type="number"
                                    placeholder="Jam Keluar"
                                    required={true}
                                    onChange={(e) =>
                                      this.setState({
                                        jamKeluar: e.target.value,
                                      })
                                    }
                                  />
                                </Col>
                              </Row>
                            </FormGroup>
                          </Col>
                        </Row>
                      ) : (
                        ""
                      )}
                      {this.state.lokasiKerja === "Tetap" ? (
                        <Row>
                          <Col lg="4">
                            <FormGroup controlId="formPoint">
                              <Label className="form-control-label">
                                Absen point
                              </Label>
                              <Input
                                className="form-control-alternative"
                                type="select"
                                required={true}
                                onChange={(e) =>
                                  this.setState({
                                    idPoint: e.target.value,
                                  })
                                }
                              >
                                <option selected disabled hidden>
                                  Pilih absen point
                                </option>
                                {daftarPoint.map((x) => (
                                  <option value={x.id}>
                                    {x.get("placeName")}
                                  </option>
                                ))}
                              </Input>
                            </FormGroup>
                          </Col>
                        </Row>
                      ) : (
                        ""
                      )}
                    </div>

                    {this.state.level !== "" &&
                    this.state.level.toLowerCase() !== "gm" &&
                    this.state.level.toLowerCase() !== "admin" ? (
                      <React.Fragment>
                        <hr className="my-4" />
                        <h6 className="heading-small text-muted mb-4">
                          Choose leader
                        </h6>
                        <div className="pl-lg-4">
                          {getDropdownByLevel(this.state.level.toLowerCase())}
                        </div>
                      </React.Fragment>
                    ) : (
                      ""
                    )}

                    <div className="pl-lg-4">
                      <Row className="mt-2">
                        <Col lg="12">
                          <Button
                            block
                            color={
                              this.state.statusReco === 0
                                ? "primary"
                                : "primary"
                            }
                            type="submit"
                            disabled={
                              this.state.statusReco === 0 ? true : false
                            }
                          >
                            {this.state.statusReco === 0 ? (
                              "upload foto dahulu"
                            ) : this.state.loadingModal ? (
                              <div>
                                <Spinner
                                  as="span"
                                  animation="grow"
                                  size="sm"
                                  role="status"
                                  aria-hidden="true"
                                />{" "}
                                Submitting...
                              </div>
                            ) : (
                              "Submit"
                            )}
                          </Button>
                        </Col>
                      </Row>
                    </div>
                    {/* <hr className="my-4" /> */}
                    {/* Description */}
                    {/* <h6 className="heading-small text-muted mb-4">About me</h6>
                    <div className="pl-lg-4">
                      <FormGroup>
                        <label>About Me</label>
                        <Input
                          className="form-control-alternative"
                          placeholder="A few words about you ..."
                          rows="4"
                          defaultValue="A beautiful Dashboard for Bootstrap 4. It is Free and
                          Open Source."
                          type="textarea"
                        />
                      </FormGroup>
                    </div> */}
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </React.Fragment>
    );
  }
}

export default FormRegister;
