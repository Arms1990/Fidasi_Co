import React from 'react';
import { AsyncCreatable } from 'react-select';
import { NotificationManager } from "../common/react-notifications";
import { withRouter } from 'react-router-dom';
import { fetch } from '../../helpers/Utils';

const loadOptions = (inputValue, otherParameters) => {
    return new Promise( async (resolve) => {
        let params = new URLSearchParams();
        params.set('s', inputValue);
        params = params.toString();
        const request = await fetch(`${otherParameters.action}/?${params}`, {
            type: 'GET',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${otherParameters.token}`
            }
        });
        if(!request.ok) {
            return NotificationManager.error(request.statusText, "Oops! We got a problem.", 3000, null, null, '')
        }
        const response = await request.json();
        setTimeout( () => {
            // let optionLabel = element.ddl.label;
            // let optionValue = element.ddl.value;
            // let options = response.data.map( (dataItem, index) => ({ key: index, label: dataItem[optionLabel], value: dataItem[optionValue] }) );
            let options = response.data;
            resolve(options);
        }, 1000);
    });
}

class SearchableProductSelector extends React.Component {

    render() {
        let { field, form, action, onChange, options, onKeyUp, hidden, token } = this.props;
        return !hidden ? (
            <AsyncCreatable
            styles={{
                menu: (provided, state) => ({
                    ...provided,
                    zIndex: 1040
                })
            }}
            name={field.name}
            value={field.value}
            onBlur={field.onBlur}
            onKeyUp={ (event) => onKeyUp(event) }
            onChange={ (option) => {
                form.setFieldValue(field.name, option);
                if(onChange) {
                    return onChange(option);
                }
            } }
            classNamePrefix="react-select"
            isMulti
            isSearchable
            cacheOptions
            defaultOptions={options}
            loadOptions={ (inputValue) => loadOptions(inputValue, { action, token }) }
            />
        ) : null;
    }

}


export default withRouter(SearchableProductSelector);