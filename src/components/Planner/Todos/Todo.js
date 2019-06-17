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

            selectedWeekDays: this.props.todo.repeatingOn,
            todo: this.props.todo,
            currentDay: this.props.currentDay,
            category: this.props.category,
            isChecked: this.props.isChecked
        };

        this.checkIfIsDayBeingSavedTo = this.checkIfIsDayBeingSavedTo.bind(
            this
        );
    }

    static getDerivedStateFromProps(props) {
        return {
            todo: props.todo,
            isChecked: props.todo.isChecked,
            category: props.category,
            currentDay: props.currentDay
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

    // Check if itterating date is in selected week days
    // Used to determin in which days to save todo
    checkIfIsDayBeingSavedTo = (dateToCheck, selectedWeekDays) => {
        let dayOfWeek = moment(dateToCheck).format("dddd");

        if (selectedWeekDays.includes(dayOfWeek)) {
            return true;
        } else {
            return false;
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

    render() {
        const {
            todo,
            isChecked,
            category,
            generateUntillDate,
            currentDay
        } = this.state;

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
                    category={category}
                    currentDay={currentDay}
                    generateUntillDate={generateUntillDate}
                    checkIfIsDayBeingSavedTo={this.checkIfIsDayBeingSavedTo}
                />
                <RepeatTodoPopup
                    todo={todo}
                    category={category}
                    currentDay={currentDay}
                    generateUntillDate={generateUntillDate}
                    checkIfIsDayBeingSavedTo={this.checkIfIsDayBeingSavedTo}
                />
            </React.Fragment>
        );
    }
}

export default Todo;
