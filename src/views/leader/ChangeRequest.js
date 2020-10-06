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
  Badge,
  Card,
  CardHeader,
  Table,
  Container,
  Row,
  UncontrolledTooltip,
  Spinner,
  Button,
  Form,
  FormGroup,
  Pagination,
  PaginationItem,
  PaginationLink,
  Input,
  Col,
  Label,
  FormText,
  InputGroup,
} from "reactstrap";
// core components
import Header from "components/Headers/Header.js";
import Parse from "parse";
import moment from "moment";
import { getLeaderId } from "utils";
import ModalHandler from "components/Modal/Modal";
import Axios from "axios";
import HeaderNormal from "components/Headers/HeaderNormal";
import Alerts from "components/Alert/Alert";

class ChangeRequest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      staff: [],
      shift: [],
      loading: false,
      requestMode: false,
      rejectMode: false,
      userIndex: 0,
      loadingModal: false,
      userId: "",
      fullnames: "",
      reason: "",
      checkId: [],
      loadingReco: false,
      message: "",
      searchBy: "all",
      searchValue: "",
      statusReco: 0,
      fotoWajah: "",
      jumlahCuti: "",
      shifting: "",
      jamKerja: "",
      lembur: "",
      email: "",
      posisi: "",
      tipe: "",
      level: "",
      messageApprove: "",
      alerts: 2,
      daftarPoint: [],
      absenPoint: "",
    };
  }

  componentDidMount() {
    this.getData();
    this.getPoint();
  }

  getData() {
    this.setState({ loading: true });
    const User = new Parse.User();
    const query = new Parse.Query(User);

    // query.equalTo("leaderId", {
    //   __type: "Pointer",
    //   className: "Leader",
    //   objectId: getLeaderId(),
    // });
    query.equalTo("leaderIdNew", {
      __type: "Pointer",
      className: "_User",
      objectId: getLeaderId(),
    });
    query.notContainedIn("roles", ["admin", "Admin", "Leader", "leader"]);
    query.include("shifting");
    query.include("userId");
    query.descending("createdAt");

    query
      .find({ useMasterKey: true })
      .then((x) => {
        console.log(x);
        this.setState({ staff: x, loading: false });
      })
      .catch((err) => {
        alert(err.message);
        this.setState({ loading: false });
      });
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

  toggle = (state) => {
    this.setState({
      [state]: !this.state[state],
    });
  };

  handleSearchBy = (e) => {
    e.preventDefault();
    this.setState({ loading: true });
    const { searchBy, searchValue } = this.state;

    if (searchBy === "name") {
      const User = new Parse.User();
      const query = new Parse.Query(User);
      query.matches("fullname", searchValue, "i");
      query.equalTo("roles", "staff");
      query
        .find()
        .then((name) => {
          this.setState({ staff: name, loading: false });
        })
        .catch((err) => alert(err.message));
      return;
    }

    if (searchBy === "all") {
      const User = new Parse.User();
      const query = new Parse.Query(User);
      query.equalTo("roles", "staff");
      query.descending("createdAt");
      query
        .find()
        .then((name) => {
          this.setState({ staff: name, loading: false });
        })
        .catch((err) => alert(err.message));
      return;
    }

    const User = new Parse.User();
    const query = new Parse.Query(User);
    query.equalTo("nik", searchValue.toUpperCase());
    query.equalTo("roles", "staff");
    query
      .find()
      .then((x) => {
        console.log(x);
        this.setState({ staff: x, loading: false });
      })
      .catch((err) => alert(err.message));
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({ loadingModal: true });
    const {
      userId,
      fotoWajah,
      imei,
      shifting,
      jamKerja,
      jumlahCuti,
      lembur,
      email,
      posisi,
      tipe,
      level,
      absenPoint,
    } = this.state;

    const ChangeRequest = Parse.Object.extend("ChangeRequest");
    const Shifting = Parse.Object.extend("Shifting");
    const ValidGeopoint = Parse.Object.extend("ValidGeopoint");
    const cr = new ChangeRequest();

    cr.set("userId", Parse.User.createWithoutData(userId));
    cr.set("leaderId", Parse.User.createWithoutData(getLeaderId()));
    if (fotoWajah !== "")
      cr.set("fotoWajah", new Parse.File("foto_wajah.jpg", fotoWajah));
    // if (imei !== "") cr.set("imei", imei);
    if (shifting !== "")
      cr.set("shifting", Shifting.createWithoutData(shifting));
    if (absenPoint !== "")
      cr.set("absenPoint", ValidGeopoint.createWithoutData(absenPoint));
    if (jumlahCuti !== "") cr.set("jumlahCuti", parseInt(jumlahCuti));
    if (lembur !== "") cr.set("lembur", lembur);
    // if (jamKerja !== "") cr.set("jamKerja", jamKerja);
    // if (email !== "") cr.set("email", email);
    // if (posisi !== "") cr.set("posisi", posisi);
    // if (tipe !== "") cr.set("tipe", tipe);
    // if (level !== "") cr.set("level", level);

    cr.save()
      .then((x) => {
        // alert("Succes melakukan request!");
        this.setState({
          messageApprove: "Success melakukan request",
          alerts: 1,
          requestMode: false,
        });
      })
      .catch((err) => {
        alert(err.message);
        this.setState({ requestMode: false });
      });
  };

  handleFace = (e) => {
    this.setState({
      loadingReco: true,
      statusReco: 0,
      fotoWajah: e.target.files[0],
    });

    const formData = new FormData();
    formData.append("knax", e.target.files[0]);

    Axios.post("http://34.126.96.126:4000/api/face-check", formData, {
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

  render() {
    const {
      staff,
      shift,
      loading,
      loadingModal,
      loadingReco,
      requestMode,
      rejectMode,
      message,
      statusReco,
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
                  <h3 className="mb-0">Data staff</h3>
                  {parseInt(this.state.alerts) === 2 ? (
                    ""
                  ) : (
                    <Alerts
                      show={true}
                      icon="ni ni-like-2"
                      alert="success"
                      message={`${this.state.messageApprove}`}
                    />
                  )}
                  <Form
                    role="form"
                    onSubmit={this.handleSearchBy}
                    className="mt-3"
                  >
                    <div className="row">
                      <div className="col-md-2 col-sm-12">
                        <p>Search By</p>
                      </div>
                      <div className="col-md-2 col-sm-12">
                        <FormGroup>
                          <InputGroup className="input-group-alternative">
                            <Input
                              type="select"
                              className="fa-pull-right"
                              defaultValue="all"
                              onChange={(e) => {
                                this.setState({ searchBy: e.target.value });
                              }}
                            >
                              {["all", "nik", "name"].map((x) => (
                                <option value={x}>{x}</option>
                              ))}
                            </Input>
                          </InputGroup>
                        </FormGroup>
                      </div>
                      <div className="col-md-4 col-sm-12">
                        <FormGroup>
                          <InputGroup className="input-group-alternative">
                            <Input
                              type="text"
                              className="fa-pull-right"
                              onChange={(e) => {
                                this.setState({ searchValue: e.target.value });
                              }}
                              placeholder={`Masukan ${this.state.searchBy}`}
                              disabled={
                                this.state.searchBy === "all" ? true : false
                              }
                              required={
                                this.state.searchBy === "all" ? false : true
                              }
                            ></Input>
                          </InputGroup>
                        </FormGroup>
                      </div>
                      <div className="text-center mt--4">
                        <Button
                          className="my-4"
                          color="primary"
                          type="submit"
                          disabled={loading}
                        >
                          {loading ? (
                            <div>
                              <Spinner
                                as="span"
                                animation="grow"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                              />{" "}
                              Loading
                            </div>
                          ) : (
                            "Search"
                          )}
                        </Button>
                      </div>
                    </div>
                  </Form>
                  {staff.length === 0 ? (
                    ""
                  ) : this.state.checkId.length === 0 ? (
                    ""
                  ) : (
                    <Col sm={{ span: 0 }} className="float-none">
                      <Button
                        color="primary"
                        size="sm"
                        type="submit"
                        disable={loading ? "true" : "false"}
                        className="mr-2 m-1"
                        onClick={() => this.setState({ approveAllMode: true })}
                      >
                        <i className="fa fa-check" />{" "}
                        {loading ? "Fetching..." : "Approve"}
                      </Button>
                      <Button
                        color="primary"
                        type="submit"
                        size="sm"
                        className="m-1"
                        disable={loading ? "true" : "false"}
                        onClick={this.setState({ rejectAllMode: true })}
                      >
                        <i className="fa fa-times" />{" "}
                        {loading ? "Fetching..." : "Reject"}
                      </Button>
                    </Col>
                  )}
                  {/* <input type="text" placeholder="input" /> */}
                </CardHeader>
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">NIK</th>
                      <th scope="col">Nama</th>
                      <th scope="col">Shifting</th>
                      <th scope="col">Jumlah Cuti</th>
                      <th scope="col">Lembur</th>
                      <th scope="col">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <td colSpan={7} style={{ textAlign: "center" }}>
                        <Spinner
                          as="span"
                          animation="grow"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />{" "}
                        <Spinner
                          as="span"
                          animation="grow"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />{" "}
                        <Spinner
                          as="span"
                          animation="grow"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />
                      </td>
                    ) : staff.length < 1 ? (
                      <td colSpan={7} style={{ textAlign: "center" }}>
                        No data found...
                      </td>
                    ) : (
                      staff.map((prop, key) => (
                        <tr>
                          <td>{prop.get("nik")}</td>
                          <td>{prop.get("fullname")}</td>
                          <td>
                            {prop.get("shifting") === undefined
                              ? "-"
                              : prop.get("shifting").attributes.tipeShift}
                          </td>
                          <td>{prop.get("jumlahCuti")}</td>
                          <td>{prop.get("lembur")}</td>
                          <td>
                            <Button
                              id="t1"
                              color="primary"
                              className="btn-circle"
                              onClick={() => {
                                this.setState({
                                  requestMode: true,
                                  userId: prop.id,
                                  userIndex: key,
                                  fullnames: prop.get("fullname"),
                                });
                              }}
                            >
                              <i className="fa fa-edit" />
                            </Button>
                            <UncontrolledTooltip
                              delay={0}
                              placement="top"
                              target="t1"
                            >
                              Ubah data
                            </UncontrolledTooltip>
                          </td>
                        </tr>
                      ))
                    )}
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

        {/* Ubah Data Modal */}
        <ModalHandler
          show={requestMode}
          loading={loadingModal}
          footer={false}
          handleHide={() => this.toggle("requestMode")}
          title="Change Request Form"
          body={
            <div>
              <Form onSubmit={this.handleSubmit} className="text-dark">
                <FormGroup>
                  <Label>Foto Wajah</Label>
                  <Input
                    id="exampleFormControlInput1"
                    type="file"
                    onChange={this.handleFace}
                  />
                  <FormText
                    className={loadingReco ? "text-muted" : ""}
                    style={{ color: `${statusReco == 0 ? "red" : "green"}` }}
                  >
                    {loadingReco ? "Processing..." : message}
                  </FormText>
                </FormGroup>

                {/* <FormGroup controlId="formImei">
                  <Label>IMEI</Label>
                  <Input
                    autoCapitalize="true"
                    autoComplete="false"
                    type="text"
                    placeholder="Masukkan imei hp"
                    onChange={(e) =>
                      this.setState({
                        imei: e.target.value,
                      })
                    }
                  />
                </FormGroup>

                <FormGroup controlId="formImei">
                  <Label>Email</Label>
                  <Input
                    autoCapitalize="true"
                    autoComplete="false"
                    type="email"
                    placeholder="Masukkan email"
                    onChange={(e) =>
                      this.setState({
                        email: e.target.value,
                      })
                    }
                  />
                </FormGroup> */}

                {/* <FormGroup controlId="formImei">
                  <Label>Tipe Karyawan</Label>
                  <Input
                    autoCapitalize="true"
                    autoComplete="false"
                    type="text"
                    placeholder="Masukkan tipe karyawan"
                    onChange={(e) =>
                      this.setState({
                        tipe: e.target.value,
                      })
                    }
                  />
                </FormGroup>

                <FormGroup controlId="formPosisi">
                  <Label>Posisi</Label>
                  <Input
                    autoCapitalize="true"
                    autoComplete="false"
                    type="text"
                    placeholder="Masukkan posisi"
                    onChange={(e) =>
                      this.setState({
                        posisi: e.target.value,
                      })
                    }
                  />
                </FormGroup>

                <FormGroup controlId="formEmail">
                  <Label>Level</Label>
                  <Input
                    autoCapitalize="false"
                    autoComplete="false"
                    type="text"
                    placeholder="Masukkan level karyawan"
                    onChange={(e) =>
                      this.setState({
                        level: e.target.value,
                      })
                    }
                  />
                </FormGroup>

                <FormGroup controlId="formImei">
                  <Label>Jam Kerja</Label>
                  <Input
                    autoCapitalize="true"
                    autoComplete="false"
                    type="select"
                    onChange={(e) =>
                      this.setState({
                        jamKerja: e.target.value,
                      })
                    }
                  >
                    {["Jam tetap", "Jam fleksibel", "Jam bebas"].map((x) => (
                      <option value={x}>{x}</option>
                    ))}
                  </Input>
                </FormGroup> */}

                <FormGroup controlId="formLokasi">
                  <Label>Absen point</Label>
                  <Input
                    type="select"
                    required={true}
                    onChange={(e) =>
                      this.setState({
                        absenPoint: e.target.value,
                      })
                    }
                  >
                    <option selected disabled hidden>
                      Pilih Absen Point
                    </option>
                    {this.state.daftarPoint.map((prop, key) => (
                      <option key={prop.id} value={prop.id}>
                        {prop.get("placeName")}
                      </option>
                    ))}
                  </Input>
                </FormGroup>

                <FormGroup controlId="formCuti">
                  <Label>Jumlah cuti</Label>
                  <Input
                    type="number"
                    placeholder="Masukkan jumlah cuti"
                    onChange={(e) =>
                      this.setState({
                        jumlahCuti: parseInt(e.target.value),
                      })
                    }
                  />
                </FormGroup>

                <FormGroup controlId="formLembut">
                  <Label>Lembur</Label>
                  <Input
                    className="text-dark"
                    type="select"
                    onChange={(e) =>
                      this.setState({
                        lembur: e.target.value,
                      })
                    }
                  >
                    <option selected disabled hidden>
                      Pilih Lembur
                    </option>
                    {["Ya", "Tidak"].map((x) => (
                      <option value={x}>{x}</option>
                    ))}
                  </Input>
                </FormGroup>
                <Button
                  color="secondary"
                  data-dismiss="modal"
                  type="button"
                  onClick={() => this.toggle("requestMode")}
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
                      />{" "}
                      Submitting...
                    </div>
                  ) : (
                    "Submit"
                  )}
                </Button>
              </Form>
            </div>
          }
          handleSubmit={this.rejectChecked}
        />
      </React.Fragment>
    );
  }
}

export default ChangeRequest;
