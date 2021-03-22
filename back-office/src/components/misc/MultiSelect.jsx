import React from 'react';
import { Creatable } from 'react-select';

class MultiSelect extends React.Component {

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
            value={field.value}
            onBlur={field.onBlur}
            onKeyUp={ (event) => onKeyUp(event) }
            onChange={ (option) => {
                form.setFieldValue(field.name, option);
                return onChange(option);
            } }
            classNamePrefix="react-select"
            isMulti
            options={options} />
        ) : null;
    }  

}


export default MultiSelect;