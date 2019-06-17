import React from "react";
import firebase from "../../../firebase/Auth";
import moment from "moment";

import { Popup, Grid, Input, Icon } from "semantic-ui-react";

import { checkIfIsDayBeingSavedTo } from "../../../helpers/Planner/Todo";
import { getDayOnlyTimestamp } from "../../../helpers/Global";

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

    // Check if todo is repeating
    handleTodoTextUpdate = () => {
        const { todo } = this.state;
        if (todo.isRepeating) {
            this.changeRepeatingTodoText(this.state);
        } else {
            this.changeSingleTodoText(this.state);
        }
    };

    // Update repeating todos text value in each day its active
    changeRepeatingTodoText = ({
        todo,
        todoRef,
        category,
        generateUntillDate,
        currentUser,
        newTodo
    }) => {
        for (
            let startDate = moment(todo.createdAt);
            startDate.isBefore(moment(generateUntillDate).add(1, "day"));
            startDate.add(1, "days")
        ) {
            // Get selected week days string from firebase and convert to array
            let selectedWeekDaysList = todo.repeatingOn.split(",");

            if (checkIfIsDayBeingSavedTo(startDate, selectedWeekDaysList)) {
                let dayTimestamp = getDayOnlyTimestamp(startDate);
                todoRef
                    .child(
                        `${currentUser.uid}/${dayTimestamp}/${category}/${
                            todo.key
                        }`
                    )
                    .update({ value: newTodo })
                    .catch(err => {
                        console.error(err);
                    });
            }
        }
    };

    // Send edited todo text to firebase and rerender
    changeSingleTodoText = ({
        todoRef,
        currentDay,
        currentUser,
        category,
        todo,
        newTodo
    }) => {
        todoRef
            .child(`${currentUser.uid}/${currentDay}/${[category]}/${todo.key}`)
            .update({
                value: newTodo,
                key: todo.key
            })
            .catch(error => console.error(error));
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
