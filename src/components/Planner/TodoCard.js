import React from "react";

import { Checkbox } from "semantic-ui-react";

class TodoCard extends React.Component {
    state = {
        checked: false
    };

    render() {
        const { checked } = this.state;

        return (
            <div>
                <Checkbox label="This is a todo" checked={checked} />
            </div>
        );
    }
}

export default TodoCard;
