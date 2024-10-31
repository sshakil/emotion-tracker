import * as React from 'react'
import TextField from '@mui/material/TextField'
import { StaticDatePicker } from "@mui/x-date-pickers"
import { connect, useDispatch } from "react-redux"
import { useEffect, useState } from "react"
import { fetchDayIfNotInStore, setSelectedDate } from "../actions"
import { convertToYYYYMMDD, convertDateStringToDate } from "../utils"

function Calendar(props) {
  const { selectedDate } = props
  const dispatch = useDispatch()
  const [initialLoadComplete, setInitialLoadComplete] = useState(false)

  // Effect to load data before the initial render based on selectedDate
  useEffect(() => {
    if (selectedDate && !initialLoadComplete) {
      const date = convertToYYYYMMDD(convertDateStringToDate(selectedDate))
      dispatch(fetchDayIfNotInStore(date))
      setInitialLoadComplete(true)
    }
  }, [selectedDate, dispatch, initialLoadComplete])

  return (
    <div style={{display: 'flex', justifyContent: 'right', width: '100%'}}>
      <StaticDatePicker
        orientation="portrait"
        openTo="day"
        value={convertDateStringToDate(selectedDate)}
        maxDate={new Date()}  // Disables dates beyond today
        onChange={(newSelectedDate) => {
          const date = convertToYYYYMMDD(newSelectedDate)
          if (date !== selectedDate) {
            dispatch(fetchDayIfNotInStore(date))
            dispatch(setSelectedDate(date))
          }
        }}
        slots={{ textField: TextField }}
      />
    </div>
  )
}

function mapStateToProps(state, ownProps) {
  return {
    selectedDate: state.selectedDate.date
  }
}

export default connect(mapStateToProps)(Calendar)