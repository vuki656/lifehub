import React from "react";

import { Popup, Grid, Icon, Button, Dropdown } from "semantic-ui-react";

import {
    todoRepeatTypes,
    daysOfWeek
} from "../../../data/Planner/RepeatingTodoDropdownOptions";

class RepeatTodoPopup extends React.Component {
    state = {
        isPopOpen: this.props.isPopOpen,
        typeOfRepeating: this.props.typeOfRepeating
    };

    // Get parent props -> causes re-render
    static getDerivedStateFromProps(props) {
        return {
            isPopOpen: props.journalEntry,
            typeOfRepeating: props.typeOfRepeating
        };
    }

    render() {
        const { isPopOpen, typeOfRepeating } = this.state;

        return (
            <Popup
                trigger={
                    <Icon
                        name={"repeat"}
                        link={true}
                        onClick={this.props.openPopup}
                    />
                }
                flowing
                on="click"
                open={isPopOpen}
                onClose={this.props.closePopup}
            >
                <Grid>
                    <Grid.Row>
                        <p>How often to repeat it</p>
                    </Grid.Row>
                    <Grid.Row columns={"equal"}>
                        <Grid.Column>
                            <Grid.Row>
                                <Dropdown
                                    placeholder="Select Option"
                                    options={todoRepeatTypes}
                                    onChange={this.props.handleDropdownChange}
                                />
                            </Grid.Row>
                            {typeOfRepeating === "every-x-day-of-week" && (
                                <Grid.Row>
                                    <Dropdown
                                        placeholder="Select Days"
                                        fluid
                                        multiple
                                        selection
                                        options={daysOfWeek}
                                        onChange={
                                            this.props.handleDaysOfWeekDropdown
                                        }
                                    />
                                </Grid.Row>
                            )}
                            <Grid.Row>
                                <Button onClick={this.props.saveRepeatingTodo}>
                                    Save
                                </Button>
                            </Grid.Row>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Popup>
        );
    }
}

export default RepeatTodoPopup;
