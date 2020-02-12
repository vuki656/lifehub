// Other Imports
import React, { useEffect } from "react";
// Icon Imports
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import IndeterminateCheckBoxIcon from "@material-ui/icons/IndeterminateCheckBox";

export const DaysListItemCheckbox = (props) => {
    const { completedAmount, totalAmount } = props;

    const [status, setStatus] = React.useState("finished");
    const [color, setColor] = React.useState("#63ea90");

    useEffect(() => {
        setCompletionStatus();
    });

    // If all todos not done, set a red alert box
    const setCompletionStatus = () => {
        if (completedAmount !== totalAmount) {
            setColor("#f12b2c");
            setStatus("unfinished");
        }
    };

    // If all todos done, return green checkmark, else return red alert box
    const getIcon = () => {
        return status === "finished"
            ? <CheckBoxIcon style={{ fill: color }} />
            : <IndeterminateCheckBoxIcon style={{ fill: color }} />;
    };

    return (
        <div className="
            planner__sidebar__dayslist__item__checkbox
            content--center--vertical
        ">
            {getIcon()}
        </div>
    )
};
