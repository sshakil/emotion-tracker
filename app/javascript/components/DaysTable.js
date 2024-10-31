import React, {useEffect, useState} from 'react'
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
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import CircularProgress from '@mui/material/CircularProgress'
import {useDispatch, useSelector} from 'react-redux'
import {fetchLast30DaysWithEntries} from '../actions'
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

function Row({row}) {
  const [open, setOpen] = useState(false)

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
        <TableCell align="right" className="column-period">{row.periods?.length || 0}</TableCell>
        <TableCell align="right" className="column-entry-count">
          {row.periods ? row.periods.reduce((acc, period) => acc + period.emotions.length, 0) : 0}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={4} className="collapsed-row">
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Table size="small" aria-label="entries">
                <TableHead>
                  <TableRow>
                    <TableCell className="period-table-cell">Period</TableCell>
                    <TableCell>Entries</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.periods.map((period) => (
                    <TableRow key={`${row.date}-${period.name}`}>
                      <TableCell>{period.name}</TableCell>
                      <TableCell>
                        {period.emotions.length > 0
                          ? period.emotions.map(emotion => emotion.name).join(', ')
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
  const dispatch = useDispatch()
  const days = useSelector(state => state.days)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      await dispatch(fetchLast30DaysWithEntries())
      setLoading(false)
    }

    fetchData()
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
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="300px">
            <CircularProgress size={50}/>
          </Box>
        ) : (
          <>
            <Table aria-label="Days table with periods and entries">
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox" className="icon-button"/>
                  <TableCell className="column-date">Date</TableCell>
                  <TableCell align="center" className="column-period">Logged Periods</TableCell>
                  <TableCell align="center" className="column-entry-count">Total Entries</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {days
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => (
                    <Row key={`${row.date}-${index}`} row={row}/>
                  ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={days.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}
      </TableContainer>
    </Paper>
  )
}