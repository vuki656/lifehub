// Other Imports
import React from "react";
// MUI Component Imports
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Select from "@material-ui/core/Select";
import Box from "@material-ui/core/Box";
import Chip from "@material-ui/core/Chip";
import MenuItem from "@material-ui/core/MenuItem";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
// Data Imports
import { weekDays } from "../../../../../../../data/weekDays"
import { monthDays } from "../../../../../../../data/monthDays"

class RepeatOptions extends React.Component {
    state = {
        // Props
        selectedWeekDays: this.props.selectedWeekDays,
        selectedMonthDays: this.props.selectedMonthDays,
        repeatAtEndOfMonth: this.props.repeatAtEndOfMonth,
        repeatAtStartOfMonth: this.props.repeatAtStartOfMonth
    };

    static getDerivedStateFromProps(props) {
        return {
            selectedWeekDays: props.selectedWeekDays,
            selectedMonthDays: props.selectedMonthDays,
            repeatAtStartOfMonth: props.repeatAtStartOfMonth,
            repeatAtEndOfMonth: props.repeatAtEndOfMonth
        };
    }

    // Converts the repeating options to right format
    // REASON: data formating in firebase
    // DB fetch is a string, changes made are an array
    convertToArray = input => {
        if (Array.isArray(input)) {
            return input;
        } else {
            if (input) {
                return input.split(",");
            } else {
                return [];
            }
        }
    };

    render() {
        const {
            selectedWeekDays,
            selectedMonthDays,
            repeatAtStartOfMonth,
            repeatAtEndOfMonth
        } = this.state;

        let weekDaysArr = this.convertToArray(selectedWeekDays);
        let monthDaysArr = this.convertToArray(selectedMonthDays);

        return (
            <Grid
                container
                direction="column"
                justify="flex-start"
                alignItems="flex-start"
            >
                <Grid item xs={12}>
                    <Typography variant="h5">Select Week Days</Typography>
                </Grid>
                <Grid item xs={12}>
                    <Select
                        name="selectedWeekDays"
                        multiple
                        value={weekDaysArr}
                        onChange={this.props.handleDropdownChange}
                        // Works without this, but with this it renders chips as selected values
                        // instead of default text components
                        renderValue={weekDays => (
                            <Box>
                                {weekDays.map(weekDay => (
                                    <Chip key={weekDay} label={weekDay} />
                                ))}
                            </Box>
                        )}
                    >
                        {weekDays.map(daysOfWeek => (
                            <MenuItem
                                key={daysOfWeek.key}
                                value={daysOfWeek.value}
                            >
                                {daysOfWeek.text}
                            </MenuItem>
                        ))}
                    </Select>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h5">Select Month Days</Typography>
                </Grid>
                <Grid item xs={12}>
                    <Select
                        name="selectedMonthDays"
                        multiple
                        value={monthDaysArr}
                        onChange={this.props.handleDropdownChange}
                        // Works without this, but with this it renders chips as selected values
                        // instead of default text components
                        renderValue={monthDays => (
                            <Box>
                                {monthDays.map(monthDay => (
                                    <Chip key={monthDay} label={monthDay} />
                                ))}
                            </Box>
                        )}
                    >
                        {monthDays.map(monthDay => (
                            <MenuItem key={monthDay.key} value={monthDay.value}>
                                {monthDay.text}
                            </MenuItem>
                        ))}
                    </Select>
                </Grid>
                <Grid item xs={12}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                name={"repeatAtStartOfMonth"}
                                checked={repeatAtStartOfMonth}
                                onChange={this.props.handleCheckboxChange}
                            />
                        }
                        label={"Repeat at the start of month"}
                    />
                </Grid>
                <Grid item xs={12}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                name={"repeatAtEndOfMonth"}
                                checked={repeatAtEndOfMonth}
                                onChange={this.props.handleCheckboxChange}
                            />
                        }
                        label={"Repeat at the end of month"}
                    />
                </Grid>
            </Grid>
        );
    }
}

export default RepeatOptions;
