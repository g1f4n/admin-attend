import React from 'react';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';

const Paginations = ({ resPerPage, totalPosts }) => {
	const pageNumbers = [];

	for (let i = 1; i <= Math.ceil(totalPosts / resPerPage); i++) {
		pageNumbers.push(i);
	}

	return (
		<React.Fragment>
			<nav aria-label="Page navigation example">
				<Pagination
					className="pagination justify-content-end p-4"
					listClassName="justify-content-end"
				>
					{pageNumbers.map((x) => (
						<PaginationItem>
							<PaginationLink
								href="#pablo"
								onClick={(e) => e.preventDefault()}
								tabIndex="-1"
							>
								{x}
								<span className="sr-only">{x}</span>
							</PaginationLink>
						</PaginationItem>
					))}
				</Pagination>
			</nav>
		</React.Fragment>
	);
};

export default Paginations;
