import React from "react"
import PropTypes from "prop-types"
class EmotionTracker extends React.Component {
  render () {
    return (
      <React.Fragment>
        User: {this.props.user}
      </React.Fragment>
    );
  }
}

EmotionTracker.propTypes = {
  // user: PropTypes.node,
    user: PropTypes.string
};
export default EmotionTracker
