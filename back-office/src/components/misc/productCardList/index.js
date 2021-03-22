
import React, { Component } from "react";

import ContextMenuContainer from "./ContextMenuContainer";
import ListPageHeading from "./ListPageHeading";
import ImageListView from "./ImageListView";
import ThumbListView from "./ThumbListView";
import DataListView from "./DataListView";
import dynamicFunctions from '../functions';
import { NotificationManager } from "../../common/react-notifications";
import { withRouter } from "react-router-dom";
import classnames from 'classnames';
import { Modal, ModalBody } from "reactstrap";

import {
    AreaChart,
    LineChart,
    BarChart,
    PieChart,
    DoughnutChart,
    Table,
    ProductList,
    ProfileCard,
    Calendar,
    ThumbsCarousel,
    Search,
    Tabs,
    UserCardGroup,
    Card
} from '../index';
import Validation from '../wizard/Validation';
import { fetch } from "../../../helpers/Utils";

class ProductCardList extends Component {

    state = {
        mode: 'thumblist',
        search: '',
        selectedPageSize: 8,
        selectedOrderOption: {
            label: 'Product Name',
            column: 'name'
        },
        selectedProducts: [],
        data: [],
        modalOpen: false,
        elements: []
    }

    toggle(index = null) {
        const { modalOpen, data } = this.state;
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

    componentDidMount() {
        const { baseURL, data, token, clientID, dynamicComponent: { id } } = this.props;
        const { slug } = this.props.match.params;
        const { search } = this.props.location;
        const queryParams = new URLSearchParams(search).entries();
        let params = new URLSearchParams();
        params.set('page_slug', slug);
        params.set('elementID', id);
        params.set('elementType', 'productCardList');
        params.set('client_id', clientID);
        for(let param of queryParams) {
            params.set(`queryString[${param[0]}]`, param[1]);
        }        
        if(data !== undefined) {
            data.forEach( (dataItem, index) => params.set(`data[${index}]`, dataItem) );
        } else {
            params.set(`data`, false);
        }
        params = params.toString();
        return fetch(`${baseURL}/details?${params}`, {
            type: 'GET',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`
            }
        })
        .then( response => response.json() )
        .then( response => this.setState({ data: response.data }) )
        .catch( error => NotificationManager.error(error.message, "Oops! We got a problem.", 3000, null, null, '') );
    }

    renderProducts() {
        let { mode, search, selectedProducts, data } = this.state;
        if(search !== "") {
            data = data.filter( dataItem => dataItem.title.match(new RegExp(search, 'gi')) );
        }
        let products = data.map( (productItem, index) => {
            let product = {
                id: productItem.id,
                title: productItem.title,
                date: productItem.date,
                price: productItem.price,
                img: productItem.img ? productItem.img : "https://gogo-react.coloredstrategies.com/assets/img/marble-cake-thumb.jpg"
            };
            if(mode === "imagelist") {
                return (
                    <ImageListView id={index} key={index} product={product} isSelect={selectedProducts.includes(product.id)} onCheckItem={ (event, productID) => this.onCheckItem(event, productID) } toggleModal={ (e, key) => this.toggle(key) } />
                );
            } else if(mode === "thumblist") {
                return (
                    <ThumbListView id={index} key={index} product={product} isSelect={selectedProducts.includes(product.id)} onCheckItem={ (event, productID) => this.onCheckItem(event, productID) } toggleModal={ (e, key) => this.toggle(key) } />
                );
            } else {
                return (
                    <DataListView id={index} key={index} product={product} isSelect={selectedProducts.includes(product.id)} onCheckItem={ (event, productID) => this.onCheckItem(event, productID) } toggleModal={ (e, key) => this.toggle(key) } />
                );
            }         
        });
        if(products.length > 0) {
            return products;
        }
        return (
            <div className="text-center w-100">
                <span className="font-italic">No product found...</span>
            </div>
        );
    }

    async getUpdatedProducts(productID) {
        const { selectedProducts } = this.state;
        let products = [];
        if(selectedProducts.includes(productID)) {
            products = [
                ...selectedProducts.filter( selectedProduct => selectedProduct !== productID )
            ];
        } else {
            products = [
                ...selectedProducts,
                productID
            ];
        }
        return products;
    }

    async onCheckItem(event, productID) {
        const { form, field, onChange } = this.props;
        let products = await this.getUpdatedProducts(productID);
        await form.setFieldValue(field.name, products);
        await onChange(products);
        return this.setState({
            selectedProducts: products
        });
    }

    changePageSize(size) {
        return this.setState({
            selectedPageSize: size
        });
    }

    changeDisplayMode(mode) {
        return this.setState({
            mode
        });
    }

    onSearchKey(event) {
        return this.setState({
            search: event.target.value
        });
    }

    renderFunctions() {
        const { selectedProducts, data } = this.state;
        let { functions } = this.props;
        if(functions) {
            functions = functions.map( functionName => {
                if(functionName in dynamicFunctions) {
                    return dynamicFunctions[functionName];
                }
                return null;
            }).filter( functionName => functionName !== null );
            functions = functions.map( (functionName, index) => {
                const Component = functionName;
                const filteredData = data.filter( (productItem) => selectedProducts.includes(productItem.id) );
                return <Component key={index} products={filteredData} />;
            })
        } else {
            functions = [];
        }
        return functions;
    }

    showTitle() {
        const { inCard, inWizard, dynamicComponent: { title, data } } = this.props;
        const { selectedOrderOption, selectedPageSize } = this.state;
        const orderOptions = [
            {
                label: 'Name',
                column: 'name'
            },
            {
                label: 'Date',
                column: 'date'
            }
        ];
        const pageSizes = [8, 12, 24];
        return (
            <ListPageHeading inWizard={inWizard} inCard={inCard} heading={title.charAt(0).toUpperCase() + title.slice(1)} changeOrderBy={ (column) => this.setState({ selectedOrderOption: orderOptions.find(opt => opt.column === column) }) } changeDisplayMode={ (mode) => this.changeDisplayMode(mode) } changePageSize={ (size) => this.changePageSize(size) } onSearchKey={ (event) => this.onSearchKey(event) } startIndex={0} endIndex={selectedPageSize} totalItemCount={data.length} pageSizes={pageSizes} selectedPageSize={selectedPageSize} orderOptions={orderOptions} selectedOrderOption={selectedOrderOption} />
        );
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

    render() {
        const { hidden, inCard } = this.props;
        const { modalOpen, elements } = this.state;
        return (
            <div className={classnames({ 'card': inCard })}>
                <div className={classnames({ 'card-body': inCard })}>
                    { this.showTitle() }
                    <div className={classnames('row', 'align-items-stretch', 'mt-5', 'mx-5')}>
                        <ContextMenuContainer onContextMenu={ (e, data) => null } />
                        { !hidden ? this.renderProducts() : null }
                        
                        <Modal isOpen={modalOpen} size="lg" toggle={ () => this.toggle() }>
                            <ModalBody className="p-4">
                                { elements.length === 0 ? <div class="loading d-block mx-auto position-static" /> : null }
                                { this.renderElements() }
                            </ModalBody>
                        </Modal>

                    </div>
                    <div className="row justify-content-end mt-5 mx-5">
                        { !hidden ? this.renderFunctions() : null }
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(ProductCardList);