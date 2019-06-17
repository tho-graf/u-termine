import React, { useState } from "react";
import { DateTime } from "luxon";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import { KeyboardDatePicker } from "@material-ui/pickers";

const useStyles = makeStyles(theme => ({
  root: {
    width: "80%",
    marginTop: theme.spacing(3),
    overflowX: "auto"
  },
  table: {
    minWidth: 650
  }
}));

const formatPoint = date => {
  try {
    return new Intl.DateTimeFormat("de-DE").format(date.toJSDate());
  } catch (msg) {
    console.log(msg.message);
    return "";
  }
};

const formatInterval = date => {
  try {
    const formattedDate = new Intl.DateTimeFormat("de-DE").format(date.toJSDate());
    const relative = date.plus({ day: 1 }).toRelative();

    const afterToday = date > Date.now();
    return `${formattedDate} ${afterToday ? `(${relative})` : ""}`;
  } catch (msg) {
    console.log(msg.message);
    return "";
  }
};

const isBefore = today => date => date > today;

function createData(name, timeperiod, from, to, fromOverdue, toOverdue) {
  return { name, timeperiod, from, fromOverdue, to, toOverdue };
}

function App() {
  const [date, setDate] = useLocalStorage("birthday", new Date().toISOString());

  const u1 = DateTime.fromISO(date);
  const u2start = DateTime.fromISO(date).plus({ day: 2 });
  const u2end = DateTime.fromISO(date).plus({ day: 9 });
  const u3start = DateTime.fromISO(date).plus({ week: 3 });
  const u3end = DateTime.fromISO(date).plus({ week: 5 });
  const u4start = DateTime.fromISO(date).plus({ month: 2 });
  const u4end = DateTime.fromISO(date).plus({ month: 4 });
  const u5start = DateTime.fromISO(date).plus({ month: 5 });
  const u5end = DateTime.fromISO(date).plus({ month: 7 });
  const u6start = DateTime.fromISO(date).plus({ month: 9 });
  const u6end = DateTime.fromISO(date).plus({ month: 12 });
  const u7start = DateTime.fromISO(date).plus({ month: 20 });
  const u7end = DateTime.fromISO(date).plus({ month: 24 });
  const u7astart = DateTime.fromISO(date).plus({ month: 33 });
  const u7aend = DateTime.fromISO(date).plus({ month: 36 });
  const u8start = DateTime.fromISO(date).plus({ month: 45 });
  const u8end = DateTime.fromISO(date).plus({ month: 48 });
  const u9start = DateTime.fromISO(date).plus({ month: 59 });
  const u9end = DateTime.fromISO(date).plus({ month: 64 });

  const isBeforeToday = isBefore(new Date());

  const rows = [
    createData("U1", "Tag der Geburt", formatPoint(u1), isBefore(u1)),
    createData("U2 ", "3. bis 10. Lebenstag", formatInterval(u2start), formatInterval(u2end)),
    createData("U3 ", "4. bis 5. Woche", formatInterval(u3start), formatInterval(u3end)),
    createData("U4 ", "3. bis 4. Monat", formatInterval(u4start), formatInterval(u4end)),
    createData("U5 ", "5. bis 6. Monat", formatInterval(u5start), formatInterval(u5end)),
    createData("U6 ", "10. bis 12. Monat", formatInterval(u6start), formatInterval(u6end)),
    createData("U7 ", "21. bis 24 Monat", formatInterval(u7start), formatInterval(u7end)),
    createData("U7a ", "34. bis 36 Monat", formatInterval(u7astart), formatInterval(u7aend)),
    createData("U8 ", "46. bis 48. Monat", formatInterval(u8start), formatInterval(u8end)),
    createData("U9 ", "60. bis 64. Monat", formatInterval(u9start), formatInterval(u9end))
  ];

  const classes = useStyles();
  return (
    <>
      <CssBaseline />
      {/* Geburtstag: <input type="date" value={date} onChange={event => setDate(event.target.value)} /> */}
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <KeyboardDatePicker
          margin="normal"
          id="mui-pickers-date"
          label="Geburtstermin"
          value={date}
          onChange={setDate}
          format="dd.MM.yyyy"
          KeyboardButtonProps={{
            "aria-label": "Geburtstermin ändern"
          }}
        />

        <Paper className={classes.root}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>Untersuchung</TableCell>
                <TableCell align="right">Zeitraum</TableCell>
                <TableCell align="right">Von</TableCell>
                <TableCell align="right">Bis</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map(row => (
                <TableRow key={row.name}>
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell align="right">{row.timeperiod}</TableCell>
                  <TableCell align="right">{row.from}</TableCell>
                  <TableCell align="right">{row.to}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </div>
    </>
  );
}

function useLocalStorage(key, initialValue) {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.log(error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = value => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.log(error);
    }
  };

  return [storedValue, setValue];
}

export default App;
