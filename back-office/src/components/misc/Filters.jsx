import React from 'react';
import $ from 'jquery';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

class FilterOptions extends React.Component {

    render() {
        const { options } = this.props;
        let content = [];
        options.forEach(function (filterValue, index) {
            content.push(<option key={index} value={filterValue.created_at}>{filterValue.created_at}</option>);
        });
        return content;
    }

}

class Filters extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            content: []
        };
        this.filterForm = React.createRef();
    }

    componentDidMount() {
        return this.props.filters.forEach( (filter, index) => {
            if(this.state[filter.id] === undefined) {
                this.setState({
                    [filter.id]: filter.value
                });
            }
        });
    }

    renderCheckBox = (filter, index) => {
        return (
            <div key={index} className="form-check form-check-inline">
                <input className="form-check-input" type="checkbox" onChange={ (event) => this.setState({ [filter.id]: event.target.checked }) } name={filter.id} id={filter.id} checked={!!this.state[filter.id]} value={this.state[filter.id]} />
                <label className="form-check-label" htmlFor={filter.id}>
                    <span>{filter.placeholder}</span>
                </label>
            </div>
        );
    }


    renderDDL = (filter, index) => {
        return (
            <select key={index} onChange={ (event) => this.setState({ [filter.id]: event.target.value }) } name={filter.id} id={filter.id} value={this.state[filter.id]} className="form-control mr-sm-2 filter-input">
                <option value="">{filter.placeholder}</option>
                <FilterOptions options={filter.values} />
            </select>
        );
    }

    renderTextField = (filter, index) => {
        let type = "text";
        if (filter.type === "number") {
            type = "number";
        }
        if (filter.type === "time_picker") {
            type = "time"
        }
        if (filter.type === "date_picker") {
            type = "date"
        }
        if (filter.type === "datetime_picker") {
            type = "datetime-local"
        }
        return (
            <input key={index} type={type} onChange={ (event) => this.setState({ [filter.id]: event.target.value }) } className="form-control mr-sm-2 filter-input" id={filter.id} name={filter.id} value={this.state[filter.id] || ''} placeholder={filter.placeholder} />
        );
    }

    filter = (event) => {


        event.preventDefault();


        const { slug, token, baseURL, clientID } = this.props;

        let that = this;
        
        let form = this.filterForm;
        let data = $(form).serializeArray().filter(function (dataObject) {
            return dataObject.value != null && dataObject.value !== "";
        });

        $.ajax({
            url: `${baseURL}/details`,
            headers: {
                Authorization: `Bearer ${token}`
            },
            data: {
                elementType: "filters",
                page_slug: slug,
                client_id: clientID,
                filters: data
            },
            success: function (response) {
                return that.props.onFiltersApplied(response.details);
            }
        });


    }


    render() {
        return (
            <form className="form-inline mb-5" ref={ ref => this.filterForm = ref } onSubmit={ (event) => this.filter(event) }>
                <div className="w-100 d-flex align-items-center justify-content-center">
                    { this.props.filters.map( (filter, index) => {
                        if (filter.type === "ddl") {
                            return (this.renderDDL(filter, index));
                        } else if (filter.type === "boolean") {
                            return (this.renderCheckBox(filter, index));
                        } else {
                            return (this.renderTextField(filter, index));
                        }
                    }) }
                    { this.props.filters.length > 0 ? <button type="submit" className="btn btn-primary btn-lg mb-2">Filter</button> : null }
                </div>
            </form>
        );
    }
}

const mapStateToProps = ({ authUser, menu }) => {
    const { containerClassnames } = menu;
    const { baseURL, token, clientID } = authUser;
    return { baseURL, token, clientID, containerClassnames };
};

export default withRouter(
    connect(
        mapStateToProps,
        {}
    )(Filters)
);