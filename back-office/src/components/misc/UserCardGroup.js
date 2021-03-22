import React, { Component } from "react";
import { NavLink, withRouter } from "react-router-dom";
import { injectIntl } from "react-intl";
import {
    Card,
    CardBody,
    CardSubtitle,
    CardText,
    Row,
    Modal,
    ModalBody
} from "reactstrap";
import ThumbnailImage from "../cards/ThumbnailImage";
import { Colxx } from "../common/CustomBootstrap";
import dynamicFunctions from './functions';
import classnames from "classnames";


import {
    AreaChart,
    LineChart,
    BarChart,
    PieChart,
    DoughnutChart,
    Table,
    ProductCardList,
    ProductList,
    ProfileCard,
    Calendar,
    ThumbsCarousel,
    Search,
    Tabs
} from './index';
import Validation from './wizard/Validation';

class UserCardGroup extends Component {

    state = {
        modalOpen: false,
        elements: []
    }

    toggle(index = null) {
        const { modalOpen } = this.state;
        const { data } = this.props.component;

        if(index !== null && Array.isArray(data[index].elements)) {
            return this.setState({
                modalOpen: !modalOpen,
                elements: data[index].elements
            });
        }

        return this.setState({
            modalOpen: false
        });

    }


    renderElements() {

        const { elements } = this.state;
        const transparent = false;

        const components = elements.map( (element, index) => {

            const { type } = element;
            if(type === "chart") {
                const { kind } = element;
                if(kind === "pie") {
                    return (
                        <div className={ elements.length === 1 ? "col" : (index === 0 ? "col-md-7" : "col-md-5") } key={index}>
                            <PieChart className={!transparent ? "shadow-none" : null} shadow={transparent} component={element} />
                        </div>
                    );
                }
    
                if(kind === "bar") {
                    return (
                        <div className={ elements.length === 1 ? "col" : (index === 0 ? "col-md-7" : "col-md-5") } key={index}>
                            <BarChart className={!transparent ? "shadow-none" : null} shadow={transparent} component={element} />
                        </div>
                    );
                }
    
                if(kind === "area") {
                    return (
                        <div className={ elements.length === 1 ? "col" : (index === 0 ? "col-md-7" : "col-md-5") } key={index}>
                            <AreaChart className={!transparent ? "shadow-none" : null} shadow={transparent} component={element} />
                        </div>
                    );
                }

                if(kind === "line") {
                    return (
                        <div className={ elements.length === 1 ? "col" : (index === 0 ? "col-md-7" : "col-md-5") } key={index}>
                            <LineChart className={!transparent ? "shadow-none" : null} shadow={transparent} component={element} />
                        </div>
                    );
                }

                if(kind === "doughnut") {
                    return (
                        <div className={ elements.length === 1 ? "col" : (index === 0 ? "col-md-7" : "col-md-5") } key={index}>
                            <DoughnutChart className={!transparent ? "shadow-none" : null} shadow={transparent} component={element} />
                        </div>
                    );
                }
            }

            if(type === "calendar") {
                return (
                    <div className={ elements.length === 1 ? "col" : (index === 1 ? "col-md-5" : "col-md-5") } key={index}>
                        <Calendar component={element} />
                    </div>
                );
            }

            if(type === "table") {
                return (
                    <div className={ elements.length === 1 ? "col" : (index === 1 ? "col-md-5" : "col-md-5") } key={index}>
                        <Table component={element} />
                    </div>
                );
            }

            if(type === "card") {
                return (
                    <div className={ elements.length === 1 ? "col" : (index === 1 ? "col-md-5" : "col-md-5") } key={index}>
                        <Card {...this.props} component={element} />
                    </div>
                );
              }
    
              if(type === "wizard") {
                return (
                    <div className={ elements.length === 1 ? "col" : (index === 1 ? "col-md-5" : "col-md-5") } key={index}>
                        <Validation {...this.props} component={element} />
                    </div>
                );
              }
    
              if(type === "productCardList") {
                return (
                    <div className={ elements.length === 1 ? "col" : (index === 1 ? "col-md-5" : "col-md-5") } key={index}>
                        <ProductCardList inCard={true} {...this.props} component={element} />
                    </div>
                );
              }
    
              if(type === "productList") {
                return (
                    <div className={ elements.length === 1 ? "col" : (index === 1 ? "col-md-5" : "col-md-5") } key={index}>
                        <ProductList inCard={true} {...this.props} dynamicComponent={element} />
                    </div>
                );
              }
    
              if(type === "userCard") {
                return (
                    <div className={ elements.length === 1 ? "col" : (index === 1 ? "col-md-5" : "col-md-5") } key={index}>
                        <UserCardGroup inCard={true} {...this.props} component={element} />
                    </div>
                );
              }
    
              if(type === "profileCard") {
                return (
                    <div className={ elements.length === 1 ? "col" : (index === 1 ? "col-md-5" : "col-md-5") } key={index}>
                        <ProfileCard {...this.props} component={element} />
                    </div>
                );
              }
              
              if(type === "thumbCarousel") {
                const data = element.data.map( dataItem => ({ id: dataItem.id, img: dataItem.img }) );
                  return (
                    <div className={ elements.length === 1 ? "col" : (index === 1 ? "col-md-5" : "col-md-5") } key={index}>
                        <ThumbsCarousel {...this.props} data={data} component={element} />
                    </div>
                );
            }

            if(type === "search") {
                return (
                    <div className={ elements.length === 1 ? "col" : (index === 1 ? "col-md-5" : "col-md-5") } key={index}>
                        <Search {...this.props} component={element} />
                    </div>
                );
            }

            
            if(type === "tabs") {
                return (
                    <div className={ elements.length === 1 ? "col" : (index === 1 ? "col-md-5" : "col-md-5") } key={index}>
                        <Tabs {...this.props} component={element} />
                    </div>
                );
            }
  
            return null;
        });

        return components;
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

    render() {
        const { component: { title, data }, inCard } = this.props;
        const { modalOpen, elements } = this.state;

        let modifiedData = data.map( (dataItem, index) => {
            return (
                <Colxx xxs="12" md="6" lg={inCard ? '3' : '4'} key={index}>
                    <Card className={classnames("d-flex", "flex-row", "mb-4", { "py-3": !!dataItem.icon })}>
                        <NavLink to={ dataItem.redirect ? `/app${dataItem.redirect}` : "#"} onClick={ () => this.toggle(index) } className="d-flex">
                            {dataItem.icon ?
                            <i className={classnames(dataItem.icon, 'h1', 'mb-0', 'px-3', 'align-self-center')}></i> :
                            <ThumbnailImage small src={dataItem.image || 'https://gogo-react.coloredstrategies.com/assets/img/profile-pic-l-10.jpg'} alt={dataItem.title} className="m-4" /> }
                            <div className="d-flex flex-grow-1 min-width-zero">
                                <CardBody className=" pl-0 align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero">
                                    <div className="min-width-zero">
                                        <CardSubtitle className="mb-1">{dataItem.title}</CardSubtitle>
                                        { dataItem.subtitle ? 
                                        <CardText className="text-muted text-small mb-2">{dataItem.subtitle}</CardText>
                                        : null
                                        }
                                    </div>
                                </CardBody>
                            </div>
                        </NavLink>
                    </Card>
                </Colxx>
            );
        });

        return (
            <Colxx xxs="12" lg={inCard ? '12' : '8'} className="mb-4 col-right d-inline-block align-top">
                <h1 className="font-weight-light mb-5">{title}</h1>
                <Row>{ modifiedData }</Row>
                <div className="row justify-content-end mt-5 mx-5">
                    { this.renderFunctions() }
                </div>



                <Modal isOpen={modalOpen} size="lg" toggle={ () => this.toggle() }>
                    <ModalBody className="p-4">
                        { elements.length === 0 ? <div className="loading d-block mx-auto position-static" /> : null }
                        { this.renderElements() }
                    </ModalBody>
                </Modal>


            </Colxx>
        );
    }
}

export default withRouter(
    injectIntl(UserCardGroup)
);