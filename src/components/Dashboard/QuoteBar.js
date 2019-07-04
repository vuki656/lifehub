import React from "react";

import { Message } from "semantic-ui-react";

class QuoteBar extends React.Component {
    state = {
        quote: null,
        quoteAuthor: null
    };

    componentDidMount() {
        fetch("http://quotes.rest/qod.json?category=inspire  ")
            .then(response => response.json())
            .then(quoteObject => {
                this.setState({
                    quote: quoteObject.contents.quotes[0].quote,
                    quoteAuthor: quoteObject.contents.quotes[0].author
                });
            });
    }

    render() {
        const { quote, quoteAuthor } = this.state;

        return (
            <Message>
                <p>{quote}</p>
                <Message.Header>{quoteAuthor}</Message.Header>
            </Message>
        );
    }
}

export default QuoteBar;
