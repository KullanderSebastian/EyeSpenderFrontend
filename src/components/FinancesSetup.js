import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import Input from "./Input";
import spargris from "../svg/spargris.svg";
import mynt from "../svg/Mynt.svg";
import infoCircle from "../svg/info-circle-solid.svg";

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
    const [salaryAmount, setSalary] = useState();
    const [userId, setUserId] = useState();
    const [spendings, setSpendings] = useState(spendingsList);

    useEffect(() => {
        fetch("http://localhost:3001/users/getuserid", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({"username": sessionStorage.getItem("username")})
        })
        .then(data => console.log(data.text()))
    }, []);

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

    const addCoins = () => {
        var html = [];

        for (var i = 0; i < 6; i++) {
            html.push(<img className={"coin coin" + (i + 1)} src={mynt}/>)
        }

        return html;
    }

    const getCircularReplacer = () => {
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
    };

    const handleChange = (e) => {
        e.preventDefault();

        //setSpendings(prevState => {
        //    prevState.map(
        //        el => el.title === e.target.parentNode.firstChild.outerText ? { ...el, amount: e.target.value}: el
        //    )
        //});

        spendingsList = spendingsList.map(
            el => el.title === e.target.parentNode.firstChild.outerText ? { ...el, amount: e.target.value } : el
        );

        setSpendings(spendingsList);

        //setSpendings(prevState => {
        //    prevState.map(
        //        el => { console.log(el)}
        //    )
        //});


        //setSpendings(prevState => ({
        //    prevState.map(
        //        el => el.title === e.target.parentNode.firstChild.outerText? { ...el, amount: e.target.value}: el
        //    )
        //}));
    }

    const handleSubmit = async e => {
        e.preventDefault();

        let userId = await getUserId();

		console.log("DATA IN SUBMIT: " + userId.data + salaryAmount, spendings);

        const res = await saveFinances({
            "username": sessionStorage.getItem("username"),
			"salary": salaryAmount,
            "finances": spendings
        });

        const res2 = await changeUserFinanceSetupStatus();

        console.log(res, res2);
    }

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
                   {addCoins()}</div>
    } else if (whichState === "salary") {
        content = <div><h2>Vad tjänar du?</h2>
                    <p>Vänligen ange din månadslön efter skatt.</p>
                    <form>
                        <input
                            name="salary"
                            key={1}
                            value={salaryAmount}
                            onChange={e => setSalary(e.target.value)}
                        />
                        <button onClick={goForward}>Nästa</button>
                    </form>
                    </div>
    } else if (whichState === "expensesNeeds") {
        content = <div>
                    <h2>Nödvändigheter</h2>
                    <p>Vänligen ange dina nödvändigheter varje månad. Detta brukar
                    anses vara utgifter som inte går att leva utan.</p>
                    <form>
                        {console.log("Spendings in expenses: " + spendings)}
                        {spendings.slice(0, 6).map((obj) =>
                            <div className="testInputs">
                                <h3>{obj.title}</h3>
                                <input
                                    name={obj.category}
                                    placeholder="0.00"
                                    value={obj.amount?obj.amount : ""}
                                    onChange={handleChange}
                                />
                            </div>
                        )}
                        <button onClick={goForward}>Nästa</button>
                    </form>
                  </div>
    } else if (whichState === "expensesWants") {
        content = <div>
                    <h2>Behov</h2>
                    <p>Dessa utgifter anses utgöra en viktig del av ens vardag,
                    men kan ändå klassas som inte nödvändiga.</p>

                    <form>
                        {spendings.slice(6, 10).map((obj) =>
                            <div className="testInputs">
                                <h3>{obj.title}</h3>
                                <input
                                    name={obj.category}
                                    placeholder="0.00"
                                    value={obj.amount?obj.amount : ""}
                                    onChange={handleChange}
                                />
                            </div>
                        )}
                        <button onClick={goForward}>Nästa</button>
                    </form>
                </div>
    } else if (whichState == "savings") {
        content = <div>
                    <h2>Sparande</h2>
                    <p>Olika former av sparande</p>

                    <form>
                        {spendings.slice(10, 13).map((obj) =>
                            <div className="testInputs">
                                <h3>{obj.title}</h3>
                                <input
                                    name={obj.category}
                                    placeholder="0.00"
                                    value={obj.amount?obj.amount : ""}
                                    onChange={handleChange}
                                />
                            </div>
                        )}
                        <button onClick={handleSubmit}>Spara</button>
                    </form>
                </div>
    }

    return (
        <div className="financeSetupView">
            {content}
        </div>
    );
}

export default FinancesSetup;
