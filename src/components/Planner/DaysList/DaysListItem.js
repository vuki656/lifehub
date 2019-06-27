import React from "react";

import { Link } from "react-router-dom";
import { Icon } from "semantic-ui-react";

import { formatMoment } from "../../../helpers/Global";
import firebase from "../../../firebase/Auth";

class DaysListItem extends React.Component {
    state = {
        iconStatus: "delete",
        todoRef: firebase.database().ref("todos"),
        currentUser: firebase.auth().currentUser,

        day: this.props.day
    };

    static getDerivedStateFromProps(props) {
        return {
            day: props.day
        };
    }

    componentDidMount() {
        this.getCompletionStatus(this.state);
    }

    getCompletionStatus = ({ todoRef, currentUser, day }) => {
        todoRef
            .child(`${currentUser.uid}/${day.valueOf()}/count/`)
            .on("value", counts => {
                if (counts.exists()) {
                    if (counts.val().total === counts.val().totalChecked) {
                        this.setState({ iconStatus: "checkmark" });
                    } else {
                        this.setState({ iconStatus: "delete" });
                    }
                } else {
                    this.setState({ iconStatus: "checkmark" });
                }
            });
    };

    render() {
        const { day, iconStatus } = this.state;

        return (
            <Link
                to={`/planner/${formatMoment(day, "DD/MM/YYYY")}`}
                key={formatMoment(day, "DD/MM/YYYY")}
                onClick={() => this.props.setCurrentDay(day)}
            >
                <li>
                    {formatMoment(day, "DD/MM/YYYY - ddd")}
                    <Icon name={iconStatus} />
                </li>
            </Link>
        );
    }
}

export default DaysListItem;
