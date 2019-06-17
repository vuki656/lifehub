import React from "react";
import firebase from "firebase";
import moment from "moment";

import { Checkbox, Icon } from "semantic-ui-react";

import EditTodoPopup from "./EditTodoPopup";
import RepeatTodoPopup from "./RepeatTodoPopup";

import { getDayOnlyTimestamp } from "../../../helpers/Global";

class Todo extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            todoRef: firebase.database().ref("todos"),
            currentUser: firebase.auth().currentUser,
            usersRef: firebase.database().ref("users"),
            generateUntillDate: null,
            isPopOpen: false,
            typeOfRepeating: "",
            selectedWeekDays: null,

            todo: this.props.todo,
            currentDay: this.props.currentDay,
            category: this.props.category,
            isChecked: this.props.isChecked
        };

        this.openPopup = this.openPopup.bind(this);
        this.closePopup = this.closePopup.bind(this);
        this.handleDropdownChange = this.handleDropdownChange.bind(this);
        this.handleDaysOfWeekDropdown = this.handleDaysOfWeekDropdown.bind(
            this
        );
        this.saveRepeatingTodo = this.saveRepeatingTodo.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleTodoTextChange = this.handleTodoTextChange.bind(this);
    }

    // Get parent props -> causes re-render
    static getDerivedStateFromProps(props) {
        return {
            todo: props.todo,
            isChecked: props.todo.isChecked
        };
    }

    componentDidMount() {
        this.getGenerateUntillDate(this.state);
    }

    // Check if todo is repeating, if so remove it from
    // each day, if not, remove its single instance
    handleTodoDeletion = ({ todo }) => {
        if (todo.isRepeating) {
            this.deleteRepeatingTodo(this.state);
        } else {
            this.deleteSingleTodo(this.state);
        }
    };

    // Remove todo in firebase
    deleteSingleTodo = ({
        currentDay,
        currentUser,
        todo,
        category,
        todoRef
    }) => {
        todoRef
            .child(`${currentUser.uid}/${currentDay}/${[category]}/${todo.key}`)
            .remove()
            .catch(error => console.error(error));
    };

    // Send edited todo text to firebase and rerender
    handleTodoTextChange = () => {
        const {
            todoRef,
            currentDay,
            currentUser,
            category,
            todo,
            newTodo
        } = this.state;

        todoRef
            .child(`${currentUser.uid}/${currentDay}/${[category]}/${todo.key}`)
            .update({
                value: newTodo,
                key: todo.key
            })
            .catch(error => console.error(error));
    };

    // Send changed todo checkbox state to firebase and rerender
    handleTodoCheckboxChange = ({
        todoRef,
        currentUser,
        currentDay,
        category,
        todo,
        isChecked
    }) => {
        todoRef
            .child(`${currentUser.uid}/${currentDay}/${[category]}/${todo.key}`)
            .update({ isChecked: !isChecked })
            .catch(error => console.error(error));
    };

    // Save repeating todo in firebase untill end date
    saveRepeatingTodo = () => {
        const {
            todo,
            generateUntillDate,
            typeOfRepeating,
            selectedWeekDays
        } = this.state;

        console.log(this.state);

        switch (typeOfRepeating) {
            case "every-day":
                this.saveRepeatingTodoEveryday(generateUntillDate, todo);
                break;
            case "every-x-day-of-week":
                this.saveRepeatingTodoDaysOfWeek(
                    generateUntillDate,
                    todo,
                    selectedWeekDays
                );
                break;
            default:
                break;
        }

        this.closePopup();
    };

    // Save repeating todo to selected days of week
    saveRepeatingTodoDaysOfWeek = (
        generateUntillDate,
        todo,
        selectedWeekDays
    ) => {
        for (
            let startDate = moment();
            startDate.isBefore(moment(generateUntillDate).add(1, "day"));
            startDate.add(1, "days")
        ) {
            if (this.checkIfIsDayBeingSavedTo(startDate, selectedWeekDays)) {
                let dayTimestamp = getDayOnlyTimestamp(startDate);
                this.sendRepeatingTodoToFirebase(
                    this.state,
                    dayTimestamp,
                    todo.key
                );
            }
        }
    };

    // Check if itterating date is in selected week days
    checkIfIsDayBeingSavedTo = (dateToCheck, selectedWeekDays) => {
        let dayOfWeek = moment(dateToCheck).format("dddd");

        if (selectedWeekDays.includes(dayOfWeek)) {
            return true;
        } else {
            return false;
        }
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

    // Save single repeating todo in firebase
    sendRepeatingTodoToFirebase = (
        { todoRef, currentUser, category, todo },
        dayTimestamp,
        key
    ) => {
        todoRef
            .child(`${currentUser.uid}/${dayTimestamp}/${category}/${key}`)
            .update({
                isChecked: false,
                key: key,
                value: todo.value,
                isRepeating: true
            })
            .catch(err => {
                console.error(err);
            });
    };

    // Delete repeating todo from firebase
    deleteRepeatingTodo = ({
        todoRef,
        currentUser,
        todo,
        generateUntillDate,
        category
    }) => {
        for (
            let startDate = moment(todo.createdAt);
            startDate.isBefore(moment(generateUntillDate).add(1, "day"));
            startDate.add(1, "days")
        ) {
            let dayTimestamp = getDayOnlyTimestamp(startDate);

            todoRef
                .child(
                    `${currentUser.uid}/${dayTimestamp}/${category}/${todo.key}`
                )
                .remove()
                .catch(err => {
                    console.error(err);
                });
        }
    };

    // Fetch date to generate months untill from firebase
    // Used to determin untill when to set repeating todos
    getGenerateUntillDate = ({ usersRef, currentUser }) => {
        usersRef.child(currentUser.uid).once("value", snapshot => {
            this.setState({
                generateUntillDate: snapshot.val().generateUntill
            });
        });
    };

    // Set the state value from user input
    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    // Set the repeaeting todo type to state
    handleDropdownChange = (event, value) => {
        console.log("first oen");
        this.setState({ typeOfRepeating: value.value });
    };

    // Set selected days of week to state
    handleDaysOfWeekDropdown = (event, value) => {
        console.log("daysofweek");
        this.setState({ selectedWeekDays: value.value });
    };

    closePopup = () => {
        this.setState({ isPopOpen: false });
    };

    openPopup = () => {
        this.setState({ isPopOpen: true });
    };

    render() {
        const { todo, isChecked, isPopOpen, typeOfRepeating } = this.state;

        return (
            <React.Fragment>
                <Checkbox
                    label={todo.value}
                    checked={isChecked}
                    onChange={() => this.handleTodoCheckboxChange(this.state)}
                />
                <Icon
                    name={"remove"}
                    link={true}
                    onClick={() => this.handleTodoDeletion(this.state)}
                />
                <EditTodoPopup
                    todo={todo}
                    handleTodoTextChange={this.handleTodoTextChange}
                    handleChange={this.handleChange}
                />
                <RepeatTodoPopup
                    isPopOpen={isPopOpen}
                    typeOfRepeating={typeOfRepeating}
                    saveRepeatingTodo={this.saveRepeatingTodo}
                    handleDropdownChange={this.handleDropdownChange}
                    handleDaysOfWeekDropdown={this.handleDaysOfWeekDropdown}
                />
            </React.Fragment>
        );
    }
}

export default Todo;
