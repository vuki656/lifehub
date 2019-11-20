// Object Imports
import React from "react";
import firebase from "../../../../firebase/Auth";

import { Card, CardContent, Typography } from "@material-ui/core";

class BestDayStreak extends React.Component {
    state = {
        todoRef: firebase.database().ref("todos"),
        currentUser: firebase.auth().currentUser,

        bestStreak: 0
    };

    render() {
        const { bestStreak } = this.state;

        return (
            <Card>
                <CardContent>
                    <Typography variant="h4" align="center">
                        {bestStreak}
                    </Typography>
                    <Typography variant="subtitle1" align="center">
                        Best Day Streak
                    </Typography>
                </CardContent>
            </Card>
        );
    }
}

export default BestDayStreak;
