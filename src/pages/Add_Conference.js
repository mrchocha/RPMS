import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, browserHistory, IndexRoute, hashHistory } from 'react-router';
import { useLocation } from 'react-router-dom'
import queryString from 'query-string'
import {withRouter, Redirect, BrowserRouter} from 'react-router-dom';

class Conference extends Component{
    constructor(props){
        super(props)
        this.state = {
            usr_mail: queryString.parse(props.location.search)["mail"],
            paper_id: queryString.parse(props.location.search)["paper"]
        }
    }
    addConference(event){
        event.preventDefault()
        console.log("Adding Conference")
        let inputData = {
            conference_name: this.refs.conf_name.value,
            conference_venue: this.refs.conf_venue.value,
            conference_date: this.refs.conf_date.value,
            conference_time: this.refs.conf_time.value,
            usr_mail: this.state.usr_mail,
            paper_id: this.state.paper_id
        }
        this.refs.conf_name.value = ''
        this.refs.conf_venue.value = ''
        this.refs.conf_date.value = ''
        this.refs.conf_time.value = ''
        console.log(inputData)

        var request = new Request('http://localhost:5000/api/addConference',{
            method: 'POST',
            headers: new Headers({ 'Content-Type': 'application/json' }),
            body: JSON.stringify(inputData)
        });

        fetch(request)
        .then(function(response){
            response.json()
            .then(function(data){
                console.log(data)
                if(data=="CALL") alert('Conference Details Added :b')
            })
        })
        .catch(function(err){
            console.log(err)
        })

    }
    render(){
        return(
            <div
          style={{
            borderStyle: "groove",
            textAlign: "left",
            padding: "30px",
            borderRadius: "10px",
            marginLeft: "50vh",
            marginRight: "50vh"
          }}
        >
          <div style={{ fontSize: "5vh"}}>
            Enter Conference Attended Details (Press "Next" if None)
          </div>

          <form
            style={{ textAlign: "left", fontSize: "2.7vh", marginTop: "10vh" }}
          >
            <div className="form-group">
              <label htmlFor="conf_name">Enter Conference Name</label>
              <input
                type="text"
                className="form-control"
                ref="conf_name"
                aria-describedby="emailHelp"
                placeholder="International Conference of Computer Vision"
              />
            </div>
            <div className="form-group">
              <label htmlFor="conf_venue">Enter Conference Venue</label>
              <input
                type="text"
                className="form-control"
                ref="conf_venue"
                placeholder="Seoul, Korea"
                aria-describedby="emailHelp"
              />
            </div>
            <div className="form-group">
              <label htmlFor="conf_time">Enter Conference Start Date</label>
              <input
                type="date"
                className="form-control"
                ref="conf_date"
                aria-describedby="emailHelp"
              />
            </div>
            <div className="form-group">
              <label htmlFor="Ref_paper_Publish_date">
                Enter Conference Start Time (HH:MM)
              </label>
              <input
                type="time"
                className="form-control"
                ref="conf_time"
                aria-describedby="emailHelp"
              />
            </div>
            <button type="submit" className="btn btn-primary" onClick={this.addConference.bind(this)}>
              Add Record
            </button>
            <button
              className="btn btn-primary"
              style={{ marginLeft: "2px" }}
              onClick={() =>
                this.props.history.push(
                  "/manageReach?mail=" +
                    this.state.usr_mail +
                    "&paper=" +
                    this.state.paper_id
                )
              }
            >
              Next
            </button>
          </form>
        </div>

        )
    }
}

export default Conference;