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
        // Firebase
        currentUser: firebase.auth().currentUser,
        todoRef: firebase.database().ref("todos"),
        categoryRef: firebase.database().ref("todo-cards"),

        // Base
        currentDay: getDayOnlyTimestamp(moment()),
        categories: []
    };

    componentDidMount() {
        this._isMounted = true;
        this.fetchCategoryList(this.state);
        this.activateListeners();
    }

    componentWillUnmount() {
        this.deactivateListeners();
        this._isMounted = false;
    }

    // Activate database listeners
    activateListeners = () => {
        this.activateSetCategoryListener(this.state);
        this.activateRemoveCategoryListener(this.state);
        this.activateChangeCategoryListener(this.state);
    };

    // Deactivate database listeners
    deactivateListeners = () => {
        this.deactivateCategoryListener(this.state);
        this.deactivateTodoListener(this.state);
    };

    // Deactivate category ref listener
    deactivateCategoryListener = ({ categoryRef, currentUser }) => {
        categoryRef.child(`${currentUser.uid}`).off();
    };

    // Deactivate todo ref listener
    deactivateTodoListener = ({ todoRef, currentUser }) => {
        todoRef.child(`${currentUser.uid}`).off();
    };

    // Listen for new category adds
    activateSetCategoryListener({ currentUser, categoryRef }) {
        categoryRef.child(currentUser.uid).on("child_added", () => {
            this.fetchCategoryList(this.state);
        });
    }

    // Listen for new category deletions
    activateRemoveCategoryListener = ({ currentUser, categoryRef }) => {
        categoryRef.child(currentUser.uid).on("child_removed", () => {
            this.fetchCategoryList(this.state);
        });
    };

    // Listen for category changes
    activateChangeCategoryListener = ({ currentUser, categoryRef }) => {
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
            this._isMounted && this.setState({ categories: categoryDetails });
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
