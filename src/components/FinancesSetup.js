import React, { useState, useEffect } from "react";
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

function FinancesSetup() {
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
                    title: "Kläder",
                    category: "clothes",
                    timeframe: "permonth",
                    amount: 0
                },
                {
                    title: "Träning",
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

        console.log(res);
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
                                    <option value="permonth">Per Månad</option>
                                </select>
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
                                    <option selected value="permonth">Per Månad</option>
                                </select>
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
                                    <option selected value="permonth">Per Månad</option>
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
