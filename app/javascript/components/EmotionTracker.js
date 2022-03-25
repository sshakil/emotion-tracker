import React from "react"
import { connect } from 'react-redux'
import { createStructuredSelector } from "reselect"
import { GET_DAY_REQUEST, GET_DAY_SUCCESS } from '../actions'
import Button from '@mui/material/Button';

function getDay() {
  return dispatch => {
    // dispatch action with type
    dispatch({ type: GET_DAY_REQUEST })

    return fetch(`day.json`)
    // return fetch(`periods/39`)
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
      return (
        <div>
          {
            emotions.map((emotion, index, emotions) => {
              if (index + 1 === emotions.length) {
                return (
                  // key added to quiet console
                  <span key={emotion + index}>
                    { emotion }
                  </span>
                )
              } else {
                return (
                  <span key={emotion + index}>
                    { emotion + ", " }
                  </span>
                )
              }
            })
          }
        </div>
      )
    }

    //todo - use tables? a form? both?
    function renderTimes(times) {
      return (
        <div>
          {
            times.map((time, index, times) => {
              return (
                <div key={ time.guid }>
                  { time.name }
                  { renderEmotions(time.emotions) }
                  { (() => {
                      if (index + 1 < times.length) {
                        return <br />
                      }
                    })()
                  }
                </div>
              )
            })
          }
        </div>
      )
    }

    const { times } = this.props
    const timesElements = renderTimes(times)

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
        { timesElements }
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