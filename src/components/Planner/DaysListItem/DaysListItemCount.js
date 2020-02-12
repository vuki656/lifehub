// Other Imports
import React from 'react';

export const DaysListItemCount = (props) => {
    const { totalAmount, completedAmount } = props;

    return (
        <p className="planner__sidebar__dayslist__item__count">
            {totalAmount - completedAmount}
        </p>
    )
};
