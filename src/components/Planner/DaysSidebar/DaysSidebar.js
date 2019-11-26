// Object Imports
import React from "react";

// Destructured Imports
import { Box } from "@material-ui/core";

// Component Imports
import MonthDropdown from "./MonthDropdown";
import DaysList from "./DaysList/DaysList";

class DaysSidebar extends React.Component {
    state = {
        monthObjectList: this.props.monthObjectList,
        currentMonth: this.props.currentMonth
    };

    static getDerivedStateFromProps(props) {
        return {
            monthObjectList: props.monthObjectList,
            currentMonth: props.currentMonth
        };
    }

    render() {
        const { monthObjectList, currentMonth } = this.state;

        return (
            <Box>
                <MonthDropdown
                    monthObjectList={monthObjectList}
                    currentMonth={currentMonth}
                    selectNewMonth={this.props.selectNewMonth}
                />
                <DaysList currentMonth={this.props.currentMonth} />
            </Box>
        );
    }
}

export default DaysSidebar;
