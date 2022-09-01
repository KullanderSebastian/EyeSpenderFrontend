import React, { useState, useEffect } from "react";
import LineBreak from "../components/LineBreak";
import { paymentSchema } from "../schemas";
import { useFormik } from "formik";


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
	const [pCategory, setCategory] = useState("food");
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

	const onSubmit = async (values, actions) => {
		console.log(values, pCategory);

		let date = new Date();
		let month = date.getMonth();
		let userId = await getUserId();

		const res = await addPayment({
			userId: userId.data,
			month: month,
			title: values.paymentTitle,
			category: pCategory,
			amount: values.paymentAmount,
			date: date,
		});

		let array;

		if (!payments) {
			array = [];
		} else {
			array = payments;
		}

		array.push({
			title: values.paymentTitle,
			category: pCategory,
			amount: values.paymentAmount,
			date: date.toISOString()
		})

		setPayments(array);

		setCategory("food");
		closeForm();
		console.log(res);
	}

	const {values, errors, touched, isSubmitting, handleBlur, handleChange, handleSubmit} = useFormik({
		initialValues: {
			paymentTitle: "",
			paymentAmount: ""
		},
		validationSchema: paymentSchema,
		onSubmit
	});

	const openForm = () => {
		console.log("open form");
		document.getElementById("paymentForm").style.display = "block";
	}

	const closeForm = () => {
		console.log("close form");
		document.getElementById("paymentForm").style.display = "none";
	}

	/*const handleChangeSelect = (e) => {
		e.preventDefault();

		if (e.target.name === "inputTitle") {
			setTitle(e.target.value);
		} else if (e.target.name === "inputAmount") {
			setAmount(e.target.value);
		} else if (e.target.name === "select") {
			setCategory(e.target.value);
		}

		console.log(e.target.name);
	}*/

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
						<form onSubmit={handleSubmit} className="formContainer">
							<input
								name="paymentTitle"
								type="paymentTitle"
								value={values.paymentTitle}
								onChange={handleChange}
								onBlur={handleBlur}
								className={errors.paymentTitle && touched.paymentTitle ? "input-error" : ""}
							/>
							{errors.paymentTitle && touched.paymentTitle && <p className="error">{errors.paymentTitle}</p>}

							<input
								name="paymentAmount"
								type="paymentAmount"
								value={values.paymentAmount}
								onChange={handleChange}
								onBlur={handleBlur}
								className={errors.paymentAmount && touched.paymentAmount ? "input-error" : ""}
							/>
							{errors.paymentAmount && touched.paymentAmount && <p className="error">{errors.paymentAmount}</p>}

							<select name="select" value={pCategory} onChange={(e) => {setCategory(e.target.value)}}>
								<option value="food">Mat</option>
								<option value="entertainment">Nöje</option>
								<option value="transportation">Färdmedel</option>
								<option value="savings">Sparande</option>
								<option value="other">Övrigt</option>
							</select>

							<button type="submit">Lägg till</button>
						</form>
					</div>
	            </div>
	        </div>
		</div>
	);
}

export default Payments;
