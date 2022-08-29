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
            financeData: [],
            totalSpending: 0,
            sliceData: [],
            dataIsLoaded: false,
			categories: ["food", "entertainment", "transportation", "savings", "other"],
        }
    }

    componentDidMount() {
        const fetchFinanceData = async () => {
            const userId = await getUserId();

            const response = await fetch("http://localhost:3001/users/getuserfinances", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({"username": sessionStorage.getItem("username")})
            })

            const data = await response.json();
			const date = new Date();
			const month = date.getMonth();

        	const unplannedSpendingsResponse = await fetch("http://localhost:3001/finances/getpayments", {
				method: "PATCH",
				headers: {
					"Content-type": "application/json"
				},
				body: JSON.stringify({"userId": userId.data, "month": month})
			})

			const data2 = await unplannedSpendingsResponse.json();

			let concatinatedArray;

			if (!data2.data) {
				concatinatedArray = data.data;
			} else {
				concatinatedArray = data.data.concat(data2.data);
			}

            this.setState({
                financeData: concatinatedArray
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

				let cleanedArray = [];
				let tempValues = {"food": 0, "entertainment": 0, "transportation": 0, "savings": 0, "other": 0}
				let categoryNames = {"food": "Mat", "entertainment": "Nöje", "transportation": "Transport", "savings": "Sparande", "other": "Övrigt"}

				this.state.financeData.map(financeData => {
					if (this.state.categories.includes(financeData.category)) {
						if (financeData.amount === 0) {
							return;
						} else {
							tempValues[financeData.category] = tempValues[financeData.category] + financeData.amount;
						}
					} else {
						if (financeData.amount === 0) {
							return;
						} else {
							cleanedArray.push({
								category: financeData.title,
								amount: financeData.amount
							})
						}
					}
				})

				for (var key in tempValues) {
					if (tempValues[key] != 0) {
						cleanedArray.push({
							category: categoryNames[key],
							amount: tempValues[key]
						})
					}
				}

				cleanedArray.map(financeData => {
					series.data.push({
						category: financeData.category,
						amount: financeData.amount
					});
				});

				this.setState({
					financeData: cleanedArray
				});

                //this.state.financeData.map(financeData => {
                //    if (financeData.amount === 0) {
                //        return;
                //    } else {
                //        series.data.push({
                //            category: financeData.title,
                //            amount: financeData.amount
                //        });
                //    }
                //});

                series.labels.template.set("visible", false);
                series.ticks.template.set("visible", false);
                series.slices.template.set("tooltipText", "[bold]{category} \n[bold]{value}kr");
                series.slices.template.set("cornerRadius", 5);
                series.slices.template.setAll({
                    stroke: am5.color(0xffffff)
                });

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
            this.state.financeData.map((financeData) => {
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
                    {this.state.dataIsLoaded ? this.state.financeData.map((financeData) => {
                        if (financeData.amount === 0) {
                            return;
                        } else {
                            const dotColor = this.state.sliceData[i];
                            i = i + 1;
                            return <div className="spendingsVisual"><div className="dot" style={{backgroundColor: dotColor}}></div>{financeData.category} <div className="amount">{financeData.amount}:-</div></div>
                        }
                    }) : null}
                </div>
            </div>
        </main>;
    }
}

export default Dashboard;
