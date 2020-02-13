// Object Imports
import React from "react";
import firebase from "../../../../helpers/firebase/Auth";
import moment from "moment";

// Destructured Imports
import { Grid, Card, CardContent, Typography } from "@material-ui/core";

// Helper Imports
import { getDayOnlyTimestamp } from "../../../../helpers/functions/Global";

class TodosForDayCard extends React.Component {
    // Used to prevent setState calls after component umounts
    _isMounted = false;

    state = {
        // Firebase
        currentUser: firebase.auth().currentUser,
        todoRef: firebase.database().ref("todos"),
        categoryRef: firebase.database().ref("todo-cards"),

        // Base
        currentDay: getDayOnlyTimestamp(moment()),
        totalTodos: null,
        totalCheckedTodos: null,
        categoryName: "",

        // Props
        category: this.props.category
    };

    componentDidMount() {
        this._isMounted = true;
        this.fetchCategoryTodoCount(this.state);
        this.fetchCategoryName(this.state);
    }

    componentWillMount() {
        this._isMounted = false;
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

                    this._isMounted &&
                        this.setState({ totalTodos, totalCheckedTodos });
                } else {
                    this._isMounted &&
                        this.setState({ totalTodos: 0, totalCheckedTodos: 0 });
                }
            });
    };

    // Get category name by ID from firebase
    fetchCategoryName = ({ categoryRef, currentUser, category }) => {
        categoryRef
            .child(`${currentUser.uid}/${category}`)
            .once("value", category => {
                this._isMounted &&
                    this.setState({ categoryName: category.val().name });
            });
    };

    render() {
        const { totalTodos, totalCheckedTodos, categoryName } = this.state;

        return (
            <Grid xs={3} item>
                <Card>
                    <CardContent>
                        <Typography variant="h4" align="center">
                            {`${totalCheckedTodos}/${totalTodos}`}
                        </Typography>
                        <Typography variant="subtitle1" align="center">
                            {categoryName}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
        );
    }
}

export default TodosForDayCard;
