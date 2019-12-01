// Object Imports
import React from "react";
import firebase from "../../../../firebase/Auth";

import { Card, CardContent, Typography } from "@material-ui/core";

class CurrentDayStreak extends React.Component {
    state = {
        // Firebase
        currentUser: firebase.auth().currentUser,
        todoRef: firebase.database().ref("todos"),

        // Base
        currentStreak: 0
    };

    render() {
        const { currentStreak } = this.state;

        return (
            <Card>
                <CardContent>
                    <Typography variant="h4" align="center">
                        {currentStreak}
                    </Typography>
                    <Typography variant="subtitle1" align="center">
                        Current Day Streak
                    </Typography>
                </CardContent>
            </Card>
        );
    }
}

export default CurrentDayStreak;
