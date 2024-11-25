import React from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import Dashboard from './Dashboard'
import DaysTable from './DaysTable'
import { logOutUser } from '../actions/user'
import { useDispatch } from 'react-redux'

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}

export default function TabbedComponentContainer() {
  const [value, setValue] = React.useState(0)
  const dispatch = useDispatch()

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const handleLogout = () => {
    dispatch(logOutUser())
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'center' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          centered
        >
          <Tab label="Log" {...a11yProps(0)} />
          <Tab label="Track" {...a11yProps(1)} />
          <Tab label="Log out" onClick={handleLogout} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <Dashboard />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <DaysTable />
      </CustomTabPanel>
    </Box>
  )
}