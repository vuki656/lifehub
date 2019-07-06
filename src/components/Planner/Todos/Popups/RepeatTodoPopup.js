// Object Imports
import React from "react";
import firebase from "../../../../firebase/Auth";
import moment from "moment";
import DatePicker from "react-datepicker";

// Destructured Imports
import {
    Popup,
    Grid,
    Icon,
    Button,
    Message,
    Checkbox,
    Segment
} from "semantic-ui-react";

// Component Imports
import RepeatOptions from "./RepeatOptions";

// Helper Imports
import {
    isDayBeingSavedTo,
    deleteTodoFromFirebase
} from "../../../../helpers/Planner/Todo";
import { getDayOnlyTimestamp } from "../../../../helpers/Global";

// Data Imports
import { daysOfWeekArr } from "../../../../data/StockData";

class RepeatTodoPopup extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isRepeatingEveryDay: false,
            isPopOpen: false,
            todoRef: firebase.database().ref("todos"),
            currentUser: firebase.auth().currentUser,

            repeatFromDate: this.props.todo.repeatFromDate,
            createdAt: this.props.todo.createdAt,
            repeatAtStartOfMonth: this.props.todo.repeatAtStartOfMonth,
            repeatAtEndOfMonth: this.props.todo.repeatAtEndOfMonth,
            selectedMonthDays: this.props.todo.repeatingOnMonthDays,
            selectedWeekDays: this.props.todo.repeatingOnWeekDays,
            todo: this.props.todo,
            category: this.props.category,
            generateUntillDate: this.props.generateUntillDate,
            currentDay: this.props.currentDay
        };

        this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
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
                this.saveRepeatingTodo(this.state, daysOfWeekArr, createdAt);
            } else {
                this.saveRepeatingTodo(this.state, selectedWeekDays, createdAt);
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
            generateUntillDate,
            repeatAtEndOfMonth,
            repeatAtStartOfMonth
        },
        selectedWeekDays,
        todoCreatedAtDate
    ) => {
        for (
            let itteratingDate = moment();
            itteratingDate.isBefore(moment(generateUntillDate).add(1, "day"));
            itteratingDate.add(1, "days")
        ) {
            let dayTimestamp = getDayOnlyTimestamp(itteratingDate);

            // If start or end date are checked, use start/end date of month
            let startOfMonth = repeatAtStartOfMonth
                ? getDayOnlyTimestamp(moment(itteratingDate).startOf("month"))
                : "";
            let endOfMonth = repeatAtEndOfMonth
                ? getDayOnlyTimestamp(moment(itteratingDate).endOf("month"))
                : "";

            if (
                (isDayBeingSavedTo(itteratingDate, selectedMonthDays, "Do") ||
                    isDayBeingSavedTo(
                        itteratingDate,
                        selectedWeekDays,
                        "dddd"
                    ) ||
                    startOfMonth === dayTimestamp ||
                    endOfMonth === dayTimestamp) &&
                moment(itteratingDate).isAfter(todoCreatedAtDate)
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
        this.closePopup();
    };

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
            becasue todo.createdAt doesent exist
            When updating, exisiting createdAt from todo will
            be used as createdAt date
        */
        if (createdAt) {
            determinedCreatedAtDate = createdAt;
        } else {
            determinedCreatedAtDate = currentDay;
        }

        todoRef
            .child(
                `${currentUser.uid}/${dayTimestamp}/categories/${category}/${
                    todo.key
                }`
            )
            .update({
                createdAt: determinedCreatedAtDate,
                isChecked: false,
                key: todo.key,
                value: todo.value,
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

    handleRepeatFromDate = newRepeatFromDate => {
        this.setState({ createdAt: getDayOnlyTimestamp(newRepeatFromDate) });
    };

    // Reset all repeating options if
    handleRepeatEveryDayCheckbox = () => {
        this.setState({
            isRepeatingEveryDay: !this.state.isRepeatingEveryDay,
            selectedMonthDays: [],
            selectedWeekDays: daysOfWeekArr,
            repeatAtEndOfMonth: false,
            repeatAtStartOfMonth: false,
            createdAt: this.state.todo.createdAt,
            repeatFromDate: false
        });
    };

    // Set the state value from checkbox
    handleCheckboxChange = (event, value) => {
        this.setState({ [value.name]: value.checked });
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
            selectedMonthDays,
            repeatAtStartOfMonth,
            repeatAtEndOfMonth,
            repeatFromDate,
            createdAt
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
                                    repeatAtStartOfMonth={repeatAtStartOfMonth}
                                    repeatAtEndOfMonth={repeatAtEndOfMonth}
                                    handleCheckboxChange={
                                        this.handleCheckboxChange
                                    }
                                    handleDaysOfMonthDropdown={
                                        this.handleDaysOfMonthDropdown
                                    }
                                    handleDaysOfWeekDropdown={
                                        this.handleDaysOfWeekDropdown
                                    }
                                />
                            </Grid.Row>
                            <Grid.Row>
                                <Checkbox
                                    label={"Start repeating from certain date"}
                                    name={"repeatFromDate"}
                                    checked={repeatFromDate}
                                    onChange={this.handleCheckboxChange}
                                />
                                {repeatFromDate && (
                                    <DatePicker
                                        minDate={moment().toDate()}
                                        name={"createdAt"}
                                        selected={createdAt}
                                        onChange={this.handleRepeatFromDate}
                                    />
                                )}
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
                                    Todo repeating will start from today date
                                    <br /> no matter in which day you create it.
                                    If you want it to start repeating from
                                    <br /> certain date. Use the checkbox
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
