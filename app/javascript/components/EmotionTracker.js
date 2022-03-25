import React from "react"
import { connect } from 'react-redux'
import { createStructuredSelector } from "reselect"
import { GET_DAY_REQUEST, GET_DAY_SUCCESS } from '../actions'
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import { Card, CardContent, Stack, TextField } from "@mui/material";

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

class EmotionTracker extends React.Component {
  render() {
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

    //todo - use tables? a form? both?
    function renderDay(day) {
      console.log("day - ", day)
      return (
        <div>
          <div>
            { day.date }
          </div>
          <div>
            {
              day.periods.map((period, index, periods) => {
                return (
                  <div key={ day.date + '-' + period.name }>
                    { period.name }
                    { renderEmotions(period.emotions) }
                    { (
                        () => {
                          if (index + 1 < periods.length) {
                            return <br />
                          }
                        }
                      )()
                    }
                  </div>
                )
              })
            }
          </div>
        </div>
      )
    }

    function renderDayForm(day) {
      function renderPeriod(period) {
        return (
          <Card
            key={ day.date + '-' + period.name }
            variant="outlined"
          >
            <CardContent>
              { period.name }
              <br />
              <TextField
                id="standard-search"
                type="search"
                variant="standard"
              />
              <br/>
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


    const { day } = this.props
    const dayElement = renderDay(day)
    const dayForm = renderDayForm(day)

    return (

      <React.Fragment>
        User: { this.props.user.name }
        <br/>
        <Button
          variant="contained"
          color="primary"
          onClick={
            () => this.props.getDay()
          }
        >
          Get Day
        </Button>
        {/*{ dayElement }*/}
        { dayForm }
      </React.Fragment>
    )
  }
}

const structuredSelector = createStructuredSelector({
  user: state => state.user,
  day: state => state.day,
})

const mapDispatchToProps = {
  getDay,
}

export default connect(structuredSelector, mapDispatchToProps)(EmotionTracker)