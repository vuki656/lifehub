import DashboardIcon from "@material-ui/icons/Dashboard";
import DoneAllIcon from "@material-ui/icons/DoneAll";
import BookIcon from "@material-ui/icons/Book";
import FitnessCenterIcon from "@material-ui/icons/FitnessCenter";
import SettingsIcon from "@material-ui/icons/Settings";
import React from "react";

export const sidebarMenuPages = [
    { linkName: "dashboard", icon: <DashboardIcon /> },
    { linkName: "planner", icon: <DoneAllIcon /> },
    { linkName: "journal", icon: <BookIcon /> },
    { linkName: "weight", icon: <FitnessCenterIcon /> },
    { linkName: "settings", icon: <SettingsIcon /> }
];



