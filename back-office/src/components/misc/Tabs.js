
import React, { Component } from "react";
import { Row, Card, CardHeader, CardBody, TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import classnames from 'classnames';
import { Colxx } from "../common/CustomBootstrap";
import {
    AreaChart,
    LineChart,
    BarChart,
    PieChart,
    DoughnutChart,
    Table,
    ProductCardList,
    ProductList,
    UserCardGroup,
    ProfileCard,
    Calendar,
    ThumbsCarousel,
    Search,
    ProductDescriptionText
} from './index';
import Validation from './wizard/Validation';
import dynamicFunctions from './functions';


class Tabs extends Component {

    state = {
        activeTab: null
    }

    componentDidMount() {
        const { tabs } = this.props.component;
        return this.setState({
            activeTab: tabs[0].id
        });
    }

    renderFunctions() {
        let { component: { functions } } = this.props;
        
        if(functions) {
            functions = functions.map( functionName => {
                if(functionName in dynamicFunctions) {
                    return dynamicFunctions[functionName]();
                }
                return null;
            }).filter( functionName => functionName !== null );
        } else {
            functions = [];
        }
        return functions;
    }

    toggleTab = (tab) => {
        const { activeTab } = this.state;
        if(activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }

    render() {
        const { activeTab } = this.state;
        const { tabs } = this.props.component;
        return (
            <div>
                  <Card className="mb-4">
                  <CardHeader>
                    <Nav tabs className="card-header-tabs">
                        {tabs.map( (tab, tabIndex) => {
                            return (
                                <NavItem key={tabIndex}>
                                    <NavLink
                                    className={classnames({
                                        active: activeTab === tab.id,
                                        "nav-link": true
                                    })}
                                    onClick={() => { this.toggleTab(tab.id); }} to="#" location={{}} >
                                        {tab.title}
                                    </NavLink>
                                </NavItem>
                            );
                        })}
                    </Nav>
                  </CardHeader>

                  <TabContent activeTab={activeTab}>
                      {tabs.map(tab => {
                          const children = tab.children;
                          return (
                            <TabPane key={tab.id} tabId={tab.id}>
                                <Row>
                                    <Colxx sm="12">
                                        <CardBody>


                                            {children.map( (child, index) => {
                                                const { type } = child;
                                                const transparent = false;
                                                if(type === "chart") {
                                                    const { kind } = child;
                                                    if(kind === "pie") {
                                                        return (
                                                                <PieChart key={index} className={!transparent ? "shadow-none" : null} shadow={transparent} component={child} />
                                                        );
                                                    }
                                        
                                                    if(kind === "bar") {
                                                        return (
                                                                <BarChart key={index} className={!transparent ? "shadow-none" : null} shadow={transparent} component={child} />
                                                        );
                                                    }
                                        
                                                    if(kind === "area") {
                                                        return (
                                                                <AreaChart key={index} className={!transparent ? "shadow-none" : null} shadow={transparent} component={child} />
                                                        );
                                                    }

                                                    if(kind === "line") {
                                                        return (
                                                                <LineChart key={index} className={!transparent ? "shadow-none" : null} shadow={transparent} component={child} />
                                                        );
                                                    }

                                                    if(kind === "doughnut") {
                                                        return (
                                                                <DoughnutChart key={index} className={!transparent ? "shadow-none" : null} shadow={transparent} component={child} />
                                                        );
                                                    }
                                                }

                                                if(type === "calendar") {
                                                    return (
                                                            <Calendar key={index} component={child} />
                                                    );
                                                }

                                                
                                                if(type === "productDescriptionText") {
                                                    return (
                                                        <ProductDescriptionText key={index} {...this.props} component={child} />
                                                    );
                                                }

                                                if(type === "table") {
                                                    return (
                                                            <Table key={index} component={child} />
                                                    );
                                                }

                                                if(type === "card") {
                                                    return (
                                                            <Card key={index} {...this.props} component={child} />
                                                    );
                                                }
                                        
                                                if(type === "wizard") {
                                                    return (
                                                            <Validation key={index} {...this.props} component={child} />
                                                    );
                                                }
                                        
                                                if(type === "productCardList") {
                                                    return (
                                                            <ProductCardList inCard={true} key={index} {...this.props} component={child} />
                                                    );
                                                }
                                        
                                                if(type === "productList") {
                                                    return (
                                                            <ProductList inCard={true} key={index} {...this.props} dynamicComponent={child} />
                                                    );
                                                }
                                        
                                                if(type === "userCard") {
                                                    return (
                                                            <UserCardGroup {...this.props} key={index} component={child} />
                                                    );
                                                }
                                        
                                                if(type === "profileCard") {
                                                    return (
                                                            <ProfileCard {...this.props} component={child} />
                                                    );
                                                }
                                                
                                                if(type === "thumbCarousel") {
                                                    const data = child.data.map( dataItem => ({ id: dataItem.id, img: dataItem.img }) );
                                                    return (
                                                            <ThumbsCarousel {...this.props} key={index} data={data} component={child} />
                                                    );
                                                }

                                                if(type === "search") {
                                                    return (
                                                            <Search {...this.props} key={index} component={child} />
                                                    );
                                            }

                                            
                                            if(type === "tabs") {
                                                return (
                                                        <Tabs {...this.props} key={index} component={child} />
                                                );
                                        }
                                        return null;
                                    })
                                            }
                                        </CardBody>
                                        </Colxx>
                                    </Row>
                                </TabPane>
                            );
                        })}
                  </TabContent>
                  <div className="row justify-content-end mt-5 mx-5">
                    { this.renderFunctions() }
                </div>
                </Card>
            </div>
        );
    }
}

export default Tabs;