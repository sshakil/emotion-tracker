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
    console.log("EmotionTracker - props: ", this.props)
    const { times } = this.props
    const timesList = times.map((time) => {
      return <li key={ time.guid }>{ time.name } { time.guid }</li>
    })

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
        <ul>{ timesList }</ul>
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