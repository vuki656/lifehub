// Object Imports
import React from "react";
import firebase from "../../firebase/Auth";
import moment from "moment";

// Destructured Imports
import { Grid } from "semantic-ui-react";
import { connect } from "react-redux";

// Component Imports
import TodoCard from "./Todos/TodoCard/TodoCard";
import Reminders from "./Reminders/Reminders";
import AddTodoCard from "./Todos/TodoCard/AddTodoCard";

class TaskArea extends React.Component {
    state = {
        todoCardRef: firebase.database().ref("todo-cards"),
        currentUser: firebase.auth().currentUser,
        isInPast: false,
        todoCards: [],

        // Redux Props
        currentDay: this.props.currentDay
    };

    static getDerivedStateFromProps(props) {
        return {
            currentDay: props.currentDay
        };
    }

    componentDidMount() {
        this.addListeners();
        this.fetchTodoCards(this.state);
    }

    addListeners = () => {
        this.addTodoCardListener(this.state);
        this.addRemoveTodoCardListener(this.state);
    };

    // Listen for todo card additions
    addTodoCardListener = ({ currentUser, todoCardRef }) => {
        todoCardRef.child(currentUser.uid).on("child_added", () => {
            this.fetchTodoCards(this.state);
        });
    };

    // Listen for new todo card deletions
    addRemoveTodoCardListener = ({ currentUser, todoCardRef }) => {
        todoCardRef.child(currentUser.uid).on("child_removed", () => {
            this.fetchTodoCards(this.state);
        });
    };

    fetchTodoCards = ({ todoCardRef, currentUser }) => {
        let todoCardHolder = [];

        todoCardRef.child(currentUser.uid).once("value", todoCards => {
            todoCards.forEach(todoCard => {
                todoCardHolder.push({
                    name: todoCard.val().name,
                    key: todoCard.val().key
                });
            });
            this.setState({ todoCards: todoCardHolder });
        });
    };

    renderTodoCards = ({ todoCards }) =>
        todoCards.map(todoCard => (
            <TodoCard todoCard={todoCard} key={todoCard.key} />
        ));

    render() {
        const { currentDay } = this.state;

        return (
            <Grid className="task-area view-height">
                <Grid.Row className="task-area-header">
                    {moment(currentDay).format("DD/MM/YYYY - dddd")}
                </Grid.Row>
                <Grid.Row className="view-height">
                    <Grid.Column
                        className="todo-area view-height"
                        width={13}
                        stretched
                    >
                        <Grid>
                            <Grid.Row columns={3}>
                                {this.renderTodoCards(this.state)}
                                <AddTodoCard />
                            </Grid.Row>
                        </Grid>
                    </Grid.Column>
                    <Grid.Column width={3}>
                        <Reminders />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }
}

const mapStateToProps = state => ({
    currentDay: state.planner.currentDay
});

export default connect(
    mapStateToProps,
    null
)(TaskArea);
