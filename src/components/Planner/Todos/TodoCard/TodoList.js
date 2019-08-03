// Object Imports
import React from "react";
import firebase from "../../../../firebase/Auth";

// Destructured Imports
import { Grid } from "semantic-ui-react";
import { connect } from "react-redux";

// Component Imports
import Todo from "./Todo";

class TodoList extends React.Component {
    // Used to prevent setState calls after component umounts
    _isMounted = false;

    state = {
        todoList: [],
        todoRef: firebase.database().ref("todos"),
        currentUser: firebase.auth().currentUser,

        // Redux Props
        currentDay: this.props.currentDay
    };

    static getDerivedStateFromProps(props) {
        return {
            currentDay: props.currentDay,
            todoCard: props.todoCard
        };
    }

    componentDidMount() {
        this._isMounted = true;
        this.fetchTodos(this.state);
        this.addListeners();
    }

    componentWillUnmount() {
        this.removeListeners(this.state);
        this._isMounted = false;
    }

    // Turn off db connections
    removeListeners = ({ todoRef, currentUser, currentDay }) => {
        todoRef.child(`${currentUser.uid}/${currentDay}/`).off();
    };

    // Listen for db changes
    addListeners = () => {
        this.addSetTodoListener(this.state);
        this.addRemoveTodoListener(this.state);
        this.addChangeTodoListener(this.state);
    };

    // Listen for new todo inputs and set to the state so component re-renders
    addSetTodoListener({ currentUser, todoRef, currentDay, todoCard }) {
        todoRef
            .child(
                `${currentUser.uid}/${currentDay}/categories/${todoCard.key}`
            )
            .on("child_added", () => {
                this.fetchTodos(this.state);
            });
    }

    // Listen for todo deletions
    addRemoveTodoListener = ({
        todoRef,
        currentUser,
        currentDay,
        todoCard
    }) => {
        todoRef
            .child(
                `${currentUser.uid}/${currentDay}/categories/${todoCard.key}`
            )
            .on("child_removed", () => {
                this.fetchTodos(this.state);
            });
    };

    // Listen for reminder deletions
    addChangeTodoListener = ({ todoRef, currentUser, currentDay }) => {
        todoRef
            .child(`${currentUser.uid}/${currentDay}`)
            .on("child_changed", () => {
                this.fetchTodos(this.state);
            });
    };

    // Fetches todos from firebase
    fetchTodos = ({ currentUser, todoRef, todoCard, currentDay }) => {
        let todoHolder = [];

        todoRef
            .child(
                `${currentUser.uid}/${currentDay}/categories/${todoCard.key}`
            )
            .on("value", todo => {
                todo.forEach(todo => {
                    let key = todo.val().key;
                    let text = todo.val().text;
                    let isChecked = todo.val().isChecked;
                    let createdAt = todo.val().createdAt;
                    let isRepeating = todo.val().isRepeating;
                    let repeatingOnWeekDays = todo.val().repeatingOnWeekDays;
                    let repeatingOnMonthDays = todo.val().repeatingOnMonthDays;
                    let repeatAtStartOfMonth = todo.val().repeatAtStartOfMonth;
                    let repeatAtEndOfMonth = todo.val().repeatAtEndOfMonth;
                    let repeatFromDate = todo.val().repeatFromDate;

                    todoHolder.push({
                        text,
                        isChecked,
                        key,
                        createdAt,
                        isRepeating,
                        repeatingOnWeekDays,
                        repeatingOnMonthDays,
                        repeatAtStartOfMonth,
                        repeatAtEndOfMonth,
                        repeatFromDate
                    });
                });
            });

        if (this._isMounted) {
            this.setState({ todoList: todoHolder });
        }
    };

    // Render todos to the screen
    renderTodos = ({ todoList, todoCard }) =>
        todoList.map(todo => (
            <Grid.Row key={todo.key}>
                <Todo
                    todo={todo}
                    category={todoCard.key}
                    isChecked={todo.isChecked}
                    key={todo.key}
                />
            </Grid.Row>
        ));

    render() {
        return <React.Fragment>{this.renderTodos(this.state)}</React.Fragment>;
    }
}

const mapStateToProps = state => ({
    currentDay: state.planner.currentDay
});

export default connect(
    mapStateToProps,
    null
)(TodoList);
