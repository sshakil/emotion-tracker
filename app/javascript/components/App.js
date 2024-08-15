import React from "react"
import Day from "./Day";

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Provider } from "react-redux";

import configureStore from '../configureStore'
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers";
import StaticDatePickerDemo from "components/StaticDatePickerLandscape";
import StaticDatePickerLandscape from "components/StaticDatePickerLandscape";
const store = configureStore()

class App extends React.Component {
  render () {
    return (
      <StaticDatePickerLandscape/>
    );
  }
}

export default App;