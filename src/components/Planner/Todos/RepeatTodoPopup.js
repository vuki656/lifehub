import React from "react";
import firebase from "../../../firebase/Auth";
import moment from "moment";

import { Popup, Grid, Icon, Button, Dropdown } from "semantic-ui-react";

import { checkIfIsDayBeingSavedTo } from "../../../helpers/Planner/Todo";
import { getDayOnlyTimestamp } from "../../../helpers/Global";

import {
    todoRepeatTypes,
    daysOfWeek
} from "../../../data/Planner/RepeatingTodoDropdownOptions";

class RepeatTodoPopup extends React.Component {
    state = {
        isPopOpen: false,
        typeOfRepeating: "",
        todoRef: firebase.database().ref("todos"),
        currentUser: firebase.auth().currentUser,

        selectedWeekDays: this.props.todo.repeatingOn.split(","),
        category: this.props.category,
        generateUntillDate: this.props.generateUntillDate,
        todo: this.props.todo,
        currentDay: this.props.currentDay
    };

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
        if (todo.repeatingOn) {
            this.handleRepeatingTodoUpdate(this.state);
        } else {
            switch (typeOfRepeating) {
                case "every-day":
                    this.handleSaveRepeatingTodoEveryday(this.state);
                    break;
                case "every-x-day-of-week":
                    this.handleSaveRepeatingTodoDaysOfWeek(this.state);
                    break;
                default:
                    break;
            }
        }

        this.closePopup();
    };

    // Save repeating todo to every day in firebase
    handleSaveRepeatingTodoEveryday = ({ generateUntillDate }) => {
        for (
            let startDate = moment();
            startDate.isBefore(moment(generateUntillDate).add(1, "day"));
            startDate.add(1, "days")
        ) {
            let dayTimestamp = getDayOnlyTimestamp(startDate);
            this.saveRepeatingTodo(this.state, dayTimestamp);
        }
    };

    // Save repeating todo to selected days of week
    handleSaveRepeatingTodoDaysOfWeek = ({
        generateUntillDate,
        selectedWeekDays
    }) => {
        for (
            let startDate = moment();
            startDate.isBefore(moment(generateUntillDate).add(1, "day"));
            startDate.add(1, "days")
        ) {
            if (checkIfIsDayBeingSavedTo(startDate, selectedWeekDays)) {
                let dayTimestamp = getDayOnlyTimestamp(startDate);
                this.saveRepeatingTodo(this.state, dayTimestamp);
            }
        }
    };

    saveRepeatingTodo = (
        { todoRef, currentUser, category, todo, currentDay, selectedWeekDays },
        dayTimestamp
    ) => {
        let repeatingDaysString = selectedWeekDays.toString();

        todoRef
            .child(`${currentUser.uid}/${dayTimestamp}/${category}/${todo.key}`)
            .update({
                createdAt: currentDay,
                isChecked: false,
                key: todo.key,
                value: todo.value,
                isRepeating: true,
                repeatingOn: repeatingDaysString
            })
            .catch(err => {
                console.error(err);
            });
    };

    // Send reminder object to firebase
    handleRepeatingTodoUpdate = ({
        generateUntillDate,
        todo,
        selectedWeekDays
    }) => {
        // Save new reminder in each day from date range
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

            if (checkIfIsDayBeingSavedTo(dayTimestamp, selectedWeekDays)) {
                this.updateRepeatingTodo(this.state, dayTimestamp);
            } else {
                this.deleteRepeatingTodo(this.state, dayTimestamp);
            }
        }
        this.closePopup();
    };

    // Update repeating todos days that its repeated on in each day its active
    updateRepeatingTodo = (
        { todo, todoRef, category, currentUser, selectedWeekDays },
        dayTimestamp
    ) => {
        // Convert selected week days array to string
        let selectedWeekDaysString = selectedWeekDays.toString();

        todoRef
            .child(`${currentUser.uid}/${dayTimestamp}/${category}/${todo.key}`)
            .update({
                repeatingOn: selectedWeekDaysString,
                value: todo.value,
                isChecked: false,
                key: todo.key,
                createdAt: todo.createdAt,
                isRepeating: todo.isRepeating
            })
            .catch(err => {
                console.error(err);
            });
    };

    // Delete repeating todo from firebase
    deleteRepeatingTodo = (
        { todoRef, currentUser, todo, category },
        dayTimestamp
    ) => {
        todoRef
            .child(`${currentUser.uid}/${dayTimestamp}/${category}/${todo.key}`)
            .remove()
            .catch(err => {
                console.error(err);
            });
    };

    // Set the repeaeting todo type to state
    handleDropdownChange = (event, value) => {
        this.setState({ typeOfRepeating: value.value });
    };

    // Set selected days of week to state
    handleDaysOfWeekDropdown = (event, value) => {
        this.setState({ selectedWeekDays: value.value });
    };

    closePopup = () => {
        this.setState({ isPopOpen: false });
    };

    openPopup = () => {
        this.setState({ isPopOpen: true });
    };

    render() {
        const { isPopOpen, typeOfRepeating, selectedWeekDays } = this.state;

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
                                <Grid.Row>
                                    <Dropdown
                                        placeholder="Select Days"
                                        fluid
                                        multiple
                                        selection
                                        value={selectedWeekDays}
                                        options={daysOfWeek}
                                        onChange={this.handleDaysOfWeekDropdown}
                                    />
                                </Grid.Row>
                            )}
                            <Grid.Row>
                                <Button onClick={this.handleRepeatingTodoSave}>
                                    Save
                                </Button>
                            </Grid.Row>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Popup>
        );
    }
}

export default RepeatTodoPopup;
