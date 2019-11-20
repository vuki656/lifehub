// Object Imports
import React from "react";
import firebase from "../../../../firebase/Auth";

import { Card, CardContent, Typography } from "@material-ui/core";

class totalCompletedTodos extends React.Component {
    state = {
        todoRef: firebase.database().ref("todos"),
        currentUser: firebase.auth().currentUser,

        totalCompletedHabits: 0
    };

    render() {
        const { totalCompletedHabits } = this.state;

        return (
            <Card>
                <CardContent>
                    <Typography variant="h4" align="center">
                        {totalCompletedHabits}
                    </Typography>
                    <Typography variant="subtitle1" align="center">
                        Total Completed Todos
                    </Typography>
                </CardContent>
            </Card>
        );
    }
}

export default totalCompletedTodos;
