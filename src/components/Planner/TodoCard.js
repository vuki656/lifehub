import React from "react";
import firebase from "firebase";
import uuidv4 from "uuid";

import { Grid, Button, Form } from "semantic-ui-react";

import Todo from "./Todo";

class TodoCard extends React.Component {
    state = {
        todo: "",
        todoList: [],
        category: this.props.category,
        todoRef: firebase.database().ref("todos"),
        currentUser: firebase.auth().currentUser,
        dbRef: firebase.database().ref(),
        currentDay: this.props.currentDay,
        monthObjectList: this.props.monthObjectList,
        dataFetched: false
    };

    componentDidMount() {
        this.fetchTodos();
        this.addListeners();
    }

    addListeners = () => {
        this.addTodoListener(this.state);
        this.removeTodoListener(this.state);
    };

    // Listen for new todo inputs and set to the state so component re-renders
    addTodoListener({ currentUser, dbRef, currentDay, category }) {
        dbRef
            .child(`todos/${currentUser.uid}/${currentDay}/${[category]}`)
            .on("child_added", snapshot => {
                let todoHolder = {
                    value: snapshot.val().value,
                    checked: snapshot.val().checked,
                    key: snapshot.key
                };
                this.setState({
                    todoList: [...this.state.todoList, todoHolder]
                });
            });
    }

    // Listen for new todo deletions
    removeTodoListener = ({ dbRef, currentUser, currentDay, category }) => {
        dbRef
            .child(`todos/${currentUser.uid}/${currentDay}/${[category]}`)
            .on("child_removed", () => {
                this.fetchTodos();
            });
    };

    // Set the state value from user input
    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    // Send added todo to firebase
    handleSubmit = () => {
        const { todo, category, currentUser, todoRef, currentDay } = this.state;
        let pushRef = todoRef.child(
            `${currentUser.uid}/${currentDay}/${[category]}`
        );

        if (todo) {
            pushRef
                .push({ value: todo, checked: false })
                .then(snapshot => {
                    pushRef.child(snapshot.key).update({ key: snapshot.key });
                })
                .catch(err => {
                    console.error(err);
                });
            this.clearForm();
        }
    };

    // Clear the input form for todo
    clearForm = () => {
        this.setState({ todo: "" });
    };

    // Fetches todos from firebase
    fetchTodos = () => {
        const { currentUser, dbRef, category, currentDay } = this.state;
        let todoHolder = [];

        dbRef
            .child(`todos/${currentUser.uid}/${currentDay}/${category}`)
            .once("value", snapshot => {
                snapshot.forEach(child => {
                    let key = child.val().key;
                    let value = child.val().value;
                    let checked = child.val().checked;
                    todoHolder.push({ value, checked, key });
                });

                // Update the state with new todo list
                this.setState({ todoList: todoHolder, dataFetched: true });
            });
    };

    // Render todos to the screen
    // KEY IS NOT UNIQUE FOR SOME REASON
    renderTodos = () => {
        const { todoList, currentDay, category, uuidv4 } = this.state;
        // let key = uuidv4();

        return todoList.map(todo => (
            <Grid.Row key={todo.key}>
                <Todo todo={todo} currentDay={currentDay} category={category} />
            </Grid.Row>
        ));
    };

    render() {
        const { todo, dataFetched } = this.state;

        return (
            <Grid>
                <Grid.Column>
                    {/* Render todos when data has been fetched */}
                    {dataFetched && this.renderTodos()}
                    <Grid.Row>
                        <Form.Group widths="equal">
                            <Form.Input
                                name="todo"
                                value={todo}
                                placeholder="todo"
                                type="float"
                                onChange={this.handleChange}
                            />
                        </Form.Group>
                        <Button onClick={this.handleSubmit}>Submit</Button>
                    </Grid.Row>
                </Grid.Column>
            </Grid>
        );
    }
}

export default TodoCard;
