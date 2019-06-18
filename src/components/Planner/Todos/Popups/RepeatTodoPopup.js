import React from "react";
import firebase from "../../../../firebase/Auth";
import moment from "moment";

import {
    Popup,
    Grid,
    Icon,
    Button,
    Dropdown,
    Message
} from "semantic-ui-react";

import {
    isDayBeingSavedTo,
    deleteSingleNodeFromFirebase,
    saveTodoInFirebase
} from "../../../../helpers/Planner/Todo";
import { getDayOnlyTimestamp } from "../../../../helpers/Global";

import XDayOfWeek from "../DropdownRepeatTypes/XDayOfWeek";
import XDayOfMonth from "../DropdownRepeatTypes/XDayOfMonth";

import { todoRepeatTypes } from "../../../../data/Planner/RepeatingTodoDropdownOptions";

class RepeatTodoPopup extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isPopOpen: false,
            typeOfRepeating: "",
            todoRef: firebase.database().ref("todos"),
            currentUser: firebase.auth().currentUser,

            selectedMonthDays: this.props.todo.repeatingOnMonthDays.split(","),
            selectedWeekDays: this.props.todo.repeatingOnWeekDays.split(","),
            category: this.props.category,
            generateUntillDate: this.props.generateUntillDate,
            todo: this.props.todo,
            currentDay: this.props.currentDay
        };

        this.handleDaysOfWeekDropdown = this.handleDaysOfWeekDropdown.bind(
            this
        );
        this.handleDaysOfMonthDropdown = this.handleDaysOfMonthDropdown.bind(
            this
        );
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
        const { todo, typeOfRepeating } = this.state;

        // Check if todo is repeating,
        // If yes, update it
        // If no, save it
        if (todo.isRepeating) {
            this.handleRepeatingTodoUpdate(this.state);
        } else {
            switch (typeOfRepeating) {
                case "every-day":
                    this.handleSaveRepeatingTodoEveryday(this.state);
                    break;
                case "every-x-day-of-week":
                    this.handleSaveRepeatingTodoDaysOfWeek(this.state);
                    break;
                case "every-x-day-of-month":
                    this.handleSaveRepeatingTodoDaysOfMonth(this.state);
                    break;
                default:
                    break;
            }
        }

        this.closePopup();
    };

    // Save repeating todo to every day in firebase
    handleSaveRepeatingTodoEveryday = ({
        todoRef,
        currentUser,
        currentDay,
        category,
        todo,
        generateUntillDate,
        selectedWeekDays
    }) => {
        for (
            let startDate = moment();
            startDate.isBefore(moment(generateUntillDate).add(1, "day"));
            startDate.add(1, "days")
        ) {
            let dayTimestamp = getDayOnlyTimestamp(startDate);
            selectedWeekDays = [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday"
            ];

            saveTodoInFirebase(
                todoRef,
                currentUser,
                category,
                todo,
                selectedWeekDays,
                dayTimestamp,
                currentDay
            );
        }
    };

    // Save repeating todo to selected days of week
    handleSaveRepeatingTodoDaysOfWeek = ({
        todoRef,
        currentUser,
        currentDay,
        category,
        todo,
        generateUntillDate,
        selectedWeekDays
    }) => {
        for (
            let startDate = moment();
            startDate.isBefore(moment(generateUntillDate).add(1, "day"));
            startDate.add(1, "days")
        ) {
            if (isDayBeingSavedTo(startDate, selectedWeekDays, "dddd")) {
                let dayTimestamp = getDayOnlyTimestamp(startDate);
                saveTodoInFirebase(
                    todoRef,
                    currentUser,
                    category,
                    todo,
                    selectedWeekDays,
                    dayTimestamp,
                    currentDay
                );
            }
        }
    };

    // Save repeating todo to selected days of month
    handleSaveRepeatingTodoDaysOfMonth = ({
        todoRef,
        currentUser,
        currentDay,
        category,
        todo,
        generateUntillDate,
        selectedWeekDays,
        selectedMonthDays
    }) => {
        for (
            let startDate = moment();
            startDate.isBefore(moment(generateUntillDate).add(1, "day"));
            startDate.add(1, "days")
        ) {
            if (isDayBeingSavedTo(startDate, selectedMonthDays, "Do")) {
                let dayTimestamp = getDayOnlyTimestamp(startDate);
                saveTodoInFirebase(
                    todoRef,
                    currentUser,
                    category,
                    todo,
                    selectedWeekDays,
                    dayTimestamp,
                    currentDay,
                    selectedMonthDays
                );
            }
        }
    };

    // Send todo object to firebase
    handleRepeatingTodoUpdate = ({
        generateUntillDate,
        todo,
        selectedWeekDays,
        todoRef,
        currentUser,
        category,
        selectedMonthDays,
        currentDay
    }) => {
        // Save new todo in each day from date range
        // If there are days outside new day range
        // delete them, else update them
        for (
            let itterationCurrentDate = moment(todo.createdAt);
            itterationCurrentDate.isBefore(
                moment(generateUntillDate).add(1, "day")
            );
            itterationCurrentDate.add(1, "days")
        ) {
            let dayTimestamp = getDayOnlyTimestamp(itterationCurrentDate);
            if (
                isDayBeingSavedTo(dayTimestamp, selectedWeekDays, "dddd") ||
                isDayBeingSavedTo(dayTimestamp, selectedMonthDays, "Do")
            ) {
                saveTodoInFirebase(
                    todoRef,
                    currentUser,
                    category,
                    todo,
                    selectedWeekDays,
                    dayTimestamp,
                    currentDay,
                    selectedMonthDays
                );
            } else {
                deleteSingleNodeFromFirebase(
                    todoRef,
                    currentUser,
                    dayTimestamp,
                    category,
                    todo
                );
            }
        }
        this.closePopup();
    };

    // Send todo object to firebase
    handleRepeatingTodoMonthDaysUpdate = ({
        generateUntillDate,
        todo,
        selectedMonthDays,
        todoRef,
        currentUser,
        category,
        selectedWeekDays
    }) => {
        // Save new todo in each day from date range
        // If there are days outside new day range
        // delete them, else update them
        for (
            let itterationCurrentDate = moment(todo.createdAt);
            itterationCurrentDate.isBefore(
                moment(generateUntillDate).add(1, "day")
            );
            itterationCurrentDate.add(1, "days")
        ) {
            let dayTimestamp = getDayOnlyTimestamp(itterationCurrentDate);
            if (isDayBeingSavedTo(dayTimestamp, selectedMonthDays, "dddd")) {
                saveTodoInFirebase(
                    todoRef,
                    currentUser,
                    category,
                    todo,
                    selectedWeekDays,
                    dayTimestamp,
                    selectedMonthDays
                );
            } else {
                deleteSingleNodeFromFirebase(
                    todoRef,
                    currentUser,
                    dayTimestamp,
                    category,
                    todo
                );
            }
        }
        this.closePopup();
    };

    // Set the repeaeting todo type to state
    handleDropdownChange = (event, value) => {
        this.setState({ typeOfRepeating: value.value });
    };

    // Set selected days of week to state
    handleDaysOfWeekDropdown = (event, value) => {
        this.setState({ selectedWeekDays: value.value });
    };

    // Set selected days of month to state
    handleDaysOfMonthDropdown = (event, value) => {
        this.setState({ selectedMonthDays: value.value });
    };

    closePopup = () => {
        this.setState({ isPopOpen: false });
    };

    openPopup = () => {
        this.setState({ isPopOpen: true });
    };

    render() {
        const {
            isPopOpen,
            typeOfRepeating,
            selectedWeekDays,
            selectedMonthDays
        } = this.state;

        return (
            <Popup
                trigger={
                    <Icon
                        name={"repeat"}
                        link={true}
                        onClick={this.openPopup}
                    />
                }
                flowing
                on="click"
                open={isPopOpen}
                onClose={this.closePopup}
            >
                <Grid>
                    <Grid.Row>
                        <p>How often to repeat it</p>
                    </Grid.Row>
                    <Grid.Row columns={"equal"}>
                        <Grid.Column>
                            <Grid.Row>
                                <Dropdown
                                    placeholder="Select Option"
                                    options={todoRepeatTypes}
                                    onChange={this.handleDropdownChange}
                                />
                            </Grid.Row>
                            {typeOfRepeating === "every-x-day-of-week" && (
                                <XDayOfWeek
                                    selectedWeekDays={selectedWeekDays}
                                    handleDaysOfWeekDropdown={
                                        this.handleDaysOfWeekDropdown
                                    }
                                />
                            )}
                            {typeOfRepeating === "every-x-day-of-month" && (
                                <XDayOfMonth
                                    selectedMonthDays={selectedMonthDays}
                                    handleDaysOfMonthDropdown={
                                        this.handleDaysOfMonthDropdown
                                    }
                                />
                            )}
                            <Grid.Row>
                                <Button onClick={this.handleRepeatingTodoSave}>
                                    Save
                                </Button>
                                <Button onClick={this.closePopup}>
                                    Cancel
                                </Button>
                            </Grid.Row>
                            <Grid.Row>
                                <Message compact>
                                    Todo repeating will start from day you make
                                    it repeating. <br />
                                    It will not be displayed before it. <br />
                                    Ex: If you make it repeating on 25th,
                                    <br /> it will display from 25th onward, it
                                    wont be visible before 25th.
                                </Message>
                            </Grid.Row>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Popup>
        );
    }
}

export default RepeatTodoPopup;
