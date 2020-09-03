import React from 'react';
import { Toast, ToastHeader, ToastBody } from 'reactstrap';

const Toastz = ({ show, toggle, title, message }) => {
	return (
		<Toast
			isOpen={show}
			style={{
				position: 'absolute',
				top: 0,
				right: 0,
				color: 'black',
				width: '100px'
			}}
		>
			<ToastHeader toggle={toggle}>{title}</ToastHeader>
			<ToastBody>{message}</ToastBody>
		</Toast>
	);
};

export default Toastz;
