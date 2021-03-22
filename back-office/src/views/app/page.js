import React, { Component, Fragment } from "react";
import { Row, Alert } from "reactstrap";
import { Colxx } from "../../components/common/CustomBootstrap";

import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import Breadcrumb from "../../containers/navs/Breadcrumb";

import {
	Filters,
	DataTable,
	DDL,
	Card,
	UserCardGroup,
	ProfileCard,
	IconCard,
	// ValidationWizard,
	ProductCardList,
	ProductList,
	AreaChart,
	LineChart,
	DoughnutChart,
	PieChart,
	BarChart,
	Calendar,
	Table,
	ThumbsCarousel,
	Search,
	Tabs,
	ProductDescriptionText
} from '../../components/misc';

import Validation from '../../components/misc/wizard/Validation';
import { fetch } from "../../helpers/Utils";


class Page extends Component {

  state = {
	fetchingDetails: false,
	errorMessage: '',
	pageDetails: {},
	oldSlug: null
  };



  getDetails = async (oldSlug = null) => {
	const { slug, subSlug } = this.props.match.params;
	const { search } = this.props.location;
	const { token, baseURL, clientID } = this.props;
	const queryParams = new URLSearchParams(search).entries();
	let params = new URLSearchParams();
	params.set('page_slug', subSlug ? `${slug}/${subSlug}` : slug);
	params.set('client_id', clientID);
	for(let param of queryParams) {
		params.set(`queryString[${param[0]}]`, param[1]);
	}
	params = params.toString();
	this.setState({
		oldSlug,
		fetchingDetails: true,
		pageDetails: {}
	});


	try {
		const request = await fetch(`${baseURL}/details?${params}`, {
			headers: {
			  'Accept': 'application/json',
			  'Content-Type': 'application/json',
			  'Authorization': `Bearer ${token}`
			}
		  });
	  
		  if([400, 404].includes(request.status)) {
			  this.setState({
				  fetchingDetails: false,
				  errorMessage: (await request.json()).message
			  });
			  return this.props.history.push('/error');
		  }
	  
		  const response = await request.json();
	  
		  if(response.details) {
			  return this.setState({
				  pageDetails: response.details
			  }, () => {
				  const slug = this.state.oldSlug;
				  if(slug !== null) {
					  const allowedFroms = response.details.allowedFrom;
					  if(allowedFroms) {
						  if(!allowedFroms.includes(slug)) {
							  return this.props.history.push('/error'); 
						  }
					  }
				  }
				  return this.setState({
				  	fetchingDetails: false
				  })
			  });
		  }
	  
		  return this.setState({
			fetchingDetails: false,
			pageDetails: {}
		  });
	} catch(error) {
		return this.setState({
			fetchingDetails: false,
			errorMessage: error.message
		});
	}

  }

  getDetailsView() {
	const { slug } = this.props.match.params;
	const { token, baseURL, clientID, clientSecret, user } = this.props;
	let { fetchingDetails, pageDetails, errorMessage } = this.state;

	let components = [];

	if(!fetchingDetails) {
	  if(Object.values(pageDetails).length > 0) {

		components = pageDetails.components ? pageDetails.components.map((component, index) => {
		  const { type } = component;

		  if(type === "datatable") {
			return (
				<DataTable slug={slug} token={token} user={user} clientSecret={clientSecret} baseURL={baseURL} clientID={clientID} identifier={component.id} key={index} filters={ pageDetails.filters.map( (filter) => ({ name: filter.id, value: filter.value }) ) } component={component} />
			);
		  }

		  if(type === "ddl") {
			return (
				<DDL slug={slug} token={token} user={user} clientSecret={clientSecret} baseURL={baseURL} clientID={clientID} identifier={component.id} key={index} filters={ pageDetails.filters.map( (filter) => ({ name: filter.id, value: filter.value }) ) } component={component} />
			);
		  }

		  if(type === "card") {
			return (
				<Card slug={slug} token={token} user={user} clientSecret={clientSecret} baseURL={baseURL} clientID={clientID} identifier={component.id} key={index} filters={ pageDetails.filters.map( (filter) => ({ name: filter.id, value: filter.value }) ) } component={component} />
			);
		  }

		  if(type === "wizard") {
			return (
				<Validation slug={slug} token={token} user={user} clientSecret={clientSecret} baseURL={baseURL} clientID={clientID} identifier={component.id} key={index} filters={ pageDetails.filters.map( (filter) => ({ name: filter.id, value: filter.value }) ) } component={component} />
			);
		  }

		  if(type === "productCardList") {
			return (
			  <ProductCardList slug={slug} token={token} user={user} clientSecret={clientSecret} baseURL={baseURL} clientID={clientID} identifier={component.id} key={index} filters={ pageDetails.filters.map( (filter) => ({ name: filter.id, value: filter.value }) ) } component={component} />
			);
		  }

		  if(type === "productList") {
			return (
			  <ProductList slug={slug} token={token} user={user} clientSecret={clientSecret} baseURL={baseURL} clientID={clientID} identifier={component.id} key={index} filters={ pageDetails.filters.map( (filter) => ({ name: filter.id, value: filter.value }) ) } dynamicComponent={component} />
			);
		  }

		  if(type === "userCard") {
			return (
			  <UserCardGroup slug={slug} token={token} user={user} clientSecret={clientSecret} baseURL={baseURL} clientID={clientID} identifier={component.id} key={index} filters={ pageDetails.filters.map( (filter) => ({ name: filter.id, value: filter.value }) ) } component={component} />
			);
		  }

		  if(type === "profileCard") {
			return (
			  <ProfileCard slug={slug} token={token} user={user} clientSecret={clientSecret} baseURL={baseURL} clientID={clientID} identifier={component.id} key={index} filters={ pageDetails.filters.map( (filter) => ({ name: filter.id, value: filter.value }) ) } component={component} />
			);
		  }

		  if(type === "productDescriptionText") {
			return (
			  <ProductDescriptionText slug={slug} token={token} user={user} clientSecret={clientSecret} baseURL={baseURL} clientID={clientID} identifier={component.id} key={index} filters={ pageDetails.filters.map( (filter) => ({ name: filter.id, value: filter.value }) ) } component={component} />
			);
		  }

		  if(type === "iconCard") {
			  return (
				  <IconCard slug={slug} token={token} user={user} clientSecret={clientSecret} baseURL={baseURL} clientID={clientID} identifier={component.id} key={index} filters={ pageDetails.filters.map( (filter) => ({ name: filter.id, value: filter.value }) ) } component={component} />
			  );
		  }
		  
		  

		  if(type === "chart") {
			const { kind } = component;


			if(kind === "pie") {
			  return (
				<div key={index}>
				  <PieChart shadow component={component} />
				</div>
			  );
			}

			if(kind === "bar") {
			  return (
				<div key={index}>
				  <BarChart shadow component={component} />
				</div>
			  );
			}

			if(kind === "area") {
			  return (
				<div key={index}>
				  <AreaChart shadow component={component} />
				</div>
			  );
			}

			if(kind === "line") {
				return (
				  <div key={index}>
					<LineChart shadow component={component} />
				  </div>
				);
			}

			if(kind === "doughnut") {
				return (
				  <div key={index}>
					<DoughnutChart shadow component={component} />
				  </div>
				);
			}

			return (
			  <div key={index}>
				<AreaChart shadow component={component} />
			  </div>
			);


		  }

		  if(type === "calendar") {
			return (
				<Calendar slug={slug} token={token} user={user} clientSecret={clientSecret} baseURL={baseURL} clientID={clientID} identifier={component.id} key={index} filters={ pageDetails.filters.map( (filter) => ({ name: filter.id, value: filter.value }) ) } component={component} />
			);
		  }


		  if(type === "table") {
			return (
			  <Table slug={slug} token={token} user={user} clientSecret={clientSecret} baseURL={baseURL} clientID={clientID} identifier={component.id} key={index} filters={ pageDetails.filters.map( (filter) => ({ name: filter.id, value: filter.value }) ) } component={component} />
			);
		  }
		  

		  if(type === "thumbCarousel") {
			  const data = component.data.map( dataItem => ({ id: dataItem.id, img: dataItem.img }) );
			  return (
				  <ThumbsCarousel data={data} slug={slug} token={token} user={user} clientSecret={clientSecret} baseURL={baseURL} clientID={clientID} identifier={component.id} key={index} filters={ pageDetails.filters.map( (filter) => ({ name: filter.id, value: filter.value }) ) } component={component} />
				);
		  }

		  if(type === "search") {
			  return (
			  	<Search slug={slug} token={token} user={user} clientSecret={clientSecret} baseURL={baseURL} clientID={clientID} identifier={component.id} key={index} filters={ pageDetails.filters.map( (filter) => ({ name: filter.id, value: filter.value }) ) } component={component} />
			  );
		}

		if(type === "tabs") {
			return (
				<Tabs slug={slug} token={token} user={user} clientSecret={clientSecret} baseURL={baseURL} clientID={clientID} identifier={component.id} key={index} filters={ pageDetails.filters.map( (filter) => ({ name: filter.id, value: filter.value }) ) } component={component} />
			);
	  }

		  return null;


		}) : null;


		return (
		  <div>
			<Filters onFiltersApplied={ (pageDetails) => this.applyFilters(pageDetails) } slug={slug} filters={pageDetails.filters} />
			{ components }
		  </div>
		);
	  }

	  if(errorMessage !== "") {
		  return (
			<Alert className="rounded" color="danger">{errorMessage}</Alert>
		  );
	  }

	  return (
		<Alert className="rounded" color="danger">
		  Oops! No details available for {slug}.
		</Alert>
	  );


	}


	return (
	  <div className="text-center">
		<div className="loading position-static" />
	  </div>
	)
  }

  async componentDidUpdate(prevProps) {
	const { slug } = this.props.match.params;
	const { slug: oldSlug } = prevProps.match.params;
	if (slug !== oldSlug) {
		return await this.getDetails(oldSlug);
	}
  }

  async componentDidMount() {
	  const { slug } = this.props.match.params;
	  return await this.getDetails(slug);
  }

  applyFilters = (pageDetails) => {
	return this.setState({
	  pageDetails,
	  fetchingDetails: true
	}, () => {
	  return this.setState({
		fetchingDetails: false
	  });
	});
  }

  render() {
	const { slug } = this.props.match.params;
	const { pageDetails } = this.state;
	document.title = `${pageDetails.title || (slug.charAt(0).toUpperCase() + slug.slice(1))} | Back Office`;
	document.body.classList.add('rounded');
	return (
	  <Fragment>
		<Row>
		  <Colxx xxs="12">
			<Breadcrumb heading={pageDetails.title || slug} match={this.props.match} />
			{/* <Separator className="mb-sm-5 mb-3" /> */}
		  </Colxx>
		</Row>
		<Row>
		  <Colxx xxs="12" className="mb-4">
			{ this.getDetailsView() }
		  </Colxx>
		</Row>
	  </Fragment>
	);
  }
}


const mapStateToProps = ({ authUser, menu }) => {
  const { containerClassnames } = menu;
  const { token, baseURL, clientID, clientSecret, user } = authUser;
  return { token, baseURL, clientID, clientSecret, user, containerClassnames };
};

export default withRouter(
  connect(
	mapStateToProps,
	{}
  )(Page)
);
