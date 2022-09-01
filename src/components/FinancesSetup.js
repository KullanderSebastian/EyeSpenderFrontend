import React, { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Input from "./Input";
import spargris from "../svg/spargris.svg";
import mynt from "../svg/Mynt.svg";
import infoCircle from "../svg/info-circle-solid.svg";
import { useFormik } from "formik";
import { financesSchema } from "../schemas";

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

async function saveFinances(data) {
    return fetch("http://localhost:3001/users/saveuserfinances", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then(data => data.json())
}

async function changeUserFinanceSetupStatus() {
    return fetch("http://localhost:3001/users/updateusersetupstatus", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({"username": sessionStorage.getItem("username")})
    })
    .then(data => data.json())
}

let spendingsList = [
    {
        title: "Hyra",
        category: "rent",
        amount: 0
    },
    {
        title: "Hemfkrn",
        category: "homeinsurance",
        amount: 0
    },
    {
        title: "Mat",
        category: "food",
        amount: 0
    },
    {
        title: "Bensin",
        category: "petrol",
        amount: 0
    },
    {
        title: "Bilfkrn",
        category: "carinsurance",
        amount: 0
    },
    {
        title: "SL kort",
        category: "slcard",
        amount: 0
    },
    {
        title: "Mobil",
        category: "mobilebill",
        amount: 0
    },
    {
        title: "Snus",
        category: "tobacco",
        amount: 0
    },
    {
        title: "Kläder",
        category: "clothes",
        amount: 0
    },
    {
        title: "Träning",
        category: "training",
        amount: 0
    },
    {
        title: "Fonder",
        category: "stocks",
        amount: 0
    },
    {
        title: "Sparande",
        category: "savings",
        amount: 0
    },
    {
        title: "Pension",
        category: "pension",
        amount: 0
    },
];

function FinancesSetup({ auth }) {
    const [whichState, declareState] = useState("welcome");
    const [userId, setUserId] = useState();
    const [spendings, setSpendings] = useState(spendingsList);
	const [isSetup, setIsSetup] = useState(false);
	const navigate = useNavigate();

    useEffect(() => {
        fetch("http://localhost:3001/users/getuserid", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({"username": sessionStorage.getItem("username")})
        })
        .then(data => console.log(data.text()))

		if (isSetup) {
			navigate("/dashboard", { replace: true })
		}
    }, [isSetup, navigate]);

	const onSubmit = async (values, actions) => {
		spendingsList.map(obj => {
			if (values[obj.category] != "") {
				obj.amount = values[obj.category];
			}
		})

		setSpendings(spendingsList);

        let userId = await getUserId();

        const res = await saveFinances({
            "username": sessionStorage.getItem("username"),
			"salary": values.salary,
            "finances": spendings
        });

        const res2 = await changeUserFinanceSetupStatus();

        console.log(res, res2);
		setIsSetup(true);
    }

	const {values, errors, touched, isSubmitting, handleBlur, handleChange, handleSubmit} = useFormik({
		initialValues: {
			salary: "",
			rent: "",
			homeinsurance: "",
			food: "",
			petrol: "",
			carinsurance: "",
			slcard: "",
			mobilebill: "",
			tobacco: "",
			clothes: "",
			training: "",
			stocks: "",
			savings: "",
			pension: ""
		},
		validationSchema: financesSchema,
		onSubmit
	});

	//console.log(errors);

    if (!auth) {
        return <Navigate to ="/splash" />;
    }

    let content;

    const goForward = e => {
        e.preventDefault();

        switch (whichState) {
            case "welcome":
                declareState("salary");
                break;
            case "salary":
                declareState("expensesNeeds");
                break;
            case "expensesNeeds":
                declareState("expensesWants")
                break;
            case "expensesWants":
                declareState("savings");
                break;
        }
    }

	const back = e => {
		e.preventDefault();

		switch (whichState) {
            case "salary":
                declareState("welcome");
                break;
            case "expensesNeeds":
                declareState("salary");
                break;
            case "expensesWants":
                declareState("expensesNeeds")
                break;
            case "savings":
                declareState("expensesWants");
                break;
        }
	}

	const hasError = () => {
		if (Object.keys(errors).length === 0) {
			return false;
		} else {
			return true;
		}
	}

    /*const getCircularReplacer = () => {
        const seen = new WeakSet();
            return (key, value) => {
        if (typeof value === "object" && value !== null) {
            if (seen.has(value)) {
                return;
            }
            seen.add(value);
        }
        return value;
        };
    };*/

    /*const handleChange = (e) => {
        e.preventDefault();

        spendingsList = spendingsList.map(
            el => el.title === e.target.parentNode.firstChild.outerText ? { ...el, amount: e.target.value } : el
        );

        setSpendings(spendingsList);
    }*/

    if (whichState === "welcome") {
        content =  <div><h2>Välkommen!</h2>
                   <p>EyeSpender är en app för att förenkla och hjälpa till med ditt
                   sparande samt att få en överblick över dina utgifter. Appen skapades
                   eftersom vi själva blev trötta på att sitta med krångliga excelfiler
                   som man inte riktigt förstod. Så vi hoppas att du ska finna att denna
                   app är lätt att använda så att du snabbt kan få kontroll över dina
                   pengar! Tryck på knappen nedan för att komma igång.</p>
                   <button onClick={goForward}>Kom igång</button>
                   <img className="pig" src={spargris} />
				   </div>
    } else if (whichState === "salary") {
        content = <div><h2>Vad tjänar du?</h2>
                    <p>Vänligen ange din månadslön efter skatt.</p>

                    <input
                        name="salary"
						type="salary"
                        key={1}
                        value={values.salary}
                        onChange={handleChange}
						onBlur={handleBlur}
						className={errors.salary && touched.salary ? "input-error" : ""}
                    />
					{errors.salary && touched.salary && <p className="error">{errors.salary}</p>}
                    <button disabled={isSubmitting} onClick={goForward}>Nästa</button>
					<a onClick={back}>Tillbaka</a>
                    </div>
    } else if (whichState === "expensesNeeds") {
        content = <div>
                    <h2>Nödvändigheter</h2>
                    <p>Vänligen ange dina nödvändigheter varje månad. Detta brukar
                    anses vara utgifter som inte går att leva utan.</p>

                    {spendings.slice(0, 6).map((obj) =>
						<div>
                            <div className="testInputs">
                                <h3>{obj.title}</h3>
                                <input
                                    name={obj.category}
									type={obj.category}
                                    value={values[obj.category]}
                                    onChange={handleChange}
									onBlur={handleBlur}
									className={errors[obj.category] && touched[obj.category] ? "input-error": ""}
                                />
                            </div>
							<div>
								{errors[obj.category] && touched[obj.category] && <p className="error">{errors[obj.category]}</p>}
							</div>
						</div>
                    )}
                    <button onClick={goForward}>Nästa</button>
					<a onClick={back}>Tillbaka</a>
                  </div>
    } else if (whichState === "expensesWants") {
        content = <div>
                    <h2>Behov</h2>
                    <p>Dessa utgifter anses utgöra en viktig del av ens vardag,
                    men kan ändå klassas som inte nödvändiga.</p>

                    {spendings.slice(6, 10).map((obj) =>
						<div>
                            <div className="testInputs">
                                <h3>{obj.title}</h3>
                                <input
                                    name={obj.category}
									type={obj.category}
                                    value={values[obj.category]}
                                    onChange={handleChange}
									onBlur={handleBlur}
									className={errors[obj.category] && touched[obj.category] ? "input-error": ""}
                                />
                            </div>
							<div>
								{errors[obj.category] && touched[obj.category] && <p className="error">{errors[obj.category]}</p>}
							</div>
						</div>
                    )}
                    <button onClick={goForward}>Nästa</button>
					<a onClick={back}>Tillbaka</a>
                </div>
    } else if (whichState == "savings") {
        content = <div>
                    <h2>Sparande</h2>
                    <p>Olika former av sparande</p>

                    {spendings.slice(10, 13).map((obj) =>
						<div>
                            <div className="testInputs">
                                <h3>{obj.title}</h3>
                                <input
                                    name={obj.category}
									type={obj.category}
                                    value={values[obj.category]}
                                    onChange={handleChange}
									onBlur={handleBlur}
									className={errors[obj.category] && touched[obj.category] ? "input-error": ""}
                                />
                            </div>
							<div>
								{errors[obj.category] && touched[obj.category] && <p className="error">{errors[obj.category]}</p>}
							</div>
						</div>
                    )}
                    <button className={hasError() === true ? "error" : ""} disabled={isSubmitting} type="submit">Spara</button>
					<a onClick={back}>Tillbaka</a>
                </div>
    }

    return (
        <div className="financeSetupView">
			<form onSubmit={handleSubmit}>
	            {content}
			</form>
        </div>
    );
}

export default FinancesSetup;
