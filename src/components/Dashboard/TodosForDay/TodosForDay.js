// Object Imports
import React from "react";
import firebase from "../../../firebase/Auth";
import moment from "moment";

// Destructured Imports
import { Box, Grid } from "@material-ui/core";

// Component Imports
import TodosForDayCard from "./TodosForDayCard";
import TodosForDayCount from "./TodosForDayCount";

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

    // Activate database listeners
    addListeners = () => {
        this.addSetCategoryListener(this.state);
        this.addRemoveCategoryListener(this.state);
        this.addChangeCategoryListener(this.state);
    };

    // Deactivate database listeners
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

    // Render category list
    renderCategoryList = ({ categories }) =>
        categories.map(category => (
            <TodosForDayCard category={category} key={category} />
        ));

    render() {
        return (
            <Box>
                <TodosForDayCount day={getDayOnlyTimestamp(moment())} />
                <Grid container spacing={3}>
                    {this.renderCategoryList(this.state)}
                </Grid>
            </Box>
        );
    }
}

export default TodosForDay;
