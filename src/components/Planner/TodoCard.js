import React from "react";
import firebase from "firebase";

import { Checkbox, Grid, Button, Form, Table } from "semantic-ui-react";

class TodoCard extends React.Component {
    state = {
        todo: "",
        todoList: [],
        category: this.props.category,
        todoRef: firebase.database().ref("todos"),
        currentUser: firebase.auth().currentUser,
        dbRef: firebase.database().ref(),
        currentDay: this.props.currentDay,
        monthObjectList: this.props.monthObjectList
    };

    componentDidMount() {
        this.fetchTodos();
        this.addTodoListener(this.state);
    }

    // Listen for new todo inputs and set the to state so componenet re-renders
    addTodoListener({ currentUser, dbRef, currentDay, category }) {
        let todoHolder = [];

        dbRef
            .child(`todos/${currentUser.uid}/${currentDay}/${[category]}`)
            .on("child_added", snapshot => {
                let todo = snapshot.val();
                todoHolder.push(todo);
                this.setState({ todoList: todoHolder });
            });
    }

    // Set the state value from user input
    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    handleSubmit = () => {
        const { todo, category, currentUser, todoRef, currentDay } = this.state;

        if (todo) {
            todoRef
                .child(`${currentUser.uid}/${currentDay}/${[category]}`)
                .push(todo)
                .catch(err => {
                    console.error(err);
                });
            this.clearForm();
        }
    };

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
                    let todo = child.val();
                    todoHolder.push(todo);
                });

                // Update the state with new todo list
                this.setState({ todoList: todoHolder });
            });
    };

    // Render todo checkboxes
    renderTodos = () => {
        const { todoList } = this.state;

        return todoList.map((todo, index) => (
            <Grid.Row key={index}>
                <Checkbox label={todo} />
            </Grid.Row>
        ));
    };

    render() {
        const { todo } = this.state;

        return (
            <Grid>
                <Grid.Column>
                    {this.renderTodos()}
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
