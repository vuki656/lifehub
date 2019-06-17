import React from "react";
import firebase from "firebase";
import moment from "moment";

import { Checkbox, Icon, Popup, Input, Grid, Button } from "semantic-ui-react";

import { getDayOnlyTimestamp } from "../../../helpers/Global";

class Todo extends React.Component {
    state = {
        todoRef: firebase.database().ref("todos"),
        currentUser: firebase.auth().currentUser,
        usersRef: firebase.database().ref("users"),
        generateUntillDate: null,
        isPopOpen: false,

        todo: this.props.todo,
        currentDay: this.props.currentDay,
        category: this.props.category,
        isChecked: this.props.isChecked
    };

    // Get parent props -> causes re-render
    static getDerivedStateFromProps(props) {
        return {
            todo: props.todo,
            isChecked: props.todo.isChecked
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

    // Set the state value from user input
    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    // Send edited todo text to firebase and rerender
    handleTodoTextChange = ({
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

    // Fetch date to generate months untill from firebase
    // Used to determin untill when to set repeating todos
    getGenerateUntillDate = ({ usersRef, currentUser }) => {
        usersRef.child(currentUser.uid).once("value", snapshot => {
            this.setState({
                generateUntillDate: snapshot.val().generateUntill
            });
        });
    };

    // Save repeating todo in firebase untill end date
    saveRepeatedTodo = ({ todo, generateUntillDate }) => {
        for (
            let startDate = moment();
            startDate.isBefore(moment(generateUntillDate).add(1, "day"));
            startDate.add(1, "days")
        ) {
            let dayTimestamp = getDayOnlyTimestamp(startDate);
            this.addRepeatingTodo(this.state, dayTimestamp, todo.key);
        }
        this.closePopup();
    };

    closePopup = () => {
        this.setState({ isPopOpen: false });
    };

    openPopup = () => {
        this.setState({ isPopOpen: true });
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

    // Save single repeating todo in firebase
    addRepeatingTodo = (
        { todoRef, currentUser, category, todo },
        dayTimestamp,
        key
    ) => {
        todoRef
            .child(`${currentUser.uid}/${dayTimestamp}/${category}/${key}`)
            .update({
                isChecked: false,
                key: key,
                value: todo.value,
                isRepeating: true
            })
            .catch(err => {
                console.error(err);
            });
    };

    handleDropdownChange = event => {
        let selectedOption = event.target.value;
    };

    render() {
        const { todo, isChecked, isPopOpen } = this.state;
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
                <Popup
                    trigger={<Icon name={"pencil"} link={true} />}
                    flowing
                    onClose={() => this.handleTodoTextChange(this.state)}
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
                <Popup
                    trigger={
                        <Icon
                            name={"repeat"}
                            link={true}
                            onClick={this.openPopup}
                        />
                    }
                    flowing
                    on="click"
                    open={isPopOpen}
                >
                    <p>How often to repeat it</p>
                    <select
                        defaultValue={0}
                        onChange={this.handleDropdownChange}
                    >
                        <option key={0} />
                        <option key={1} value={"every-day"}>
                            Every day
                        </option>
                    </select>
                    <Button onClick={() => this.saveRepeatedTodo(this.state)}>
                        Save
                    </Button>
                </Popup>
            </React.Fragment>
        );
    }
}

export default Todo;
