import React from 'react';

import { NotificationManager } from "../common/react-notifications";
import Validation from './wizard/Validation';


import $ from 'jquery';
import 'bootstrap';
import bootbox from 'bootbox';


import 'datatables.net-bs4';
import 'datatables.net-responsive';
import 'datatables.net-responsive-bs4';
import 'datatables.net-select';
import 'datatables.net-select-bs4';
import 'datatables.net-buttons/js/buttons.html5';
import 'datatables.net-buttons/js/buttons.print';
import dynamicFunctions from './functions';


import '../../plugins/datatables.net-buttons-bs4/js/buttons.bootstrap4';
import { Modal, ModalBody } from 'reactstrap';
import { fetch } from '../../helpers/Utils';
// import '../../plugins/datatables.net-editor-free';












$.fn.dataTableExt.oStdClasses["sFilterInput"] = "form-control";
$.fn.dataTableExt.oStdClasses["sLengthSelect"] = "w-auto mx-2";


class DataTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            modalContent: []
        }
    }

    toggle = () => this.setState({ isOpen: !this.state.isOpen });

    refresh() {
        return this.setState({
            isOpen: false,
            modalContent: []
        });
    }

    async componentDidMount() {
        return await this.drawTable();
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

    generateUUID() {
        var d = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,function(c) {
            var r = (d + Math.random()*16)%16 | 0;
            d = Math.floor(d/16);
            return (c=='x' ? r : (r&0x7|0x8)).toString(16);
        });
        return uuid.toUpperCase();
    }

    async drawTable() {
        let { slug, token, user, baseURL, clientID, component, filters } = this.props;
        user = (typeof(user) === "string") ? JSON.parse(user) : user;
        let that = this;
        let options = {
            responsive: {
                details: {
                    type: 'column',
                    target: 'tr'
                }
            },
            processing: true,
            serverSide: true,
            search: {
                regex: false,
                smart: true,
                caseInsensitive: true
            },
            columns: component.columns.map(function (column, index) {
                return {
                    type: column.attributes.type,
                    name: [column.as],
                    required: (column.as.search("password") !== -1) ? false : column.attributes.required,
                    readonly: column.attributes.readonly,
                    excluded: column.attributes.excluded,
                    visible: (column.as.search("password") !== -1) ? false : column.attributes.visible,
                    protected: column.attributes.protected,
                    data: [column.as],
                    render: function (data, type, row, meta) {
                        if(column.attributes.kind) {
                            if(column.attributes.kind === "file") {


                                const { as, content } = column.attributes.label;

                                if(as === "icon") {
                                    return `<a href="${baseURL}/download?file=${data}" download class="btn btn-link text-decoration-none p-0"><i class="${content}"></i></a>`;
                                } else {
                                    return `<a href="${baseURL}/download?file=${data}" download class="btn btn-link p-0">${content}</a>`;
                                }

                                
                            }
                        }
                        return data;
                    }
                };
            }),
            pagingType: "full_numbers",
            dom: "<'row no-gutters align-items-center justify-content-around mx-0'<'col-sm-12 col-md-3'l><'col-sm-12 col-md-9 text-right d-sm-flex justify-content-end align-items-center'<'mb-2 mr-2'B>f>>" +
            "<'row no-gutters align-items-center justify-content-around mx-0'<'col-sm-12'tr>>" +
            "<'row no-gutters align-items-center justify-content-around mx-0'<'col-sm-12 col-md-6'i><'col-sm-12 col-md-6 text-right'p>>",
            select: {
                info: false
            },
            buttons: !component.buttons ? [] : { 
                dom: {
                    container: {
                        className: 'dt-buttons btn-group'
                    }
                },
                buttons: component.buttons.map( (button) => {

                let action = {
                    text: button.label,
                    name: button.action
                };


                if(button.action !== "export" && button.action !== "add") {
                    action.extend = "selected";
                }

                if(button.action === "export") {
                    action.extend = button.format;
                    action.filename = this.generateUUID();
                    action.exportOptions = {
                        modifier: {
                            page: 'all'
                        }
                    };
                    // action.action = function(e, dt, button, config) {

                        // let payload = dt.page.info();
                        // payload['entityName'] = component.entityName;

                        // return bootbox.prompt({
                        //     title: "Please re-enter your password to continue...",
                        //     inputType: "password",
                        //     callback: function(response) {
                        //         if(response) {
                        //             return fetch(`${baseURL}/api/user/authorize`, {
                        //                 method: 'POST',
                        //                 headers: {
                        //                     'Accept': 'application/json',
                        //                     'Content-Type': 'application/json'
                        //                 },
                        //                 body: JSON.stringify({
                        //                     user_id: user.user_id,
                        //                     password: response,
                        //                     action: 'csv_export',
                        //                     payload: JSON.stringify(payload)
                        //                 })
                        //             })
                        //             .then( response => response.json() )
                        //             .then( response => {
                        //                 if(response.matched) {
                                            // return $.fn.dataTable.ext.buttons.csvHtml5.action.call(dt.button(button), e, dt, button, config);
                                    //     }
                                    //     return NotificationManager.error(response.message, "Authorization Failed", 3000, null, null, '');
                                    // })
                                    // .catch( error => console.error(error) );
                            //     }
                            // }
                        // });
                    // }
                    action.key = {
                        key: 'e',
                        ctrlKey: true,
                        shiftKey: true
                    };
                } else {
                    action.action = async function(e, dt, buttonRef, config) {
                        let customizedFilters = {};
                        let selectedRows = dt.rows({ selected: true }).data()[0];
                        if(filters) {
                            filters.forEach( filter => customizedFilters[filter.name] = filter.value );
                            selectedRows = {
                                ...selectedRows,
                                ...customizedFilters
                            };
                        }
                        try {
                            const request = await fetch(`${baseURL}/details?elementID=${button.element}&elementType=modal&page_slug=${slug}&client_id=${clientID}`, {
                                headers: {
                                    'Accept': 'application/json',
                                    'Authorization': `Bearer ${token}`
                                }
                            });
                            if(!request.ok) return request.statusText;
                            const response = await request.json();

                            const { components } = response;


                            let details = components.map( (component, componentIndex) => {
                                const { type } = component;
                                if(type === "wizard") {
                                    return (
                                        <Validation key={componentIndex} customData={selectedRows} callback={ () => { dt.draw(); that.refresh(); } } token={token} baseURL={baseURL} clientID={clientID} user={user} component={component} />
                                    );
                                }
                                return null;
                            });


                            that.setState({
                                isOpen: true,
                                modalContent: details
                            });


                        } catch(error) {
                            return NotificationManager.error(error.message, "Oops! We got a problem.", 3000, null, null, '');
                        }

                        
                        

                        // return bootbox.prompt({
                        //     title: "Please re-enter your password to continue...",
                        //     inputType: "password"
                        // });
                    }
                }

                if(button.action === "add") {
                    action.key = {
                        key: 'a',
                        ctrlKey: true,
                        shiftKey: true
                    };
                }

                if(button.action === "edit") {
                    action.key = {
                        key: 'e',
                        ctrlKey: true,
                        shiftKey: false
                    };
                }

                if(button.action === "delete") {
                    action.key = {
                        key: 'd',
                        ctrlKey: true,
                        shiftKey: true
                    };
                }
                return action;
            }) },
            ajax: {
                url: `${baseURL}/details`,
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                data: function (d) {
                    d.elementID = component.id;
                    d.elementType = "dataTable";
                    d.page_slug = slug;
                    d.client_id = clientID;
                    d.filters = filters;
                    return d;
                }
            },
            language: {
                searchPlaceholder: 'Search...',
                sSearch: '',
                lengthMenu: '_MENU_ items/page'
            }
        }
        
        $(`.${component.id}`).DataTable(options);
    }


    render() {
        const { component: { legend }, identifier } = this.props;
        const { isOpen, modalContent } = this.state;
        return (
            <div className="card table-wrapper my-5" ref={this.table}>
                <div className="card-body">
                    <div className="card-title">
                        <span>{legend.charAt(0).toUpperCase() + legend.slice(1)}</span>
                    </div>
                    <table className={`table table-hover w-100 ${identifier}`}>
                        <thead>
                            <tr>
                                { this.props.component.columns.map( (column, index) => <th key={index}>{column.label}</th> ) }
                            </tr>
                        </thead>
                    </table>
                    <div className="row justify-content-end mt-5 mx-5">
                        { this.renderFunctions() }
                    </div>
                </div>

                <Modal isOpen={isOpen} size="xl" fade={true} toggle={ () => this.toggle() }>
                    <ModalBody className="p-0">
                        { modalContent }
                    </ModalBody>
                </Modal>


            </div>
        );
      }
  
  

}


export default DataTable;