// Other Imports
import React from "react";
import { Route } from "react-router-dom";
import moment from "moment";
// Component Imports
import TaskArea from "./PlannerMain";

export const PlannerMainRoutes = (props) => {
    const { currentMonth } = props;

    // Generate routes to switch the task area for selected day
    const generateRoutes = (currentMonth) =>
        currentMonth.daysList.map(day => (
            <Route
                key={moment(day).format("DD/MM/YYYY")}
                path={`/planner/${moment(day).format("DD/MM/YYYY")}`}
                render={() => <TaskArea />}
            />
        ));

    return (
        <>
            {generateRoutes(currentMonth)}
        </>
    )

};
