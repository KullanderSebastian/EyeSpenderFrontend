import React from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import * as am5percent from "@amcharts/amcharts5/percent";


async function getUserId() {
    return fetch("http://localhost:3001/users/getuserid", {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({"username": sessionStorage.getItem("username")})
    })
    .then(data => data.json())
}

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            financeData: {}
        }
    }

    componentDidMount() {
        const fetchFinanceData = async () => {
            const userId = await getUserId();

            const response = await fetch("http://localhost:3001/finances/getfinances", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({"userid": userId.data})
            })

            const data = await response.json();

            this.setState({
                financeData: data.data
            }, () => {
                let root = am5.Root.new("chartdiv");
                let chart = root.container.children.push(
                  am5percent.PieChart.new(root, {
                      radius: am5.percent(80),
                      innerRadius: am5.percent(50)
                  })
                );

                let series = chart.series.push(
                  am5percent.PieSeries.new(root, {
                    name: "Series",
                    categoryField: "category",
                    valueField: "amount"
                  })
                );

                this.state.financeData.needs.map(financeData => {
                    if (financeData.amount == 0) {
                        return;
                    } else {
                        series.data.push({
                            category: financeData.title,
                            amount: financeData.amount
                        });
                    }
                });

                this.state.financeData.wants.map(financeData => {
                    if (financeData.amount == 0) {
                        return;
                    } else {
                        series.data.push({
                            category: financeData.title,
                            amount: financeData.amount
                        });
                    }
                });

                this.state.financeData.savings.map(financeData => {
                    if (financeData.amount == 0) {
                        return;
                    } else {
                        series.data.push({
                            category: financeData.title,
                            amount: financeData.amount
                        });
                    }
                });
            });

        };
        fetchFinanceData();
    }

    render() {
        return <main className="dashboard">
            <h1>Inkomst: {this.state.financeData.salary}</h1>
            <div id="chartdiv"></div>
        </main>;
    }
}

export default Dashboard;
