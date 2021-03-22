
import React, { Component, Fragment } from "react";
import { Modal, ModalBody, ButtonDropdown, DropdownItem, DropdownMenu, DropdownToggle, CustomInput, FormGroup, Label } from "reactstrap";
import ContextMenuContainer from "./ContextMenuContainer";
import ImageListView from "./ImageListView";
import ProductListPagination from "./ProductListPagination";
import { NotificationManager } from "../../common/react-notifications";
import { withRouter } from "react-router-dom";
import classnames from 'classnames';
import dynamicFunctions from '../functions';
import { fetch } from "../../../helpers/Utils";
import Validation from '../wizard/Validation';
import Slider, { Range } from "rc-slider";
import SingleSelect from "../SingleSelect";
import {
    // Formik,
    // Form,
    Field
} from "formik";
// import SearchableMultiSelect from "../SearchableMultiSelect";
import MultiSelect from "../MultiSelect";

function numberWithCommas(x) {
    return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}

class RangeTooltip extends Component {
    
    sliderHandle = (props) => {
        const { value, dragging, index, offset, ...restProps } = props;
        const positionStyle = {
            position: "absolute",
            left: `${offset}%`
        };
        return (
            <Fragment key={index}>
                <div className="rc-slider-tooltip" style={positionStyle}>{"€"+numberWithCommas(value)}</div>
                <Slider.Handle value={value} offset={offset} {...restProps} />
            </Fragment>
        );
    }

    render() {
        return (
          <Range handle={this.sliderHandle} {...this.props} />
        );
    }
}

class ProductList extends Component {

    state = {
        selectedProducts: [],
        data: [],
        currentPage: 1,
        perPage: 12,
        pageList: [],
        dropdownSplitOpen: false,
        isOpen: false,
        modalContent: [],
        priceFilter: null,
        statusFilter: null,
        categoryFilter: null,
        nameFilter: null,
        tagFilter: null,
        isLoading: false
    }

    toggle = () => this.setState({ isOpen: !this.state.isOpen });

    toggleSplit() {
        return this.setState( prevState => ({ dropdownSplitOpen: !prevState.dropdownSplitOpen }) );
    }

    handleChangeSelectAll = isToggle => {
        const { selectedProducts, data } = this.state;
        if (selectedProducts.length >= data.length) {
            if (isToggle) {
                this.setState({
                    selectedProducts: []
                });
            }
        } else {
            this.setState({
                selectedProducts: data.map(x => x.id)
            });
        }
        document.activeElement.blur();
        return false;
    };

    fetchProductsData(priceFilter = null, statusFilter = null, categoryFilter = null, tagFilter = null, nameFilter = null) {
        const { baseURL, data, token, clientID, dynamicComponent: { id } } = this.props;
        const { slug } = this.props.match.params;
        const { search } = this.props.location;
        const { currentPage, perPage } = this.state;
        const queryParams = new URLSearchParams(search).entries();
        let params = new URLSearchParams();
        params.set('page_slug', slug);
        params.set('elementID', id);
        params.set('elementType', 'productList');
        params.set('client_id', clientID);
        params.set('currentPage', currentPage);
        params.set('perPage', perPage);

        if(priceFilter) {
            params.set('filters[price]', priceFilter);
        }

        if(statusFilter) {
            params.set('filters[status]', statusFilter);
        }

        if(nameFilter) {
            params.set('filters[name]', nameFilter);
        }

        if(categoryFilter && categoryFilter.length > 0) {
            params.set('filters[category]', categoryFilter);
        }

        if(tagFilter && tagFilter.length > 0) {
            params.set('filters[tag]', tagFilter);
        }

        
        for(let param of queryParams) {
            params.set(`queryString[${param[0]}]`, param[1]);
        }        
        if(data !== undefined) {
            data.forEach( (dataItem, index) => params.set(`data[${index}]`, dataItem) );
        } else {
            params.set(`data`, false);
        }
        params = params.toString();

        this.setState({
            isLoading: true
        });

        return fetch(`${baseURL}/details?${params}`, {
            type: 'GET',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`
            }
        })
        .then( response => response.json() )
        .then( response => {
            return this.setState({ 
                currentPage: response.data.currentPage,
                data: response.data.data,
                perPage: response.data.perPage,
                pageList: response.data.pageList,
                isLoading: false
            });
        })
        .catch( error => NotificationManager.error(error.message, "Oops! We got a problem.", 3000, null, null, '') );
    }

    componentDidMount() {
        return this.fetchProductsData();
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
            functions = functions.map( functionName => {
                const Component = functionName;
                const filteredData = data.filter( (productItem) => selectedProducts.includes(productItem.id) );
                return <Component products={filteredData} />;
            })
        } else {
            functions = [];
        }
        return functions;
    }

    callback(error) {
        this.setState({
            isOpen: false,
            modalContent: [],
            selectedProducts: []
        });
        if(!error) {
            return this.fetchProductsData(this.state.priceFilter, this.state.statusFilter, this.state.categoryFilter, this.state.tagFilter, this.state.nameFilter);
        }
    }

    renderProducts() {
        const { selectedProducts, data, isLoading } = this.state;
        const { dynamicComponent: { detailViewSlug, entityName } } = this.props;
        if(isLoading) {
            return (
                <div className="text-center w-100">
                    <div className="loading position-static" />
                </div>
            );
        }
        let products = data.map( (productItem, index) => {
            let product = {
                id: productItem.id,
                title: productItem.title,
                date: productItem.date,
                price: productItem.price,
                status: productItem.status,
                statusColor: productItem.status_color,
                img: productItem.img ? productItem.img : "https://gogo-react.coloredstrategies.com/assets/img/marble-cake-thumb.jpg"
            };
            return (
                <ImageListView key={index} entityName={entityName} detailViewSlug={detailViewSlug} product={product} isSelect={selectedProducts.includes(product.id)} onCheckItem={ (event, productID) => this.onCheckItem(event, productID) } />
            );            
        });
        if(products.length > 0) {
            return products;
        }
        return (
            <p className="w-100 mb-0 font-italic text-center">No data found with the specified criteria.</p>
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

    showTitle() {
        const { inCard, dynamicComponent: { title } } = this.props;
        if(inCard) {
            return (
                <div className="card-title">
                    <span>{title.charAt(0).toUpperCase() + title.slice(1)}</span>
                </div>
            );
        }
    }

    async onPageChange(page) {
        const { baseURL, token, clientID, dynamicComponent: { id } } = this.props;
        const { slug } = this.props.match.params;
        const { perPage } = this.state;
        this.setState({
            isLoading: true
        });
        return await fetch(`${baseURL}/details?page_slug=${slug}&elementID=${id}&elementType=productList&client_id=${clientID}&currentPage=${page}&perPage=${perPage}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then( response => response.json() )
            .then( response => {
                return this.setState({ 
                    currentPage: response.data.currentPage,
                    data: response.data.data,
                    perPage: response.data.perPage,
                    pageList: response.data.pageList,
                    isLoading: false
                });
            })
            .catch( error => console.error(error) );
    }

    async triggerAction(e, action) {

        const { baseURL, token, clientID, user } = this.props;
        const { slug } = this.props.match.params;
        const { selectedProducts } = this.state;

        const request = await fetch(`${baseURL}/details?elementID=${action.component}&elementType=modal&page_slug=${slug}&client_id=${clientID}`, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        if(!request.ok) return request.statusText;
        const response = await request.json();


        const { components } = response;


        const details = components.map( (component, componentIndex) => {
            const { type } = component;
            if(type === "wizard") {
                return (
                    <Validation key={componentIndex} customData={selectedProducts} callback={ (error = false) => this.callback(error) } token={token} baseURL={baseURL} clientID={clientID} user={user} component={component} />
                );
            }
            return null;
        });

        return this.setState({
            isOpen: true,
            modalContent: details
        });
    }

    renderFilters() {
        const { filters } = this.props.dynamicComponent;
        const filtersMapped = filters.map( (filter, index) => {
            const { type } = filter;

            if(type === "range") {
                return (
                    <div className="col-md-2" key={index}>
                        <FormGroup className="mx-3">
                            <Label>{filter.label}</Label>
                            <RangeTooltip
                                onAfterChange={ (value) => {
                                    this.setState({
                                        priceFilter: value
                                    });
                                    return this.fetchProductsData(value, this.state.statusFilter, this.state.categoryFilter, this.state.tagFilter, this.state.nameFilter);
                                } }
                                min={filter.attributes.min}
                                max={filter.attributes.max}
                                className="mb-5"
                                defaultValue={[filter.attributes.min, filter.attributes.max]}
                                allowCross={false}
                                pushable={0}
                            />
                        </FormGroup>
                    </div>
                );
            }

            if(type === "text") {
                return (
                    <div className="col-md-3" key={index}>
                        <FormGroup className="mx-3">
                            <Label>{filter.label}</Label>
                            <Field
                                className="form-control"
                                name={filter.name}
                                id={filter.name}
                                placeholder={filter.placeholder}
                                onInput={ (event) => {
                                    event.persist();
                                    this.setState({
                                        nameFilter: event.target.value
                                    });
                                    return this.fetchProductsData(this.state.priceFilter, this.state.statusFilter, this.state.categoryFilter, this.state.tagFilter, event.target.value);
                                } }
                            />
                        </FormGroup>
                    </div>
                );
            }

            if(type === "predefinedDDL") {
                const options = filter.attributes.options.map( (option, index) => ({ key: index, label: option[filter.attributes.ddl.label], value: option[filter.attributes.ddl.value] }) );
                return (
                    <div className="col-md-2" key={index}>
                        <FormGroup>
                            <Label>{filter.label}</Label>
                            <Field
                                className="form-control"
                                name={filter.name}
                                id={filter.name}
                                component={SingleSelect}
                                options={options}
                                onChange={ (value) => {
                                    this.setState({
                                        statusFilter: value.value
                                    });
                                    return this.fetchProductsData(this.state.priceFilter, value.value, this.state.categoryFilter, this.state.tagFilter, this.state.nameFilter);
                                } }
                            />
                        </FormGroup>
                    </div>
                );
            }


            

            if(type === "staticDDL") {

                if(filter.identity === "category") {
                    let optionLabel = filter.attributes.ddl.label;
                    let optionValue = filter.attributes.ddl.value;
                    let options = filter.data.map( (dataItem, index) => ({ key: index, label: dataItem[optionLabel], value: dataItem[optionValue] }) );
                    return (
                        <div className="col-md-2" key={index}>
                            <FormGroup>
                                <Label>{filter.label}</Label>
                                <Field
                                    className="form-control"
                                    name={filter.name}
                                    id={filter.name}
                                    component={MultiSelect}
                                    options={options}
                                    onChange={ (value) => {
                                        const values = value.map( v => v.value );
                                        this.setState({
                                            categoryFilter: values
                                        });
                                        return this.fetchProductsData(this.state.priceFilter, this.state.statusFilter, values, this.state.tagFilter, this.state.nameFilter);
                                    } }
                                />
                            </FormGroup>
                        </div>
                    );
                }

                if(filter.identity === "tag") {
                    let optionLabel = filter.attributes.ddl.label;
                    let optionValue = filter.attributes.ddl.value;
                    let options = filter.data.map( (dataItem, index) => ({ key: index, label: dataItem[optionLabel], value: dataItem[optionValue] }) );
                    return (
                        <div className="col-md-2" key={index}>
                            <FormGroup>
                                <Label>{filter.label}</Label>
                                <Field
                                    className="form-control"
                                    name={filter.name}
                                    id={filter.name}
                                    component={MultiSelect}
                                    options={options}
                                    onChange={ (value) => {
                                        const values = value.map( v => v.value );
                                        this.setState({
                                            tagFilter: values
                                        });
                                        return this.fetchProductsData(this.state.priceFilter, this.state.statusFilter, this.state.categoryFilter, values, this.state.nameFilter);
                                    } }
                                />
                            </FormGroup>
                        </div>
                    );
                }

            }



            return (
                <div className="col-md-3" key={index}>
                    <FormGroup className="mx-3">
                        <Label>{filter.label}</Label>
                        <Field
                            className="form-control"
                            name={filter.name}
                            id={filter.name}
                            placeholder={filter.placeholder}
                            onInput={ (event) => {
                                event.persist();
                                this.setState({
                                    nameFilter: event.target.value
                                });
                                return this.fetchProductsData(this.state.priceFilter, this.state.statusFilter, this.state.categoryFilter, this.state.tagFilter, event.target.value);
                            } }
                        />
                    </FormGroup>
                </div>
            );
               

        });
        return (
            <div className="row mx-0 justify-content-center align-items-center">{ filtersMapped }</div>
        );
    }

    showExtendedFeatures() {
        const { selectedProducts, data, dropdownSplitOpen } = this.state;
        const { showExtendedFeatures, actions } = this.props.dynamicComponent;
        if(!showExtendedFeatures) {
            return null;
        }
        return (
            <div className="row mx-0 justify-content-between align-items-center">
                <div className="col-md-11 text-center">
                    { this.renderFilters() }
                </div>
                <div className="col-md-1 text-right">
                    <ButtonDropdown isOpen={dropdownSplitOpen} toggle={ () => this.toggleSplit() }>
                        <div className="btn btn-primary btn-lg pl-4 pr-0 check-button check-all">
                            <CustomInput
                                className="custom-checkbox mb-0 d-inline-block"
                                type="checkbox"
                                id="checkAll"
                                checked={selectedProducts.length >= data.length}
                                onChange={ () => this.handleChangeSelectAll(true) }
                                label={
                                    <span
                                        className={`custom-control-label ${
                                            selectedProducts.length > 0 &&
                                            selectedProducts.length < data.length
                                            ? "indeterminate"
                                            : ""
                                        }`}
                                    />
                                }
                            />
                        </div>
                        <DropdownToggle
                            disabled={selectedProducts.length === 0}
                            caret
                            color="primary"
                            className="dropdown-toggle-split btn-lg"
                        />
                        <DropdownMenu right>
                            {
                                actions.map( (action, index) => {
                                    return (
                                        <DropdownItem
                                            key={index}
                                            onClick={ (e) => this.triggerAction(e, action) }>
                                            {action.label}
                                        </DropdownItem>
                                    );
                                })
                            }
                        </DropdownMenu>
                    </ButtonDropdown>
                </div>
            </div>
        );
    }

    render() {
        const { hidden, inCard } = this.props;
        const { currentPage, pageList, data, isOpen, modalContent } = this.state;
        return (
            <div>
                <div className={classnames({ 'card': inCard })}>
                    <div className={classnames({ 'card-body': inCard })}>
                        { this.showTitle() }
                        { this.showExtendedFeatures() }
                        <div className={classnames('row', 'align-items-stretch', 'mt-5', 'mx-5')}>
                            <ContextMenuContainer onContextMenu={ (e, data) => null } />
                            { !hidden ? this.renderProducts() : null }
                        </div>
                        <ProductListPagination canNext canPrevious onPageChange={ async (page) => await this.onPageChange(page) } page={currentPage} totalResults={data.length} pages={pageList} />
                        <div className="row justify-content-end mt-5 mx-5">
                            { !hidden ? this.renderFunctions() : null }
                        </div>
                    </div>
                </div>
                <Modal isOpen={isOpen} size="xl" fade={false} toggle={ () => this.toggle() }>
                    <ModalBody className="p-0">
                        { modalContent }
                    </ModalBody>
                </Modal>
            </div>
          
        );
    }
}


export default withRouter(ProductList);