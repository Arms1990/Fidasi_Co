import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';
import { Nav, NavItem, Collapse } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import classnames from 'classnames';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { withRouter } from 'react-router-dom';


// import IntlMessages from '../../helpers/IntlMessages';

import {
  setContainerClassnames,
  addContainerClassname,
  changeDefaultClassnames,
  changeSelectedMenuHasSubItems
} from '../../redux/actions';
import { fetch } from '../../helpers/Utils';


const urlPrefix = "/app/";

// import menuItems from '../../constants/menu';

// const menuItems = [
//   {
//     id: "components",
//     icon: "iconsminds-air-balloon-1",
//     label: "menu.gogo",
//     to: "/app/components"
//   },
//   {
//     id: "charts",
//     icon: "iconsminds-pie-chart",
//     label: "menu.charts",
//     to: "/app/charts"
//   }
// ];

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedParentMenu: 1,
      viewingParentMenu: '',
      collapsedMenus: [],
      menuItems: [],
      isMounted: false
    };
  }

  async getMenu() {
    const { token, baseURL } = this.props;
    return await fetch(`${baseURL}/menu`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    .then( response => response.json() )
    .then( response => {
      if(this.state.isMounted) {
        this.setState({ menuItems: response });
        if(response.length > 0) {
          if(this.props.match.isExact) {
            return this.props.history.push(`/app/${response[0].page.slug}`);
          }
        }
      }
    })
    .catch( error => error );
  }

  handleWindowResize = async (event) => {
    if (event && !event.isTrusted) {
      return;
    }
    const { containerClassnames } = this.props;
    let nextClasses = this.getMenuClassesForResize(containerClassnames);
    return await this.props.setContainerClassnames(
      0,
      nextClasses.join(' '),
      this.props.selectedMenuHasSubItems
    );
  };

  handleDocumentClick = e => {
    const container = this.getContainer();
    let isMenuClick = false;
    if (
      e.target &&
      e.target.classList &&
      (e.target.classList.contains('menu-button') ||
        e.target.classList.contains('menu-button-mobile'))
    ) {
      isMenuClick = true;
    } else if (
      e.target.parentElement &&
      e.target.parentElement.classList &&
      (e.target.parentElement.classList.contains('menu-button') ||
        e.target.parentElement.classList.contains('menu-button-mobile'))
    ) {
      isMenuClick = true;
    } else if (
      e.target.parentElement &&
      e.target.parentElement.parentElement &&
      e.target.parentElement.parentElement.classList &&
      (e.target.parentElement.parentElement.classList.contains('menu-button') ||
        e.target.parentElement.parentElement.classList.contains(
          'menu-button-mobile'
        ))
    ) {
      isMenuClick = true;
    }
    if (container.contains(e.target) || container === e.target || isMenuClick) {
      return;
    }
    this.setState({
      viewingParentMenu: ''
    });
    this.toggle();
  };

  getMenuClassesForResize = classes => {
    const { menuHiddenBreakpoint, subHiddenBreakpoint } = this.props;
    let nextClasses = classes.split(' ').filter(x => x !== '');
    const windowWidth = window.innerWidth;
    if (windowWidth < menuHiddenBreakpoint) {
      nextClasses.push('menu-mobile');
    } else if (windowWidth < subHiddenBreakpoint) {
      nextClasses = nextClasses.filter(x => x !== 'menu-mobile');
      if (
        nextClasses.includes('menu-default') &&
        !nextClasses.includes('menu-sub-hidden')
      ) {
        nextClasses.push('menu-sub-hidden');
      }
    } else {
      nextClasses = nextClasses.filter(x => x !== 'menu-mobile');
      if (
        nextClasses.includes('menu-default') &&
        nextClasses.includes('menu-sub-hidden')
      ) {
        nextClasses = nextClasses.filter(x => x !== 'menu-sub-hidden');
      }
    }
    return nextClasses;
  };

  getContainer = () => {
    return ReactDOM.findDOMNode(this);
  };

  toggle = () => {
    const hasSubItems = this.getIsHasSubItem();
    this.props.changeSelectedMenuHasSubItems(hasSubItems);
    const { containerClassnames, menuClickCount } = this.props;
    const currentClasses = containerClassnames
      ? containerClassnames.split(' ').filter(x => x !== '')
      : '';
    let clickIndex = -1;

    if (!hasSubItems) {
      if (
        currentClasses.includes('menu-default') &&
        (menuClickCount % 4 === 0 || menuClickCount % 4 === 3)
      ) {
        clickIndex = 1;
      } else if (
        currentClasses.includes('menu-sub-hidden') &&
        (menuClickCount === 2 || menuClickCount === 3)
      ) {
        clickIndex = 0;
      } else if (
        currentClasses.includes('menu-hidden') ||
        currentClasses.includes('menu-mobile')
      ) {
        clickIndex = 0;
      }
    } else {
      if (currentClasses.includes('menu-sub-hidden') && menuClickCount === 3) {
        clickIndex = 2;
      } else if (
        currentClasses.includes('menu-hidden') ||
        currentClasses.includes('menu-mobile')
      ) {
        clickIndex = 0;
      }
    }
    if (clickIndex >= 0) {
      this.props.setContainerClassnames(
        clickIndex,
        containerClassnames,
        hasSubItems
      );
    }
  };

  handleProps = async () => {
    return await this.addEvents();
  };

  addEvents = () => {
    ['click', 'touchstart', 'touchend'].forEach(event =>
      document.addEventListener(event, this.handleDocumentClick, true)
    );
  };

  removeEvents = async () => {
    ['click', 'touchstart', 'touchend'].forEach(event =>
      document.removeEventListener(event, this.handleDocumentClick, true)
    );
  };

  setSelectedLiActive = async (callback) => {
    const oldli = document.querySelector('.sub-menu  li.active');
    if (oldli != null) {
      oldli.classList.remove('active');
    }

    const oldliSub = document.querySelector('.third-level-menu  li.active');
    if (oldliSub != null) {
      oldliSub.classList.remove('active');
    }

    /* set selected parent menu */
    const selectedSublink = document.querySelector('.third-level-menu  a.active');
    if (selectedSublink != null) {
      selectedSublink.parentElement.classList.add('active');
    }

    const selectedlink = document.querySelector('.sub-menu  a.active');
    if (selectedlink != null) {
      selectedlink.parentElement.classList.add('active');
        this.setState(
          {
            selectedParentMenu: selectedlink.parentElement.parentElement.getAttribute(
              'data-parent'
            )
          },
          callback
        );
    } else {
      const { menuItems } = this.state;
      var selectedParentNoSubItem = document.querySelector(
        '.main-menu  li a.active'
      );
      if (selectedParentNoSubItem != null) {
          this.setState(
            {
              selectedParentMenu: selectedParentNoSubItem.getAttribute(
                'data-flag'
              )
            },
            callback
          );
      } else if (this.state.selectedParentMenu === '') {
          this.setState(
            {
              selectedParentMenu: menuItems[0] ? menuItems[0].page.slug : null
            },
            callback
          );
      }
    }
  };

  setHasSubItemStatus = () => {
    const hasSubmenu = this.getIsHasSubItem();
    this.props.changeSelectedMenuHasSubItems(hasSubmenu);
    this.toggle();
  };

  getIsHasSubItem = () => {
    const { selectedParentMenu, menuItems } = this.state;
    const menuItem = menuItems ? menuItems.find(x => x.id === selectedParentMenu) : null;
    if (menuItem)
      return menuItem && menuItem.children && menuItem.children.length > 0
        ? true
        : false;
    else return false;
  };

  componentDidUpdate(prevProps) {
    if(this.state.isMounted) {
      if (this.props.location.pathname !== prevProps.location.pathname) {
        this.setSelectedLiActive(this.setHasSubItemStatus);
        window.scrollTo(0, 0);
      }
      this.handleProps();
    }
  }

  async componentDidMount() {
    this.setState({
      isMounted: true
    }, async () => {
      return await this.getMenu();
    });
    if(this.state.isMounted) {
      window.addEventListener('resize', this.handleWindowResize);
      await this.handleWindowResize();
      await this.setSelectedLiActive(this.setHasSubItemStatus);
      await this.handleProps();
    }
  }

  async componentWillUnmount() {
    if(this.state.isMounted) {
      await this.removeEvents();
      window.removeEventListener('resize', this.handleWindowResize);
    }
  }

  openSubMenu = (e, menuItem) => {
    const selectedParent = menuItem.id;
    const hasSubMenu = menuItem.children && menuItem.children.length > 0;
    this.props.changeSelectedMenuHasSubItems(hasSubMenu);
    if (!hasSubMenu) {
        this.setState({
          viewingParentMenu: selectedParent,
          selectedParentMenu: selectedParent
        });
      this.toggle();
    } else {
      e.preventDefault();

      const { containerClassnames, menuClickCount } = this.props;
      const currentClasses = containerClassnames
        ? containerClassnames.split(' ').filter(x => x !== '')
        : '';

      if (!currentClasses.includes('menu-mobile')) {
        if (
          currentClasses.includes('menu-sub-hidden') &&
          (menuClickCount === 2 || menuClickCount === 0)
        ) {
          this.props.setContainerClassnames(3, containerClassnames, hasSubMenu);
        } else if (
          currentClasses.includes('menu-hidden') &&
          (menuClickCount === 1 || menuClickCount === 3)
        ) {
          this.props.setContainerClassnames(2, containerClassnames, hasSubMenu);
        } else if (
          currentClasses.includes('menu-default') &&
          !currentClasses.includes('menu-sub-hidden') &&
          (menuClickCount === 1 || menuClickCount === 3)
        ) {
          this.props.setContainerClassnames(0, containerClassnames, hasSubMenu);
        }
      } else {
        this.props.addContainerClassname(
          'sub-show-temporary',
          containerClassnames
        );
      }
      this.setState({
        viewingParentMenu: selectedParent
      });
    }
  };

  toggleMenuCollapse = (e, menuKey) => {
    e.preventDefault();

    let collapsedMenus = this.state.collapsedMenus;
    if (collapsedMenus.indexOf(menuKey) > -1) {
        this.setState({
          collapsedMenus: collapsedMenus.filter(x => x !== menuKey)
        });
    } else {
      collapsedMenus.push(menuKey);
      this.setState({
        collapsedMenus
      });
    }
    return false;
  };

  render() {
    let {
      selectedParentMenu,
      viewingParentMenu,
      collapsedMenus,
      menuItems
    } = this.state;
    return (
      <div className="sidebar">
        <div className="main-menu">
          <div className="scroll">
            <PerfectScrollbar
              options={{ suppressScrollX: true, wheelPropagation: false }}
            >
              <Nav vertical className="list-unstyled">
                {menuItems &&
                  menuItems.map(item => {
                    return (
                      <NavItem
                        key={item.id}
                        to={item.to}
                        className={classnames({
                          active:
                            (selectedParentMenu === item.id &&
                              viewingParentMenu === '') ||
                            viewingParentMenu === item.id
                        })}
                      >
                        {item.newWindow ? (
                          <a
                            href={`${urlPrefix}${item.page.slug}`}
                            rel="noopener noreferrer"
                            target="_blank"
                          >
                            <i className={item.image} />
                            <span>{item.page.name}</span>
                          </a>
                        ) : (
                          <NavLink
                            to={`${urlPrefix}${item.page.slug}`}
                            onClick={e => this.openSubMenu(e, item)}
                            data-flag={item.id}
                          >
                            <i className={item.image} />
                            <span>{item.page.name}</span>
                          </NavLink>
                        )}
                      </NavItem>
                    );
                  })}
              </Nav>
            </PerfectScrollbar>
          </div>
        </div>

        <div className="sub-menu">
          <div className="scroll">
            <PerfectScrollbar
              options={{ suppressScrollX: true, wheelPropagation: false }}
            >
              {menuItems &&
                menuItems.map(item => {
                  return (
                    <Nav
                      key={item.id}
                      className={classnames({
                        'd-block':
                          (this.state.selectedParentMenu === item.id &&
                            this.state.viewingParentMenu === '') ||
                          this.state.viewingParentMenu === item.id
                      })}
                      data-parent={item.id}
                    >
                      {item.children &&
                        item.children.map((child, index) => {
                          return (
                            <NavItem
                              key={`${child.id}_${index}`}
                              className={`${
                                child.children && child.children.length > 0
                                  ? 'has-sub-item'
                                  : ''
                              }`}
                            >
                              {child.newWindow ? (
                                <a
                                  href={`${urlPrefix}${child.page.slug}`}
                                  rel="noopener noreferrer"
                                  target="_blank"
                                >
                                  <i className={child.image} />
                                  <span>{child.page.name}</span>
                                </a>
                              ) : child.children && child.children.length > 0 ? (
                                <Fragment>
                                  <NavLink
                                    className={`rotate-arrow-icon opacity-50 ${
                                      collapsedMenus.indexOf(
                                        `${child.id}_${index}`
                                      ) === -1
                                        ? ''
                                        : 'collapsed'
                                    }`}
                                    to={`${urlPrefix}${child.page.slug}`}
                                    id={`${child.id}_${index}`}
                                    onClick={e =>
                                      this.toggleMenuCollapse(
                                        e,
                                        `${child.id}_${index}`
                                      )
                                    }
                                  >
                                    <i className="simple-icon-arrow-down" />
                                    <span>{child.page.name}</span>
                                  </NavLink>

                                  <Collapse
                                    isOpen={
                                      collapsedMenus.indexOf(
                                        `${child.id}_${index}`
                                      ) === -1
                                    }
                                  >
                                    <Nav className="third-level-menu">
                                      {child.children.map((thirdSub, thirdIndex) => {
                                        return (
                                          <NavItem
                                            key={`${
                                              thirdSub.id
                                            }_${index}_${thirdIndex}`}
                                          >
                                            {thirdSub.newWindow ? (
                                              <a
                                                href={`${urlPrefix}${thirdSub.page.slug}`}
                                                rel="noopener noreferrer"
                                                target="_blank"
                                              >
                                                <i className={thirdSub.image} />
                                                <span>{thirdSub.page.name}</span>
                                              </a>
                                            ) : (
                                              <NavLink to={`${urlPrefix}${thirdSub.page.slug}`}>
                                                <i className={thirdSub.image} />
                                                <span>{thirdSub.page.name}</span>
                                              </NavLink>
                                            )}
                                          </NavItem>
                                        );
                                      })}
                                    </Nav>
                                  </Collapse>
                                </Fragment>
                              ) : (
                                <NavLink to={`${urlPrefix}${child.page.slug}`}>
                                  <i className={child.image} />
                                  <span>{child.page.name}</span>
                                </NavLink>
                              )}
                            </NavItem>
                          );
                        })}
                    </Nav>
                  );
                })}
            </PerfectScrollbar>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ authUser, menu }) => {
  const { token, baseURL, clientID, user: loginUser } = authUser;
  const {
    containerClassnames,
    subHiddenBreakpoint,
    menuHiddenBreakpoint,
    menuClickCount,
    selectedMenuHasSubItems
  } = menu;
  return {
    token,
    baseURL,
    clientID,
    loginUser,
    containerClassnames,
    subHiddenBreakpoint,
    menuHiddenBreakpoint,
    menuClickCount,
    selectedMenuHasSubItems
  };
};
export default withRouter(
  connect(
    mapStateToProps,
    {
      setContainerClassnames,
      addContainerClassname,
      changeDefaultClassnames,
      changeSelectedMenuHasSubItems
    }
  )(Sidebar)
);
