import React, { Component } from 'react';
import './Home.css';
import Add_Paper from './Add_Paper'
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Form from './Form';
import Add_Domain_Reference from './Add_Domain_Reference'
import Paper_Det from './Paper_Det'
import Add_Conference from './Add_Conference'
import View_User_History from './View_User_History'
import Manage_Reach from './Manage_Reach'
import View_User_Det from './View_User_Det'

class Home extends React.Component{

    constructor(){
        super()
        this.state = {
            title: 'Welcome to the Research Paper Portal',
            search_key: []
        }
    }

    render(){
        console.log("Rendering Home Page...")
        let title = this.state.title;
        return(
            <BrowserRouter>
                <Switch>
                    <Route path="/home" component={Form} />
                    <Route path="/addpaper" component={Add_Paper} /> 
                    <Route path="/domainReference" component={Add_Domain_Reference} />
                    <Route path="/paperDetails" component={Paper_Det} />
                    <Route path="/addConfDet" component={Add_Conference} />
                    <Route path="/viewHistory" component={View_User_History} />
                    <Route path="/manageReach" component={Manage_Reach} /> 
                    <Route path="/viewProfile" component={View_User_Det} />
                </Switch>
            </BrowserRouter>
        );
    }
}

// ReactDOM.render((
//     <Router history={browserHistory}>
//       <Route path = "/pages" component = {Home}> 
//         <IndexRoute component = {Home} />
        
//       </Route>
//     </Router>
// ), document.getElementById('root'));
  

export default Home;

// module.exports = Home;