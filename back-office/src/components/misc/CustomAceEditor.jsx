import React from 'react';
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-xcode";


class CustomAceEditor extends React.Component {

    render() {
        let { className, field, form, onChange, onKeyUp, hidden, placeholder } = this.props;
        return !hidden ? (
            <AceEditor
            name={field.name}
            value={field.value}
            mode="json"
            theme="xcode"
            editorProps={{ $blockScrolling: true }}
            setOptions={{ useWorker: false }}
            fontSize={14}
            width="auto"
            height="300px"
            className={className}
            showPrintMargin={false}
            placeholder={placeholder}
            onBlur={field.onBlur}
            onKeyUp={ (event) => onKeyUp(event) }
            onChange={ (option) => {
                form.setFieldValue(field.name, option);
                return onChange(option);
            } }
            />
        ) : null;
    }  

}


export default CustomAceEditor;