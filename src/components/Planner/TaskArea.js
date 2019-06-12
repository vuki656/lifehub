import React from "react";

import { Grid } from "semantic-ui-react";

import TodoCard from "./TodoCard";
import Reminders from "./Reminders";

class TaskArea extends React.Component {
    state = {};

    render() {
        const { monthObjectList, currentDay } = this.props;

        return (
            <Grid>
                <Grid.Column width={13}>
                    <Grid>
                        <Grid.Row columns={"equal"}>
                            <Grid.Column>
                                <p>Morning</p>
                                <TodoCard
                                    category={"morning"}
                                    monthObjectList={monthObjectList}
                                    currentDay={currentDay}
                                />
                            </Grid.Column>
                            <Grid.Column>
                                <p>Day</p>
                                <TodoCard
                                    category={"day"}
                                    monthObjectList={monthObjectList}
                                    currentDay={currentDay}
                                />
                            </Grid.Column>
                            <Grid.Column>
                                <p>Evening</p>
                                <TodoCard
                                    category={"evening"}
                                    monthObjectList={monthObjectList}
                                    currentDay={currentDay}
                                />
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row columns={"equal"}>
                            <Grid.Column>
                                <p>Work</p>
                                <TodoCard
                                    category={"work"}
                                    monthObjectList={monthObjectList}
                                    currentDay={currentDay}
                                />
                            </Grid.Column>
                            <Grid.Column>
                                <p>Misc</p>
                                <TodoCard
                                    category={"misc"}
                                    monthObjectList={monthObjectList}
                                    currentDay={currentDay}
                                />
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Grid.Column>
                <Grid.Column width={3}>
                    <Reminders currentDay={currentDay} />
                </Grid.Column>
            </Grid>
        );
    }
}

export default TaskArea;
