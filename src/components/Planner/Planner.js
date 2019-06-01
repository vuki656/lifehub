import React from "react";
import moment from "moment";

import { Grid } from "semantic-ui-react";

import TaskArea from "./TaskArea";
import Reminders from "./Reminders";
import DaysList from "./DaysList";

class Planner extends React.Component {
    state = {};

    generateList = () => {
        let monthObjectList = [];

        //Generate next 12 months
        let monthList = [];
        for (let i = 0; i < 12; i++) {
            monthList.push(moment().add(i, "month"));
        }

        // Itterate trough next 12 months
        monthList.forEach((monthMomentObject, index) => {
            let daysInMonthAmount = monthMomentObject.daysInMonth();
            let year = moment(monthMomentObject).format("YYYY");
            let month = moment(monthMomentObject).format("MM");
            let monthDaysList = [];

            // Itterate trough days in month
            for (let i = 1; i < daysInMonthAmount + 1; i++) {
                monthDaysList.push(moment(`${i}-${month}-${year}`));
            }

            monthObjectList.push({
                month: monthList[index],
                daysList: monthDaysList
            });

            // Empty days in month so next month can be put in
            monthDaysList = [];
        });

        console.log(monthObjectList);
    };

    render() {
        return (
            <div>
                {this.generateList()}
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={3} className="sidebar-menu">
                            <DaysList />
                        </Grid.Column>
                        <Grid.Column width={10} className="task-area">
                            <TaskArea />
                        </Grid.Column>
                        <Grid.Column width={3} className="sidebar-menu">
                            <Reminders />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>
        );
    }
}

export default Planner;
