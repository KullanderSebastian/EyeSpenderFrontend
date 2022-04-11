import React from "react";

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
            financeData: {}
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
            });

            console.log(this.state.financeData);
        };
        fetchFinanceData();
    }

    render() {

        return <main className="dashboard"><h1>{this.state.financeData.salary}</h1></main>;
    }
}

export default Dashboard;
