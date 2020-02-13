// Object Imports
import React from "react";
import firebase from "../../../../helpers/firebase/Auth";

// Destructured Imports
import { Grid } from "@material-ui/core";
import { connect } from "react-redux";

// Component Imports
import Todo from "./CardTodo";

class CardTodoList extends React.Component {
    // Used to prevent setState calls after component umounts
    _isMounted = false;

    state = {
        // Firebase
        currentUser: firebase.auth().currentUser,
        todoRef: firebase.database().ref("todos"),

        // Base
        todoList: [],

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
        this.activateListeners();
    }

    componentWillUnmount() {
        this.deactivateListeners();
        this._isMounted = false;
    }

    // Activate database listeners
    activateListeners = () => {
        this.activateSetTodoListener(this.state);
        this.activateRemoveTodoListener(this.state);
        this.activateChangeTodoListener(this.state);
    };

    // Deactivate database listeners
    deactivateListeners = () => {
        this.deactivateTodoListener = this.state;
    };

    // Deactivate todo ref listener
    deactivateTodoListener = ({ todoRef, currentUser, currentDay }) => {
        todoRef.child(`${currentUser.uid}/${currentDay}/`).off();
    };

    // Listen for new todo inputs and set to the state so component re-renders
    activateSetTodoListener({ currentUser, todoRef, currentDay, todoCard }) {
        todoRef
            .child(
                `${currentUser.uid}/${currentDay}/categories/${todoCard.key}`
            )
            .on("child_added", () => {
                this.fetchTodos(this.state);
            });
    }

    // Listen for todo deletions
    activateRemoveTodoListener = ({
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

    // Listen for todo deletions
    activateChangeTodoListener = ({ todoRef, currentUser, currentDay }) => {
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

        this._isMounted && this.setState({ todoList: todoHolder });
    };

    // Render todos to the screen
    renderTodos = ({ todoList, todoCard }) =>
        todoList.map(todo => (
            <Grid item xs={12} key={todo.key}>
                <Todo
                    todo={todo}
                    category={todoCard.key}
                    isChecked={todo.isChecked}
                    key={todo.key}
                />
            </Grid>
        ));

    render() {
        return (
            <Grid
                container
                direction="column"
                justify="flex-start"
                alignItems="stretch"
            >
                {this.renderTodos(this.state)}
            </Grid>
        );
    }
}

const mapStateToProps = state => ({
    currentDay: state.planner.currentDay
});

export default connect(mapStateToProps, null)(CardTodoList);
