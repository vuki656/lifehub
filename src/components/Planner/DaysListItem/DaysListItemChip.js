// Other Imports
import React from 'react';
// MUI Component Imports
import Chip from "@material-ui/core/Chip";

export const DaysListItemChip = (props) => {
    const { totalAmount, completedAmount } = props;

    return (
        <Chip
            label={totalAmount - completedAmount}
            className="planner__sidebar__dayslist__item__chip"
        />
    )
};
