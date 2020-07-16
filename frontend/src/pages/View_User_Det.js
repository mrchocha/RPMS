import React from 'react';
import queryString from 'query-string';
import { Link } from 'react-router-dom';

class View_User_Det extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            mail: queryString.parse(this.props.location.search)['mail'],
            papers: []
        }
        this.displayUserDet()
    }

    displayUserDet() {
        var that = this
        let inputData = {
            usr_mail: this.state.mail
        }

        var request = new Request('http://localhost:5000/api/fetchUserDet', {
            method: 'POST',
            headers: new Headers({ 'Content-Type': 'application/json' }),
            body: JSON.stringify(inputData)
        });

        fetch(request)
            .then(function (response) {
                response.json()
                    .then(function (data) {
                        console.log("User Incoming")
                        console.log(data)

                        // document.getElementById("User info").innerHTML = ''
                        // document.getElementById("School info").innerHTML = ''
                        // document.getElementById("Paper info").innerHTML = ''

                        document.getElementById("User info").innerHTML += ("User ID: <b>" + data[0]["user_id"] + "</b><br/>User Name: <b>" + data[0]["user_name"] + "</b><br/>User Type: <b>" + data[0]["user_type"] + "</b>")
                        document.getElementById("School info").innerHTML += ("School Id: <b>" + data[0]["user_school"] + "</b><br/>School Name: <b>" + data[1]["school_name"])

                        // for(var i=0; i<data[2].length; i++){
                        //     document.getElementById("Paper info").innerHTML += ('<a href="/paperDetails?mail='+that.state.mail+'&paper='+data[2][i]["paper_id"]+'">'+data[2][i]["paper_name"]+' </a> <br /> <br />')
                        // }
                        that.setState({ papers: data[2] })

                    })
            })
            .catch(function (err) {
                console.log(err)
            })
    }

    render() {
        return (

            <div style={{ fontSize: "2.7vh", marginLeft: "50vh", marginRight: "50vh", marginTop: "5vh" }}>
                
                    <div style={{ textAlign:"center" }}>
                        <br />
                        <h1>Your Profile</h1>
                    </div>
                    <div style={{
                        textAlign: "left",
                        borderStyle: "groove",
                        padding: "30px",
                        paddingBottom: "15vh",
                        borderRadius: "10px"
                    }}>    
                    <div id="User info" >
                        <h3>User Info</h3><br/>
                    </div>
                    </div>
                    <div id="School info" style={{
                        textAlign: "left",
                        borderStyle: "groove",
                        padding: "30px",
                        paddingBottom: "15vh",
                        borderRadius: "10px"
                    }}>
                        <h3>User's School Info</h3> <br/>
                    </div>
                    <div id="Paper info" style={{
                        textAlign: "left",
                        borderStyle: "groove",
                        padding: "30px",
                        paddingBottom: "15vh",
                        borderRadius: "10px"
                    }}>
                        <h3>Paper's Info</h3> <br/>
                        {this.state.papers.map((number, i) => {
                            return <span><button type="button" class="btn btn-light"><Link to={"/paperDetails?mail=" + this.state.mail + "&paper=" + this.state.papers[i]["paper_id"] + "#"}> {this.state.papers[i]["paper_name"]} </Link> </button> </span>
                        })}
                    </div>

                
            </div>
        )
    }
}

export default View_User_Det