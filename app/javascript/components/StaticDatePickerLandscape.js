import * as React from 'react';
import TextField from '@mui/material/TextField';
import { StaticDatePicker } from "@mui/lab";
import { useEffect } from "react";
import { GET_DAY_REQUEST, GET_DAY_SUCCESS } from "../actions";
import { fetchDayByDate } from "../clients/api";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";

function getDay(selectedDate) {
  return dispatch => {
    // dispatch action with type
    dispatch({ type: GET_DAY_REQUEST })

    // return fetch(`day.json`)
    return fetchDayByDate(selectedDate)
      .then(response => response.json())
      .then(json => dispatch(getDaySuccess(json)))
      .catch(error => console.log(error))
  }
}

function getDaySuccess(json) {
  return {
    type: GET_DAY_SUCCESS,
    json
  }
}


function Calendar(props) {
  const { date, setDate, getDay } = props

  useEffect(() => {
    console.log("calender rendered")
    console.log("about to get day for date - ", date.toLocaleDateString())
    getDay(date.toLocaleDateString())
  }, [date])

  return (
    <StaticDatePicker
      orientation="portrait"
      openTo="day"
      value={ date }
      onChange={ (newValue) => {
          //todo - these strips timezone info, which will be added back later
          // const date = newValue.toISOString().split('T')[0] - this one has a day ahead issue
          const formattedDate = newValue.toLocaleDateString()
          console.log("Day selected - ", newValue, formattedDate)
          setDate(newValue);
        }
      }
      renderInput={ (params) => <TextField { ...params } /> }
    />
  );
}


const structuredSelector = createStructuredSelector({
  day: state => state.day,
})

const mapDispatchToProps = {
  getDay, //todo - how can bindActionCreators be used here?
}

export default connect(structuredSelector, mapDispatchToProps)(Calendar)
