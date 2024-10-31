import React, { useEffect } from 'react'
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
import { useDispatch, useSelector } from 'react-redux'
import { fetchLast30DaysWithEntries } from '../actions'
import './styles/DaysTable.css'

const periods = ['Early Morning', 'Morning', 'Afternoon', 'Evening', 'Before Bed']

function formatDateString(dateString) {
  if (!dateString) return "Invalid Date"

  const date = new Date(dateString)
  if (isNaN(date.getTime())) {
    const parts = dateString.split("-")
    if (parts.length === 3) {
      const [year, month, day] = parts
      return new Date(year, month - 1, day).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    } else {
      return "Invalid Date"
    }
  }

  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

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
        <TableCell align="right" className="column-period">{row.day_periods?.length || 0}</TableCell>
        <TableCell align="right" className="column-entry-count">
          {row.day_periods ? row.day_periods.reduce((acc, period) => acc + period.entries.length, 0) : 0}
        </TableCell>
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
                  {periods.map((period, index) => {
                    const periodData = row.day_periods?.find(p => p.period_id === index + 1)
                    return (
                      <TableRow key={`${row.date}-${period}`}>
                        <TableCell>{period}</TableCell>
                        <TableCell>
                          {periodData && periodData.entries.length > 0
                            ? periodData.entries.map(entry => entry.emotion.name).join(', ')
                            : 'No Entries'}
                        </TableCell>
                      </TableRow>
                    )
                  })}
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
  const dispatch = useDispatch()
  const days = useSelector(state => state.days)
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(5)

  useEffect(() => {
    dispatch(fetchLast30DaysWithEntries())
  }, [dispatch])

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
            <TableRow>
              <TableCell padding="checkbox" className="icon-button" />
              <TableCell className="column-date">Date</TableCell>
              <TableCell align="center" className="column-period">Logged Periods</TableCell>
              <TableCell align="center" className="column-entry-count">Logged Entries</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {days
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => (
                <Row key={`${row.date}-${index}`} row={row} />
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={days.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  )
}