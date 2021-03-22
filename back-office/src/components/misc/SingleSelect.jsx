import React from 'react';
import { Creatable } from 'react-select';

class SingleSelect extends React.Component {

    render() {
        let { options, field, form, onChange, onKeyUp, hidden } = this.props;
        return !hidden ? (
            <Creatable
            styles={{
                menu: (provided, state) => ({
                    ...provided,
                    zIndex: 1040
                })
            }}
            name={field.name}
            value={options.find(option => option.value === field.value)}
            onBlur={field.onBlur}
            onKeyUp={ (event) => onKeyUp(event) }
            onChange={ (option) => {
                form.setFieldValue(field.name, option.value);
                if(onChange) {
                    return onChange(option);
                }
            } }
            classNamePrefix="react-select"
            options={options} />
        ) : null;
    }  

}


export default SingleSelect;