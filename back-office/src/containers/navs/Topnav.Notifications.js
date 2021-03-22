import React from "react";
import ReactDOM from "react-dom";
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, Table } from "reactstrap";
import { connect } from 'react-redux';
import PerfectScrollbar from "react-perfect-scrollbar";
import { NotificationManager } from "../../components/common/react-notifications";
import { logoutUser } from "../../redux/auth/actions";
import FileSaver from 'file-saver';
import moment from 'moment';
import Echo from 'laravel-echo';
import io from 'socket.io-client';
import { withRouter } from "react-router-dom";
import { DataTable, DDL, ProductCardList, ProductList, AreaChart, LineChart, PieChart, BarChart, DoughnutChart, Calendar, Card } from "../../components/misc";
import Validation from '../../components/misc/wizard/Validation';
import bootbox from 'bootbox';
import classnames from 'classnames';
import { fetch } from "../../helpers/Utils";

// window.io = io;


const NotificationItem = ({ onClick, token, loginUser: user, baseURL, webSocketURL, clientID, clientSecret, id, image: img, message: title, payload: notificationPayload, data_creation, action, type, seen, created_at }) => {

	// const payload = JSON.stringify(notificationPayload);

  const handleNotificationClick = async (event, id) => {
    event.preventDefault();
    onClick(id);
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
          return window.open(url, '_blank');
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
                <Card slug={slug} token={token} user={user} clientSecret={clientSecret} baseURL={baseURL} clientID={clientID} identifier={component.id} key={index} component={component} />
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
    <a className={classnames("scrollbar-notification-item", "d-flex", "flex-row", "py-3", "px-4", "border-bottom", { "bg-light": seen === "N" })} href="/" onClick={ (event) => handleNotificationClick(event, id) }>
      { img ? <img
        src={img}
        alt={title}
        className="img-thumbnail list-thumbnail xsmall border-0 rounded-circle" /> : null
      }
      <div className="pl-3 pr-2">
        <p className="font-weight-medium mb-1">{title}</p>
        <p className="text-muted mb-0 text-small">{date}</p>
      </div>
    </a>
  );
};

class TopnavNotifications extends React.Component {

  state = {
    loadingNotifications: false,
    notifications: [],
    unreadNotificationsCount: 0,
    nextPageURL: null,
    dropdownOpened: false
  }

  getNotifications = async () => {
    const { token, webSocketURL, clientID } = this.props;
    return await fetch(`${webSocketURL}/notifications?client_id=${clientID}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    .then( response => {
      return response.json();
    })
    .then( response => {
      return this.setState({
        nextPageURL: response.nextPageURL,
        notifications: response.notifications,
        unreadNotificationsCount: parseInt(response.unreadNotificationsCount, 10)
      });
    })
    .catch( error => {
      return console.error(error)
    });
  }

  markAllNotificationsAsRead = async () => {
    const { token, webSocketURL, clientID } = this.props;
    return await fetch(`${webSocketURL}/notifications`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    .then( response => response.json() )
    .then( response => {
      return this.setState({
        notifications: response.notifications,
        unreadNotificationsCount: 0
      });
    })
    .catch( error => {
      return console.error(error)
    });
  }


  async componentDidMount() {
    await this.getNotifications();
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
        const { notifications, unreadNotificationsCount } = this.state;
        this.setState({
          notifications: [ notification, ...notifications ],
          unreadNotificationsCount: unreadNotificationsCount + 1
        });
      });
    }
  }

  onClick(notificationId) {
    const { notifications, unreadNotificationsCount } = this.state;
    const notification = notifications.find( not => not.id === notificationId );
    const otherNotifications = notifications.filter( not => not.id !== notificationId );
    this.setState({
      unreadNotificationsCount: unreadNotificationsCount - 1,
      notifications: [
        ...otherNotifications,
        {
          ...notification,
          seen: 'S'
        }
      ]
    });
    return this.forceUpdate();
  }

  dropdownToggle(event) {
    const { dropdownOpened, notifications } = this.state;
    return this.setState({
      dropdownOpened: !dropdownOpened,
      notifications 
    });
  }

  renderNotifications = (notifications) => {
    if(notifications.length === 0) {
      return (
        <div className="scrollbar-notification-item w-100 d-flex flex-row justify-content-center align-items-center mb-3 py-0 px-4">
          <p className="font-weight-medium font-italic mb-0">No notification</p>
        </div>
      );
	}
	
  const unseenNotifications = Array.isArray(notifications) ? notifications.filter( notification => notification.seen === "N" ).map( (notification, index) => <NotificationItem key={index} onClick={ (notId) => this.onClick(notId) } {...this.props} {...notification} /> ) : [];
  const seenNotifications = Array.isArray(notifications) ? notifications.filter( notification => notification.seen === "S" ).map( (notification, index) => <NotificationItem key={index} onClick={ (notId) => this.onClick(notId) } {...this.props} {...notification} /> ) : [];
	

	

	const newNotificationsTitle = (
		<div key="unique_01" className="scrollbar-notification-item notification-action-item w-100 d-flex flex-row justify-content-start py-2 px-4 border-bottom">
			<span>New</span>
		</div>
	);

	const earlierNotificationsTitle = (
		<div key="unique_02" className="scrollbar-notification-item notification-action-item w-100 d-flex flex-row justify-content-start py-2 px-4 border-bottom">
			<span>Earlier</span>
		</div>
	);

	let modifiedNotifications = [
		unseenNotifications.length > 0 ? newNotificationsTitle : null,
		...unseenNotifications,
		unseenNotifications.length > 0 ? earlierNotificationsTitle : null,
		...seenNotifications
	];


    return modifiedNotifications;
  }

  async loadMoreNotifications(notificationsContainer) {
	const { token, clientID } = this.props;
	const { nextPageURL, notifications, loadingNotifications } = this.state;
	const scrollAmount = notificationsContainer.scrollTop;
	const containerHeight = notificationsContainer.scrollHeight;
	if((containerHeight - scrollAmount) <= 300) {
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
					return notificationsContainer.scrollTop = notificationsContainer.scrollTop - 300;
				})
				.catch( error => {
					return console.error(error)
				});
		}
	}
  }

  render() {
    const { notifications, loadingNotifications, dropdownOpened, unreadNotificationsCount } = this.state;
    const unseenNotifications = Array.isArray(notifications) ? notifications.filter( notification => notification.seen === "N" ) : [];
    const sortedNotifications = Array.isArray(notifications) ? notifications.sort( (a, b) => moment(b.created_at).isAfter(moment(a.created_at)) ) : [];

	
	
	const actionButtons = (
		<div className="scrollbar-notification-item notification-action-item notification-top-action-item w-100 position-sticky d-flex flex-row justify-content-end py-2 px-4 border-bottom">
			<button className="btn btn-link p-0 text-decoration-none notification-action" onClick={ () => this.markAllNotificationsAsRead() }>Mark All as Read</button>
		</div>
	);


	const bottomActionButtons = (
		<div className="scrollbar-notification-item notification-action-item notification-bottom-action-item w-100 position-sticky d-flex flex-row justify-content-center py-2 px-4 border-bottom">
			<button className="btn btn-link p-0 text-decoration-none notification-action" onClick={ () => this.props.history.push('/app/notifications') }>See all</button>
		</div>
	);


    return (
      <div className="position-relative d-inline-block">
        <UncontrolledDropdown isOpen={dropdownOpened} className="dropdown-menu-right" toggle={ (event) => this.dropdownToggle(event) }>
          <DropdownToggle
            className="header-icon notificationButton"
            color="empty"
          >
            <i className="simple-icon-bell" />
            { unreadNotificationsCount > 0 ? <span className="count">{unreadNotificationsCount}</span> : null }
          </DropdownToggle>
          <DropdownMenu
            className="position-absolute mt-3 scroll py-0"
            right
            id="notificationDropdown"
          >
            <PerfectScrollbar
				onScrollDown={ (container) => this.loadMoreNotifications(container) }
				className={classnames({ 'd-flex align-items-center justify-content-center mx-0': (sortedNotifications.length === 0) })}
				options={{ suppressScrollX: true, wheelPropagation: false }}>
				{ sortedNotifications.length > 0 ? actionButtons : null }
            	{ this.renderNotifications(sortedNotifications) }
				{ loadingNotifications ? <div className="text-center mt-4 py-1">
					<div className="loading position-static" />
				</div> : null }
				{ sortedNotifications.length > 0 ? bottomActionButtons : null }
            </PerfectScrollbar>
          </DropdownMenu>
        </UncontrolledDropdown>
      </div>
      );
  }

}

  
const mapStateToProps = ({ authUser }) => {
  const { token, baseURL, user: loginUser, clientID, clientSecret, webSocketURL } = authUser;
  return { token, baseURL, loginUser, clientID, clientSecret, webSocketURL };
};

export default connect(
    mapStateToProps,
    {logoutUser}
  )(withRouter(TopnavNotifications));

