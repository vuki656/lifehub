// Other Imports
import React from "react";
// Component Imports
import DaysListItem from "./DaysListItem/DaysListItem";

export const PlannerDaysList = (props) => {
    const { currentMonth } = props;

    // Display list of days in the sidebar
    const displayDays = currentMonth =>{
        return currentMonth.daysList.map((day) => (<DaysListItem key={day} day={day} />))
    };

    return (
        <div className="planner__sidebar__dayslist">
            {displayDays(currentMonth)}
        </div>
    );
};

