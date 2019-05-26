import React from "react";

import { Grid } from "semantic-ui-react";

import EnterWeightForm from "./EnterWeightForm";
import WeightTable from "./WeightTable";
import Chart from "./Chart";

class Weight extends React.Component {
    render() {
        return (
            <Grid columns="equal">
                <Grid.Row>
                    <Grid.Column>
                        <p>Data Entry History</p>
                        <EnterWeightForm />
                        <WeightTable />
                    </Grid.Column>
                    <Grid.Column>
                        <Chart />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }
}

export default Weight;
