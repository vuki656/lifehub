// Object Imports
import React from "react";
import moment from "moment";

// Destructured Imports
import { Grid, Header, Segment } from "semantic-ui-react";
import { connect } from "react-redux";

// Component Imports
import TodoCard from "./Todos/TodoCard";
import Reminders from "./Reminders/Reminders";

// Helper Imports
import { getDayOnlyTimestamp } from "../../helpers/Global";

class TaskArea extends React.Component {
    state = {
        isInPast: false,

        // Redux Props
        currentDay: this.props.currentDay
    };

    static getDerivedStateFromProps(props) {
        return {
            currentDay: props.currentDay
        };
    }

    componentDidMount() {
        this.checkIfShouldDisable(this.state);
    }

    // Checks if day is in the past, if yes disable editing of todos
    checkIfShouldDisable = ({ currentDay }) => {
        if (moment(currentDay).isBefore(getDayOnlyTimestamp(moment()))) {
            this.setState({ isInPast: true });
        } else {
            this.setState({ isInpast: false });
        }
    };

    render() {
        const { currentDay, isInPast } = this.state;

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
                                    <TodoCard category={"morning"} />
                                </Grid.Column>
                                <Grid.Column>
                                    <p>Day</p>
                                    <TodoCard category={"day"} />
                                </Grid.Column>
                                <Grid.Column>
                                    <p>Evening</p>
                                    <TodoCard category={"evening"} />
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row columns={"equal"}>
                                <Grid.Column>
                                    <p>Work</p>
                                    <TodoCard category={"work"} />
                                </Grid.Column>
                                <Grid.Column>
                                    <p>Misc</p>
                                    <TodoCard category={"misc"} />
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Grid.Column>
                    <Grid.Column width={3}>
                        <Reminders />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }
}

const mapStateToProps = state => ({
    currentDay: state.planner.currentDay
});

export default connect(
    mapStateToProps,
    null
)(TaskArea);
