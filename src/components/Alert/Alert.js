import React from "react";
// reactstrap components
import { UncontrolledAlert } from "reactstrap";

class Alerts extends React.Component {
  handleShow = () => {
    this.setState({ show: true });

    setTimeout(() => {
      this.setState({ show: false });
    }, 300);
  };
  render() {
    return (
      <>
        <UncontrolledAlert
          color={this.props.alert}
          fade={false}
          show={this.handleShow}
        >
          <span className="alert-inner--icon">
            <i className={this.props.icon} />
          </span>{" "}
          <span className="alert-inner--text">
            <strong>{this.props.alert} !</strong> {this.props.message}
          </span>
        </UncontrolledAlert>
      </>
    );
  }
}

export default Alerts;
