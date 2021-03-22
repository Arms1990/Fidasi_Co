import React from "react";
import moment from "moment";
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import { CalendarToolbar } from "./CalendarToolbar";
import dynamicFunctions from './functions';

const localizer = momentLocalizer(moment);

const Calendar = ({ component }) => {
  const { title, description } = component;

  function renderFunctions() {
    let { functions } = component;
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

    return (
      <div className="card my-5">
        <div className="card-body">
          <div className="card-title">
            <span>{title.charAt(0).toUpperCase() + title.slice(1)}</span>
            <span> &mdash; </span>
            <span className="opacity-50">{description.charAt(0).toUpperCase() + description.slice(1)}</span>
          </div>
          <BigCalendar
            localizer={localizer}
            events={[]}
            components={{
              toolbar: CalendarToolbar
            }}
            drilldownView="null"
            startAccessor="start"
            endAccessor="end"
          />
          <div className="row justify-content-end mt-5 mx-5">
              { renderFunctions() }
          </div>
        </div>
      </div>
    );
  };

export default Calendar;