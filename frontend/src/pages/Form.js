import React, {useRef, useEffect, Component} from 'react'
import {Link, useParams, useLocation, useHistory, useRouteMatch} from 'react-router-dom';
import { BrowserRouter, Route, Switch, withRouter } from 'react-router-dom';
import Home from './Home';
import ReactDOM from 'react-dom'
import queryString from 'query-string';
import Add_Domain_Reference from './Add_Domain_Reference'
import loggedIn from './../index'

class Form extends Component{
        
        constructor(props){
            console.log("Constructor")
            super(props)
            console.log(props.location)
            this.state = {
                mail: queryString.parse(props.location.search)["mail"],
                title: "Welcome to the Research Paper Portal",
                pair: [],
                ans: ''
            }
            console.log(this.state.mail)
        }
        
        searchIt(event){
            event.preventDefault()
            console.log("Search in Progress...")
            let data = {
                search_key: this.refs.search_value.value,
                usr_mail: this.state.mail
            };
            console.log(data.search_key)
            var request = new Request('http://localhost:5000/api/searchKey',{
                method: 'POST',
                headers: new Headers({ 'Content-Type': 'application/json' }),
                body: JSON.stringify(data)
            });

            var that = this;

            fetch(request)
            .then(function(response){
                response.json()
                .then(function(data){
                    // data = JSON.stringify(data)
                    console.log(data.length + ";;;")
                    that.state.ans = data
                    var pair = []
                    // var pair = {paper_id: '', paper_name: ''}
                    for(let i=0; i<data.length; i++){
                        // arr[i] = data[i]["paper_id"]
                        pair[i] = {paper_id: data[i]["paper_id"], paper_name: data[i]["paper_name"]}
                        // pair[i].paper_name = data[i]["paper_name"]
                        // ReactDOM.render(Form, document.getElementById('root'))
                        // ReactDOM.render(makeButton(arr[i]), document.getElementById("form"))
                    }
                    that.state.pair = pair
                    console.log(that.state.pair)
                    // ReactDOM.render(that.getButtonsUsingMap(), that.refs.form)
                    // ReactDOM.render(document.getElementById("content"))
                    that.render()
                    that.forceUpdate()
                })
            })
            .catch(function(err){
                console.log(err)
            })
            // this.getButtonsUsingMap();
            
        }
        routeChange=(event)=> {
            const history = useHistory();
            event.preventDefault()
            let path = `/paperDetails`;
            history.push(path);
        }
        getButtonsUsingMap() {
            if(this.state.pair.length>0){
                const array = this.state.pair
                console.log(array)
                    return (
                    array.map((number, index) => {
                        return <span><button type="button" class="btn btn-light"><Link to={"/paperDetails?mail="+this.state.mail+"&paper="+this.state.pair[index].paper_id+"#"}> {this.state.pair[index].paper_name} </Link> </button> </span>
                    })
                )
            }
        }
        render(){
            return(
                <div id = "Form" ref="form" style={{textAlign: "left", borderStyle: "groove", padding: "30px", paddingBottom: "15vh", borderRadius: "10px" ,fontSize: "2.7vh",marginTop: "10vh", marginLeft: "50vh", marginRight: "50vh" }}> 
                      <div>
                        <h1>{this.state.title}</h1>
                        <form>
                            <input type="text"  className="form-control" ref="search_value" placeholder="Enter Paper Domain..." />
                            <button  className="btn btn-primary" onClick={this.searchIt.bind(this)}>Search</button>
                            <ul>
                                <li><Link to={"/addpaper?mail="+this.state.mail}>Add Paper</Link></li>
                                <li><Link to={"/viewHistory?mail="+this.state.mail}>View History</Link></li>
                                <li><Link to={"/viewProfile?mail="+this.state.mail}>My Profile</Link></li>
                            </ul>  
                            <h3>Search Results will be shown below(Paper Ids)</h3>
                            {this.getButtonsUsingMap()}
                        </form>
                        </div>
                </div>
            );
        }
}

export default withRouter(Form);