// Object Imports
import React from "react";
import firebase from "../../../helpers/firebase/Auth";
import moment from "moment";
// Destructured Imports
import { Box, Button, Grid, Paper, Popper, TextField, Typography } from "@material-ui/core";
import { connect } from "react-redux";
// Icon Imports
import CreateIcon from "@material-ui/icons/Create";
// Helper Imports
import { getDayOnlyTimestamp } from "../../../helpers/functions/Global";
import { isDayBeingSavedTo } from "../../../helpers/functions/Todo";

class EditTodoNameButton extends React.Component {
    state = {
        // Firebase
        currentUser: firebase.auth().currentUser,
        todoRef: firebase.database().ref("todos"),
        usersRef: firebase.database().ref("users"),

        // Base
        newTodo: "",
        isPopOpen: false,
        anchorElement: null, // Point from where the popup is opened

        // Props
        todo: this.props.todo,
        category: this.props.category,

        // Redux Props
        currentDay: this.props.currentDay,
        generateUntillDate: this.props.generateUntillDate
    };

    static getDerivedStateFromProps(props) {
        return {
            todo: props.todo,
            generateUntillDate: props.generateUntillDate,
            category: props.category
        };
    }

    // Handle popup toggle actions
    handlePopToggle = event => {
        this.setAnchorElement(event);
        this.togglePopup();
    };

    // Set anchor element (where to open the pop)
    setAnchorElement = event => {
        this.setState({ anchorElement: event.currentTarget });
    };

    // Toggle popup
    togglePopup = () => {
        this.setState({ isPopOpen: !this.state.isPopOpen });
    };

    /*  Iterate trough all days
        If todo is repeating, update wherever its active
        If todo not repeating, update its single instance
    */
    handleTodoTextUpdate = () => {
        const { todo, generateUntillDate, currentDay } = this.state;

        for (
            let itteratingDate = moment(todo.createdAt);
            itteratingDate.isBefore(moment(generateUntillDate).add(1, "day"));
            itteratingDate.add(1, "days")
        ) {
            if (todo.isRepeating) {
                this.handleRepeatingTodoTextUpdate(
                    this.state,
                    itteratingDate,
                    todo,
                    itteratingDate
                );
            } else {
                this.changeTodoTextInFirebase(this.state, currentDay);
            }
        }

        this.togglePopup();
    };

    // Check if itterating date matches repeating month day or week day
    handleRepeatingTodoTextUpdate = (
        { repeatAtStartOfMonth, repeatAtEndOfMonth },
        date,
        todo,
        itteratingDate
    ) => {
        // Convert iterating date to epoch timestamp
        let dayTimestamp = getDayOnlyTimestamp(itteratingDate);

        // Check if the selected dates includes start of month
        let startOfMonth = repeatAtStartOfMonth
            ? getDayOnlyTimestamp(moment(itteratingDate).startOf("month"))
            : "";

        // Check if the selected dates includes end of month
        let endOfMonth = repeatAtEndOfMonth
            ? getDayOnlyTimestamp(moment(itteratingDate).endOf("month"))
            : "";

        if (
            isDayBeingSavedTo(date, todo.repeatingOnMonthDays, "Do") ||
            isDayBeingSavedTo(date, todo.repeatingOnWeekDays, "dddd") ||
            startOfMonth === dayTimestamp ||
            endOfMonth === dayTimestamp
        ) {
            this.changeTodoTextInFirebase(this.state, date);
        }
    };

    // Change todo text in firebase
    changeTodoTextInFirebase = (
        { todo, todoRef, category, currentUser, newTodo },
        date
    ) => {
        let dayTimestamp = getDayOnlyTimestamp(date);

        if (newTodo !== "") {
            todoRef
                .child(
                    `${currentUser.uid}/${dayTimestamp}/categories/${category}/${todo.key}`
                )
                .update({ text: newTodo })
                .catch(err => {
                    console.error(err);
                });
        }
    };

    // Set the state value from user input
    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    render() {
        const { todo, isPopOpen, anchorElement } = this.state;

        return (
            <Box>
                <CreateIcon onClick={this.handlePopToggle} />
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
                                    <Typography variant="h4">
                                        Enter a New Name
                                    </Typography>
                                </Grid>
                                <Grid xs={12} item>
                                    <TextField
                                        label="Name"
                                        defaultValue={todo.text}
                                        name={"newTodo"}
                                        onChange={this.handleChange}
                                    />
                                </Grid>
                                <Grid xs={12} item>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={this.handleTodoTextUpdate}
                                    >
                                        Save
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={this.togglePopup}
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

const mapStateToProps = state => ({
    currentDay: state.planner.currentDay,
    generateUntillDate: state.planner.generateUntillDate
});

export default connect(mapStateToProps, null)(EditTodoNameButton);
