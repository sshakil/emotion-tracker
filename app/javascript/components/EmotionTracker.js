import React, { useEffect, useState, useRef } from "react";
import { connect, useDispatch } from 'react-redux';
import Chip from '@mui/material/Chip';
import { Card, CardContent, IconButton, Stack, TextField, Typography } from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { DELETE_EMOTION_REQUEST, createEntries, deleteEntry } from "../actions";

const periodNames = ["Early Morning", "Morning", "Afternoon", "Evening", "Before Bed"];
const defaultPeriods = periodNames.map(name => ({ name, emotions: [] }));

function deleteEmotionEntry(dispatch, entryUuid, selectedDate, periodName) {
  dispatch(deleteEntry(entryUuid, selectedDate, periodName));
}

function renderEmotions(dispatch, selectedDate, period, chipRefs, inputRef) {
  useEffect(() => {
    // Clean up chipRefs to match the number of emotions in the period
    chipRefs.current = chipRefs.current.slice(0, period.emotions.length);
  }, [period.emotions.length]);

  return (
    <div>
      {period.emotions.map((entry, index) => (
        <Chip
          key={entry.name + index}
          label={entry.name}
          onDelete={() => {
            deleteEmotionEntry(dispatch, entry.uuid, selectedDate, period.name);
            if (inputRef.current) {
              inputRef.current.focus();
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Backspace' || e.key === 'Delete') {
              deleteEmotionEntry(dispatch, entry.uuid, selectedDate, period.name);
              setTimeout(() => {
                if (chipRefs.current[0]) {
                  chipRefs.current[0].focus();
                } else if (inputRef.current) {
                  inputRef.current.focus();
                }
              }, 100);
            }
          }}
          tabIndex={0}
          ref={(el) => chipRefs.current[index] = el}
        />
      ))}
    </div>
  );
}

function renderDayForm(
  dispatch,
  selectedDate, day,
  setAllEmotionInputValues, allEmotionInputValues
) {
  const inputRefs = useRef([]); // Array to hold references for each TextField
  const chipRefsArray = useRef([]); // Array to hold references for chips in each period

  function handleCreateEntries(periodName, inputRef) {
    dispatch(createEntries(
      selectedDate,
      periodName,
      allEmotionInputValues[periodName]
        .split(",")
        .map(emotion => emotion.trim())
    ));

    setAllEmotionInputValues({
      ...allEmotionInputValues,
      [periodName]: ''
    });

    if (inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus(); // Maintain focus on the current input field
      }, 100);
    }
  }

  function handleTabPress(e, periodName, period, chipRefs, inputRef, isLastPeriod, currentPeriodIndex) {
    if (e.key === 'Tab' && !e.shiftKey) {
      if (allEmotionInputValues[periodName].trim() === "") {
        e.preventDefault();
        if (period.emotions.length > 0) {
          chipRefs.current[0]?.focus();
        } else if (!isLastPeriod) {
          const nextInputRef = inputRefs.current[currentPeriodIndex + 1];
          nextInputRef?.current?.focus();
        }
      }
    }

    if (e.key === 'Tab' && e.shiftKey) {
      e.preventDefault();
      if (currentPeriodIndex > 0) {
        const previousInputRef = inputRefs.current[currentPeriodIndex - 1];
        const previousChipRefs = chipRefsArray.current[currentPeriodIndex - 1];
        if (previousChipRefs?.current?.length > 0) {
          previousChipRefs.current[previousChipRefs.current.length - 1]?.focus();
        } else {
          previousInputRef?.current?.focus();
        }
      }
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      handleCreateEntries(periodName, inputRef);
    }
  }

  function renderPeriod(dispatch, period, index) {
    const inputRef = useRef(null);
    const chipRefs = useRef([]);
    const isLastPeriod = period.name === "Before Bed";

    inputRefs.current[index] = inputRef;
    chipRefsArray.current[index] = chipRefs;

    return (
      <Card key={`${selectedDate}-${period.name}`} variant="outlined">
        <CardContent>
          <Typography variant="string">
            {period.name}
          </Typography>
          <br />
          <TextField
            id={`${period.name}-${selectedDate}`}
            name={period.name}
            type="search"
            variant="standard"
            value={allEmotionInputValues[period.name]}
            inputRef={inputRef}
            onChange={(e) => {
              setAllEmotionInputValues({
                ...allEmotionInputValues,
                [e.target.name]: e.target.value
              });
            }}
            onKeyDown={(e) => handleTabPress(e, period.name, period, chipRefs, inputRef, isLastPeriod, index)}
          />
          <IconButton
            color="primary"
            aria-label="add emotion to period"
            name={period.name}
            onClick={() => handleCreateEntries(period.name, inputRef)}
            tabIndex={(isLastPeriod && allEmotionInputValues[period.name].trim() === "") ? -1 : 0}
          >
            <AddCircleIcon />
          </IconButton>
          {renderEmotions(dispatch, selectedDate, period, chipRefs, inputRef)}
        </CardContent>
      </Card>
    );
  }

  useEffect(() => {
    // Focus on the first input for the period without any entries
    for (let i = 0; i < day.periods.length; i++) {
      if (day.periods[i].emotions.length === 0) {
        inputRefs.current[i]?.current?.focus();
        break;
      }
    }
  }, [day, selectedDate]);

  return day != null ? (
    <Stack spacing={2}>
      {day.periods.map((period, index) => renderPeriod(dispatch, period, index))}
    </Stack>
  ) : (
    'temp - no entries'
  );
}

function EmotionTracker(props) {
  const [
    allEmotionInputValues, setAllEmotionInputValues
  ] = useState(() => periodNames.reduce((acc, name) => ({ ...acc, [name]: '' }), {}));

  const dispatch = useDispatch();
  const { selectedDate, day } = props;

  useEffect(() => { }, [day]);

  const dayForm = renderDayForm(
    dispatch,
    selectedDate,
    day,
    setAllEmotionInputValues,
    allEmotionInputValues
  );

  return (
    <React.Fragment>
      <br />
      {dayForm}
    </React.Fragment>
  );
}

function newDay(selectedDate) {
  return {
    date: selectedDate,
    periods: [...defaultPeriods]
  };
}

function mergePeriods(day) {
  return defaultPeriods.map(defaultPeriod => {
    const existingPeriod = day.periods.find(period => period.name === defaultPeriod.name);
    return existingPeriod || defaultPeriod;
  });
}

function mapStateToProps(state) {
  const selectedDate = state.selectedDate.date;

  return {
    selectedDate: selectedDate,
    day: (() => {
      const foundDay = state.days.find(day => day.date === state.selectedDate.date) || newDay(selectedDate);
      return {
        ...foundDay,
        periods: mergePeriods(foundDay)
      };
    })()
  };
}

export default connect(mapStateToProps)(EmotionTracker);