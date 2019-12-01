// Object Imports
import React from "react";
import firebase from "../../../../firebase/Auth";
import moment from "moment";

// Destructured Imports
import {
    Input,
    InputAdornment,
    IconButton,
    FormControl
} from "@material-ui/core";
import { connect } from "react-redux";

// Icon Imports
import AddIcon from "@material-ui/icons/Add";

// Helper Imports
import { getDayOnlyTimestamp } from "../../../../helpers/Global";

class AddTodoInput extends React.Component {
    state = {
        // Firebase
        currentUser: firebase.auth().currentUser,
        todoRef: firebase.database().ref("todos"),

        // Base
        todoText: "",

        // Props
        todoCard: this.props.todoCard,

        // Redux Props
        currentDay: this.props.currentDay
    };

    static getDerivedStateFromProps(props) {
        return {
            currentDay: props.currentDay,
            todoCard: props.todoCard
        };
    }

    // Send added todo to firebase
    handleSubmit = () => {
        const {
            todoText,
            todoCard,
            currentUser,
            todoRef,
            currentDay
        } = this.state;
        const pushRef = todoRef.child(
            `${currentUser.uid}/${currentDay}/categories/${todoCard.key}`
        );
        let createdAt = getDayOnlyTimestamp(moment());

        // Pushes to firebase and then updates the fields
        if (todoText) {
            pushRef
                .push()
                .then(todo => {
                    pushRef.child(todo.key).update({
                        text: todoText,
                        isChecked: false,
                        key: todo.key,
                        createdAt,
                        isRepeating: false,
                        repeatingOnWeekDays: "",
                        repeatingOnMonthDays: "",
                        repeatAtEndOfMonth: false,
                        repeatAtStartOfMonth: false,
                        repeatFromDate: false
                    });
                })
                .then(this.clearForm())
                .catch(err => {
                    console.error(err);
                });
        }
    };

    // Set the state value from user input
    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    // Clear the input form for todo
    clearForm = () => {
        this.setState({ todoText: "" });
    };

    render() {
        const { todoText } = this.state;

        return (
            <FormControl fullWidth>
                <Input
                    name="todoText"
                    value={todoText}
                    type={"text"}
                    onChange={this.handleChange}
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton onClick={this.handleSubmit}>
                                <AddIcon />
                            </IconButton>
                        </InputAdornment>
                    }
                />
            </FormControl>
        );
    }
}

const mapStateToProps = state => ({
    currentDay: state.planner.currentDay
});

export default connect(mapStateToProps, null)(AddTodoInput);
