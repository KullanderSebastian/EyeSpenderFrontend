import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
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
    return fetch("http://localhost:3001/finances/savefinances", {
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

function FinancesSetup({ auth }) {
    const [whichState, declareState] = useState("welcome");
    const [salaryAmount, setSalary] = useState();
    const [userId, setUserId] = useState();
    const [needsInput, setNeedsInputs] = useState({
            needs: [
                {
                    title: "Hyra",
                    category: "rent",
                    timeframe: "permonth",
                    amount: 0
                },
                {
                    title: "Hemfkrn",
                    category: "homeinsurance",
                    timeframe: "permonth",
                    amount: 0
                },
                {
                    title: "Mat",
                    category: "food",
                    timeframe: "permonth",
                    amount: 0
                },
                {
                    title: "Bensin",
                    category: "petrol",
                    timeframe: "permonth",
                    amount: 0
                },
                {
                    title: "Bilfkrn",
                    category: "carinsurance",
                    timeframe: "permonth",
                    amount: 0
                },
                {
                    title: "SL kort",
                    category: "slcard",
                    timeframe: "permonth",
                    amount: 0
                }
            ],
            wants: [
                {
                    title: "Mobil",
                    category: "mobilebill",
                    timeframe: "permonth",
                    amount: 0
                },
                {
                    title: "Snus",
                    category: "tobacco",
                    timeframe: "permonth",
                    amount: 0
                },
                {
                    title: "Kl??der",
                    category: "clothes",
                    timeframe: "permonth",
                    amount: 0
                },
                {
                    title: "Tr??ning",
                    category: "training",
                    timeframe: "permonth",
                    amount: 0
                }

            ],
            savings: [
                {
                    title: "Fonder",
                    category: "stocks",
                    timeframe: "permonth",
                    amount: 0
                },
                {
                    title: "Sparande",
                    categoru: "savings",
                    timeframe: "permonth",
                    amount: 0
                },
                {
                    title: "Pension",
                    category: "pension",
                    timeframe: "permonth",
                    amount: 0
                }
            ]
    });

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
        return <Redirect to ="/splash" />;
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

/*    const addInput = e => {
        e.preventDefault();

        setNeedsInputs(prevState => ({
            inputs: [...prevState.inputs, {
                id: "c" + prevState.inputs.length - 1,
                category: "choose",
                amount: 0
            }]
        }));
    }*/

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

        setNeedsInputs(prevState => ({
            needs: prevState.needs.map(
                el => el.title === e.target.parentNode.firstChild.outerText? { ...el, amount: e.target.value}: el
            ),
            wants: prevState.wants.map(
                el => el.title === e.target.parentNode.firstChild.outerText? { ...el, amount: e.target.value}: el
            ),
            savings: prevState.savings.map(
                el => el.title === e.target.parentNode.firstChild.outerText? { ...el, amount: e.target.value}: el
            )

        }));
    }

    const handleChangeSelect = (e) => {
        e.preventDefault();

        setNeedsInputs(prevState => ({
            needs: prevState.needs.map(
                el => el.title === e.target.attributes[0].nodeValue? { ...el, timeframe: e.target.value}: el
            ),
            wants: prevState.wants.map(
                el => el.title === e.target.attributes[0].nodeValue? { ...el, timeframe: e.target.value}: el
            ),
            savings: prevState.savings.map(
                el => el.title === e.target.attributes[0].nodeValue? { ...el, timeframe: e.target.value}: el
            )
        }));
    }

    const handleSubmit = async e => {
        e.preventDefault();

        let userId = await getUserId();

        const res = await saveFinances({
            "userid": userId.data,
            "salary": salaryAmount,
            "needs": needsInput.needs,
            "wants": needsInput.wants,
            "savings": needsInput.savings
        });

        const res2 = await changeUserFinanceSetupStatus();

        console.log(res, res2);
    }

    if (whichState === "welcome") {
        content =  <div><h2>V??lkommen!</h2>
                   <p>EyeSpender ??r en app f??r att f??renkla och hj??lpa till med ditt
                   sparande samt att f?? en ??verblick ??ver dina utgifter. Appen skapades
                   eftersom vi sj??lva blev tr??tta p?? att sitta med kr??ngliga excelfiler
                   som man inte riktigt f??rstod. S?? vi hoppas att du ska finna att denna
                   app ??r l??tt att anv??nda s?? att du snabbt kan f?? kontroll ??ver dina
                   pengar! Tryck p?? knappen nedan f??r att komma ig??ng.</p>
                   <button onClick={goForward}>Kom ig??ng</button>
                   <img className="pig" src={spargris} />
                   {addCoins()}</div>
    } else if (whichState === "salary") {
        content = <div><h2>Vad tj??nar du?</h2>
                    <p>V??nligen ange din m??nadsl??n efter skatt.</p>
                    <form>
                        <input
                            name="salary"
                            key={1}
                            value={salaryAmount}
                            onChange={e => setSalary(e.target.value)}
                        />
                        <button onClick={goForward}>N??sta</button>
                    </form>
                    </div>
    } else if (whichState === "expensesNeeds") {
        content = <div>
                    <h2>N??dv??ndigheter</h2>
                    <p>V??nligen ange dina n??dv??ndigheter varje m??nad. Detta brukar
                    anses vara utgifter som inte g??r att leva utan.</p>

                    <form>
                        {needsInput.needs.map((obj) =>
                            <div className="testInputs">
                                <h3>{obj.title}</h3>
                                <img className="information" src={infoCircle} />
                                <input
                                    name={obj.category}
                                    placeholder="0.00"
                                    value={obj.amount}
                                    onChange={handleChange}
                                />
                                <select classname={obj.title} value={obj.timeframe} onChange={handleChangeSelect} >
                                    <option value="perday">Per Dag</option>
                                    <option value="perweek">Per Vecka</option>
                                    <option value="perweek2">Per 2 Veckor</option>
                                    <option value="permonth">Per M??nad</option>
                                </select>
                            </div>
                        )}
                        <button onClick={goForward}>N??sta</button>
                    </form>
                  </div>
    } else if (whichState === "expensesWants") {
        content = <div>
                    <h2>Behov</h2>
                    <p>Dessa utgifter anses utg??ra en viktig del av ens vardag,
                    men kan ??nd?? klassas som inte n??dv??ndiga.</p>

                    <form>
                        {needsInput.wants.map((obj) =>
                            <div className="testInputs">
                                <h3>{obj.title}</h3>
                                <img className="information" src={infoCircle} />
                                <input
                                    name={obj.category}
                                    placeholder="0.00"
                                    value={obj.amount}
                                    onChange={handleChange}
                                />
                                <select classname={obj.title} value={obj.timeframe} onChange={handleChangeSelect} >
                                    <option value="perday">Per Dag</option>
                                    <option value="perweek">Per Vecka</option>
                                    <option value="perweek2">Per 2 Veckor</option>
                                    <option selected value="permonth">Per M??nad</option>
                                </select>
                            </div>
                        )}
                        <button onClick={goForward}>N??sta</button>
                    </form>
                </div>
    } else if (whichState == "savings") {
        content = <div>
                    <h2>Sparande</h2>
                    <p>Olika former av sparande</p>

                    <form>
                        {needsInput.savings.map((obj) =>
                            <div className="testInputs">
                                <h3>{obj.title}</h3>
                                <img className="information" src={infoCircle} />
                                <input
                                    name={obj.category}
                                    placeholder="0.00"
                                    value={obj.amount}
                                    onChange={handleChange}
                                />
                                <select classname={obj.title} value={obj.timeframe} onChange={handleChangeSelect} >
                                    <option value="perday">Per Dag</option>
                                    <option value="perweek">Per Vecka</option>
                                    <option value="perweek2">Per 2 Veckor</option>
                                    <option selected value="permonth">Per M??nad</option>
                                </select>
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
