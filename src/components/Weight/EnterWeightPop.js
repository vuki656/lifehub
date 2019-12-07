// Object Imports
import React from "react";
import moment from "moment";
import firebase from "../../firebase/Auth";
import DateFnsUtils from "@date-io/date-fns";

// Destructured Imports
import {
    Box,
    Typography,
    Popper,
    Button,
    Paper,
    Input,
    Grid
} from "@material-ui/core";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";

class EnterWeightPop extends React.Component {
    state = {
        // Firebase
        currentUser: firebase.auth().currentUser,
        weightRef: firebase.database().ref("weight-entries"),

        // Base
        weight: "",
        weightDate: moment().valueOf(),
        error: "",
        isPopOpen: false,
        anchorElement: null // Point from where the popup is opened
    };

    // Set the state value from user input
    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    // Check if weight is valid
    checkWeightFormat = weight => {
        return this.checkIfWeightExists(weight) &&
            this.handleNumberCheck(weight)
            ? true
            : false;
    };

    // Checks if weight exists
    checkIfWeightExists = weight => {
        if (weight) {
            this.setState({ error: "" });
            return true;
        } else {
            this.setState({ error: "Please enter a number" });
            return false;
        }
    };

    // Checks the weight format
    handleNumberCheck = weight => {
        const regEx = /^0$|^[1-9]\d*$|^\.\d+$|^0\.\d*$|^[1-9]\d*\.\d*$/;

        if (regEx.test(weight)) {
            this.setState({ error: "" });
            return true;
        } else {
            this.setState({
                error:
                    "Wrong format. Weight can only be a whole number or a decimal with 2 decimal places"
            });
            return false;
        }
    };

    // Sends the weight and date object to firebase
    handleSubmit = ({ weight, weightDate, weightRef, currentUser }) => {
        let pushRef = weightRef.child(currentUser.uid);

        if (this.checkWeightFormat(weight)) {
            pushRef
                .child(`${currentUser.uid}`)
                .push()
                .then(weightEntry => {
                    pushRef
                        .child(weightEntry.key)
                        .set({
                            weight: weight,
                            date: weightDate,
                            key: weightEntry.key
                        })
                        .catch(err => {
                            console.error(err);
                        });
                });

            this.clearForm();
        }
    };

    // Handle weight entry save
    handleWeightEntrySave = () => {
        this.handleSubmit(this.state);
        if (!this.state.error) {
            this.togglePopup();
        }
    };

    // CLear the form
    clearForm = () => {
        this.setState({ weight: "" });
    };

    // Toggle popup
    togglePopup = () => {
        this.setState({ isPopOpen: !this.state.isPopOpen });
    };

    // Handle cancel button press
    handleWeightEntryCancel = () => {
        this.setState({ weight: "" });
        this.togglePopup();
    };

    // Handle date picker value setting
    handleDateChange = newCreatedAtDate => {
        this.setState({ weightDate: moment(newCreatedAtDate).valueOf() });
    };

    // Set anchor element (position where to open the pop)
    setAnchorElement = event => {
        this.setState({ anchorElement: event.currentTarget });
    };

    // Handle popup toggle actions
    handlePopToggle = event => {
        this.setAnchorElement(event);
        this.togglePopup();
    };

    render() {
        const { error, isPopOpen, weightDate, anchorElement } = this.state;

        return (
            <Box>
                <Typography variant="h5">Weight Entry Table </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={this.handlePopToggle}
                >
                    Add Entry
                </Button>
                <Popper
                    open={isPopOpen}
                    anchorEl={anchorElement}
                    placement="right-start"
                    style={{ maxWidth: "350px" }}
                    modifiers={{
                        flip: {
                            enabled: true
                        },
                        preventOverflow: {
                            enabled: true,
                            boundariesElement: "undefined"
                        }
                    }}
                >
                    <Paper>
                        <Box p={2}>
                            <Grid container>
                                <Grid xs={12} item>
                                    <Typography variant="h5">
                                        Enter Your Weight
                                    </Typography>
                                </Grid>
                                <Grid xs={12} item>
                                    {error !== "" && (
                                        <Typography>{error}</Typography>
                                    )}
                                </Grid>
                                <Grid xs={12} item>
                                    <Typography variant="h5">Date</Typography>
                                </Grid>
                                <Grid xs={12} item>
                                    <MuiPickersUtilsProvider
                                        utils={DateFnsUtils}
                                    >
                                        <DatePicker
                                            autoOk
                                            label="Date"
                                            clearable
                                            disableFuture
                                            value={weightDate}
                                            onChange={this.handleDateChange}
                                        />
                                    </MuiPickersUtilsProvider>
                                </Grid>
                                <Grid xs={12} item>
                                    <Typography variant="h5">Weight</Typography>
                                </Grid>
                                <Grid xs={12} item>
                                    <Input
                                        name="weight"
                                        type={"text"}
                                        onChange={this.handleChange}
                                    />
                                </Grid>
                                <Grid xs={12} item>
                                    <Button
                                        onClick={this.handleWeightEntrySave}
                                        variant="contained"
                                        color="primary"
                                    >
                                        Submit
                                    </Button>
                                    <Button
                                        onClick={this.handleWeightEntryCancel}
                                        variant="contained"
                                        color="secondary"
                                    >
                                        Cancel
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    </Paper>
                </Popper>
            </Box>
        );
    }
}

export default EnterWeightPop;
