import React, { Component, Fragment } from "react";
import ReactDOM from "react-dom";
import { Card, CardBody, CardTitle } from "reactstrap";

import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { NotificationManager } from "../../components/common/react-notifications";
import moment from 'moment';
import Echo from 'laravel-echo';
import io from 'socket.io-client';
import classnames from 'classnames';
import { DataTable, DDL, ProductCardList, Table, ProductList, AreaChart, LineChart, PieChart, BarChart, DoughnutChart, Calendar, Card as ComponentCard } from "../../components/misc";
import Validation from '../../components/misc/wizard/Validation';
import FileSaver from 'file-saver';
import bootbox from 'bootbox';
import { fetch } from "../../helpers/Utils";

window.io = io({
	path: `${process.env.REACT_APP_APPLICATION_PROTOCOL}://${process.env.REACT_APP_APPLICATION_HOST}:${process.env.REACT_APP_NOTIFICATION_SERVICE_PORT}`
});



const NotificationItem = ({ token, loginUser: user, baseURL, webSocketURL, isLast, clientID, clientSecret, id, image: img, message: title, payload: notificationPayload, data_creation, action, type, seen, created_at }) => {

	
	const handleNotificationClick = async (event, id) => {
		event.preventDefault();
		
		return await fetch(`${webSocketURL}/notification/${id}`, {
		  method: 'POST',
		  headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${token}`
		  }
		})
		.then( response => {
		  if(!response.ok) {
			return response.json()
			.then( (json) => {
			  throw new Error(json.message)
			});
		  }
		  return response.json();
		})
		.then( response => {
		  const { url, type, resourceURI } = response;
		  if(type) {
			if(type === "externalLink") {
				window.open(url, '_blank');
			}
			
			if(type === "file") {
			  return FileSaver.saveAs(resourceURI);
			}
	
			if(type === "modal") {
			  let components = response.components.map( (component, index) => {
				const { type: componentType, slug } = component;
	
				if(componentType === "datatable") {
				  return (
					<DataTable slug={slug} token={token} user={user} clientSecret={clientSecret} baseURL={baseURL} clientID={clientID} identifier={component.id} key={index} component={component} />
				  );
				}
	
				if(componentType === "ddl") {
				  return (
					<DDL slug={slug} token={token} user={user} clientSecret={clientSecret} baseURL={baseURL} clientID={clientID} identifier={component.id} key={index} component={component} />
				  );
				}
	
				if(componentType === "card") {
				  return (
					<ComponentCard slug={slug} token={token} user={user} clientSecret={clientSecret} baseURL={baseURL} clientID={clientID} identifier={component.id} key={index} component={component} />
				  );
				}
	
				if(componentType === "wizard") {
				  return (
					<Validation slug={slug} token={token} user={user} clientSecret={clientSecret} baseURL={baseURL} clientID={clientID} identifier={component.id} key={index} component={component} />
				  );
				}
	
				if(componentType === "productCardList") {
				  return (
					<ProductCardList slug={slug} token={token} user={user} clientSecret={clientSecret} baseURL={baseURL} clientID={clientID} identifier={component.id} key={index} component={component} />
				  );
				}
	
				if(componentType === "productList") {
				  return (
					<ProductList slug={slug} token={token} user={user} clientSecret={clientSecret} baseURL={baseURL} clientID={clientID} identifier={component.id} key={index} component={component} />
				  );
				}
	
			  
	
				if(componentType === "chart") {
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
	
				if(componentType === "calendar") {
				  return (
					<Calendar slug={slug} token={token} user={user} clientSecret={clientSecret} baseURL={baseURL} clientID={clientID} identifier={component.id} key={index} component={component} />
				  );
				}
	
	
				if(componentType === "table") {
				  return (
					<Table slug={slug} token={token} user={user} clientSecret={clientSecret} baseURL={baseURL} clientID={clientID} identifier={component.id} key={index} component={component} />
				  );
				}
	
				return null;
			  });
			  let dialog = bootbox.dialog({
				message: `<div class="loading" />`,
				closeButton: false,
				backdrop: true,
				centerVertical: true,
				onEscape: true,
				scrollable: true,
				size: 'extra-large'
			  });
			  dialog.init(function() {
				let targetContainer = dialog.find('.modal-content').addClass('modal-dialog-centered modal-dialog-scrollable').find('.modal-body').addClass('w-100').find('.bootbox-body');
				return ReactDOM.render(components, targetContainer[0]);
			  });
			}
		
	
	
			
		  }
		
		})
		.catch( error => {
		  return NotificationManager.error(error.message, "Notification Error", 3000, null, null, '');
		});
	  
	
	
	
	  }

  const date = moment(moment.utc(data_creation).toDate()).local().fromNow();

  return (
	<a
	href="/"
	onClick={ (event) => handleNotificationClick(event, id) }
	className={classnames("scrollbar-notification-item", "d-flex", "flex-row", "py-3", { "bg-light": seen === "N" }, { "mb-2": !isLast }, { "border-bottom": seen === "S" && !isLast }) }>
	{/* <NavLink to="/app/pages/product/details">
		<img
		src={item.thumb}
		alt={item.title}
		className="img-thumbnail border-0 rounded-circle list-thumbnail align-self-center xsmall"
		/>
	</NavLink> */}

	<div className="pl-3 pr-2">
		{/* <div to="/app/pages/product/details"> */}
		<p className="font-weight-medium mb-0">{title}</p>
		<p className="text-muted mb-0 text-small">
			{date}
		</p>
		{/* </NavLink> */}
	</div>
	</a>
  );
};

class Notifications extends Component {

  state = {
	loadingNotifications: false,
	notifications: [],
	nextPageURL: null,
    dropdownOpened: false
  }

  getNotifications = async () => {
    const { token, baseURL, webSocketURL, logoutUser, history, clientID } = this.props;
    return await fetch(`${webSocketURL}/notifications?client_id=${clientID}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    .then( response => {
		if(!response.ok) {
			return logoutUser(history);
		}
		return response.json();
	})
    .then( response => {
      return this.setState({
		nextPageURL: response.nextPageURL,
		notifications: response.notifications,
		loadingNotifications: false
      });
    })
    .catch( error => {
      return console.error(error)
    });
  }

  componentWillUnmount() {
	window.removeEventListener('scroll', () => this.loadMoreNotifications(), false);
  }

  async componentDidMount() {
	await this.getNotifications();
	window.addEventListener('scroll', () => this.loadMoreNotifications(), false);
    const { loginUser, token, webSocketURL } = this.props;
	const user = typeof(loginUser) === "string" ? JSON.parse(loginUser) : loginUser;
	if (typeof io !== 'undefined') {
		const socket = io(webSocketURL, {
		  extraHeaders: {
			'x-auth-token': token
		  },
		  transportOptions: {
			polling: {
			  extraHeaders: {
				'x-auth-token': token
			  }
			}
		  }
		});
		socket.on('error', function(err) {
		  throw new Error(err);
		});
		socket.on(`private.notifications.User.${user.id}`, (notification) => {
		  const { notifications } = this.state;
		  return this.setState({
			notifications: [ ...notifications, notification ]
		  });
		});
	}
  }

  renderNotifications = (notifications) => {
    if(notifications.length === 0) {
      return (
        <div className="scrollbar-notification-item w-100 d-flex flex-row justify-content-center align-items-center mb-3 py-0 px-4">
          <p className="font-weight-medium font-italic mb-0">No notification</p>
        </div>
      );
	}
	
	let unseenNotifications = notifications.filter( notification => notification.seen === "N" );
	unseenNotifications = unseenNotifications.map( (notification, index) => {
		return (
			<NotificationItem key={index} isLast={(unseenNotifications.length - 1) === index} {...this.props} {...notification} />
		);
	});
	let seenNotifications = notifications.filter( notification => notification.seen === "S" );
	seenNotifications = seenNotifications.map( (notification, index) => {
		return (
			<NotificationItem key={index} isLast={(seenNotifications.length - 1) === index} {...this.props} {...notification} />
		);
	});
	

	

	const newNotificationsTitle = (
		<div key="new_notification_header" className="w-100 d-flex flex-row justify-content-start pb-2 px-2 mb-2 border-bottom">
			<h6>New</h6>
		</div>
	);

	const earlierNotificationsTitle = (
		<div key="earlier_notification_header" className="w-100 d-flex flex-row justify-content-start pb-2 pt-3 px-2 mb-2 border-bottom">
			<h6>Earlier</h6>
		</div>
	);

	let modifiedNotifications = [];
	if(unseenNotifications.length > 0) {
		modifiedNotifications.push(newNotificationsTitle);
	}
	modifiedNotifications = [
		...modifiedNotifications,
		...unseenNotifications
	];
	if(seenNotifications.length > 0) {
		modifiedNotifications.push(earlierNotificationsTitle);
	}
	modifiedNotifications = [
		...modifiedNotifications,
		...seenNotifications
	];
    return modifiedNotifications;
  }
  
  getVerticalScrollPercentage(elm) {
	var p = elm.parentNode
	return (elm.scrollTop || p.scrollTop) / (p.scrollHeight - p.clientHeight ) * 100
  }

  async loadMoreNotifications() {
	const { token, clientID } = this.props;
	const { nextPageURL, notifications, loadingNotifications } = this.state;
	const scrollAmount = this.getVerticalScrollPercentage(document.body);
	if(scrollAmount > 70) {
		if(!loadingNotifications && (nextPageURL !== null)) {
			this.setState({
				loadingNotifications: true
			});
			return await fetch(`${nextPageURL}&client_id=${clientID}`, {
				method: 'GET',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`
				}
			})
				.then( response => response.json() )
				.then( response => {
					this.setState({
						nextPageURL: response.nextPageURL,
						notifications: [
							...notifications,
							...response.notifications
						],
						loadingNotifications: false
					});
					// return notificationsContainer.scrollTop = notificationsContainer.scrollTop - 100;
				})
				.catch( error => {
					return console.error(error)
				});
		}
	}
  }

  render() {
    const { notifications, loadingNotifications } = this.state;
	const sortedNotifications = notifications.sort( (a, b) => moment(b.created_at).isAfter(moment(a.created_at)) );

	document.title = `Notifications | Back Office`;
	document.body.classList.add('rounded');
	return (
	  <Fragment>
		<Card>
			<CardBody>
				<CardTitle>Notifications</CardTitle>
				<div>{ this.renderNotifications(sortedNotifications) }</div>
				{ loadingNotifications ? <div className="text-center mt-4 py-1">
					<div className="loading position-static" />
				</div> : null }
			</CardBody>
		</Card>
	  </Fragment>
	);
  }
}


const mapStateToProps = ({ authUser, menu }) => {
  const { containerClassnames } = menu;
  const { token, baseURL, webSocketURL, clientID, clientSecret, user: loginUser } = authUser;
  return { token, baseURL, webSocketURL, clientID, clientSecret, loginUser, containerClassnames };
};

export default withRouter(
  connect(
	mapStateToProps,
	{}
  )(Notifications)
);
