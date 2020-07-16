import React, { Component } from 'react';
import queryString from 'query-string'
import { Router, Link, IndexRoute, browserHistory } from 'react-router';
import { useHistory, useLocation, BrowserRouter, Switch, Route, Redirect, withRouter } from 'react-router-dom';
import ReactDOM from 'react-dom';
import Add_Domain_Reference from './Add_Domain_Reference'
import Form from './Form'

class Add_Paper extends Component {
    // const history = useHistory()
    constructor(props){
        console.log("Constructor")
        super(props)
        console.log(props.location)
        this.state = {
            mail: queryString.parse(props.location.search)["mail"],
            paperDurationType: 'Year',
            paperCitationType: 'IEEE',
            p_id: ''
        }
        console.log("Hello "+this.state.mail)
    }
    state = { redirect: null}
    submitPaper(event){    
        var that = this;
        event.preventDefault()
        console.log("Submitting Your Paper...")
        let dataf = {
            paperName: this.refs.paper_name.value,
            paperDuration: this.refs.paper_duration.value,
            paperSubmitDate: this.refs.paper_submit_date.value,
            paperAcceptDate: this.refs.paper_accept_date.value,
            paperPublishDate: this.refs.paper_publish_date.value,
            paperCitationType: this.state.paperCitationType,
            paperDurationType: this.state.paperDurationType,
            publicationName: this.refs.publication_name.value,
            userMail: this.state.mail,
            paperAuthor: this.refs.paper_author.value
        };
        console.log(dataf)

        var request = new Request('http://localhost:5000/api/addPaperDetails',{
                method: 'POST',
                headers: new Headers({ 'Content-Type': 'application/json' }),
                body: JSON.stringify(dataf)
        });

        fetch(request, {
            headers : { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }

        })
        .then((response) => response.json())
        .then((msg) => {
            console.log((msg));
            if(msg>=0){
                alert('Paper Inserted Successfully :)')
                that.state.p_id = msg;
                let inputData = {
                    action: 'Inserting',
                    engage_time: 0.0,
                    access_date: this.formatDate(new Date()),
                    access_time: new Date().toLocaleTimeString(),
                    paper_id: that.state.p_id,
                    user_mail: this.state.mail
                }
                console.log(inputData)
                var request = new Request('http://localhost:5000/api/trackUser',{
                    method: 'POST',
                    headers: new Headers({ 'Content-Type': 'application/json' }),
                    body: JSON.stringify(inputData)
                });
                console.log("Adding to History ;-?")
                fetch(request)
                .then(function(response){
                    response.json()
                    .then(function(data){
                        console.log(data)
                        if(data=="Added")console.log("Added to History :?")
                    })
                })
                .catch(function(err){
                    console.log(err)
                })
                that.props.history.push('/domainReference?mail='+that.state.mail+'&paper='+that.state.p_id)
            }
        });
       
    }

    formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + (d.getDate()),
            year = d.getFullYear();
    
        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;
    
        return [year, month, day].join('-');
    }
    handleChangeDate(event){
        event.preventDefault()
        console.log("Handling Things, Don't Worry...    :)")
        console.log(event.target[event.target.selectedIndex].value)
        this.state.paperDurationType = event.target[event.target.selectedIndex].value
    }

    handleChangeType(event){
        event.preventDefault()
        console.log("Handling Citation Type, Don't Worry...  :)")
        console.log(event.target[event.target.selectedIndex].value)
        this.state.paperCitationType = event.target[event.target.selectedIndex].value
    }

    render(){
        if (this.state.redirect) {
            console.log(this.state.redirect)
            return (
                <BrowserRouter>
                <Redirect push to={this.state.redirect} />
                <Route path='/addpaper/domainReference'>
                    <Add_Domain_Reference />
                </Route>
                </BrowserRouter>
            );
        }
        return( 
            <div style={{ fontSize: "2.7vh" }}>
          <div
            className="Title"
            style={{ textAlign: "center", fontSize: "5vh" }}
          >
            Add Details about Your Work
          </div>

          <div
            style={{
              borderStyle: "groove",
              textAlign: "left",
              padding: "30px",
              borderRadius: "10px",
              marginLeft: "50vh",
              marginTop: "6vh",
              marginRight: "50vh"
            }}
          >
            <div style={{ textAlign: "center", fontSize: "4vh" }}>
              Paper Details
            </div>

            <div className="form-group">
              <label htmlFor="exampleInputEmail1">Paper Name</label>
              <input
                type="text"
                ref="paper_name"
                className="form-control"
                id="paper_name"
                aria-describedby="emailHelp"
                placeholder="Research Paper Name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="exampleInputEmail1">
                Author Ids(Other Than You)
              </label>
              <input
                type="text"
                ref="paper_author"
                className="form-control"
                id="paper_name"
                aria-describedby="emailHelp"
                placeholder="Author Names"
              />
            </div>

            <div className="form-group">
              <label htmlFor="exampleInputEmail1">Publication Name</label>
              <input
                type="text"
                ref="publication_name"
                className="form-control"
                id="paper_name"
                aria-describedby="emailHelp"
                placeholder="Publication Name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="exampleInputPassword1">Paper Time Duration</label>
              <div className="row">
                <div className="col">
                  <input
                    type="text"
                    ref="paper_duration"
                    className="form-control"
                    id="paper_time_duration"
                    placeholder="Enter number"
                  />
                </div>

                <div className="col">
                  <select
                    className="form-control"
                    onChange={this.handleChangeDate.bind(this)}
                  >
                    <option>Year</option>
                    <option>Month</option>
                    <option>Day</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="exampleInputEmail1">Paper Submit Date</label>
              <input
                type="date"
                ref="paper_submit_date"
                className="form-control"
                id="submit_date"
                aria-describedby="emailHelp"
              />
            </div>

            <div className="form-group">
              <label htmlFor="exampleInputEmail1">Paper Accept Date</label>
              <input
                type="date"
                ref="paper_accept_date"
                className="form-control"
                id="paper_name"
                aria-describedby="emailHelp"
              />
            </div>

            <div className="form-group">
              <label htmlFor="exampleInputEmail1">Paper Publish Date</label>
              <input
                type="date"
                ref="paper_publish_date"
                className="form-control"
                id="paper_name"
                aria-describedby="emailHelp"
              />
            </div>

            <div className="form-group">
              <label htmlFor="exampleInputPassword1">Paper Citation Type</label>
              <select
                className="form-control "
                onChange={this.handleChangeType.bind(this)}
              >
                <option> IEEE </option>
                <option> MLA </option>
                <option> APA </option>
                <option> CHICAGO </option>
                <option> CSE </option>
              </select>
            </div>

            <input
              type="button"
              value="Submit"
              onClick={this.submitPaper.bind(this)}
              className="btn btn-primary submit_paper_details"
            />
          </div>
        </div>
    );}
}

export default withRouter(Add_Paper);
