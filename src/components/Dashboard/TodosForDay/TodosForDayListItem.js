// Object Imports
import React from "react";
import firebase from "../../../firebase/Auth";
import moment from "moment";

// Destructured Imports
import { List } from "semantic-ui-react";

// Helper Imports
import { getDayOnlyTimestamp } from "../../../helpers/Global";

class TodosForDayCard extends React.Component {
    state = {
        todoRef: firebase.database().ref("todos"),
        categoryRef: firebase.database().ref("todo-cards"),
        currentUser: firebase.auth().currentUser,
        currentDay: getDayOnlyTimestamp(moment()),
        totalTodos: null,
        totalCheckedTodos: null,
        categoryName: "",

        // Props
        category: this.props.category
    };

    componentDidMount() {
        this.fetchCategoryTodoCount(this.state);
        this.fectCategoryName(this.state);
    }

    // Get todo count from firebase
    fetchCategoryTodoCount = ({
        todoRef,
        currentUser,
        currentDay,
        category
    }) => {
        todoRef
            .child(`${currentUser.uid}/${currentDay}/count/${category}`)
            .on("value", counts => {
                if (counts.exists()) {
                    let totalTodos = counts.val().total;
                    let totalCheckedTodos = counts.val().checked;

                    this.setState({ totalTodos, totalCheckedTodos });
                } else {
                    this.setState({ totalTodos: 0, totalCheckedTodos: 0 });
                }
            });
    };

    // Get category name by ID from firebase
    fectCategoryName = ({ categoryRef, currentUser, category }) => {
        categoryRef
            .child(`${currentUser.uid}/${category}`)
            .once("value", category => {
                this.setState({ categoryName: category.val().name });
            });
    };

    render() {
        const { totalTodos, totalCheckedTodos, categoryName } = this.state;

        return (
            <List.Item>
                <List.Content floated="right">
                    {`${totalCheckedTodos}/${totalTodos}`}
                </List.Content>
                <List.Content>{categoryName}</List.Content>
            </List.Item>
        );
    }
}

export default TodosForDayCard;
