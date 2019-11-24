// Object Imports
import React from "react";

// Destructured Imports
import { Box, Typography } from "@material-ui/core";

// Component Imports
import DashboardNotesList from "./DashboardNotesList/DashboardNotesList";
import AddDashboardNote from "./AddDashboardNote";

const DashboardNotes = () => (
    <Box>
        <Typography variant="h4">Notes</Typography>
        <DashboardNotesList />
        <AddDashboardNote />
    </Box>
);

export default DashboardNotes;
