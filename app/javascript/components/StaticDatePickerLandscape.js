import * as React from 'react';
import TextField from '@mui/material/TextField';
import { StaticDatePicker } from "@mui/x-date-pickers";
import { connect, useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchDayIfNotInStore, setSelectedDate } from "../actions";
import { convertToYYYYMMDD, convertDateStringToDate } from "../utils"

function Calendar(props) {
  const { selectedDate } = props
  const dispatch = useDispatch()

  // Effect to load data before the initial render based on selectedDate
  useEffect(() => {
    if (selectedDate) {
        const date = convertToYYYYMMDD(convertDateStringToDate(selectedDate));
        dispatch(fetchDayIfNotInStore(date));
    }
    console.log("Calender rendered, selectedDate - ", selectedDate)
  }, [selectedDate, dispatch]); // Dependencies: selectedDate and dispatch


  return (
    <StaticDatePicker
      orientation="portrait"
      openTo="day"
      value={ convertDateStringToDate(selectedDate) }
      onChange={ (newSelectedDate) => {
          // todo - these strips timezone info, which will be added back later
          // const date = newValue.toISOString().split('T')[0] - this one has a day ahead issue
          // const formattedDate = newSelectedDate.toLocaleDateString()

          // backend needs format: "2022-10-01" (oct 1); front with toLocaleDateString() gives mm/dd/yyyy
          // this converts it to needed format
          // https://stackoverflow.com/questions/23593052/format-javascript-date-as-yyyy-mm-dd
          // should be done on server side?
          const date = convertToYYYYMMDD(newSelectedDate)
          // console.log("StaticDatePicker - onChange: newSelectedDate, formattedDate: ", newSelectedDate, formattedDate)
          console.log("got to there")
          dispatch(fetchDayIfNotInStore(date))
          dispatch(setSelectedDate(date));
        }
      }
      renderInput={ (params) => <TextField { ...params } /> }
    />
  );
}

function mapStateToProps (state, ownProps) {
  return {
    selectedDate: state.selectedDate.date
  }
}

export default connect(mapStateToProps)(Calendar)
