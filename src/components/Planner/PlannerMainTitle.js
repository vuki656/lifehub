// Other Imports
import React from "react";
import moment from "moment";

export const PlannerMainTitle = (props) => {
    const { currentDay } = props;

    return (
        <p className="planner__main__title__text">
            {moment(currentDay).format("DD/MM/YYYY - dddd")}
        </p>
    )
};
