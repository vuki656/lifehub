import React from "react";
import firebase from "../../../../firebase/Auth";
import moment from "moment";

import {
    Popup,
    Grid,
    Icon,
    Button,
    Message,
    Checkbox,
    Segment
} from "semantic-ui-react";

import {
    isDayBeingSavedTo,
    deleteTodoFromFirebase
} from "../../../../helpers/Planner/Todo";
import { getDayOnlyTimestamp } from "../../../../helpers/Global";

import RepeatOptions from "./RepeatOptions";

import { daysOfWeekArr } from "../../../../data/StockData";

class RepeatTodoPopup extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isRepeatingEveryDay: false,
            isPopOpen: false,
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
        const { todo, selectedWeekDays, isRepeatingEveryDay } = this.state;

        // Check if todo is repeating,
        // If yes, update it
        // If no, save it
        if (todo.isRepeating) {
            this.saveRepeatingTodo(
                this.state,
                selectedWeekDays,
                todo.createdAt
            );
        } else {
            if (isRepeatingEveryDay) {
                this.saveRepeatingTodo(this.state, daysOfWeekArr);
            } else {
                this.saveRepeatingTodo(this.state, selectedWeekDays);
            }
        }
        this.closePopup();
    };

    saveRepeatingTodo = (
        {
            todoRef,
            currentUser,
            category,
            todo,
            selectedMonthDays,
            generateUntillDate
        },
        selectedWeekDays,
        todoCreatedAtDate
    ) => {
        // When updating, use todo created date to update from
        // When saving, use current day to save from
        let startFromDate = todoCreatedAtDate ? todoCreatedAtDate : moment();

        for (
            let itteratingDate = moment(startFromDate);
            itteratingDate.isBefore(moment(generateUntillDate).add(1, "day"));
            itteratingDate.add(1, "days")
        ) {
            let dayTimestamp = getDayOnlyTimestamp(itteratingDate);
            if (
                isDayBeingSavedTo(itteratingDate, selectedMonthDays, "Do") ||
                isDayBeingSavedTo(itteratingDate, selectedWeekDays, "dddd")
            ) {
                this.saveTodoInFirebase(
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
        this.closePopup();
    };

    saveTodoInFirebase = (
        { todoRef, currentUser, category, todo, currentDay, selectedMonthDays },
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

        /*  Determine if todo.createdAt exists
            When creating, currentDay will be used as createdAt date
            becasue todo.createdAt doesent exist
            When updating, exisiting createdAt from todo will
            be used as createdAt date
        */
        if (todo.createdAt) {
            determinedCreatedAtDate = todo.createdAt;
        } else {
            determinedCreatedAtDate = currentDay;
        }

        todoRef
            .child(`${currentUser.uid}/${dayTimestamp}/${category}/${todo.key}`)
            .update({
                createdAt: determinedCreatedAtDate,
                isChecked: false,
                key: todo.key,
                value: todo.value,
                isRepeating: true,
                repeatingOnWeekDays: repeatingDaysOfWeekString,
                repeatingOnMonthDays: repeatingDaysOMonthString
            })
            .catch(err => {
                console.error(err);
            });
    };

    handleRepeatEveryDayCheckbox = () => {
        this.setState({
            isRepeatingEveryDay: !this.state.isRepeatingEveryDay,
            selectedMonthDays: [],
            selectedWeekDays: daysOfWeekArr
        });
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
            isRepeatingEveryDay,
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
                                <Checkbox
                                    label={"Repeat every day"}
                                    checked={isRepeatingEveryDay}
                                    onChange={this.handleRepeatEveryDayCheckbox}
                                />
                            </Grid.Row>
                            <Grid.Row
                                as={Segment}
                                className={
                                    isRepeatingEveryDay ? "disabled" : ""
                                }
                            >
                                <RepeatOptions
                                    selectedWeekDays={selectedWeekDays}
                                    selectedMonthDays={selectedMonthDays}
                                    handleDaysOfMonthDropdown={
                                        this.handleDaysOfMonthDropdown
                                    }
                                    handleDaysOfWeekDropdown={
                                        this.handleDaysOfWeekDropdown
                                    }
                                />
                            </Grid.Row>
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
