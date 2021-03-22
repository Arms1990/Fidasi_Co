
import React, { Component } from "react";
import DataTablePagination from "./DatatablePagination";
// import { servicePath, searchPath } from "../constants/defaultValues";
import dynamicFunctions from './functions';
import { fetch } from "../../helpers/Utils";
import ThumbnailImage from "../cards/ThumbnailImage";
import classnames from "classnames";

class Search extends Component {

    state = {
        data: null,
        currentPage: 0,
        perPage: 10,
        totalPages: 1
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

    getData = async () => {
        const { baseURL, token, slug, clientID, component } = this.props;
        return await fetch(`${baseURL}/details?page_slug=${slug}&elementID=${component.id}&elementType=search&client_id=${clientID}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then( response => response.json() )
            .then( response => {
                this.setState({ 
                    currentPage: response.page,
                    data: response.data,
                    perPage: response.pageSize,
                    totalPages: response.total_pages
                });
            })
            .catch( error => console.error(error) );
    }

    async componentDidMount() {
        return await this.getData();
    }

    extractContent(s) {
        const span = document.createElement('span');
        span.innerHTML = s;
        return span.textContent || span.innerText;
    };

    renderData = (isSmall) => {
        let { data } = this.state;
        let content = data.map( (dataItem) => {
            return (
                <div key={dataItem.id} aria-current="page" className={classnames('row', 'align-items-center', 'justify-content-center', 'mb-4', 'active')}>
                    <div className={classnames({ "col-md-3": !isSmall || false }, { "col-md-2": isSmall || false }, { "text-center": isSmall || false })}>
                        <ThumbnailImage small={isSmall || false} rounded={isSmall || false} className="p-0" alt={dataItem.title} src={dataItem.image} />
                    </div>
                    <div className={classnames({ "col-md-9": !isSmall || false }, { "col-md-10": isSmall || false })}>
                        <p className="list-item-heading mb-1">{dataItem.title}</p>
                        <div style={{ fontSize: 10 }} dangerouslySetInnerHTML={{ __html: this.extractContent(dataItem.description).substring(0, 80) }} className="mb-1 text-small"></div>
                        <p className="text-primary text-small mb-0">{dataItem.date}</p>
                    </div>
                </div>
            );
        });
        return content;
    }

    async onPageChange(page) {
        const { baseURL, token, slug, clientID, component } = this.props;
        return await fetch(`${baseURL}/details?page_slug=${slug}&elementID=${component.id}&elementType=search&client_id=${clientID}&currentPage=${page+1}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then( response => response.json() )
            .then( response => {
                this.setState({
                    currentPage: response.current_page,
                    data: response.data,
                    perPage: response.per_page,
                    totalPages: response.last_page
                });
            })
            .catch( error => console.error(error) );
    }

    render() {
        const { data, currentPage, totalPages } = this.state;
        const { component: { title, isSmall } } = this.props;
        if(data) {
            return (
                <div className="bg-white pb-2 pt-4 px-4 rounded-lg shadow-sm">
                    <h2 className="mb-3">{title ? title.charAt(0).toUpperCase() + title.slice(1) : null}</h2>
                    { this.renderData(isSmall) }
                    {/* <div className="row justify-content-end mt-5 mx-5">
                        { this.renderFunctions() }
                    </div> */}
                    { this.state.data.length >= this.state.perPage ? <DataTablePagination canNext canPrevious onPageChange={ (page) => this.onPageChange(page) } page={currentPage - 1} pages={totalPages} /> : null }
                </div>
            );
        }

        return null;
    }
}

export default Search;