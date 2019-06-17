import React from "react";

import { Popup, Grid, Input, Icon } from "semantic-ui-react";

class EditTodoPopup extends React.Component {
    state = {
        todo: this.props.todo
    };

    static getDerivedStateFromProps(props) {
        return {
            todo: props.todo
        };
    }

    render() {
        const { todo } = this.state;

        return (
            <Popup
                trigger={<Icon name={"pencil"} link={true} />}
                flowing
                onClose={this.props.handleTodoTextChange}
                on="click"
            >
                <Grid>
                    <Grid.Column>
                        <Grid.Row>
                            <Input
                                defaultValue={todo.value}
                                name={"newTodo"}
                                onChange={this.props.handleChange}
                            />
                        </Grid.Row>
                    </Grid.Column>
                </Grid>
            </Popup>
        );
    }
}

export default EditTodoPopup;
