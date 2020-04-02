// Object Imports
import React from "react";
import DateFnsUtils from "@date-io/date-fns";
// Destructured Imports
import { Checkbox, FormControlLabel, Grid } from "@material-ui/core";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";

class StartRepeatingFromButton extends React.Component {
    state = {
        // Props
        createdAt: this.props.createdAt,
        repeatFromDate: this.props.repeatFromDate
    };

    static getDerivedStateFromProps(props) {
        return {
            repeatFromDate: props.repeatFromDate
        };
    }

    render() {
        const { createdAt, repeatFromDate } = this.state;

        return (
            <Grid
                container
                direction="row"
                justify="space-between"
                alignItems="center"
            >
                <Grid item xs={6}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                name={"repeatFromDate"}
                                checked={repeatFromDate}
                                onChange={this.props.handleCheckboxChange}
                            />
                        }
                        label="Start repeating from certain date"
                    />
                </Grid>
                <Grid item xs={6}>
                    {repeatFromDate && (
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <DatePicker
                                autoOk
                                label="Date"
                                clearable
                                disablePast
                                value={createdAt}
                                onChange={this.props.handleRepeatFromDate}
                            />
                        </MuiPickersUtilsProvider>
                    )}
                </Grid>
            </Grid>
        );
    }
}

export default StartRepeatingFromButton;
