// Object Imports
import React from "react";
import firebase from "../../../../../../../../helpers/firebase/Auth";
import moment from "moment";
// Destructured Imports
import { Box, Button, Checkbox, FormControlLabel, Grid, Paper, Popper, Typography } from "@material-ui/core";
import { connect } from "react-redux";
// Component Imports
import RepeatOptions from "./RepeatOptions";
import StartRepeatingFromButton from "./StartRepeatingFromButton";
// Icon Imports
import LoopIcon from "@material-ui/icons/Loop";
// Helper Imports
import { deleteTodoFromFirebase, isDayBeingSavedTo } from "../../../../../../../../helpers/functions/Todo";
import { getDayOnlyTimestamp } from "../../../../../../../../helpers/functions/Global";
// Data Imports
import { weekDaysList } from "../../../../../../../../data/weekDays"

class RepeatTodoButton extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            // Firebase
            currentUser: firebase.auth().currentUser,
            todoRef: firebase.database().ref("todos"),

            // Base
            isRepeatingEveryDay: false,
            isPopOpen: false,
            anchorElement: null, // Point from where the popup is opened

            // Props
            repeatFromDate: this.props.todo.repeatFromDate,
            createdAt: this.props.todo.createdAt,
            repeatAtStartOfMonth: this.props.todo.repeatAtStartOfMonth,
            repeatAtEndOfMonth: this.props.todo.repeatAtEndOfMonth,
            selectedMonthDays: this.props.todo.repeatingOnMonthDays,
            selectedWeekDays: this.props.todo.repeatingOnWeekDays,
            todo: this.props.todo,
            category: this.props.category,

            // Redux Props
            currentDay: this.props.currentDay,
            generateUntillDate: this.props.generateUntillDate
        };

        this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
        this.handleDropdownChange = this.handleDropdownChange.bind(this);
        this.handleRepeatFromDate = this.handleRepeatFromDate.bind(this);
    }

    static getDerivedStateFromProps(props) {
        return {
            category: props.category,
            generateUntillDate: props.generateUntillDate,
            todo: props.todo,
            currentDay: props.currentDay
        };
    }

    // Determine if todo is repeating and what kind
    handleRepeatingTodoSave = () => {
        const {
            todo,
            selectedWeekDays,
            isRepeatingEveryDay,
            createdAt
        } = this.state;

        // Check if todo is repeating,
        // If yes, update it
        // If no, save it
        if (todo.isRepeating) {
            this.saveRepeatingTodo(this.state, selectedWeekDays, createdAt);
        } else {
            if (isRepeatingEveryDay) {
                this.saveRepeatingTodo(this.state, weekDaysList, createdAt);
            } else {
                this.saveRepeatingTodo(this.state, selectedWeekDays, createdAt);
            }
        }
        this.togglePopup();
    };

    // Save repeating todo in firebase in all days that match
    saveRepeatingTodo = (
        {
            todoRef,
            currentUser,
            category,
            todo,
            selectedMonthDays,
            generateUntillDate,
            repeatAtEndOfMonth,
            repeatAtStartOfMonth
        },
        selectedWeekDays,
        todoCreatedAtDate
    ) => {
        for (
            let iteratingDate = moment();
            iteratingDate.isBefore(moment(generateUntillDate).add(1, "day"));
            iteratingDate.add(1, "days")
        ) {
            let dayTimestamp = getDayOnlyTimestamp(iteratingDate);

            // If start or end date are checked, use start/end date of month
            let startOfMonth = repeatAtStartOfMonth
                ? getDayOnlyTimestamp(moment(iteratingDate).startOf("month"))
                : "";
            let endOfMonth = repeatAtEndOfMonth
                ? getDayOnlyTimestamp(moment(iteratingDate).endOf("month"))
                : "";

            // Check if todo is repeating in month days
            let isDayOfMonth = isDayBeingSavedTo(
                iteratingDate,
                selectedMonthDays,
                "Do"
            );

            // Check if todo is repeating in week days
            let isDayOfYear = isDayBeingSavedTo(
                iteratingDate,
                selectedWeekDays,
                "dddd"
            );

            // Check if todo is repeating on the 1st in month
            let isStartOfMonth = startOfMonth === dayTimestamp;

            // Check if todo is repeating on the last in month
            let isEndOfMonth = endOfMonth === dayTimestamp;

            // Check if date being set to is in the past, if yes, it will be ignored
            // until its it gets to todays date
            // Reason is because you cant put todo in the past
            let isAfterCreationDate = moment(iteratingDate).isAfter(
                todoCreatedAtDate
            );

            if (
                (isDayOfMonth ||
                    isDayOfYear ||
                    isStartOfMonth ||
                    isEndOfMonth) &&
                isAfterCreationDate
            ) {
                this.saveSingleTodoInFirebase(
                    this.state,
                    selectedWeekDays,
                    dayTimestamp
                );
            } else {
                deleteTodoFromFirebase(
                    todoRef,
                    currentUser,
                    dayTimestamp,
                    category,
                    todo
                );
            }
        }
        this.togglePopup();
    };

    // Save single todo instance node in firebase
    saveSingleTodoInFirebase = (
        {
            todoRef,
            currentUser,
            category,
            todo,
            currentDay,
            selectedMonthDays,
            repeatAtStartOfMonth,
            repeatAtEndOfMonth,
            createdAt,
            repeatFromDate
        },
        selectedWeekDays,
        dayTimestamp
    ) => {
        let determinedCreatedAtDate;

        /*  Convert selected days array to string if exists
            Else use empty string
        */
        let repeatingDaysOfWeekString = selectedWeekDays
            ? selectedWeekDays.toString()
            : "";
        let repeatingDaysOMonthString = selectedMonthDays
            ? selectedMonthDays.toString()
            : "";

        /*  Determine if todo.createdAt exists.
            When creating a todo, currentDay will be used as createdAt date
            because todo.createdAt doesn't exist
            When updating, existing createdAt from todo will
            be used as createdAt date
        */
        if (createdAt) {
            determinedCreatedAtDate = createdAt;
        } else {
            determinedCreatedAtDate = currentDay;
        }

        todoRef
            .child(
                `${currentUser.uid}/${dayTimestamp}/categories/${category}/${todo.key}`
            )
            .update({
                createdAt: determinedCreatedAtDate,
                isChecked: false,
                key: todo.key,
                text: todo.text,
                isRepeating: true,
                repeatingOnWeekDays: repeatingDaysOfWeekString,
                repeatingOnMonthDays: repeatingDaysOMonthString,
                repeatAtStartOfMonth: repeatAtStartOfMonth,
                repeatAtEndOfMonth: repeatAtEndOfMonth,
                repeatFromDate: repeatFromDate
            })
            .catch(err => {
                console.error(err);
            });
    };

    // Handle popup toggle actions
    handlePopToggle = event => {
        this.setAnchorElement(event);
        this.togglePopup();
    };

    // Set anchor element (position where to open the pop)
    setAnchorElement = event => {
        this.setState({ anchorElement: event.currentTarget });
    };

    // Set created at date from custom user selection
    handleRepeatFromDate = newRepeatFromDate => {
        this.setState({ createdAt: getDayOnlyTimestamp(newRepeatFromDate) });
    };

    // Reset all repeating options
    handleRepeatEveryDayCheckbox = () => {
        this.setState({
            isRepeatingEveryDay: !this.state.isRepeatingEveryDay,
            selectedMonthDays: [],
            selectedWeekDays: weekDaysList,
            repeatAtEndOfMonth: false,
            repeatAtStartOfMonth: false,
            createdAt: this.state.todo.createdAt,
            repeatFromDate: false
        });
    };

    // If todo is repeating, show repeating icon all the time
    checkIfRepeating = ({ todo }) => {
        return todo.isRepeating ? "todo-card-active-icon" : "todo-card-icon";
    };

    // Set the state value from checkbox
    handleCheckboxChange = (event, value) => {
        this.setState({ [event.target.name]: value });
    };

    // Handle dropdown value selecting
    handleDropdownChange = (event, value) => {
        this.setState({ [event.target.name]: event.target.value });
    };

    // Toggle popup
    togglePopup = () => {
        this.setState({ isPopOpen: !this.state.isPopOpen });
    };

    render() {
        const {
            isPopOpen,
            isRepeatingEveryDay,
            selectedWeekDays,
            selectedMonthDays,
            repeatAtStartOfMonth,
            repeatAtEndOfMonth,
            repeatFromDate,
            createdAt,
            anchorElement
        } = this.state;

        return (
            <Box>
                <LoopIcon onClick={this.handlePopToggle} />
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
                                <Grid item xs={12}>
                                    <Typography variant="h4">
                                        How Often To Repeat It
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="body2">
                                        Todo repeating will start from today
                                        date no matter in which day you create
                                        it. If you want it to start repeating
                                        from certain date. Use the checkbox at
                                        the bottom.
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={isRepeatingEveryDay}
                                                onChange={
                                                    this
                                                        .handleRepeatEveryDayCheckbox
                                                }
                                            />
                                        }
                                        label="Repeat every day"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <RepeatOptions
                                        selectedWeekDays={selectedWeekDays}
                                        selectedMonthDays={selectedMonthDays}
                                        repeatAtStartOfMonth={
                                            repeatAtStartOfMonth
                                        }
                                        repeatAtEndOfMonth={repeatAtEndOfMonth}
                                        handleCheckboxChange={
                                            this.handleCheckboxChange
                                        }
                                        handleDropdownChange={
                                            this.handleDropdownChange
                                        }
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <StartRepeatingFromButton
                                        createdAt={createdAt}
                                        repeatFromDate={repeatFromDate}
                                        handleCheckboxChange={
                                            this.handleCheckboxChange
                                        }
                                        handleRepeatFromDate={
                                            this.handleRepeatFromDate
                                        }
                                    />
                                </Grid>
                                <Grid container>
                                    <Grid item xs={6}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={
                                                this.handleRepeatingTodoSave
                                            }
                                        >
                                            Save
                                        </Button>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={this.togglePopup}
                                        >
                                            Cancel
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Box>
                    </Paper>
                </Popper>
            </Box>
        );
    }
}

const mapStateToProps = state => ({
    currentDay: state.planner.currentDay,
    generateUntillDate: state.planner.generateUntillDate
});

export default connect(mapStateToProps, null)(RepeatTodoButton);
