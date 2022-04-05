import * as React from 'react';
import TextField from '@mui/material/TextField';
import { StaticDatePicker } from "@mui/lab";
import { useEffect } from "react";
import {
  GET_DAY,
  GET_DAY_REQUEST,
  GET_DAY_SUCCESS_FOUND,
  GET_DAY_SUCCESS_NOT_FOUND
} from "../actions";
import { fetchDayByDate } from "../clients/api";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";

// function getDay(selectedDate) {
//   return dispatch => {
//     // dispatch action with type // todo - bindActionCreators for this
//     // dispatch({ type: GET_DAY_REQUEST })
//
//     // return fetchDayByDate(selectedDate)
//     //   .then(response => response.json())
//     //   .then(json => {
//     //       json ?
//     //         dispatch(getDaySuccessFound(json)) :
//     //         dispatch(getDaySuccessNotFound())
//     //     }
//     //   )
//     //   .catch(error => console.log(error))
//     dispatch({ type: GET_DAY })
//   }
// }

// function getDaySuccessFound(json) {
//   return {
//     type: GET_DAY_SUCCESS_FOUND,
//     json
//   }
// }
//
// function getDaySuccessNotFound() {
//   return { type: GET_DAY_SUCCESS_NOT_FOUND }
// }
//

function Calendar(props) {
  const { selectedDate, setSelectedDate } = props

  // useEffect(() => {
  //   console.log("selectedDate in useEffect - ", selectedDate)
  // }, [props.selectedDate])

  return (
    <StaticDatePicker
      orientation="portrait"
      openTo="day"
      value={ new Date(selectedDate) }
      onChange={ (newSelectedDate) => {
          //todo - these strips timezone info, which will be added back later
          // const date = newValue.toISOString().split('T')[0] - this one has a day ahead issue
          const formattedDate = newSelectedDate.toLocaleDateString()
          console.log("Day selected - ", newSelectedDate, formattedDate)
          setSelectedDate(newSelectedDate);
        }
      }
      renderInput={ (params) => <TextField { ...params } /> }
    />
  );
}

function mapStateToProps (state, ownProps) {
  console.log("ownProps", ownProps)
  return {
    selectedDate: state.selectedDate.date
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    setSelectedDate: (newSelectedDate) => {
      dispatch({type: "SET_SELECTED_DATE", selectedDate: newSelectedDate.toISOString() })
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Calendar)
