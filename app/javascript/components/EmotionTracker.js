import React from "react"
import { connect } from 'react-redux'
import { createStructuredSelector } from "reselect"

const GET_TIMES_REQUEST = 'GET_TIMES_REQUEST'

function getTimes() {
  return {
    type: GET_TIMES_REQUEST
  }
}

class EmotionTracker extends React.Component {
  render() {
    const { times } = this.props
    const timesList = times.map((time) => {
      return <li key={ time.guid }>{ time.name } { time.guid }</li>
    })

    return (

      <React.Fragment>
        User: { this.props.user }
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
  times: state => state.times
})

const mapDispatchToProps = { getTimes }

export default connect(structuredSelector, mapDispatchToProps)(EmotionTracker)