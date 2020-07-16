import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, browserHistory, IndexRoute, hashHistory } from 'react-router';
import { useLocation } from 'react-router-dom'
import queryString from 'query-string'
import {withRouter, Redirect, BrowserRouter} from 'react-router-dom';

class Manage_Reach extends Component{
  constructor(props){
    super(props);
    this.state = {
      usr_mail: queryString.parse(props.location.search)["mail"],
      paper_id: queryString.parse(props.location.search)["paper"],
      seas: [false, false],
      amsom: [false, false],
      sas: [false, false],
      scs: [false, false],
      bls: [false, false]
    }
  }
  implement(event){
    event.preventDefault()
    console.log("Implementing")
    console.log(this.state)
    let inputData = {
      usr_mail: this.state.usr_mail,
      paper_id: this.state.paper_id,
      seas: (Number(this.state.seas[1])*2+Number(this.state.seas[0])),    // index - 1 is for faculties and 0 is for students
      amsom: (Number(this.state.amsom[1])*2+Number(this.state.amsom[0])),
      scs: (Number(this.state.scs[1])*2+Number(this.state.scs[0])),
      sas: (Number(this.state.sas[1])*2+Number(this.state.sas[0])),
      bls: (Number(this.state.bls[1])*2+Number(this.state.bls[0]))
    }
    console.log(inputData)
    var request = new Request('http://localhost:5000/api/implementReach',{
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(inputData)
    });

    fetch(request)
    .then(function(response){
        response.json()
        .then(function(data){
            console.log(data)
            alert('Paper Security Implemented : ) ')
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
          marginTop: "6vh",
          marginRight: "50vh"
        }}
      >
        <div style={{ fontSize: "5vh" }}>Decide Your Paper Reach </div>
        <form style={{ fontSize: "2.7vh" }}>
          <br />
          School Of Engineering And Applied Science
          <br />
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="checkbox"
              id="inlineCheckbox1seas"
              value="seas1"
              onChange = {() => this.setState({seas: [!this.state.seas[0], this.state.seas[1]]})}
            />
            <label className="form-check-label" for="inlineCheckbox1">
              Student
            </label>
          </div>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="checkbox"
              id="inlineCheckbox2seas"
              value="seas2"
              onChange = {() => this.setState({seas: [this.state.seas[0], !this.state.seas[1]]})}
            />
            <label className="form-check-label" for="inlineCheckbox2">
              Faculty
            </label>
          </div>
          <br />
          <br />
          Amrut Mody School Of Management
          <br />
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="checkbox"
              id="inlineCheckbox1amsom"
              value="amsom1"
              onChange = {() => this.setState({amsom: [!this.state.amsom[0], this.state.amsom[1]]})}
            />
            <label className="form-check-label" for="inlineCheckbox1">
              Student
            </label>
          </div>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="checkbox"
              id="inlineCheckbox2amsom"
              value="amsom2"
              onChange = {() => this.setState({amsom: [this.state.amsom[0], !this.state.amsom[1]]})}
            />
            <label className="form-check-label" for="inlineCheckbox2">
              Faculty
            </label>
          </div>
          
          <br />
          <br />
          School of Arts and Science
          <br />
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="checkbox"
              id="inlineCheckbox1sas"
              value="sas1"
              onChange = {() => this.setState({sas: [!this.state.sas[0], this.state.sas[1]]})}
            />
            <label className="form-check-label" for="inlineCheckbox1">
              Student
            </label>
          </div>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="checkbox"
              id="inlineCheckbox2sas"
              value="sas2"
              onChange = {() => this.setState({sas: [this.state.sas[0], !this.state.sas[1]]})}
            />
            <label className="form-check-label" for="inlineCheckbox2">
              Faculty
            </label>
          </div>

          <br />
          <br />
          School of Computer Studies
          <br />
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="checkbox"
              id="inlineCheckbox1scs"
              value="scs1"
              onChange = {() => this.setState({scs: [!this.state.scs[0], this.state.scs[1]]})}
            />
            <label className="form-check-label" for="inlineCheckbox1">
              Student
            </label>
          </div>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="checkbox"
              id="inlineCheckbox2scs"
              value="scs2"
              onChange = {() => this.setState({scs: [this.state.scs[0], !this.state.scs[1]]})}
            />
            <label className="form-check-label" for="inlineCheckbox2">
              Faculty
            </label>
          </div>
          <br />
          <br />
          Biological & Life Sciences
          <br />
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="checkbox"
              id="inlineCheckbox1bls"
              value="ls1"
              onChange = {() => this.setState({bls: [!this.state.bls[0], this.state.bls[1]]})}
            />
            <label className="form-check-label" for="inlineCheckbox1">
              Student
            </label>
          </div>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="checkbox"
              id="inlineCheckbox2bls"
              value="ls2"
              onChange = {() => this.setState({bls: [this.state.bls[0], !this.state.bls[1]]})}
            />
            <label className="form-check-label" for="inlineCheckbox2">
              Faculty
            </label>
          </div>
          <br/>
          <br/>
          <button className="btn btn-primary" onClick={this.implement.bind(this)}>Implement</button>
          <button className="btn btn-primary" style={{marginLeft:"3px"}} onClick={() => this.props.history.push('/home?mail='+this.state.usr_mail)}>Home</button>
          <br/>
        </form>
      </div>
      )
  }
}

export default Manage_Reach;