import React from "react";
import { Redirect } from "react-router-dom";
import * as am5 from "@amcharts/amcharts5";
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
            financeData: {},
            totalSpending: 0
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

                root._logo.dispose();
                let chart = root.container.children.push(
                  am5percent.PieChart.new(root, {
                      radius: am5.percent(90),
                      innerRadius: am5.percent(85),
                  })
                );

                let series = chart.series.push(
                  am5percent.PieSeries.new(root, {
                    name: "Series",
                    categoryField: "category",
                    valueField: "amount",
                    startAngle: -230,
                    endAngle: 50,
                    //alignLabels: false
                  })
                );

                let tempSpending = 0;

                this.state.financeData.needs.map(financeData => {
                    if (financeData.amount === 0) {
                        return;
                    } else {
                        series.data.push({
                            category: financeData.title,
                            amount: financeData.amount
                        });
                    }
                });

                this.state.financeData.wants.map(financeData => {
                    if (financeData.amount === 0) {
                        return;
                    } else {
                        series.data.push({
                            category: financeData.title,
                            amount: financeData.amount
                        });
                    }
                });

                this.state.financeData.savings.map(financeData => {
                    if (financeData.amount === 0) {
                        return;
                    } else {
                        series.data.push({
                            category: financeData.title,
                            amount: financeData.amount
                        });
                    }
                });

                series.labels.template.set("visible", false);
                series.ticks.template.set("visible", false);
                series.slices.template.set("tooltipText", "[bold]{category} \n[bold]{value}kr");
                series.slices.template.set("cornerRadius", 5);
                series.slices.template.setAll({
                    //fill: am5.color(0xffffff),
                    stroke: am5.color(0xffffff)
                });
            });

        };
        fetchFinanceData();
    }


    render() {
        if (!this.props.auth) {
            return <Redirect to ="/splash" />;
        }

        return <main className="dashboard">
            <div className="fullscreen">
                <div className="chartBg">
                    <div id="chartdiv"></div>
                    <div className="spendingText">
                        <p id="spendAmount">18150 kr</p>
                        <p id="spendText">Totalt spenderande</p>
                    </div>
                </div>
                <div className="savingsDiv">
                    <h1>Sparande</h1>
                </div>
            </div>
        </main>;
    }
}

export default Dashboard;
