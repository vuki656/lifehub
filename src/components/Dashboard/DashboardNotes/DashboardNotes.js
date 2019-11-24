// Object Imports
import React from "react";

// Destructured Imports
import { Box } from "@material-ui/core";

// Component Imports
import DashboardNotesList from "./DashboardNotesList/DashboardNotesList";
import AddDashboardNote from "./AddDashboardNote";

const DashboardNotes = () => (
    <Box>
        <DashboardNotesList />
        <AddDashboardNote />
    </Box>
);

export default DashboardNotes;
