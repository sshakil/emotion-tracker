import React, { useState } from "react"
import { connect } from 'react-redux'
import { createStructuredSelector } from "reselect"
import { GET_DAY_REQUEST, GET_DAY_SUCCESS } from '../actions'
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import { Card, CardContent, IconButton, Stack, TextField, Typography } from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';

function getDay() {
  return dispatch => {
    // dispatch action with type
    dispatch({ type: GET_DAY_REQUEST })

    // return fetch(`day.json`)
    return fetch(`days/1`)
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

function renderEmotions(emotions) {
  return (
    <div>
      {
        emotions.map((emotion, index, emotions) => {
          return (
            // key added to quiet console
            <Chip
              key={emotion.name + index}
              label={ emotion.name }
            />
          )
        })
      }
    </div>
  )
}

function renderDayForm(
  day,
  setEmotionInputValueForMorning, emotionInputValueForMorning
) {
  function renderPeriod(period) {
    return (
      <Card
        key={ day.date + '-' + period.name }
        variant="outlined"
      >
        <CardContent>
          <Typography variant="string">
            { period.name }
          </Typography>
          <br />
          <TextField
            id="standard-search"
            type="search"
            variant="standard"
            onChange={ (e) =>
              setEmotionInputValueForMorning(e.target.value)
            }
          />
          <IconButton
            color="primary"
            aria-label="add emotion to period"
            onClick={ () => addEmotionToPeriod(
              period, emotionInputValueForMorning
            ) }
          >
            <AddCircleIcon />
          </IconButton>
          { renderEmotions(period.emotions) }
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
  const [
    emotionInputValueForMorning, setEmotionInputValueForMorning,
    emotionInputValueForEarlyMorning, setEmotionInputValueForEarlyMorning
  ] = useState('')

  const periodToSetterMap = new Map([
    ["Morning", setEmotionInputValueForMorning],

  ])


  const { day } = props
  const dayForm = renderDayForm(
    day,
    setEmotionInputValueForMorning,
    emotionInputValueForMorning
  )


  return (
    <React.Fragment>
      User: { props.user.name }
      <br/>
      <Button
        variant="contained"
        color="primary"
        onClick={
          () => props.getDay()
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