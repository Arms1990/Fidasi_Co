import React from "react";
import ReactTable from 'react-table';
import selectTableHOC from "react-table/lib/hoc/selectTable";
import DataTablePagination from "./DatatablePagination";
import dynamicFunctions from './functions';


const SelectTable = selectTableHOC(ReactTable);


export default class Table extends React.Component {

  static defaultProps = {
    keyField: "id"
  }

  state = {
    selectAll: false,
    selection: []
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

  toggleSelection = (key, shift, row) => {
    // start off with the existing state
    let selection = [...this.state.selection];
    const keyIndex = selection.indexOf(key);

    // check to see if the key exists
    if (keyIndex >= 0) {
      // it does exist so we will remove it using destructing
      selection = [
        ...selection.slice(0, keyIndex),
        ...selection.slice(keyIndex + 1)
      ];      
    } else {
      // it does not exist so add it
      selection.push(key);
    }
    // update the state
    this.setState({ selection });
  }

  toggleAll = () => {
    const { keyField } = this.props;
    const selectAll = !this.state.selectAll;
    const selection = [];

    if (selectAll) {
      // we need to get at the internals of ReactTable
      const wrappedInstance = this.checkboxTable.getWrappedInstance();
      // the 'sortedData' property contains the currently accessible records based on the filter and sort
      const currentRecords = wrappedInstance.getResolvedState().sortedData;
      // we just push all the IDs onto the selection array
      currentRecords.forEach(item => {
        selection.push(`select-${item._original[keyField]}`);
      });
    }
    this.setState({ selectAll, selection });
  }

  isSelected = key => {
    return this.state.selection.includes(`select-${key}`);
  }

  rowFn = (state, rowInfo, column, instance) => {
    const { selection } = this.state;

    return {
      onClick: (e, handleOriginal) => {
        // IMPORTANT! React-Table uses onClick internally to trigger
        // events like expanding SubComponents and pivots.
        // By default a custom 'onClick' handler will override this functionality.
        // If you want to fire the original onClick handler, call the
        // 'handleOriginal' function.
        if (handleOriginal) {
          handleOriginal();
        }
      },
      style: {
        background:
          rowInfo &&
          selection.includes(`select-${rowInfo.original.id}`) &&
          "#bbb"
      }
    };
  }

  render() {

    const { component } = this.props;
    const { legend } = component;

    let columns = component.columns.map(function (column) {
      return {
        Header: column.label,
        accessor: column.identifier
      };
    });
  
    return (
      <div className="card">
        <div className="card-body">
          <div className="card-title">
            <span>{legend.charAt(0).toUpperCase() + legend.slice(1)}</span>
          </div>
          <SelectTable { ...this.props } ref={r => (this.checkboxTable = r)} toggleSelection={this.toggleSelection} selectAll={this.state.selectAll} selectType="checkbox" toggleAll={this.toggleAll} isSelected={this.isSelected} getTrProps={this.rowFn} className="react-table -highlight" defaultPageSize={component.data.length} columns={columns} data={component.data} PaginationComponent={DataTablePagination} />
          <div className="row justify-content-end mt-5 mx-5">
              { this.renderFunctions() }
          </div>
        </div>
      </div>
    );
  }


};