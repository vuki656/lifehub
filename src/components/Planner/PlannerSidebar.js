// Other Imports
import React from "react";
// Component Imports
import PlannerMonthDropdown from "./PlannerMonthDropdown";
import { PlannerDaysList } from "./PlannerDaysList";

export const PlannerSidebar = (props) => {
    const { monthObjectList, currentMonth, selectNewMonth } = props;

    return (
        <div className="planner__sidebar">
            <PlannerMonthDropdown
                monthObjectList={monthObjectList}
                currentMonth={currentMonth}
                selectNewMonth={selectNewMonth}
            />
            <PlannerDaysList currentMonth={currentMonth} />
        </div>
    );
};
