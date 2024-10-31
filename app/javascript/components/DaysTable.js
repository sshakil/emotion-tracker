import React from 'react'
import Box from '@mui/material/Box'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import './styles/DaysTable.css'

const periods = ['Early Morning', 'Morning', 'Afternoon', 'Evening', 'Before Bed']

function formatDateString(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function createDateEntry(date, numPeriods, numEntries, periodData) {
  return { date, numPeriods, numEntries, periodData }
}

const rows = Array.from({ length: 25 }, (_, index) => {
  const date = `2024-10-${String(index + 1).padStart(2, '0')}`
  const numPeriods = 5
  const numEntries = Math.floor(Math.random() * 10) + 5
  const periodData = periods.reduce((acc, period) => {
    acc[period] = Array.from({ length: Math.floor(Math.random() * 4) + 1 }, () => `Entry ${Math.floor(Math.random() * 100)}`)
    return acc
  }, {})
  return createDateEntry(date, numPeriods, numEntries, periodData)
})

function Row({ row }) {
  const [open, setOpen] = React.useState(false)

  return (
    <>
      <TableRow>
        <TableCell padding="checkbox" className="icon-button">
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell className="column-date">{formatDateString(row.date)}</TableCell>
        <TableCell align="right" className="column-period">{row.numPeriods}</TableCell>
        <TableCell align="right" className="column-entry-count">{row.numEntries}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={4} className="collapsed-row">
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Entries by Period - {formatDateString(row.date)}
              </Typography>
              <Table size="small" aria-label="entries">
                <TableHead>
                  <TableRow>
                    <TableCell className="period-table-cell">Period</TableCell>
                    <TableCell>Entries</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {periods.map((period) => (
                    <TableRow key={period}>
                      <TableCell>{period}</TableCell>
                      <TableCell>
                        {row.periodData[period].length > 0
                          ? row.periodData[period].join(', ')
                          : 'No Entries'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  )
}

export default function DaysTable() {
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(5)

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  return (
    <Paper className="days-table-container">
      <TableContainer>
        <Table aria-label="Days table with periods and entries">
          <TableHead>
            <TableRow id="FirstHeader">
              <TableCell padding="checkbox" className="icon-button" />
              <TableCell className="column-date"></TableCell>
              <TableCell align="center" colSpan={2} className="column-logged">Logged</TableCell>
            </TableRow>
            <TableRow id="SecondHeader">
              <TableCell padding="checkbox" />
              <TableCell>Date</TableCell>
              <TableCell align="right" className="column-period">Periods</TableCell>
              <TableCell align="right" className="column-entry-count">Entries</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <Row key={row.date} row={row} />
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  )
}