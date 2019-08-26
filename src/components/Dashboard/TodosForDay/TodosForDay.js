// Object Imports
import React from "react";
import firebase from "../../../firebase/Auth";
import moment from "moment";

// Destructured Imports
import { List } from "semantic-ui-react";

// Component Imports
import TodosForDayListItem from "./TodosForDayListItem";

// Helper Imports
import { getDayOnlyTimestamp } from "../../../helpers/Global";

class TodosForDay extends React.Component {
    // Used to prevent setState calls after component umounts
    _isMounted = false;

    state = {
        todoRef: firebase.database().ref("todos"),
        categoryRef: firebase.database().ref("todo-cards"),
        currentUser: firebase.auth().currentUser,
        currentDay: getDayOnlyTimestamp(moment()),
        categories: []
    };

    componentDidMount() {
        this._isMounted = true;
        this.fetchCategoryList(this.state);
        this.addListeners();
    }

    componentWillUnmount() {
        this.removeListeners(this.state);
        this._isMounted = false;
    }

    addListeners = () => {
        this.addSetCategoryListener(this.state);
        this.addRemoveCategoryListener(this.state);
        this.addChangeCategoryListener(this.state);
    };

    removeListeners = ({ categoryRef, currentUser }) => {
        categoryRef.child(`${currentUser.uid}`).off();
    };

    // Listen for new category adds
    addSetCategoryListener({ currentUser, categoryRef }) {
        categoryRef.child(currentUser.uid).on("child_added", () => {
            this.fetchCategoryList(this.state);
        });
    }

    // Listen for new category deletions
    addRemoveCategoryListener = ({ currentUser, categoryRef }) => {
        categoryRef.child(currentUser.uid).on("child_removed", () => {
            this.fetchCategoryList(this.state);
        });
    };

    // Listen for category changes
    addChangeCategoryListener = ({ currentUser, categoryRef }) => {
        categoryRef.child(currentUser.uid).on("child_changed", () => {
            this.fetchCategoryList(this.state);
        });
    };

    // Fetch all categories active in that day
    fetchCategoryList = ({ categoryRef, currentUser }) => {
        let categoryDetails = [];
        categoryRef.child(currentUser.uid).on("value", categories => {
            categories.forEach(category => {
                categoryDetails.push(category.key);
            });
            this.setState({ categories: categoryDetails });
        });
    };

    renderCategoryList = ({ categories }) =>
        categories.map(category => (
            <TodosForDayListItem category={category} key={category} />
        ));

    render() {
        return (
            <List divided verticalAlign="middle">
                {this.renderCategoryList(this.state)}
            </List>
        );
    }
}

export default TodosForDay;
