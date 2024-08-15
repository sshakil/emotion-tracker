import React, {useEffect, useState} from "react"
import {connect, useDispatch} from 'react-redux'
import {DELETE_EMOTION_REQUEST,} from '../actions'
import Chip from '@mui/material/Chip'
import {Card, CardContent, IconButton, Stack, TextField, Typography} from "@mui/material"
import AddCircleIcon from '@mui/icons-material/AddCircle'
import {createEntries} from "../actions/entry"

// Centralized array for period names
const periodNames = ["Early Morning", "Morning", "Afternoon", "Evening", "Before Bed"]

const defaultPeriods = periodNames.map(name => ({ name, emotions: [] }))

function deleteEmotion(period, emotion) {
  console.log("delete emotion : ", emotion)
  console.log("for period : ", period)
}

function deleteEmotionSuccess(json) {
  return {
    type: DELETE_EMOTION_REQUEST,
    json
  }
}

function renderEmotions(period) {
  return (
    <div>
      {period.emotions.map((emotion, index) => (
        <Chip
          key={emotion.name + index}
          label={emotion.name}
          onDelete={() => deleteEmotion(period, emotion)}
        />
      ))}
    </div>
  )
}

function renderDayForm(
  dispatch,
  selectedDate, day,
  setAllEmotionInputValues, allEmotionInputValues
) {
  function renderPeriod(period) {
    return (
      <Card key={`${selectedDate}-${period.name}`} variant="outlined">
        <CardContent>
          <Typography variant="string">
            {period.name}
          </Typography>
          <br />
          <TextField
            id={`${period.name}-${selectedDate}`}
            name={period.name}
            type="search"
            variant="standard"
            onChange={(e) => {
              setAllEmotionInputValues({
                ...allEmotionInputValues,
                [e.target.name]: e.target.value
              })
            }}
          />
          <IconButton
            color="primary"
            aria-label="add emotion to period"
            name={period.name}
            onClick={(e) => {
              dispatch(createEntries(
                selectedDate,
                period.name,
                allEmotionInputValues[e.currentTarget.name]
                  .split(",")
                  .map(emotion => emotion.trim())
              ))
            }}
          >
            <AddCircleIcon />
          </IconButton>
          {renderEmotions(period)}
        </CardContent>
      </Card>
    )
  }

  return day != null ? (
    <Stack spacing={2}>
      {day.periods.map(period => renderPeriod(period))}
    </Stack>
  ) : (
    'temp - no entries'
  )
}

function EmotionTracker(props) {
  const [
    allEmotionInputValues, setAllEmotionInputValues
  ] = useState(() => periodNames.reduce((acc, name) => ({ ...acc, [name]: '' }), {}))

  const dispatch = useDispatch()

  const { selectedDate, day } = props

  useEffect(() => {
    console.log("EmotionTracker rendered")
  }, [])

  // console.log("got day in EmotionTracker - ", day)
  const dayForm = renderDayForm(
    dispatch,
    selectedDate,
    day,
    setAllEmotionInputValues,
    allEmotionInputValues
  )

  return (
    <React.Fragment>
      <br/>
      {dayForm}
    </React.Fragment>
  )
}

function newDay(selectedDate) {
  return {
    date: selectedDate,
    periods: [...defaultPeriods]
  }
}

function mergePeriods(day) {
  return defaultPeriods.map(defaultPeriod => {
    const existingPeriod = day.periods.find(period => period.name === defaultPeriod.name)
    return existingPeriod || defaultPeriod
  })
}

function mapStateToProps(state) {
  const selectedDate = state.selectedDate.date
  // console.log("mapStateToProps - selectedDate - ", selectedDate)
  // console.log("mapStateToProps - day - ", state.days.find(day => day.date === selectedDate))

  return {
    selectedDate: selectedDate,
    day: (() => {
      const foundDay = state.days.find(day => day.date === state.selectedDate.date) || newDay(selectedDate)
      return {
        ...foundDay,
        periods: mergePeriods(foundDay)
      }
    })()
  }
}

export default connect(mapStateToProps)(EmotionTracker)