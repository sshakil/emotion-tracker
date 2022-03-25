import React from "react"
import { connect } from 'react-redux'
import { createStructuredSelector } from "reselect"
import { GET_DAY_REQUEST, GET_DAY_SUCCESS } from '../actions'
import Button from '@mui/material/Button';

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

// function getUser() {
//
// }

function getDaySuccess(json) {
  return {
    type: GET_DAY_SUCCESS,
    json
  }
}

class EmotionTracker extends React.Component {
  render() {
    function renderEmotions(emotions) {

      // console.log("emotions - ", emotions.map((emotion, index, emotions) => {
      //     return ( emotion.name )
      //   }
      // ))
      // return ("")
      return (
        <div>
          {
            emotions.map((emotion, index, emotions) => {
              if (index + 1 === emotions.length) {
                return (
                  // key added to quiet console
                  <span key={emotion.name + index}>
                    { emotion.name }
                  </span>
                )
              } else {
                return (
                  <span key={emotion.name + index}>
                    { emotion.name + ", " }
                  </span>
                )
              }
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

    const { day } = this.props
    const dayElement = renderDay(day)

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
        { dayElement }
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