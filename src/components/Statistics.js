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
	const [salary, setSalary] = useState();
	const [dataIsLoaded, setDataIsLoaded] = useState(false);
	const monthNames = ["Januari", "Februari", "Mars", "April", "Maj", "Juni", "Juli", "Augusti", "Oktober", "November", "December"]

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

	return (
		<div className="background">
			<div className="payments">
	            <div className="fullscreen">
                    <div className="pageTitle">
						<h3>Statistik</h3>
                    </div>
	                <div className="paymentsDiv">
						<h3>Sammanfattning</h3>
						<h3>{monthNames[dateToday.getMonth()]}</h3>
						<p>Inkomst: {salary} kr</p>
	                    <p>Utgift: {totalSpending} kr</p>
						<p>Totalt: {salary - totalSpending} kr</p>
						<p>Det är {daysUntilEndOfMonth} dagar kvar denna månad,
						du kan spendera {(salary - totalSpending) / daysUntilEndOfMonth}kr per dag.</p>
	                </div>
	            </div>
	        </div>
		</div>
	);
}

export default Statistics;
