import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

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

function Statistics({ auth }) {
	const [plannedFinances, setPlannedFinances] = useState();
	const [unplannedFinances, setUnplannedFinances] = useState();
	const [financeData, setFinanceData] = useState();
	const [salary, setSalary] = useState();
	const [dataIsLoaded, setDataIsLoaded] = useState(false);
	const monthNames = ["Januari", "Februari", "Mars", "April", "Maj", "Juni", "Juli", "Augusti", "September", "Oktober", "November", "December"];
	const categories = ["food", "entertainment", "transportation", "savings", "other"];

	useEffect(() => {
		const fetchFinances = async () => {
			const userId = await getUserId();
			const date = new Date();
			const month = date.getMonth();

			const responseUnplanned = await fetch("http://localhost:3001/finances/getpayments", {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({"userId": userId.data, "month": month})
			})

			const data = await responseUnplanned.json();

			setUnplannedFinances(data.data);

			const responsePlanned = await fetch("http://localhost:3001/users/getuserfinances", {
				method: "PATCH",
				headers: {
					"Content-type": "application/json"
				},
				body: JSON.stringify({"username": sessionStorage.getItem("username")})
			})

			const data2 = await responsePlanned.json();

			setPlannedFinances(data2.data);

			let concatinatedArray;

			if (!data.data) {
				concatinatedArray = data2.data;
			} else {
				concatinatedArray = data2.data.concat(data.data);
			}

			let cleanedArray = [];
			let tempValues = {"food": 0, "entertainment": 0, "transportation": 0, "savings": 0, "other": 0}
			let categoryNames = {"food": "Mat", "entertainment": "Nöje", "transportation": "Transport", "savings": "Sparande", "other": "Övrigt"}

			concatinatedArray.map(financeData => {
				console.log(financeData);
				if (categories.includes(financeData.category)) {
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

			setFinanceData(cleanedArray);

			const fetchSalary = await fetch("http://localhost:3001/users/getsalary", {
				method: "PATCH",
				headers: {
					"Content-type": "application/json"
				},
				body: JSON.stringify({"username": sessionStorage.getItem("username")})
			})

			const data3 = await fetchSalary.json();

			setSalary(data3.data);

			setDataIsLoaded(true);
		};

		fetchFinances();
	}, [])

	if (!auth) {
        return <Navigate to ="/splash" />;
    }

	let totalSpending = 0;

	if (dataIsLoaded === true) {
		if (unplannedFinances) {
			unplannedFinances.map((obj) => {
				if (obj.amount === 0) {
					return;
				} else {
					totalSpending += parseInt(obj.amount);
				}
			})
		}

		plannedFinances.map((obj) => {
			if (obj.amount === 0) {
				return;
			} else {
				totalSpending += parseInt(obj.amount)
			}
		})
	}

	let dateToday = new Date();
	let lastDayOfMonth = new Date(dateToday.getFullYear(), dateToday.getMonth()+1, 0).getDate();
	let daysUntilEndOfMonth = lastDayOfMonth - dateToday.getDate();

	let barLeftWidth = (totalSpending / salary) * 100;
	let barRightWidth = 100 - barLeftWidth;

	return (
		<div className="statistics">
			<div className="fullPageWrapper">
				<div className="headerWrapper">
					<div className="headerTextWrapper">
						<p><div className="number">{salary - totalSpending} SEK</div><div className="kvar"><div className="kvarBorder">kvar</div></div></p>
					</div>
					<div className="barWrapper">
						<div className="barLeft" style={{width: `${barLeftWidth}%`}}></div>
						<div className="barRight" style={{width: `${barRightWidth}%`}}></div>
					</div>
					<div className="spendingOverview">
						<p><b>{totalSpending}</b> av {salary} spenderat</p>
					</div>
				</div>
				<div className="contentWrapper">
						<div className="insightsWrapper">
							<div className="insightsCard"><h1>{daysUntilEndOfMonth} Dagar</h1><p>Kvar denna månad</p></div>
							<div className="insightsCard"><h1>{Math.round((salary - totalSpending) / daysUntilEndOfMonth)} SEK</h1><p>Kan du spendera per dag</p></div>
						</div>

						<h2>Utgifter {monthNames[dateToday.getMonth()]}</h2>
						<div className="budgetWrapper">
							{dataIsLoaded ? financeData.map((financeData) => {
								if (financeData.amount === 0) {
									return;
								} else {
									return <div className="budgetItem"><div className="paymentText">{financeData.category}:</div><div className="paymentAmount">{financeData.amount} SEK</div></div>
								}
							}) : null}
						</div>
					</div>
				</div>
		</div>
	);
}

export default Statistics;
