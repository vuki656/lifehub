// Other Imports
import React from "react";
import moment from "moment";
import AddTodoCardButton from "../Dialogs/AddTodoCardButton";
import Grid from "@material-ui/core/Grid";

export const PlannerTopBar = (props) => {
    const { currentDay } = props;

    return (
        <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="center"
        >
            <Grid item>
                <p className="planner__main__topbar__title">
                    {moment(currentDay).format("DD/MM/YYYY - dddd")}
                </p>
            </Grid>
            <Grid item>
                <AddTodoCardButton />
            </Grid>
        </Grid>

    )
};
