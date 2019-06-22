import React from "react";
import moment from "moment";

import { Grid, Header, Segment } from "semantic-ui-react";

import { getDayOnlyTimestamp } from "../../helpers/Global";

import TodoCard from "./Todos/TodoCard";
import Reminders from "./Reminders/Reminders";

class TaskArea extends React.Component {
    render() {
        const { currentDay } = this.props;

        // Checks if day is in the past, if yes disable editing of todos
        let isInPast = moment(currentDay).isBefore(
            getDayOnlyTimestamp(moment())
        )
            ? true
            : false;

        return (
            <Grid as={Segment} disabled={isInPast}>
                <Grid.Row>
                    <Header>
                        {moment(currentDay).format("DD/MM/YYYY - dddd")}
                    </Header>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column width={13}>
                        <Grid>
                            <Grid.Row columns={"equal"}>
                                <Grid.Column>
                                    <p>Morning</p>
                                    <TodoCard
                                        category={"morning"}
                                        currentDay={currentDay}
                                    />
                                </Grid.Column>
                                <Grid.Column>
                                    <p>Day</p>
                                    <TodoCard
                                        category={"day"}
                                        currentDay={currentDay}
                                    />
                                </Grid.Column>
                                <Grid.Column>
                                    <p>Evening</p>
                                    <TodoCard
                                        category={"evening"}
                                        currentDay={currentDay}
                                    />
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row columns={"equal"}>
                                <Grid.Column>
                                    <p>Work</p>
                                    <TodoCard
                                        category={"work"}
                                        currentDay={currentDay}
                                    />
                                </Grid.Column>
                                <Grid.Column>
                                    <p>Misc</p>
                                    <TodoCard
                                        category={"misc"}
                                        currentDay={currentDay}
                                    />
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Grid.Column>
                    <Grid.Column width={3}>
                        <Reminders currentDay={currentDay} />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }
}

export default TaskArea;
