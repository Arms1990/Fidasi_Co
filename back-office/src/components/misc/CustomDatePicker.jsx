import React from 'react';
import DatePicker from "react-datepicker";

class CustomDatePicker extends React.Component {

    render() {
        let { field, form, onChange, placeholder, hidden } = this.props;
        return !hidden ? (
            <DatePicker
                id={field.id}
                name={field.name}
                value={field.value}
                // onBlur={field.onBlur}
                onSelect={ (value) => {
                    value = value.format('YYYY-MM-DD');
                    form.setFieldValue(field.name, value);
                    return onChange(value);
                } }
                dateFormat="YYYY-MM-DD"
                // selected={moment(field.value)}
                placeholderText={placeholder}
            />
        ) : null;
    }  

}


export default CustomDatePicker;