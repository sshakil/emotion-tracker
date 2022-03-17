import React from "react"
import { connect } from 'react-redux'
import { createStructuredSelector } from "reselect"
import { GET_TIMES_REQUEST, GET_TIMES_SUCCESS } from '../actions'

function getTimes() {
  return dispatch => {
    // dispatch action with type
    dispatch({ type: GET_TIMES_REQUEST })

    return fetch(`times.json`)
      .then(response => response.json())
      .then(json => dispatch(getTimesSuccess(json)))
      .catch(error => console.log(error))
  }
}

// function getUser() {
//
// }

function getTimesSuccess(json) {
  return {
    type: GET_TIMES_SUCCESS,
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
        <button
          className="getTimesButton"
          onClick={
            () => this.props.getTimes()
          }
        >
          Get Times
        </button>
        { timesElements }
      </React.Fragment>
    )
  }
}

const structuredSelector = createStructuredSelector({
  times: state => state.times,
  user: state => state.user,
})

const mapDispatchToProps = {
  getTimes,
}

export default connect(structuredSelector, mapDispatchToProps)(EmotionTracker)