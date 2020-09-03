import React from 'react';
import { UncontrolledAlert, Alert } from 'reactstrap';

const Alertz = ({ color, message, open, togglez }) => {
	return (
		<React.Fragment>
			<Alert color={color} isOpen={open} toggle={togglez} fade={false}>
				<span className="alert-inner--text">
					{/* <strong>Success!</strong> This is a success alert—check it out! */}
					{message}
				</span>
			</Alert>
		</React.Fragment>
	);
};

export default Alertz;
