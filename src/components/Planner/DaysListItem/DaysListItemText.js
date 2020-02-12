// Other Imports
import React from "react";
// Helper Imports
import { formatMoment } from "../../../helpers/Global";

export const DaysListItemText = (props) => {
    const { day } = props;

    return (
        <p className="planner__sidebar__dayslist__item__text">
            {formatMoment(day, "DD dd")}
        </p>
    )
};
