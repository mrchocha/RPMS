import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import ReactDOM from 'react-dom';
import Home from './pages/Home';
import img2 from "./21430.jpg"
import img from "./2480553.jpg";
import { Router, Route, Link, browserHistory, IndexRoute } from 'react-router';
import log from './index'

class App extends Component {
  constructor() {
    super()
    this.state = {
      title: 'Welcome to',
      user_mail: []
    }
  }

  // MAKE AJAX CALLS

  componentDidMount() {
    console.log("COMPONENT HAS MOUNTED")
  }

  validateUser(event) {
    event.preventDefault();
    console.log("Validating User...")
    let dataf = {
      user_mail: this.refs.user_mail.value,
      password: this.refs.password.value
    };
    var request = new Request('http://localhost:5000/api/login-credentials', {
      method: 'POST',
      headers: new Headers({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(dataf)
    });

    //xmlhttprequest

    fetch(request)
      .then(function (response) {
        response.json()
          .then(function (data) {
            if (data == false) {
              alert('Login was unsuccessful :( ')
            } else if (data == true) {
              // console.log(log)
              // log=1
              // console.log(log)
              alert('Login Successfully Done :) ')
              browserHistory.push('/home?mail=' + dataf.user_mail)
              ReactDOM.render(<Home />, document.getElementById('root'))
            } else {
              alert('No such user exists :| ')
            }
            console.log(data + "  ;) ")
          })
      })
      .catch(function (err) {
        console.log(err)
      })
  }

  render() {
    let title = this.state.title;
    return (
      // <Router history={browserHistory}>

      <div
        style={{ fontSize: "2.7vh" }}
      >
        <div className="row " style={{ width: "100vw", height: "100vh", backgroundColor: "#fafafa", paddingLeft: "5vw" }}>
          <div className="col-sm-5" style={{ paddingTop: "20vh" }}>
            <span style={{ fontSize: "10vh", lineHeight: "10vh", fontWeight: "500" }}>Research Paper Management System</span>
            <div>
              <br />
              <h5 style={{ paddingTop: "1vh" }}> We will manage your work.</h5>
              <br />
            </div>
            <div className="form-group">
              <input
                className="form-control"
                type="text"
                ref="user_mail"
                placeholder="Email"
                style={{ marginBottom: "10px" }}
              />
              <input
                className="form-control"
                type="password"
                ref="password"
                placeholder="Password"
                style={{ marginBottom: "10px" }}
              />
              <button className="btn btn-primary" onClick={this.validateUser.bind(this)}>Login</button>
            </div>
          </div>
          <div className="col-sm-2">
            <img src={img2} style={{ height: "auto", width: "50vw", paddingBottom: "10vh", paddingTop: "15vh" }} ></img>
          </div>
        </div>
        <div
          className="About_Home row"
          style={{
            maxWidth: "100vw",
            background: "#eeeeee",
            paddingTop: "30vh",
            minHeight: "95vh",
            paddingBottom: "10vh",
          }}
        >
          <div className="col-sm" style={{ paddingTop: "10vh", paddingLeft: "5vw" }}>
            <span style={{ fontSize: "15vh", fontWeight: "500" }}>
              About Us
            </span>
            <br></br>
             Hey there, Welcome to RPMS.
          </div>
          <div className="col-sm">
            <img src={img} style={{ height: "50vh" }}></img>
          </div>
        </div>
        <div
          className="contri"
          style={{
            maxWidth: "100vh",
            paddingTop: "5vh",
            minHeight: "70vh",
            height: "auto",
            paddingBottom: "8vh",
          }}
        >
          <h3 style={{ paddingLeft: "1vw" }}>Contributer</h3>
          <div className="row" style={{ width: "100vw" }}>
            <div className="col-sm">
              <div className="card float-right" style={{ width: "18rem" }}>
                <div style={{ textAlign: "center" }}>
                  <img
                    src="https://media-exp1.licdn.com/dms/image/C5103AQGPhLC6TSZGBQ/profile-displayphoto-shrink_200_200/0?e=1600300800&v=beta&t=s0pQx-8VB1EY2bOwC6vRIgxAveBvjAlUnxF7oGi6Dtk"
                    className="card-img-top"
                    alt="..."
                    style={{
                      height: "20vh",
                      width: "20vh",
                      paddingTop: "2vh",
                      borderRadius: "50%",
                    }}
                  ></img>
                </div>
                <div className="card-body">
                  <h5 class="card-title">
                    <h5 class="card-title">Jeet Karia</h5>
                    <h6 class="card-subtitle mb-2 text-muted">
                      School of Engineering And Applied Science
                    </h6>
                  </h5>
                  <p className="card-text">
                    Student at Ahmedabad University, B.Tech ICT.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-sm">
              <div className="card " style={{ width: "18rem" }}>
                <div style={{ textAlign: "center" }}>
                  <img
                    src="https://media-exp1.licdn.com/dms/image/C4D03AQFE_V0Zu8a_Rw/profile-displayphoto-shrink_200_200/0?e=1600300800&v=beta&t=qmZ1qHJB6TwHxUjd5SMHqxWx4TL64pKz9Tp6qV0YB5Q"
                    className="card-img-top"
                    alt="..."
                    style={{
                      height: "20vh",
                      width: "20vh",
                      paddingTop: "2vh",
                      borderRadius: "50%",
                    }}
                  ></img>
                </div>
                <div className="card-body">
                  <h5 class="card-title">Rahul Chocha</h5>
                  <h6 class="card-subtitle mb-2 text-muted">
                    School of Engineering And Applied Science
                  </h6>
                  <p className="card-text">
                    Student at Ahmedabad University, B.Tech ICT.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="contect"
          style={{
            color: "white",
            maxWidth: "100vw",
            background: "black",
            paddingTop: "5vh",
            minHeight: "50vh",
            height: "auto",
            paddingBottom: "5vh",
          }}
        >
          <h3 style={{ color: "white", paddingLeft: "1vw" }}>Contact Us</h3>
          <div
            className="info"
            style={{ maxWidth: "100vw", paddingLeft: "1vw" }}
          >
            Rahul Chocha:
            <ul>
              <li>Moblie: +91-7096642232</li>
              <li>
                Email:{" "}
                <a href="mailto:rahul.c@ahduni.edu.in">rahul.c@ahduni.edu.in</a>
              </li>
              <li>
                Github: <a href="https://github.com/mrchocha">mr_chocha</a>
              </li>
              <li>
                Linkedin:{" "}
                <a href="https://www.linkedin.com/in/rahul-chocha-14b391179/">
                  Rahul Chocha
                </a>
              </li>
            </ul>
            <br></br>
            Jeet Karia:
            <ul>
              <li>Moblie: +91-9925122579</li>
              <li>
                Email:{" "}
                <a href="mailto:jeet.k@ahduni.edu.in">jeet.k@ahduni.edu.in</a>
              </li>
              <li>
                Github: <a href="https://github.com/JeetKaria06">JeetKaria06</a>
              </li>
              <li>
                Linkedin:{" "}
                <a href="https://www.linkedin.com/in/jeet-karia-628773170/">
                  Jeet Karia{" "}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      // {/* </Router> */}
    );
  }
}
export default App;
