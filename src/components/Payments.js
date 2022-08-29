import React, { useState, useEffect } from "react";
import LineBreak from "../components/LineBreak";

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

async function addPayment(data) {
	return fetch("http://localhost:3001/finances/savepayment", {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(data)
	})
	.then(data => data.json())
}

function Payments() {
	const [payments, setPayments] = useState([]);
	const [pTitle, setTitle] = useState();
	const [pCategory, setCategory] = useState("food");
	const [pAmount, setAmount] = useState();
	const [dataIsLoaded, setDataIsLoaded] = useState(false);

	useEffect(() => {
		const fetchPayments = async () => {
			const userId = await getUserId();
			const date = new Date();
			const month = date.getMonth();

			const response = await fetch("http://localhost:3001/finances/getpayments", {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({"userId": userId.data, "month": month})
			})

			const data = await response.json();

			setPayments(data.data);
		};
		fetchPayments();
		setDataIsLoaded(true);
	}, [])

	const openForm = () => {
		console.log("open form");
		document.getElementById("paymentForm").style.display = "block";
	}

	const closeForm = () => {
		console.log("close form");
		document.getElementById("paymentForm").style.display = "none";
	}

	const handleChange = (e) => {
		e.preventDefault();

		if (e.target.name === "inputTitle") {
			setTitle(e.target.value);
		} else if (e.target.name === "inputAmount") {
			setAmount(e.target.value);
		} else if (e.target.name === "select") {
			setCategory(e.target.value);
		}

		console.log(e.target.name);
	}

	const handleSubmit = async e => {
        e.preventDefault();

		let date = new Date();
		let month = date.getMonth();
		let userId = await getUserId();

		const res = await addPayment({
            userId: userId.data,
			month: month,
			title: pTitle,
			category: pCategory,
			amount: pAmount,
			date: date,
        });

		let array;

		if (!payments) {
			array = [];
		} else {
			array = payments;
		}

		array.push({
			title: pTitle,
			category: pCategory,
			amount: pAmount,
			date: date.toISOString()
		})

		setPayments(array);

		setTitle("");
		setAmount("");
		setCategory("food");
		closeForm();
		console.log(res);
    }

	return (
		<div className="background">
			<div className="payments">
	            <div className="fullscreen">
                    <div className="pageTitle">
						<h3>Oplanerade utgifter</h3>
                    </div>
	                <div className="paymentsDiv">
	                    <p>Här kan du lägga in utgifter som inte ingår i din budget.</p>
						<button onClick={openForm}>Lägg till en betalning</button>

						<h3>Dina betalningar denna månad</h3>
						{payments ? payments.map((obj) => {
							return <div>
								<div className="payment">
									<p>{obj.title}</p>
									<p>{obj.date.split("T")[0]}</p>
									<p>{obj.amount} :-</p>
								</div>
								<LineBreak />
							</div>
						}): null }
	                </div>

					<div className="formPopup" id="paymentForm">
						<form className="formContainer">
							<input
								name="inputTitle"
								value={pTitle}
								onChange={e => handleChange(e)}
							/>

							<input
								name="inputAmount"
								value={pAmount}
								onChange={e => handleChange(e)}
							/>

							<select name="select" value={pCategory} onChange={handleChange}>
								<option value="food">Mat</option>
								<option value="entertainment">Nöje</option>
								<option value="transportation">Färdmedel</option>
								<option value="savings">Sparande</option>
								<option value="other">Övrigt</option>
							</select>

							<button onClick={handleSubmit}>Lägg till</button>
						</form>
					</div>
	            </div>
	        </div>
		</div>
	);
}

export default Payments;
