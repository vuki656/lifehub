import React from "react";
import firebase from "../../../../firebase/Auth";
import moment from "moment";

import { Popup, Grid, Input, Icon } from "semantic-ui-react";

import {
    isDayBeingSavedTo,
    changeTodoTextInFirebase
} from "../../../../helpers/Planner/Todo";

class EditTodoPopup extends React.Component {
    state = {
        todoRef: firebase.database().ref("todos"),
        currentUser: firebase.auth().currentUser,
        usersRef: firebase.database().ref("users"),
        newTodo: "",

        currentDay: this.props.currentDay,
        generateUntillDate: this.props.generateUntillDate,
        todo: this.props.todo,
        category: this.props.category
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
                this.handleRepeatingTodoTextUpdate(itteratingDate, todo);
            } else {
                changeTodoTextInFirebase(this.state, currentDay);
            }
        }
    };

    // Check if itterating date matches repeating month day or week day
    handleRepeatingTodoTextUpdate = (date, todo) => {
        if (
            isDayBeingSavedTo(date, todo.repeatingOnMonthDays, "Do") ||
            isDayBeingSavedTo(date, todo.repeatingOnWeekDays, "dddd")
        ) {
            changeTodoTextInFirebase(this.state, date);
        }
    };

    // Set the state value from user input
    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    render() {
        const { todo } = this.state;

        return (
            <Popup
                trigger={<Icon name={"pencil"} link={true} />}
                flowing
                onClose={this.handleTodoTextUpdate}
                on="click"
            >
                <Grid>
                    <Grid.Column>
                        <Grid.Row>
                            <Input
                                defaultValue={todo.value}
                                name={"newTodo"}
                                onChange={this.handleChange}
                            />
                        </Grid.Row>
                    </Grid.Column>
                </Grid>
            </Popup>
        );
    }
}

export default EditTodoPopup;
