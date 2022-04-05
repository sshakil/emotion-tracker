import React, { useEffect, useState  } from "react"
import { connect } from 'react-redux'
import {
  DELETE_EMOTION_REQUEST,
  GET_DAY_FOR_DATE,
} from '../actions'
import Chip from '@mui/material/Chip';
import {
  Card,
  CardContent,
  IconButton,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';


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
      {
        period.emotions.map((emotion, index, emotions) => {
          return (
            // key added to quiet console
            <Chip
              key={emotion.name + index}
              label={ emotion.name }
              onDelete={() => {
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
            }}
          >
            <AddCircleIcon />
          </IconButton>
          { renderEmotions(period) }
        </CardContent>
      </Card>
    )
  }
  if(day != null) {
    return(
      <Stack spacing={2}>
        { day.periods.map(period => renderPeriod(period)) }
      </Stack>
    )
  } else {
    return ('')
  }

}

function EmotionTracker(props) {
  const [
    allEmotionInputValues, setAllEmotionInputValues
  ] = useState({
    earlyMorning: '',
    morning: '',
    afternoon: '',
    evening: '',
    beforeBed: ''
  })

  const {
    selectedDate,
    day,
  } = props


  useEffect(() => {
    console.log("EmotionTracker rendered")
  }, [])

  console.log("got day in EmotionTracker - ", day)
  const dayForm = renderDayForm(
    selectedDate,
    day,
    setAllEmotionInputValues,
    allEmotionInputValues
  )


  return (
    <React.Fragment>
      {/*User: { user.name }*/}
      <br/>
      { dayForm }
    </React.Fragment>
  )
}

function mapStateToProps(state, ownProps) {
  console.log("mapStateToProps - selectedDate - ", new Date(state.selectedDate.date))
  console.log("mapStateToProps - selectedDate.toLocaleDateString - ", new Date(state.selectedDate.date).toLocaleDateString())
  state.days.map( day => { console.log(day.date) })
  console.log("mapStateToProps - day - ", state.days.find(day => day.date === new Date(state.selectedDate.date).toLocaleDateString()))
  return {
    selectedDate: new Date(state.selectedDate.date),
    day: state.days.find(day => day.date === new Date(state.selectedDate.date).toLocaleDateString())
  }
}

// function mapDispatchToProps(dispatch, ownProps) {
//   return {
//     getDayForDate: (date) => {
//       dispatch({ type: GET_DAY_FOR_DATE, date: date })
//     }
//   }
// }

export default connect(mapStateToProps)(EmotionTracker)