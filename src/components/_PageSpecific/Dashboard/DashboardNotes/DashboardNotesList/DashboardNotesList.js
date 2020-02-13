// Object Imports
import React from "react";
import firebase from "../../../../../helpers/firebase/Auth";

// Destructured Imports
import { List } from "@material-ui/core";

// Component Imports
import DashboardNotesListItem from "./DashboardNotesListItem";

class DashboardNotesList extends React.Component {
    // Used to prevent setState calls after component umounts
    _isMounted = false;

    state = {
        // Firebase
        currentUser: firebase.auth().currentUser,
        notesRef: firebase.database().ref("dashboard-notes"),

        // Base
        notesList: []
    };

    componentDidMount() {
        this._isMounted = true;
        this.fetchNotes(this.state);
        this.activateListeners();
    }

    componentWillUnmount() {
        this.deactivateListeners();
        this._isMounted = false;
    }

    // Activate database listeners
    activateListeners = () => {
        this.activateSetNoteListener(this.state);
        this.activateRemoveNoteListener(this.state);
        this.activateChangeNoteListener(this.state);
    };

    // Deactivate database listeners
    deactivateListeners = () => {
        this.deactivateNotesListener(this.state);
    };

    // Deactivate notes ref listener
    deactivateNotesListener = ({ notesRef, currentUser }) => {
        notesRef.child(`${currentUser.uid}`).off();
    };

    // Listen for new note adds
    activateSetNoteListener({ currentUser, notesRef }) {
        notesRef.child(currentUser.uid).on("child_added", () => {
            this.fetchNotes(this.state);
        });
    }

    // Listen for new note deletions
    activateRemoveNoteListener = ({ currentUser, notesRef }) => {
        notesRef.child(currentUser.uid).on("child_removed", () => {
            this.fetchNotes(this.state);
        });
    };

    // Listen for note changes
    activateChangeNoteListener = ({ currentUser, notesRef }) => {
        notesRef.child(currentUser.uid).on("child_changed", () => {
            this.fetchNotes(this.state);
        });
    };

    // Fetch notes from firebase
    fetchNotes = ({ notesRef, currentUser }) => {
        notesRef.child(currentUser.uid).once("value", notes => {
            let noteHolder = [];

            notes.forEach(note => {
                let text = note.val().text;
                let key = note.key;

                noteHolder.push({ text, key });
            });

            this._isMounted && this.setState({ notesList: noteHolder });
        });
    };

    // Render notes to screen
    renderNotes = ({ notesList }) =>
        notesList.map(note => (
            <DashboardNotesListItem note={note} key={note.key} />
        ));

    render() {
        return <List>{this.renderNotes(this.state)}</List>;
    }
}

export default DashboardNotesList;
