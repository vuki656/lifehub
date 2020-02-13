// Other Imports
import React from "react"
// MUI Component Imports
import Grid from "@material-ui/core/Grid";
// Component Imports
import EditTodoCardNameButton from "../../Buttons/EditTodoCardNameButton";
import DeleteTodoCardButton from "../../Buttons/DeleteTodoCardButton";

export const CardItemTopBar = (props) => {
    const { todoCard } = props;

    return (
        <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="center"
        >
            <Grid item xs={10}>
                {todoCard.name}
            </Grid>
            <Grid
                item
                container
                direction="row"
                justify="flex-end"
                alignItems="center"
                xs={2}
            >
                <EditTodoCardNameButton todoCard={todoCard} />
                <DeleteTodoCardButton todoCard={todoCard} />
            </Grid>
        </Grid>
    )
};
