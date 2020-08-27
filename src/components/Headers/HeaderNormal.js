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
import Skeleton from 'react-loading-skeleton';

// reactstrap components
import { Card, CardBody, CardTitle, Container, Row, Col } from 'reactstrap';
import { Link } from 'react-router-dom';
import Parse from 'parse';
import moment from 'moment';
import { getLeaderId } from 'utils';

class HeaderNormal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			activeNav: 1,
			chartExample1Data: 'data1'
		};
	}

	render() {
		return (
			<React.Fragment>
				<div className="header bg-gradient-info pb-8 pt-5 pt-md-8">
					<Container fluid>
						<div className="header-body" />
					</Container>
				</div>
			</React.Fragment>
		);
	}
}

export default HeaderNormal;
