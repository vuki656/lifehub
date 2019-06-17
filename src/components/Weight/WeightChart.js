import React from "react";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend
} from "recharts";

class Chart extends React.Component {
    state = {
        data: null
    };

    static getDerivedStateFromProps(props) {
        return {
            data: props.weightList
        };
    }

    render() {
        const { data } = this.state;

        return (
            <LineChart
                width={600}
                height={500}
                data={data}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
                <XAxis dataKey="date" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="weight" stroke="#FF6384" />
            </LineChart>
        );
    }
}

export default Chart;
