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
        selectedWeekDays: "",
        typeOfRepeating: "",
        todoRef: firebase.database().ref("todos"),
        currentUser: firebase.auth().currentUser,

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

    // Save repeating todo in firebase untill end date
    handleRepeatingTodoSave = () => {
        const {
            todo,
            generateUntillDate,
            typeOfRepeating,
            selectedWeekDays
        } = this.state;

        switch (typeOfRepeating) {
            case "every-day":
                this.saveRepeatingTodoEveryday(generateUntillDate, todo);
                break;
            case "every-x-day-of-week":
                this.saveRepeatingTodoDaysOfWeek(
                    generateUntillDate,
                    selectedWeekDays
                );
                break;
            default:
                break;
        }

        this.closePopup();
    };

    // Save repeating todo to every day in firebase
    saveRepeatingTodoEveryday = (generateUntillDate, todo) => {
        for (
            let startDate = moment();
            startDate.isBefore(moment(generateUntillDate).add(1, "day"));
            startDate.add(1, "days")
        ) {
            let dayTimestamp = getDayOnlyTimestamp(startDate);
            this.sendRepeatingTodoToFirebase(
                this.state,
                dayTimestamp,
                todo.key
            );
        }
    };

    // Save repeating todo to selected days of week
    saveRepeatingTodoDaysOfWeek = (generateUntillDate, selectedWeekDays) => {
        for (
            let startDate = moment();
            startDate.isBefore(moment(generateUntillDate).add(1, "day"));
            startDate.add(1, "days")
        ) {
            if (checkIfIsDayBeingSavedTo(startDate, selectedWeekDays)) {
                let dayTimestamp = getDayOnlyTimestamp(startDate);
                let repeatingDaysString = selectedWeekDays.toString();

                this.sendRepeatingTodoToFirebase(
                    this.state,
                    dayTimestamp,
                    repeatingDaysString
                );
            }
        }
    };

    // Save single repeating todo in firebase
    sendRepeatingTodoToFirebase = (
        { todoRef, currentUser, category, todo, currentDay },
        dayTimestamp,
        repeatingDaysString
    ) => {
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
        const { isPopOpen, typeOfRepeating } = this.state;

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
