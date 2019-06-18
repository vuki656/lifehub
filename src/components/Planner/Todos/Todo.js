import React from "react";
import firebase from "firebase";
import moment from "moment";

import { Checkbox, Icon } from "semantic-ui-react";

import EditTodoPopup from "./Popups/EditTodoPopup";
import RepeatTodoPopup from "./Popups/RepeatTodoPopup";

import { deleteSingleNodeFromFirebase } from "../../../helpers/Planner/Todo";
import { getDayOnlyTimestamp } from "../../../helpers/Global";

class Todo extends React.Component {
    state = {
        todoRef: firebase.database().ref("todos"),
        currentUser: firebase.auth().currentUser,
        usersRef: firebase.database().ref("users"),
        generateUntillDate: null,

        todo: this.props.todo,
        currentDay: this.props.currentDay,
        category: this.props.category,
        isChecked: this.props.isChecked
    };

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
    handleTodoDeletion = ({
        todoRef,
        currentUser,
        currentDay,
        category,
        todo
    }) => {
        if (todo.isRepeating) {
            this.deleteRepeatingTodo(this.state);
        } else {
            deleteSingleNodeFromFirebase(
                todoRef,
                currentUser,
                currentDay,
                category,
                todo
            );
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
            deleteSingleNodeFromFirebase(
                todoRef,
                currentUser,
                dayTimestamp,
                category,
                todo
            );
        }
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
            .child(`${currentUser.uid}/${currentDay}/${category}/${todo.key}`)
            .update({ isChecked: !isChecked })
            .catch(error => console.error(error));
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
                />
                <RepeatTodoPopup
                    todo={todo}
                    category={category}
                    currentDay={currentDay}
                    generateUntillDate={generateUntillDate}
                />
            </React.Fragment>
        );
    }
}

export default Todo;
