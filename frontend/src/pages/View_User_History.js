import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, browserHistory, IndexRoute, hashHistory } from 'react-router';
import { useLocation } from 'react-router-dom'
import queryString from 'query-string'
import {withRouter, Redirect, BrowserRouter} from 'react-router-dom';

class View_User_History extends Component{
    constructor(props){
      super(props)
      this.state = {
        usr_mail: queryString.parse(this.props.location.search)["mail"],
        history_det: []
      }
      this.displayHist()
    }

    displayHist(){
      var that = this
      console.log("Displaying Details")
      let inputData = {
        usr_mail: this.state.usr_mail
      }
      var request = new Request('http://localhost:5000/api/fetchHistory',{
          method: 'POST',
          headers: new Headers({ 'Content-Type': 'application/json' }),
          body: JSON.stringify(inputData)
      });

      fetch(request)
      .then(function(response){
          response.json()
          .then(function(data){
              console.log(data)
              if(data.length>0){
                document.getElementById("history").innerHTML = ''
                for(var i=0; i<data.length; i++){
                  // document.getElementById("history").innerHTML += (
                  //   '<div className="card">'+
                  //     '<div className="card-header">'+
                  //       'Date Accessed: '+data[i]["access_date"].substring(0, 10)+' Time Accessed: '+data[i]["access_time"]+
                  //     '</div>'+
                  //     '<div className="card-body">'+
                  //       '<h5 className="card-title">Paper ID:'+data[i]["paper_id"]+'</h5>'+
                  //       '<p className="card-text">Action Performed: '+data[i]["action"]+'</p>'+
                  //       '<button className="btn btn-primary" onClick={this.redirect()}>Redirect to Paper</button>'+
                  //     '</div>'+
                  //   '</div>'
                  // )
                  // ReactDOM.render(, document.getElementById("history"))
                  that.state.history_det[i] = {access_date: data[i]["access_date"].substring(0, 10), access_time: data[i]["access_time"], paper_id: data[i]["paper_id"], action: data[i]["action"]}
                }
              }
              that.render()
              that.forceUpdate()
          })
      })
      .catch(function(err){
          console.log(err)
      })
    }

    redirect(){
      console.log("Redirecting")
      if(this.state.history_det.length>0){
        const array = this.state.history_det
        console.log(array)
            return (
            array.map((number, index) => {
                return(
                  <div className="card">
                  <div className="card-header">Date Accessed: {this.state.history_det[index].access_date} Time Accessed: {this.state.history_det[index].access_time}</div>
                  <div className="card-body">
                <h5 className="card-title">Paper ID: {this.state.history_det[index].paper_id}</h5>
                    <p className="card-text">
                      Action Performed: {this.state.history_det[index].action}
                    </p>
                    <button className="btn btn-primary" onClick={() => this.props.history.push("/paperDetails?mail="+this.state.usr_mail+"&paper="+this.state.history_det[index].paper_id+"#")}>
                      Redirect to the Paper
                    </button>
                  </div>
                </div> 
                )
            })
        )
      }
    }
    
    render() {
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
              <div style={{ fontSize: "5vh", textAlign: "center" }}>
                <br />
                Your History{" "}
              </div>

              <br />
              {this.redirect()}
              <div id="history"></div>
            </div>
        )
    }
}

export default View_User_History;