// Object Imports
import React from "react";
import firebase from "../../../../firebase/Auth";
import moment from "moment";

// Destructured Imports
import { Popup, Input, Icon, Button, Grid } from "semantic-ui-react";
import { connect } from "react-redux";

// Helper Imports
import { getDayOnlyTimestamp } from "../../../../helpers/Global";
import { isDayBeingSavedTo } from "../../../../helpers/Planner/Todo";

class EditTodoPopup extends React.Component {
    state = {
        todoRef: firebase.database().ref("todos"),
        currentUser: firebase.auth().currentUser,
        usersRef: firebase.database().ref("users"),
        newTodo: "",
        isPopOpen: false,

        todo: this.props.todo,
        category: this.props.category,

        // Redux Props
        currentDay: this.props.currentDay,
        generateUntillDate: this.props.generateUntillDate
    };

    static getDerivedStateFromProps(props) {
        return {
            todo: props.todo,
            generateUntillDate: props.generateUntillDate,
            category: props.category
        };
    }

    /*  Itterate trough all days
        If todo is repeaeting, update wherever its active
        If todo not repeating, update its single instance
    */
    handleTodoTextUpdate = () => {
        const { todo, generateUntillDate, currentDay } = this.state;

        for (
            let itteratingDate = moment(todo.createdAt);
            itteratingDate.isBefore(moment(generateUntillDate).add(1, "day"));
            itteratingDate.add(1, "days")
        ) {
            if (todo.isRepeating) {
                this.handleRepeatingTodoTextUpdate(
                    this.state,
                    itteratingDate,
                    todo,
                    itteratingDate
                );
            } else {
                this.changeTodoTextInFirebase(this.state, currentDay);
            }
        }

        this.closePopup();
    };

    // Check if itterating date matches repeating month day or week day
    handleRepeatingTodoTextUpdate = (
        { repeatAtStartOfMonth, repeatAtEndOfMonth },
        date,
        todo,
        itteratingDate
    ) => {
        let dayTimestamp = getDayOnlyTimestamp(itteratingDate);

        let startOfMonth = repeatAtStartOfMonth
            ? getDayOnlyTimestamp(moment(itteratingDate).startOf("month"))
            : "";
        let endOfMonth = repeatAtEndOfMonth
            ? getDayOnlyTimestamp(moment(itteratingDate).endOf("month"))
            : "";

        if (
            isDayBeingSavedTo(date, todo.repeatingOnMonthDays, "Do") ||
            isDayBeingSavedTo(date, todo.repeatingOnWeekDays, "dddd") ||
            startOfMonth === dayTimestamp ||
            endOfMonth === dayTimestamp
        ) {
            this.changeTodoTextInFirebase(this.state, date);
        }
    };

    changeTodoTextInFirebase = (
        { todo, todoRef, category, currentUser, newTodo },
        date
    ) => {
        let dayTimestamp = getDayOnlyTimestamp(date);

        if (newTodo !== "") {
            todoRef
                .child(
                    `${
                        currentUser.uid
                    }/${dayTimestamp}/categories/${category}/${todo.key}`
                )
                .update({ text: newTodo })
                .catch(err => {
                    console.error(err);
                });
        }
    };

    openPopup = () => {
        this.setState({ isPopOpen: true });
    };

    closePopup = () => {
        this.setState({ isPopOpen: false });
    };

    // Set the state value from user input
    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    render() {
        const { todo, isPopOpen } = this.state;

        return (
            <Popup
                className="edit-todo-name-popup"
                basic
                trigger={
                    <Icon
                        name={"edit"}
                        link={true}
                        onClick={this.openPopup}
                        className="todo-card-icon"
                    />
                }
                flowing
                open={isPopOpen}
                on="click"
            >
                <Grid className="pad-all-1-rem">
                    <Grid.Row className="pad-top-bot-0">
                        <span className="edit-todo-name-popup-title">
                            Enter a New Name
                        </span>
                    </Grid.Row>
                    <Grid.Row className="pad-top-bot-0">
                        <Input
                            className="edit-todo-name-popup-input"
                            defaultValue={todo.text}
                            name={"newTodo"}
                            onChange={this.handleChange}
                        />
                    </Grid.Row>
                    <Grid.Row className="pad-top-bot-0">
                        <Button.Group>
                            <Button
                                className="main-button"
                                onClick={this.handleTodoTextUpdate}
                            >
                                Save
                            </Button>
                            <Button
                                className="secondary-button"
                                onClick={this.closePopup}
                            >
                                Cancel
                            </Button>
                        </Button.Group>
                    </Grid.Row>
                </Grid>
            </Popup>
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
)(EditTodoPopup);
