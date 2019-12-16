// Object Imports
import React from "react";

// Destructured Imports
import { Typography, Box, Popover } from "@material-ui/core";

// Icon Imports
import VisibilityIcon from "@material-ui/icons/Visibility";

class ViewReminderButton extends React.Component {
    state = {
        // Base
        isPopupOpen: false,
        anchorElement: null, // Point from where the popup is opened

        // Props
        reminder: this.props.reminder
    };

    // Set anchor element (position where to open the pop)
    setAnchorElement = target => {
        this.setState({ anchorElement: target });
    };

    // Handle popup open
    handlePopupOpen = event => {
        this.setAnchorElement(event.currentTarget);
    };

    // Handle popup close
    handlePopupClose = () => {
        this.setState({ anchorElement: null });
    };

    render() {
        const { anchorElement, reminder } = this.state;
        const isPopupOpen = Boolean(anchorElement);

        return (
            <Box>
                <VisibilityIcon
                    aria-haspopup="true"
                    onMouseOver={this.handlePopupOpen}
                    onMouseLeave={this.handlePopupClose}
                />
                <Popover
                    pointerEvents="none"
                    open={isPopupOpen}
                    anchorEl={anchorElement}
                    anchorOrigin={{
                        vertical: "top",
                        horizontal: "left"
                    }}
                    transformOrigin={{
                        vertical: "center",
                        horizontal: "right"
                    }}
                    onClose={this.handlePopupClose}
                >
                    <Typography variant="h5"> {reminder.text}</Typography>
                    <Typography variant="body1">
                        {reminder.description}
                    </Typography>
                </Popover>
            </Box>
        );
    }
}

export default ViewReminderButton;
