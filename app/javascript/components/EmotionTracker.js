import React, { useEffect, useState, useRef } from "react";
import { connect, useDispatch } from "react-redux";
import Chip from "@mui/material/Chip";
import { Card, CardContent, IconButton, Stack, TextField, Typography } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { createEntries, deleteEntry } from "../actions";
import "./styles/EmotionTracker.css";

// Define the period names and default periods
const periodNames = ["Early Morning", "Morning", "Afternoon", "Evening", "Before Bed"];
const defaultPeriods = periodNames.map(name => ({ name, emotions: [] }));

function EmotionTracker({ selectedDate, day }) {
  // Initialize state for emotion input values for each period
  const [allEmotionInputValues, setAllEmotionInputValues] = useState(() =>
    periodNames.reduce((acc, name) => ({ ...acc, [name]: "" }), {})
  );

  // Refs to manage input, chip, and button elements for focus management
  const inputRefs = useRef([]);
  const chipRefsArray = useRef([]);
  const buttonRefsArray = useRef([]);
  const dispatch = useDispatch();

  // Handle deletion of an emotion chip with animation and focus management
  const handleDeleteChip = (entryUuid, periodName, chipIndex) => {
    const periodIndex = periodNames.indexOf(periodName);
    const chipRefs = chipRefsArray.current[periodIndex];

    // Add the "removing" class for animation
    const chip = chipRefs.current[chipIndex];
    if (chip) {
      chip.classList.add("removing");
    }

    setTimeout(() => {
      dispatch(deleteEntry(entryUuid, selectedDate, periodName));

      setTimeout(() => {
        // After deletion, focus on the nearest chip or the input field if no chips are left
        if (chipRefs.current.length > 1) {
          const nextChip = chipRefs.current[chipIndex - 1] || chipRefs.current[chipIndex] || chipRefs.current[0];
          nextChip?.focus();
        } else if (chipRefs.current.length === 1) {
          chipRefs.current[0]?.focus();
        } else {
          inputRefs.current[periodIndex]?.current?.focus();
        }
      }, 100);
    }, 300); // Matches the animation duration
  };

  // Handle creation of new emotion entries and manage focus after creation
  const handleCreateEntries = (periodName, inputRef) => {
    const emotionsToAdd = allEmotionInputValues[periodName].split(",").map(emotion => emotion.trim());
    dispatch(createEntries(selectedDate, periodName, emotionsToAdd));
    setAllEmotionInputValues(prev => ({ ...prev, [periodName]: "" }));

    setTimeout(() => {
      const chipRefs = chipRefsArray.current[periodNames.indexOf(periodName)];
      if (chipRefs && chipRefs.current.length > 0) {
        const newChip = chipRefs.current[chipRefs.current.length - 1];
        if (newChip) {
          newChip.classList.add("adding");
          newChip.focus();
        }
      }

      inputRef.current.focus();
    }, 100);
  };

  // Handle keyboard navigation (Tab and Enter keys) within the emotion input and chips
  const handleTabPress = (e, periodName, period, chipRefs, inputRef, buttonRef, isLastPeriod, currentPeriodIndex) => {
    if (e.key === "Tab" && !e.shiftKey) {
      if (allEmotionInputValues[periodName].trim() !== "") {
        e.preventDefault();
        buttonRef.current?.focus(); // Focus on the IconButton if there is text in the TextField
      } else if (period.emotions.length > 0) {
        e.preventDefault();
        chipRefs.current[0]?.focus();
      } else if (!isLastPeriod) {
        e.preventDefault();
        inputRefs.current[currentPeriodIndex + 1]?.current?.focus();
      }
    }

    if (e.key === "Tab" && e.shiftKey) {
      e.preventDefault();
      if (currentPeriodIndex > 0) {
        const previousInputRef = inputRefs.current[currentPeriodIndex - 1];
        const previousPeriod = day.periods[currentPeriodIndex - 1];
        const previousChipRefs = chipRefsArray.current[currentPeriodIndex - 1];
        if (previousPeriod.emotions.length > 0) {
          previousChipRefs.current[previousPeriod.emotions.length - 1]?.focus();
        } else {
          previousInputRef?.current?.focus();
        }
      } else {
        inputRef.current.blur(); // Allow natural shift-tab behavior to move focus to prior elements in the DOM
      }
    }

    if (e.key === "Enter") {
      e.preventDefault();
      handleCreateEntries(periodName, inputRef);
    }
  };

  // Render each period with its associated emotions and input field
  const renderPeriod = (period, index) => {
    const inputRef = useRef(null);
    const chipRefs = useRef([]);
    const buttonRef = useRef(null);
    const isLastPeriod = period.name === "Before Bed";

    inputRefs.current[index] = inputRef;
    chipRefsArray.current[index] = chipRefs;
    buttonRefsArray.current[index] = buttonRef;

    return (
      <Card key={`${selectedDate}-${period.name}`} variant="outlined">
        <CardContent>
          <Typography variant="string">{period.name}</Typography>
          <Stack direction="row" alignItems="center" spacing={1}>
            <TextField
              id={`${period.name}-${selectedDate}`}
              name={period.name}
              type="search"
              variant="standard"
              value={allEmotionInputValues[period.name]}
              inputRef={inputRef}
              onChange={(e) => setAllEmotionInputValues(prev => ({ ...prev, [e.target.name]: e.target.value }))}
              onKeyDown={(e) => handleTabPress(e, period.name, period, chipRefs, inputRef, buttonRef, isLastPeriod, index)}
              className="text-input"
            />
            <IconButton
              color="primary"
              aria-label="add emotion to period"
              onClick={() => handleCreateEntries(period.name, inputRef)}
              ref={buttonRef}
              tabIndex={allEmotionInputValues[period.name].trim() !== "" ? 0 : -1}
            >
              <AddCircleIcon />
            </IconButton>
          </Stack>
          <div className="chips-container">
            {period.emotions.map((entry, chipIndex) => (
              <Chip
                key={entry.uuid}
                label={entry.name}
                onDelete={() => handleDeleteChip(entry.uuid, period.name, chipIndex)}
                tabIndex={0}
                ref={el => chipRefs.current[chipIndex] = el}
                className="chip"
              />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  // Focus the first empty period's input field after the component mounts
  useEffect(() => {
    for (let i = 0; i < day.periods.length; i++) {
      if (day.periods[i].emotions.length === 0) {
        inputRefs.current[i]?.current?.focus();
        break;
      }
    }
  }, [day, selectedDate]);

  // Render the periods or a placeholder if no day data is available
  return day ? (
    <Stack spacing={2}>
      {day.periods.map((period, index) => renderPeriod(period, index))}
    </Stack>
  ) : (
    "temp - no entries"
  );
}

// Helper function to create a new day object with default periods
function newDay(selectedDate) {
  return {
    date: selectedDate,
    periods: [...defaultPeriods],
  };
}

// Merge existing periods with the default periods
function mergePeriods(day) {
  return defaultPeriods.map(defaultPeriod => {
    const existingPeriod = day.periods.find(period => period.name === defaultPeriod.name);
    return existingPeriod || defaultPeriod;
  });
}

// Map the state to props for the EmotionTracker component
function mapStateToProps(state) {
  const selectedDate = state.selectedDate.date;
  return {
    selectedDate,
    day: (() => {
      const foundDay = state.days.find(day => day.date === selectedDate) || newDay(selectedDate);
      return {
        ...foundDay,
        periods: mergePeriods(foundDay),
      };
    })(),
  };
}

export default connect(mapStateToProps)(EmotionTracker);