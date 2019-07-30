// Object Imports
import React from "react";
import firebase from "firebase";
import moment from "moment";

// Destructured Imports
import { Checkbox, Icon, Grid } from "semantic-ui-react";
import { connect } from "react-redux";

// Component Imports
import EditTodoNamePopup from "./Popups/EditTodoNamePopup";
import RepeatTodoPopup from "./Popups/RepeatTodoPopup";

// Helper Imports
import { deleteTodoFromFirebase } from "../../../helpers/Planner/Todo";
import { getDayOnlyTimestamp } from "../../../helpers/Global";

class Todo extends React.Component {
    state = {
        todoRef: firebase.database().ref("todos"),
        currentUser: firebase.auth().currentUser,

        todo: this.props.todo,
        category: this.props.category,
        isChecked: this.props.isChecked,

        // Redux Props
        currentDay: this.props.currentDay,
        generateUntillDate: this.props.generateUntillDate
    };

    static getDerivedStateFromProps(props) {
        return {
            todo: props.todo,
            isChecked: props.todo.isChecked,
            category: props.category,
            currentDay: props.currentDay,
            generateUntillDate: props.generateUntillDate
        };
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
            deleteTodoFromFirebase(
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
            deleteTodoFromFirebase(
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
            .child(
                `${currentUser.uid}/${currentDay}/categories/${category}/${
                    todo.key
                }`
            )
            .update({ isChecked: !isChecked })
            .catch(error => console.error(error));
    };

    render() {
        const { todo, isChecked, category } = this.state;

        return (
            <Grid>
                <Grid.Row className="todo-card-item">
                    <Grid.Column floated="left" width={10}>
                        <Checkbox
                            label={todo.text}
                            checked={isChecked}
                            onChange={() =>
                                this.handleTodoCheckboxChange(this.state)
                            }
                        />
                    </Grid.Column>
                    <Grid.Column floated="right" width={6}>
                        <EditTodoNamePopup todo={todo} category={category} />
                        <RepeatTodoPopup todo={todo} category={category} />
                        <Icon
                            name={"remove"}
                            link={true}
                            onClick={() => this.handleTodoDeletion(this.state)}
                            className="todo-card-icon"
                        />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }
}

const mapStateToProps = state => ({
    currentDay: state.planner.currentDay,
    generateUntillDate: state.planner.generateUntillDate
});

export default connect(
    mapStateToProps,
    null
)(Todo);
