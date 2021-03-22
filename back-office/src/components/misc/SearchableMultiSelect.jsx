import React from 'react';
import { AsyncCreatable } from 'react-select';
import { NotificationManager } from "../common/react-notifications";
import { withRouter } from 'react-router-dom';
import { fetch } from '../../helpers/Utils';

const loadOptions = (inputValue, otherParameters) => {
    return new Promise( async (resolve) => {
        const { baseURL, token, clientID, element } = otherParameters;
        const { slug } = otherParameters.match.params;
        let params = new URLSearchParams();
        params.set('page_slug', slug);
        params.set('elementID', element.elementID);
        params.set('elementType', 'wizard');
        params.set('stepElementName', 'distributor');
        params.set('client_id', clientID);
        params.set(`searchInput`, inputValue);
        params = params.toString();
        const request = await fetch(`${baseURL}/details?${params}`, {
            type: 'GET',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`
            }
        });
        if(!request.ok) {
            return NotificationManager.error(request.statusText, "Oops! We got a problem.", 3000, null, null, '')
        }
        const response = await request.json();
        setTimeout( () => {
            let optionLabel = element.ddl.label;
            let optionValue = element.ddl.value;
            let options = response.data.map( (dataItem, index) => ({ key: index, label: dataItem[optionLabel], value: dataItem[optionValue] }) );
            resolve(options);
        }, 1000);
    });
}

class SearchableMultiSelect extends React.Component {

    render() {
        let { field, form, onChange, onKeyUp, hidden, match, element, baseURL, token, clientID } = this.props;
        return !hidden ? (
            <AsyncCreatable
            styles={{
                menu: (provided, state) => ({
                    ...provided,
                    zIndex: 1040
                })
            }}
            allowCreateWhileLoading={true}
            name={field.name}
            value={field.value}
            onBlur={field.onBlur}
            onKeyUp={ (event) => onKeyUp(event) }
            onChange={ (option) => {
                form.setFieldValue(field.name, option);
                return onChange(option);
            } }
            classNamePrefix="react-select"
            // isMulti
            isSearchable
            isClearable
            cacheOptions
            // defaultOptions={options}
            loadOptions={ (inputValue) => loadOptions(inputValue, {
                baseURL,
                token,
                clientID,
                match,
                element
            }) }
            />
        ) : null;
    }

}


export default withRouter(SearchableMultiSelect);