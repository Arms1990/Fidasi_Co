import React, { Component } from "react";
import dynamicFunctions from './functions';


class ProductDescriptionText extends Component {

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

    render() {
        let { component: { data } } = this.props;
        return (
            <div>
                <p dangerouslySetInnerHTML={{ __html: data }} />
                <div className="row justify-content-end mt-5 mx-5">
                    { this.renderFunctions() }
                </div>
            </div>
        );
    }
}

export default ProductDescriptionText;