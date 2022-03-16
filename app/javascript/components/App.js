import React from "react"
import EmotionTracker from "./EmotionTracker";

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Provider } from "react-redux";

import configureStore from '../configureStore'
const store = configureStore()

class App extends React.Component {
  render () {
    return (
        <Provider store={store}>
            <BrowserRouter>
              <Routes>
                <Route exact path="/" element = { "Emotion Tracker" } />
                <Route path={ "/landing" } element = { <EmotionTracker user="public" /> } />
                {/*todo - another way, is this better than above?*/}
                {/*<Route path={ "/landing" } element={<EmotionTracker user="public" /> } />*/}
              </Routes>
            </BrowserRouter>
        </Provider>
    );
  }
}

export default App
