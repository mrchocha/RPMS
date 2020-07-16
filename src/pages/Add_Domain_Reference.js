import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, browserHistory, IndexRoute, hashHistory } from 'react-router';
import { useLocation } from 'react-router-dom'
import queryString from 'query-string'
import {withRouter, Redirect, BrowserRouter} from 'react-router-dom';
import Form from './Form'
import Add_Paper from './Add_Paper'

class Add_Domain_Reference extends Component{
    constructor(props){
        console.log("Constructor")
        super(props)
        console.log(props.location)
        this.state = {
            usr_mail: queryString.parse(props.location.search)["mail"],
            p_id: queryString.parse(props.location.search)["paper"]
        }
    }
    addDomain(event){
        event.preventDefault()
        let domainName = this.refs.add_domain.value;
        let inputData = {
            domainName: this.refs.add_domain.value,
            user_mail: this.state.usr_mail,
            paper_id: this.state.p_id
        };
        this.refs.add_domain.value = '';
        console.log(inputData)

        var request = new Request('http://localhost:5000/api/addDomain',{
            method: 'POST',
            headers: new Headers({ 'Content-Type': 'application/json' }),
            body: JSON.stringify(inputData)
        });

        fetch(request)
        .then(function(response){
            response.json()
            .then(function(data){
                console.log(data)
                if(data=="CALL") alert('Domain Added :b')
            })
        })
        .catch(function(err){
            console.log(err)
        })
    }

    addReference(event){
        event.preventDefault()
        let inputData = {
            user_mail: this.state.usr_mail,
            paper_id: this.state.p_id,
            ref_paper_name: this.refs.ref_paper_name.value,
            ref_author_name: this.refs.ref_paper_author.value,
            ref_paper_publish_date: this.refs.ref_paper_publish_date.value,
            ref_paper_publication: this.refs.ref_paper_publication.value,
            ref_paper_doi: this.refs.ref_paper_doi.value
        }
        this.refs.ref_paper_name.value = ''
        this.refs.ref_paper_author.value = ''
        this.refs.ref_paper_publish_date.value = ''
        this.refs.ref_paper_publication.value = ''
        this.refs.ref_paper_doi.value = ''
        console.log(inputData)

        var request = new Request('http://localhost:5000/api/addReference',{
            method: 'POST',
            headers: new Headers({ 'Content-Type': 'application/json' }),
            body: JSON.stringify(inputData)
        });

        fetch(request)
        .then(function(response){
            response.json()
            .then(function(data){
                console.log(data)
                if(data=="CALL") alert('Reference Paper Added :b')
            })
        })
        .catch(function(err){
            console.log(err)
        })
    }
    render(){
        return(
            <div>
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
              <div style={{ fontSize: "5vh" }}>Enter Domain Details</div>
              <form
                style={{
                  textAlign: "left",
                  fontSize: "2.7vh",
                  marginTop: "10vh"
                }}
              >
                <div className="form-group">
                  <label htmlFor="Add_Domain">Enter Domain Name</label>
                  <input
                    type="text"
                    className="form-control"
                    ref="add_domain"
                    aria-describedby="emailHelp"
                  />
                </div>
                <button type="submit" className="btn btn-primary" onClick={this.addDomain.bind(this)}>
                  Add Domain
                </button>
              </form>
            </div>
            <div style={{
                borderStyle: "groove",
                textAlign: "left",
                padding: "30px",
                borderRadius: "10px",
                marginLeft: "50vh",
                marginTop: "3vh",
                marginRight: "50vh",
                marginBottom:"3vh"
              }}>
              <div style={{ fontSize: "5vh" }}>
                Enter Reference Paper Details
              </div>
  
              <form
                style={{
                  textAlign: "left",
                  fontSize: "2.7vh",
                  marginTop: "10vh"
                }}
              >
                <div className="form-group">
                  <label htmlFor="Ref_paper">Enter Reference Paper Name</label>
                  <input
                    type="text"
                    className="form-control"
                    ref="ref_paper_name"
                    aria-describedby="emailHelp"
                    placeholder="AutoML"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="Ref_paper_Author">
                    Enter Reference Author Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    ref="ref_paper_author"
                    placeholder="R. Chocha, JK. Karia"
                    aria-describedby="emailHelp"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="Ref_paper_Publish_date">
                    Enter Reference Publish Date
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    ref="ref_paper_publish_date"
                    aria-describedby="emailHelp"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="Ref_paper_Publish_date">
                    Enter Reference Publisher
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    ref="ref_paper_publication"
                    placeholder="IEEE Transactions"
                    aria-describedby="emailHelp"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="Ref_paper_Publish_date">
                    Enter Referance DOI Number
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    ref="ref_paper_doi"
                    placeholder="DOI_Number"
                    aria-describedby="emailHelp"
                  />
                </div>
                <button type="submit" className="btn btn-primary" onClick={this.addReference.bind(this)}>
                  Add Reference Paper
                </button>
                <button
                  onClick={() =>
                    this.props.history.push(
                      "/addConfDet?mail=" +
                        this.state.usr_mail +
                        "&paper=" +
                        this.state.p_id
                    )
                  }
                  className="btn btn-primary" style={{marginLeft:"1vh"}}
                >
                  Next
                </button>
              </form>
            </div>
          </div>
        );
    }
}

export default withRouter(Add_Domain_Reference);