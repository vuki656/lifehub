// Object Imports
import React from "react";

// Destructured Imports
import { Box, Typography } from "@material-ui/core";

// Component Imports
import DashboardNotesList from "./DashboardNotesList/DashboardNotesList";
import AddDashboardNoteButton from "./Buttons/AddDashboardNoteButton";

const DashboardNotes = () => (
    <Box>
        <Typography variant="h4">Notes</Typography>
        <DashboardNotesList />
        <AddDashboardNoteButton />
    </Box>
);

export default DashboardNotes;
