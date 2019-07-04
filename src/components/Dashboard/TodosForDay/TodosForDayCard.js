import React from "react";
import firebase from "../../../firebase/Auth";
import moment from "moment";

import { Card, Icon } from "semantic-ui-react";

import { getDayOnlyTimestamp } from "../../../helpers/Global";

class TodosForDayCard extends React.Component {
    // Used to prevent setState calls after component umounts
    _isMounted = false;

    state = {
        todoRef: firebase.database().ref("todos"),
        currentUser: firebase.auth().currentUser,
        currentDay: getDayOnlyTimestamp(moment()),
        totalTodos: null,
        totalCheckedTodos: null,

        category: this.props.category,
        iconName: this.props.iconName
    };

    componentDidMount() {
        this._isMounted = true;
        this.fetchCategoryTodoCount(this.state);
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    fetchCategoryTodoCount = ({
        todoRef,
        currentUser,
        currentDay,
        category
    }) => {
        todoRef
            .child(
                `${currentUser.uid}/${currentDay}/count/categories/${category}`
            )
            .on("value", counts => {
                let totalTodos = counts.val().total;
                let totalCheckedTodos = counts.val().totalChecked;

                if (this._isMounted) {
                    this.setState({ totalTodos, totalCheckedTodos });
                }
            });
    };

    render() {
        const {
            category,
            iconName,
            totalTodos,
            totalCheckedTodos
        } = this.state;

        return (
            <Card>
                <Card.Content textAlign="center">
                    <Card.Header>{`${totalCheckedTodos}/${totalTodos}`}</Card.Header>
                    <Card.Header>
                        {/* Changes the first letter to uppercase.
                        Firebase is case sensitive so
                        props is passed all lowercase*/}
                        {category.charAt(0).toUpperCase() +
                            category.substring(1)}{" "}
                        Todos
                    </Card.Header>
                    <Icon name={iconName} size="large" circular inverted />
                </Card.Content>
            </Card>
        );
    }
}

export default TodosForDayCard;
