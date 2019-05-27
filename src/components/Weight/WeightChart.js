import React from "react";
import moment from "moment";

import { Line } from "react-chartjs-2";

class Chart extends React.Component {
    state = {
        data: {}
    };

    componentWillReceiveProps() {
        this.sortWeightData(this.props.weightList);
    }

    // Sorts the prop weight objects data and stores
    // It in state data (used to render the chart)
    sortWeightData(initialWeightList) {
        let weightHolder = [];
        let dateHolder = [];

        initialWeightList.forEach(weightListEntry => {
            weightHolder.push(weightListEntry.weight);
            dateHolder.push(moment.unix(weightListEntry.date).format("DD/MM/YYYY"));
        });

        this.setState({
            data: {
                labels: dateHolder,
                datasets: [
                    {
                        label: "Weight",
                        data: weightHolder,
                        backgroundColor: ["rgba(255, 99, 132, 0.2)"],
                        borderColor: ["rgba(255, 99, 132, 1)"],
                        borderWidth: 2
                    }
                ]
            }
        });
    }

    render() {
        const { data } = this.state;
        return (
            <div className="chart">
                <Line data={data} width={100} height={50} />
            </div>
        );
    }
}

export default Chart;
