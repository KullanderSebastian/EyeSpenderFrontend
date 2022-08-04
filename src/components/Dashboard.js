import React from "react";
import { Navigate } from "react-router-dom";
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
            totalSpending: 0,
            sliceData: [],
            dataIsLoaded: false
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

                this.state.financeData.spendings[0].expenditure.map(financeData => {
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
                    stroke: am5.color(0xffffff)
                });

                //console.log(series._settings.colors._settings.colors[0].toCSSHex());
                let colorArray = [];
                series._settings.colors._settings.colors.map((color) => colorArray.push(color.toCSSHex()));
                this.setState({
                    sliceData: colorArray
                })
            });
            this.setState({
                dataIsLoaded: true
            });
        };
        fetchFinanceData();
    }


    render() {
        if (!this.props.auth) {
            return <Navigate to ="/splash" />;
        }

        let i = 0;
        let totalSpending = 0;

        if (this.state.dataIsLoaded) {
            this.state.financeData.spendings[0].expenditure.map((financeData) => {
                if (financeData.amount === 0) {
                    return;
                } else {
                    totalSpending += parseFloat(financeData.amount);
                }
            });
        }

        return <main className="dashboard">
            <div className="fullscreen">
                <div className="chartBg">
                    <div id="chartdiv"></div>
                    <div className="spendingText">
                        <p id="spendAmount">{totalSpending}:-</p>
                        <p id="spendText">Ditt Spenderande</p>
                    </div>
                </div>
                <div className="savingsDiv">
                    <h3>Utgifter</h3>
                    {this.state.dataIsLoaded ? this.state.financeData.spendings[0].expenditure.map((financeData) => {
                        if (financeData.amount === 0) {
                            return;
                        } else {
                            const dotColor = this.state.sliceData[i];
                            i = i + 1;
                            return <div className="spendingsVisual"><div className="dot" style={{backgroundColor: dotColor}}></div>{financeData.title} <div className="amount">{financeData.amount}:-</div></div>
                        }
                    }) : null}
                </div>
            </div>
        </main>;
    }
}

export default Dashboard;
