// Object Imports
import React from "react";
import firebase from "../../../firebase/Auth";

// Destructured Imports
import { List } from "semantic-ui-react";

// Component Imports
import DashboardNotesListItem from "./DashboardNotesListItem";

class DashboardNotes extends React.Component {
    state = {
        notesRef: firebase.database().ref("dashboard-notes"),
        currentUser: firebase.auth().currentUser,
        notesList: []
    };

    componentDidMount() {
        this.fetchNotes(this.state);
        this.addListeners();
    }

    addListeners = () => {
        this.addSetNoteListener(this.state);
        this.addRemoveNoteListener(this.state);
        this.addChangeNoteListener(this.state);
    };

    componentWillUnmount() {
        this.removeListeners(this.state);
    }

    removeListeners = ({ notesRef, currentUser }) => {
        notesRef.child(`${currentUser.uid}`).off();
    };

    // Listen for new note adds
    addSetNoteListener({ currentUser, notesRef }) {
        notesRef.child(currentUser.uid).on("child_added", () => {
            this.fetchNotes(this.state);
        });
    }

    // Listen for new note deletions
    addRemoveNoteListener = ({ currentUser, notesRef }) => {
        notesRef.child(currentUser.uid).on("child_removed", () => {
            this.fetchNotes(this.state);
        });
    };

    // Listen for note changes
    addChangeNoteListener = ({ currentUser, notesRef }) => {
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
            this.setState({ notesList: noteHolder });
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

export default DashboardNotes;
