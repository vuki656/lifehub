// Object Imports
import React from "react";

// Helper Imports
import { Box } from "@material-ui/core";

// Component Imports
import DaysListItem from "./DaysListItem";

class DaysList extends React.Component {
    // Display list of days in the sidebar
    displayDays = currentMonth =>
        currentMonth.daysList.map(day => <DaysListItem key={day} day={day} />);

    render() {
        const { currentMonth } = this.props;

        return <Box>{this.displayDays(currentMonth)}</Box>;
    }
}

export default DaysList;
