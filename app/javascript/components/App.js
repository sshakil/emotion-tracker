import React from "react"
import EmotionTracker from "./EmotionTracker";
import Day from "./Day";
import Calendar from "./StaticDatePickerLandscape"

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Provider } from "react-redux";

import configureStore from '../configureStore'
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { LocalizationProvider } from "@mui/lab";
const store = configureStore()

class App extends React.Component {
  render () {
    return (
      <LocalizationProvider dateAdapter={ AdapterDateFns }>
        <Provider store={store}>
          <BrowserRouter>
            <Routes>
              <Route exact path="/" element = { "Emotion Tracker" } />
              {/*<Route path={ "/landing" } element = { <EmotionTracker user="public" /> } />*/}
              <Route path={ "/day" } element = { <Day /> } />
              {/*todo - another way, is this better than above?*/}
              {/*<Route path={ "/landing" } element={<EmotionTracker user="public" /> } />*/}
            </Routes>
          </BrowserRouter>
        </Provider>
      </LocalizationProvider>
    );
  }
}

export default App
