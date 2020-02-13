// Object Imports
import React from "react";
import firebase from "firebase";

// Destructured Imports
import { Grid, Checkbox, FormControlLabel } from "@material-ui/core";
import { connect } from "react-redux";

// Component Imports
import EditTodoNameButton from "../../Dialogs/EditTodoNameButton";
import RepeatTodoButton from "./TodoList/Todo/Buttons/RepeatTodoButton/RepeatTodoButton";
import PushToTomorrowButton from "../../Buttons/PushToTomorrowButton";
import DeleteTodoButton from "../../Buttons/DeleteTodoButton";

class CardTodo extends React.Component {
    state = {
        // Firebase
        currentUser: firebase.auth().currentUser,
        todoRef: firebase.database().ref("todos"),

        // Props
        todo: this.props.todo,
        category: this.props.category,
        isChecked: this.props.isChecked,

        // Redux Props
        currentDay: this.props.currentDay
    };

    static getDerivedStateFromProps(props) {
        return {
            todo: props.todo,
            isChecked: props.todo.isChecked,
            category: props.category,
            currentDay: props.currentDay
        };
    }

    // Send changed todo checkbox state to firebase and re-render
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
                `${currentUser.uid}/${currentDay}/categories/${category}/${todo.key}`
            )
            .update({ isChecked: !isChecked })
            .catch(error => console.error(error));
    };

    render() {
        const { todo, isChecked, category } = this.state;

        return (
            <Grid
                container
                direction="row"
                justify="space-between"
                alignItems="center"
            >
                <Grid item xs={8}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={isChecked}
                                onChange={() =>
                                    this.handleTodoCheckboxChange(this.state)
                                }
                            />
                        }
                        label={todo.text}
                    />
                </Grid>
                <Grid
                    container
                    item
                    direction="row"
                    justify="flex-end"
                    alignItems="center"
                    xs={4}
                >
                    <PushToTomorrowButton todo={todo} category={category} />
                    <EditTodoNameButton todo={todo} category={category} />
                    <RepeatTodoButton todo={todo} category={category} />
                    <DeleteTodoButton todo={todo} category={category} />
                </Grid>
            </Grid>
        );
    }
}

const mapStateToProps = state => ({
    currentDay: state.planner.currentDay
});

export default connect(mapStateToProps, null)(CardTodo);
