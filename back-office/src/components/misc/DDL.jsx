import React from 'react';
// import ReactDOM from 'react-dom';

import { NotificationManager } from "../common/react-notifications";

import { DataTable, AreaChart, BarChart, PieChart } from "./index";
import Validation from './wizard/Validation';
import { Modal, ModalBody } from 'reactstrap';

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


import '../../plugins/datatables.net-buttons-bs4';
import { fetch } from '../../helpers/Utils';
// import '../../plugins/datatables.net-editor-free';

const unique = function (arr) {
    var a = arr.concat();
    for (var i = 0; i < a.length; ++i) {
        for (var j = i + 1; j < a.length; ++j) {
            if (a[i] === a[j])
                a.splice(j--, 1);
        }
    }

    return a;
};


$.fn.dataTableExt.oStdClasses["sFilterInput"] = "form-control";
$.fn.dataTableExt.oStdClasses["sLengthSelect"] = "w-auto mx-2";

class DDL extends React.Component {

    constructor(props) {
        super(props);
        this.tableRef = React.createRef();
        this.state = {
            isOpen: false,
            modalContent: []
        }
    }

    componentDidMount() {
        this.drawTable();
    }

    toggle = () => this.setState({ isOpen: !this.state.isOpen });

    refresh() {
        return this.setState({
            isOpen: false,
            modalContent: []
        });
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

    format(rowData) {
        let content = `<table class="table table-layout-fixed table-striped w-100" data-table-id="${rowData.id}">` +
                '<thead>' +
                    '<tr>';
                        rowData.columns.forEach( (column) => content += `<th>${column.label}</th>` );
                    content += '</tr>' +
                '</thead>' +
            '</table>';
        return content;
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


    drawTable() {
        let { slug, token, user, baseURL, clientID, clientSecret, component, filters } = this.props;
        user = (typeof(user) === "string") ? JSON.parse(user) : user;

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
                regex: true,
                smart: true,
                caseInsensitive: true
            },
            pagingType: "full_numbers",
            dom: "<'row no-gutters align-items-center justify-content-around mx-0'<'col-sm-12 col-md-3'l><'col-sm-12 col-md-9 text-right d-sm-flex justify-content-end align-items-center'<'mb-2 mr-2'B>f>>" +
            "<'row no-gutters align-items-center justify-content-around mx-0'<'col-sm-12 table-responsive'tr>>" +
            "<'row no-gutters align-items-center justify-content-around mx-0'<'col-sm-12 col-md-6'i><'col-sm-12 col-md-6 text-right'p>>",
            columns: component.columns.map(function (column, index) {
                return {
                    data: null,
                    name: column.identifier,
                    type: column.attributes.type,
                    readonly: column.attributes.readonly,
                    excluded: column.attributes.excluded,
                    protected: column.attributes.protected,
                    required: column.identifier === "password" ? false : column.attributes.required,
                    visible: column.identifier === "password" ? false : true,
                    render: function (data, type, row, meta) {
                        if (column.inDrillDown && column.inDrillDown === true) {
                            //AC
                            return `<span class="details-control" data-filters='[{ "name": "${column.as}", "value": "${data.data[column.as]}" }]' data-rel="${column.rel}"></span><span class="d-table-cell pl-3">${data.data[column.as]}</span>`;
                            
                        }
                        if (column.inModal && column.inModal === true) {
                            if(data.data[column.key]) {
                                let customFilters = JSON.stringify(Object.entries(data.data[column.key]).map( dataItem => ({ name: dataItem[0], value: dataItem[1] }) ));
                                return `<a href="#" class="dynamic-modal text-primary" data-filters='${customFilters}' data-rel="${column.rel}"><div class="simple-icon-magnifier"></div></a>`;
                            }
                            return `<a href="#" class="dynamic-modal text-primary" data-filters='[]' data-rel="${column.rel}"><div class="simple-icon-magnifier"></div></a>`;
                        }
                        return data.data[column.as];
                    }
                };
            }),
            // createdRow: function ( row, data ) {
            //     if(!data.permissible) {
            //         $(row).addClass('unselectable');
            //     }
            // },
            select: {
                info: false
            },
            altEditor: true,
            onAddRow: (altEditor, rowData, success, error) => {
                rowData.push({ name: 'client_secret', value: clientSecret });
                return $.ajax({
                    url: `${baseURL}/details`,
                    type: 'POST',
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    data: {
                        page_slug: slug,
                        entityName: component.entityName,
                        client_id: clientID,
                        data: Object.values(rowData)
                    },
                    error: (jqXHR) => error(jqXHR),
                    success: (response) => success(response.data)
                });
            },
            onEditRow: (altEditor, rowData, success, error) => {
                rowData.push({ name: 'client_secret', value: clientSecret });
                return $.ajax({
                    url: `${baseURL}/details`,
                    type: 'PUT',
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    data: {
                        page_slug: slug,
                        entityName: component.entityName,
                        client_id: clientID,
                        data: Object.values(rowData)
                    },
                    error: (jqXHR) => error(jqXHR),
                    success: (response) => success(response.data)
                });
            },
            onDeleteRow: (altEditor, rowData, success, error) => {
                rowData.push({ name: 'client_secret', value: clientSecret });
                return $.ajax({
                    url: `${baseURL}/details`,
                    type: 'DELETE',
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    data: {
                        page_slug: slug,
                        entityName: component.entityName,
                        client_id: clientID,
                        data: Object.values(rowData)
                    },
                    error: (jqXHR) => error(jqXHR),
                    success: (response) => success(response.message)
                });
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
                        //                 }
                        //                 return NotificationManager.error(response.message, "Authorization Failed", 3000, null, null, '');
                        //             })
                        //             .catch( error => console.error(error) );
                        //         }
                        //     }
                        // });
                    // }
                    action.key = {
                        key: 'e',
                        ctrlKey: true,
                        shiftKey: true
                    };
                } else {
                    action.action = async function(e, dt, buttonRef, config) {

                        let selectedRows = dt.rows({ selected: true }).data()[0] ? dt.rows({ selected: true }).data()[0].data : [];


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
                    d.elementType = "ddl";
                    d.page_slug = slug;
                    d.client_id = clientID;
                    d.filters = filters;
                    return d;
                }
            },
            language: {
                searchPlaceholder: 'Search...',
                sSearch: '',
                lengthMenu: '_MENU_ items/page',
            }
        }


        let table = this.tableRef.current; //$(`.${component.id}`);
        let isDataTable = $.fn.dataTable.isDataTable(table);
        if(!isDataTable) {
            $(table).dataTable(options);
        }



        let that = this;
        // AC
        $(document).off('click', '.details-control');
        $(document).on('click', '.details-control', function () {
            table = $(this).closest('table');
            let tr = $(this).closest('tr'), row = $(table).DataTable().row(tr);
            let togglerFilters = $(this).data('filters'), targetContentID = $(this).data('rel');
            if (row.child.isShown()) {
                row.child.hide();
                tr.removeClass('shown');
            } else {
                let filterData = $(".filter-form").serializeArray();
                $.ajax({
                    url: `${baseURL}/details`,
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    data: {
                        elementType: "ddl",
                        elementID: targetContentID, //rowData.id;
                        page_slug: slug,
                        client_id: clientID,
                        filters: unique([ ...filterData, ...togglerFilters])
                    },
                    success: async function (response) {
                        // let rowData = row.data();
                        
                        let rowData = response.rowData;



                        row.child(that.format(rowData)).show();
                        tr.addClass('shown');
        
                        // let extendedFilters = rowData.extendedFilters.map(function (item) {
                        //     return {
                        //         "name": item.label,
                        //         "value": item.value
                        //     };
                        // });                        
                        $(row.child()).find(`table[data-table-id="${rowData.id}"]`).DataTable({
                            responsive: {
                                details: {
                                    type: 'column',
                                    target: 'tr'
                                }
                            },
                            processing: true,
                            serverSide: true,
                            autoWidth: false,
                            search: {
                                regex: false,
                                smart: true,
                                caseInsensitive: true
                            },
                            columns: rowData.columns.map(function (column, index) {
                                return {
                                    data: null,
                                    name: column.identifier,
                                    type: column.attributes.type,
                                    readonly: column.attributes.readonly,
                                    excluded: column.attributes.excluded,
                                    protected: column.attributes.protected,
                                    required: column.identifier === "password" ? false : column.attributes.required,
                                    visible: column.identifier === "password" ? false : true,
                                    render: function (data, type, row, meta) {
                                        if (column.inDrillDown && column.inDrillDown === true) {
                                            return `<span class="details-control" data-filters='[{ "name": "${column.identifier}", "value": "${data.data[column.identifier]}" }]' data-rel="${column.rel}"></span><span class="d-table-cell pl-3">${data.data[column.identifier]}</span>`;
                                        }
                                        if (column.inModal && column.inModal === true) {
                                            let customFilters = JSON.stringify(Object.entries(data.data[column.key]).map( dataItem => ({ name: dataItem[0], value: dataItem[1] }) ));
                                            return `<a href="#" class="dynamic-modal text-primary" data-filters='${customFilters}' data-rel="${column.rel}"><div class="simple-icon-magnifier"></div></a>`;
                                        }
                                        return data.data[column.identifier];
                                    }
                                };
                            }),
                            pagingType: "full_numbers",
                            dom: "<'row no-gutters align-items-center justify-content-around mx-0'<'col-sm-12 col-md-3'l><'col-sm-12 col-md-9 text-right d-sm-flex justify-content-end align-items-center'<'mb-2 mr-2'B>f>>" +
                                "<'row no-gutters align-items-center justify-content-around mx-0'<'col-sm-12 table-responsive'tr>>" +
                                "<'row no-gutters align-items-center justify-content-around mx-0'<'col-sm-12 col-md-6'i><'col-sm-12 col-md-6 text-right'p>>",
                            select: {
                                info: false
                            },
                            altEditor: true,
                            onAddRow: (altEditor, rowDataArray, success, error) => {
                                return $.ajax({
                                    url: `${baseURL}/details`,
                                    type: 'POST',
                                    headers: {
                                        Accept: 'application/json',
                                        Authorization: `Bearer ${token}`
                                    },
                                    data: {
                                        page_slug: rowData.entityName,
                                        client_id: clientID,
                                        data: Object.values(rowDataArray)
                                    },
                                    error: (jqXHR) => error(jqXHR),
                                    success: (response) => success(response.data)
                                });
                            },
                            onEditRow: (altEditor, rowDataArray, success, error) => {
                                return $.ajax({
                                    url: `${baseURL}/details`,
                                    type: 'PUT',
                                    headers: {
                                        Accept: 'application/json',
                                        Authorization: `Bearer ${token}`
                                    },
                                    data: {
                                        page_slug: rowData.entityName,
                                        client_id: clientID,
                                        data: Object.values(rowDataArray)
                                    },
                                    error: (jqXHR) => error(jqXHR),
                                    success: (response) => success(response.data)
                                });
                            },
                            onDeleteRow: (altEditor, rowDataArray, success, error) => {
                                return $.ajax({
                                    url: `${baseURL}/details`,
                                    type: 'DELETE',
                                    headers: {
                                        Accept: 'application/json',
                                        Authorization: `Bearer ${token}`
                                    },
                                    data: {
                                        page_slug: rowData.entityName,
                                        client_id: clientID,
                                        data: Object.values(rowDataArray)
                                    },
                                    error: (jqXHR) => error(jqXHR),
                                    success: (response) => success(response.message)
                                });
                            },
                            buttons: !rowData.buttons ? [] : { 
                                dom: {
                                    container: {
                                        className: 'dt-buttons btn-group'
                                    }
                                },
                                buttons: rowData.buttons.map( (button) => {

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
                                        // payload['entityName'] = rowData.entityName;
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
                                        //                     password: response
                                        //                 })
                                        //             })
                                        //             .then( response => response.json() )
                                        //             .then( response => {
                                        //                 if(response.matched) {
                                                            // return $.fn.dataTable.ext.buttons.csvHtml5.action.call(dt.button(button), e, dt, button, config);
                                        //                 }
                                        //                 return NotificationManager.error(response.message, "Authorization Failed", 3000, null, null, '');
                                        //             })
                                        //             .catch( error => console.error(error) );
                                        //         }
                                        //     }
                                        // });
                                    // }
                                    action.key = {
                                        key: 'e',
                                        ctrlKey: true,
                                        shiftKey: true
                                    };
                                } else {
                                    action.action = async function(e, dt, buttonRef, config) {
                
                                        let selectedRows = dt.rows({ selected: true }).data()[0] ? dt.rows({ selected: true }).data()[0].data : [];
                                
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
                                                        <Validation key={componentIndex} customData={{ ...togglerFilters.reduce((acc, cur) => ({ ...acc, [cur.name]: cur.value }), {}), ...selectedRows }} callback={ () => { dt.draw(); that.refresh(); } } token={token} baseURL={baseURL} clientID={clientID} user={user} component={component} />
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
                                    Authorization: `Bearer ${token}`
                                },
                                data: function (d) {
                                    d.elementID = targetContentID; //rowData.id;
                                    d.elementType = "ddl";
                                    d.page_slug = slug;
                                    d.client_id = clientID;
                                    // let extendedFilters = rowData.extendedFilters.map(function (item) {
                                    //     return {
                                    //         "name": item.label,
                                    //         "value": item.value
                                    //     };
                                    // });
                                    d.filters = unique([ ...filterData, ...togglerFilters]);
                                    return d;
                                }
                            },
                            language: {
                                searchPlaceholder: 'Search...',
                                sSearch: '',
                                lengthMenu: '_MENU_ items/page',
                            }
                        });
                    }
                });


            }
        });


        $(document).off('click', '.dynamic-modal');
        $(document).on("click", ".dynamic-modal", function (e) {
            e.preventDefault();

            let modalToggler = this, rel = $(modalToggler).data('rel'),
            
            modalFilters = $(modalToggler).data('filters'),
                filterData = $(".filter-form").serializeArray();
                
                // dialog = bootbox.dialog({
                //     message: `<div class="loading" />`,
                //     closeButton: false,
                //     backdrop: true,
                //     centerVertical: true,
                //     onEscape: true,
                //     scrollable: true,
                //     size: 'extra-large'
                // });


            let filters = unique([...filterData, ...modalFilters]);

            // filters = [ ...filters, ...modalFilters ];



            $.ajax({
                url: `${baseURL}/details`,
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                data: {
                    elementType: "modal",
                    elementID: rel,
                    page_slug: slug,
                    client_id: clientID,
                    filters
                },
                success: function (response) {

                    let pageDetails = response;

                    let content = pageDetails.components.map( function(component, index) {

    
                        if(component.type === "datatable") {
                            return (
                                <DataTable slug={slug} token={token} user={user} clientSecret={clientSecret} baseURL={baseURL} clientID={clientID} identifier={component.id} key={index} filters={ filters } component={component} />
                            );
                        }
            
                        if(component.type === "ddl") {
                            return (
                                <DDL slug={slug} token={token} user={user} clientSecret={clientSecret} baseURL={baseURL} clientID={clientID} identifier={component.id} key={index} filters={ filters } component={component} />
                            );
                        }

                        if(component.type === "chart") {
                            const { kind } = component;
                            if(kind === "pie") {
                                return (
                                <div key={index}>
                                    <PieChart shadow component={component} />
                                </div>
                                );
                            }

                            if(kind === "bar") {
                                return (
                                <div key={index}>
                                    <BarChart shadow component={component} />
                                </div>
                                );
                            }

                            if(kind === "area") {
                                return (
                                <div key={index}>
                                    <AreaChart shadow component={component} />
                                </div>
                                );
                            }

                            return (
                                <div key={index}>
                                <AreaChart shadow component={component} />
                                </div>
                            );
                        }

                        return (
                            <div key={index}></div>
                        );
                    
                    });


                    that.setState({
                        isOpen: true,
                        modalContent: content
                    });


                    // return ReactDOM.render(content, targetContainer[0]);



                    // $(targetContainer).html(ReactDOMServer.renderToString(content));
                    // that.getDetails(response);
                    // loadPage(response, targetContainer, filters);
                }
            });


            // dialog.init(function () {
                // let targetContainer = dialog.find('.modal-content').addClass('modal-dialog-centered modal-dialog-scrollable').find('.modal-body').addClass('w-100').find('.bootbox-body');
                // $.ajax({
                //     url: `${baseURL}/details`,
                //     headers: {
                //         'Authorization': `Bearer ${token}`
                //     },
                //     data: {
                //         elementType: "modal",
                //         elementID: rel,
                //         page_slug: slug,
                //         client_id: clientID,
                //         filters
                //     },
                //     success: function (response) {

                //         let pageDetails = response;

                //         let content = pageDetails.components.map( function(component, index) {

        
                //             if(component.type === "datatable") {
                //                 return (
                //                     <DataTable slug={slug} token={token} user={user} clientSecret={clientSecret} baseURL={baseURL} clientID={clientID} identifier={component.id} key={index} filters={ filters } component={component} />
                //                 );
                //             }
                
                //             if(component.type === "ddl") {
                //                 return (
                //                     <DDL slug={slug} token={token} user={user} clientSecret={clientSecret} baseURL={baseURL} clientID={clientID} identifier={component.id} key={index} filters={ filters } component={component} />
                //                 );
                //             }

                //             if(component.type === "chart") {
                //                 const { kind } = component;
                //                 if(kind === "pie") {
                //                     return (
                //                     <div key={index}>
                //                         <PieChart shadow component={component} />
                //                     </div>
                //                     );
                //                 }

                //                 if(kind === "bar") {
                //                     return (
                //                     <div key={index}>
                //                         <BarChart shadow component={component} />
                //                     </div>
                //                     );
                //                 }

                //                 if(kind === "area") {
                //                     return (
                //                     <div key={index}>
                //                         <AreaChart shadow component={component} />
                //                     </div>
                //                     );
                //                 }

                //                 return (
                //                     <div key={index}>
                //                     <AreaChart shadow component={component} />
                //                     </div>
                //                 );
                //             }

                //             return (
                //                 <div key={index}></div>
                //             );
                        
                //         })


                //         return ReactDOM.render(content, targetContainer[0]);



                //         // $(targetContainer).html(ReactDOMServer.renderToString(content));
                //         // that.getDetails(response);
                //         // loadPage(response, targetContainer, filters);
                //     }
                // });

            // });


        });
        

    }


    render() {
        const { component: { legend }, identifier } = this.props;
        const { isOpen, modalContent } = this.state;
        return (
            <div className="card table-wrapper my-5">
                <div className="card-body">
                    <div className="card-title">
                        <span>{legend.charAt(0).toUpperCase() + legend.slice(1)}</span>
                    </div>
                    <div className="table-wrapper">
                        <table ref={this.tableRef} className={`table table-hover w-100 ${identifier}`}>
                            <thead>
                                <tr>
                                    { this.props.component.columns.map( (column, index) => <th key={index}>{column.label}</th> ) }
                                </tr>
                            </thead>
                        </table>
                    </div>
                    <div className="row justify-content-end mt-5 mx-5">
                        { this.renderFunctions() }
                    </div>
                </div>

                <Modal isOpen={isOpen} size="xl" fade={true} toggle={ () => this.toggle() }>
                    <ModalBody className="py-0 px-4">
                        { modalContent }
                    </ModalBody>
                </Modal>

            </div>
        );
      }
  
  

}




export default DDL;