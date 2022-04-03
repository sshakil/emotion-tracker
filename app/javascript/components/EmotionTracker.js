import React, { useState } from "react"
import { connect } from 'react-redux'
import { createStructuredSelector } from "reselect"
import { GET_DAY_REQUEST, GET_DAY_SUCCESS } from '../actions'
import { DELETE_EMOTION_REQUEST, DELETE_EMOTION_SUCCESS } from '../actions'
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import { Card, CardContent, IconButton, Stack, TextField, Typography } from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { fetchDay, fetchDayByDate } from '../clients/api'

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

//todo - use tables? a form? both?
// function renderDay(day) {
//   console.log("day - ", day)
//   return (
//     <div>
//       <div>
//         { day.date }
//       </div>
//       <div>
//         {
//           day.periods.map((period, index, periods) => {
//             return (
//               <div key={ day.date + '-' + period.name }>
//                 { period.name }
//                 { renderEmotions(period.emotions) }
//                 { (
//                     () => {
//                       if (index + 1 < periods.length) {
//                         return <br />
//                       }
//                     }
//                   )()
//                 }
//               </div>
//             )
//           })
//         }
//       </div>
//     </div>
//   )
// }

function deleteEmotion(period, emotion) {
  console.log("delete emotion : ", emotion)
  console.log("for period : ", period)
  // return dispatch => {
  //   // dispatch action with type
  //   dispatch({ type: DELETE_EMOTION_REQUEST })
  //
  //   // return fetch(`day.json`)
  //   return fetch(`emotions/${emotion.id}`,
  //     {
  //       method: "DELETE"
  //     })
  //     .then(response => response.json())
  //     .then(json => dispatch(deleteEmotionSuccess(json)))
  //     .catch(error => console.log(error))
  // }
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
      {
        period.emotions.map((emotion, index, emotions) => {
          return (
            // key added to quiet console
            <Chip
              key={emotion.name + index}
              label={ emotion.name }
              onDelete={() => {
                // console.log("delete : ", emotion.name)
                deleteEmotion(period, emotion)
              }}
            />
          )
        })
      }
    </div>
  )
}

function renderDayForm(
  selectedDate, day,
  setAllEmotionInputValues, allEmotionInputValues
) {
  function renderPeriod(period) {
    // console.log("renderPeriod - date - ", date)
    return (
      <Card
        key={ selectedDate + '-' + period.name }
        variant="outlined"
      >
        <CardContent>
          <Typography variant="string">
            { period.name }
          </Typography>
          <br />
          <TextField
            id="standard-search"
            name={ period.name }
            type="search"
            variant="standard"
            onChange={ (e) => {
                // console.log(e.target.name, e.target.value)
                setAllEmotionInputValues(
                  { ...allEmotionInputValues, [e.target.name]: e.target.value }
                )
              }
            }
          />
          <IconButton
            color="primary"
            aria-label="add emotion to period"
            name={ period.name }
            onClick={ (e) => {
              console.log("add emotion to period for date - ", selectedDate)
              console.log(period.name)
              console.log(allEmotionInputValues[e.currentTarget.name])
              // console.log(allEmotionInputValues[e.currentTarget.name])
            }}
          >
            <AddCircleIcon />
          </IconButton>
          { renderEmotions(period) }
        </CardContent>
      </Card>
    )
  }
  return(
    <Stack spacing={2}>
      { day.periods.map(period => renderPeriod(period)) }
    </Stack>
  )
}

function addEmotionToPeriod( period, emotion) {
  console.log("addEmotionToPeriod ", emotion, period)
}


function EmotionTracker(props) {
  // console.log("props", props)
  const [
    allEmotionInputValues, setAllEmotionInputValues
  ] = useState({
    earlyMorning: '',
    morning: '',
    afternoon: '',
    evening: '',
    beforeBed: ''
  })

  // todo - is this way faster / more efficient than the onchange+state?
  // probably by a bit but is it significant?
  // it's appears cleaner, though, that's only a dev thing
  // const periodToSetterMap = new Map([
  //   ["Morning", setEmotionInputValueForMorning],
  //
  // ])

  const { selectedDate, user, day, getDay } = props
  const dayForm = renderDayForm(
    selectedDate,
    day,
    setAllEmotionInputValues,
    allEmotionInputValues
  )


  return (
    <React.Fragment>
      User: { user.name }
      <br/>
      <Button
        variant="contained"
        color="primary"
        onClick={
          () => getDay(selectedDate)
        }
      >
        Get Day
      </Button>
      {/*{ dayElement }*/}
      { dayForm }
    </React.Fragment>
  )
}

const structuredSelector = createStructuredSelector({
  user: state => state.user,
  day: state => state.day,
})

const mapDispatchToProps = {
  getDay,
}

export default connect(structuredSelector, mapDispatchToProps)(EmotionTracker)