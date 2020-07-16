import React, { Component } from 'react';
import queryString from 'query-string'
import ReactDOM from 'react-dom';

class Paper_Det extends Component{
    constructor(props){
        super(props)
        this.state={
            usr_mail: queryString.parse(props.location.search)["mail"],
            pageId: queryString.parse(props.location.search)["paper"],
            paperDetails: [],
            userDetails: [],
            domainDetails: [],
            conferenceDetails: [],
            referenceDetails: [],
            access_date: this.formatDate(new Date()),
            access_time: new Date(),
            action: 'Reading'
        }
        console.log(this.state)
        var that = this
        var request = new Request('http://localhost:5000/api/checkUser',{
            method: 'POST',
            headers: new Headers({ 'Content-Type': 'application/json' }),
            body: JSON.stringify(that.state)
        });

        fetch(request)
        .then(function(response){
            response.json()
            .then(function(data){
                console.log(data[0]["is_reachable"])
                if(data[0]["is_reachable"]==0){
                    alert("Sorry! This paper is set Confidential by its author.")
                    that.props.history.push("/home?mail="+that.state.usr_mail)
                } else {
                    that.displayDet()
                }
            })
        })
        .catch(function(err){
            console.log(err)
        })

        
        
    }
    componentDidUpdate(){

        window.onpopstate  = (e) => {
            let inputData = {
                action: this.state.action,
                engage_time: ((new Date().getTime())-(this.state.access_time.getTime()))/60000,
                access_date: this.state.access_date,
                access_time: this.state.access_time.toLocaleTimeString(),
                paper_id: this.state.pageId,
                user_mail: this.state.usr_mail
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
        }
      
      }

    displayDet(){
        var that = this;
        console.log("Displaying Paper Details")
        let inputData = {
            mail: this.state.usr_mail,
            paperId: this.state.pageId
        }
        console.log(inputData)
        
        var request = new Request('http://localhost:5000/api/fetchComments',{
            method: 'POST',
            headers: new Headers({ 'Content-Type': 'application/json' }),
            body: JSON.stringify(inputData)
        });

        fetch(request)
        .then(function(response){
            response.json()
            .then(function(data){
                console.log(data.length)
                document.getElementById("comments").innerHTML = ''
                for(var i=0; i<data.length; i++){
                    // data[i]["comment_date"] = data[i]["comment_date"].toLocaleDateString()
                    document.getElementById("comments").innerHTML += (
                    '<div class="alert alert-success" role="alert" style="border-top-right-radius:20px; border-top-left-radius:20px; border-bottom-right-radius:20px; margin-right=1vh">'+
                        '<h4 className="alert-heading">'+data[i]["user_name"]+'</h4>'+
                        '<hr />'+
                        '<p>'+
                        data[i]["comment_content"]+
                        '</p>'+
                        '<p class="mb-0" style="text-align:right">'+
                        (data[i]["comment_date"].substring(0, 10))+' '+data[i]["comment_time"]+
                        '</p>'+
                    '</div>'
                    )
                }
            })
        })
        .catch(function(err){
            console.log(err)
        })

        var request = new Request('http://localhost:5000/api/paperDetails',{
            method: 'POST',
            headers: new Headers({ 'Content-Type': 'application/json' }),
            body: JSON.stringify(inputData)
        });

        fetch(request)
        .then(function(response){
            response.json()
            .then(function(data){
                var paperDetails = data[0]
                paperDetails = paperDetails.substring(1, paperDetails.length-2)
                
                var userDetails = data[1]
                userDetails = userDetails.substring(0, userDetails.length-2)

                var domainDetails = data[2]
                domainDetails = domainDetails.substring(1, domainDetails.length-2)

                var conferenceDetails = data[3]
                conferenceDetails = conferenceDetails.substring(1, conferenceDetails.length-2)

                var referenceDetails = data[4]
                referenceDetails = referenceDetails.substring(0, referenceDetails.length-2)
                console.log("user Details = "+userDetails)
                console.log("conf details = "+conferenceDetails)

                that.setState({paperDetails: paperDetails.toString().split(","), userDetails: userDetails.toString().split("\n"), domainDetails: domainDetails.toString().split(","), conferenceDetails: conferenceDetails.toString().split("\n"), referenceDetails: referenceDetails.toString().split("\n")})
                
                that.state.paperDetails[1] = that.state.paperDetails[1].substring(1)
                that.state.userDetails[0] = that.state.userDetails[0].substring(17)
                that.state.domainDetails[1] = that.state.domainDetails[1].substring(1)
                that.state.referenceDetails[0] = that.state.referenceDetails[0].substring(22)
                that.state.conferenceDetails[0] = that.state.conferenceDetails[0].substring(22)
                //22 for conference
                console.log(that.state.conferenceDetails)
                document.getElementById("domains").innerHTML = ''
                document.getElementById("references").innerHTML = ''
                document.getElementById("authors").innerHTML = ''
                document.getElementById("conferences").innerHTML = ''
                for (var i = 2; i < that.state.domainDetails.length; i++)
                {
                    document.getElementById("domains").innerHTML += ("<li>" + that.state.domainDetails[i] + "</li>");
                }   
                for(var i=0; i<that.state.referenceDetails.length-1; i++){
                    var str = '\"';
                    that.state.referenceDetails[i] = that.state.referenceDetails[i].replace(str, "")
                    document.getElementById("references").innerHTML += ("<li>" + that.state.referenceDetails[i] + "</li>")                    
                }
                if(that.state.referenceDetails.length-1==0) document.getElementById("references").innerHTML = ("No reference paper exists.")
                for(var i=0; i<that.state.userDetails.length-1; i++){
                    var arr = []
                    arr = that.state.userDetails[i].split(",")
                    document.getElementById("authors").innerHTML += ("<li> Author Id: <b>"+arr[0]+"</b><br/>Name: <b>"+arr[1]+"</b><br/>School: <b>"+arr[2]+"</b><br/>Author type: <b>"+arr[3]+"</b><br/>E-mail Id: <b>"+arr[4]+"</b></li>")
                    document.getElementById("authors").innerHTML += "<br/>"
                }
                for(var i=0; i<that.state.conferenceDetails.length-1; i++){
                    var arr = []
                    arr = that.state.conferenceDetails[i].split(',')
                    var venue = []
                    venue = arr.slice(1, -2)
                    document.getElementById("conferences").innerHTML += ("<li> Conference Name: <b>"+arr[0]+"</b><br/>Conference Venue: <b>"+venue+"</b><br/>Conference Date: <b>"+arr[0+venue.length+2]+"</b></li>")
                    document.getElementById("authors").innerHTML += "<br/>"
                }
                if(that.state.conferenceDetails.length-1==0) document.getElementById("conferences").innerHTML = ("No conferences attended, as of now.")
                console.log(that.state)
                // if(data=="CALL") alert('Domain Added :b')
            })
        })
        .catch(function(err){
            console.log(err)
        })
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

    addComment(event){
        var that = this;
        event.preventDefault()
        let inputData = {
            new_comment: this.refs.new_comment.value,
            date: this.formatDate(new Date()),
            time: new Date().toLocaleTimeString(),
            mail: this.state.usr_mail,
            paper_id: this.state.pageId
        }
        this.refs.new_comment.value = ''
        var request = new Request('http://localhost:5000/api/addComment',{
            method: 'POST',
            headers: new Headers({ 'Content-Type': 'application/json' }),
            body: JSON.stringify(inputData)
        });

        fetch(request)
        .then(function(response){
            response.json()
            .then(function(data){
                // console.log(data)
                if(data=="Success"){
                    console.log("Comment Added Successfully.")
                    that.displayDet()
                }
            })
        })
        .catch(function(err){
            console.log(err)
        })
        console.log(inputData)
    }

    render(){
        return(
                <div className="App" style={{ marginTop: "5vh" }}>
            <div
            style={{ fontSize: "2.7vh", marginLeft: "30vh", marginRight: "30vh" }}
            >
            <div
                style={{textAlign: "left", borderStyle: "groove", padding: "30px", paddingBottom: "15vh", borderRadius: "10px" }}>
                <div style={{ fontSize: "5vh", paddingBottom: "30px", textAlign: "center"}}>
                Paper Details
                    <a href="/#">
                    <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-link" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6.354 5.5H4a3 3 0 0 0 0 6h3a3 3 0 0 0 2.83-4H9c-.086 0-.17.01-.25.031A2 2 0 0 1 7 10.5H4a2 2 0 1 1 0-4h1.535c.218-.376.495-.714.82-1z"/>
                        <path d="M9 5.5a3 3 0 0 0-2.83 4h1.098A2 2 0 0 1 9 6.5h3a2 2 0 1 1 0 4h-1.535a4.02 4.02 0 0 1-.82 1H12a3 3 0 1 0 0-6H9z"/>
                    </svg>
                    </a>
                </div>

                Paper Name:
                <br /> {this.state.paperDetails[1]}
                <br />
                <div class="dropdown-divider" />
                Paper Time Duration:
                <br /> {this.state.paperDetails[2]}
                <br />
                <div class="dropdown-divider" />
                Paper Submit Date:
                <br />{this.state.paperDetails[3]}
                <br />
                <div class="dropdown-divider" />
                Paper Accepte Date:
                <br />{this.state.paperDetails[4]}
                <br />
                <div class="dropdown-divider" />
                Paper Publish Date:
                <br />{this.state.paperDetails[5]}
                <br />
                <div class="dropdown-divider" />
                Publication Name:
                <br />{this.state.paperDetails[6]}
                <br />
                <div class="dropdown-divider" />
            </div>
            </div>
            <div>
            <div
                style={{fontSize: "5vh", marginTop: "5vh", textAlign: "center"}}>
                <div class="dropdown-divider" />
                Paper Domains
                <div
                style={{fontSize: "2.7vh", marginLeft: "30vh", marginRight: "30vh", borderStyle: "groove", padding: "30px", paddingBottom: "15vh", borderRadius: "10px", textAlign:'left'}}>
                <br />
                <div id="domains"><ul></ul></div>
                </div>
            </div>
            </div>

            <div>
            <div
                style={{fontSize: "5vh", marginTop: "5vh", textAlign: "center"}}>
                <div class="dropdown-divider" />
                Reference Papers
                <div
                style={{
                    fontSize: "2.7vh", marginLeft: "30vh", marginRight: "30vh", borderStyle: "groove", padding: "30px", paddingBottom: "15vh", borderRadius: "10px", textAlign:'left'}}>
                <br />
                <div id="references"><ul></ul></div>
                </div>
            </div>
            </div>
            <div>
            <div
                style={{fontSize: "5vh", marginTop: "5vh", textAlign: "center"}}>
                <div class="dropdown-divider" />
                Author Details
                <div
                style={{fontSize: "2.7vh", marginLeft: "30vh", marginRight: "30vh", borderStyle: "groove", padding: "30px", paddingBottom: "15vh", borderRadius: "10px", textAlign:'left'}}>
                <br />
                <div id="authors"><ul></ul></div>
                </div>
            </div>

            <div
                style={{fontSize: "5vh", marginTop: "5vh", textAlign: "center"}}>
                <div class="dropdown-divider" />
                Conferences Details
                <div
                style={{fontSize: "2.7vh", marginLeft: "30vh", marginRight: "30vh", borderStyle: "groove", padding: "30px", paddingBottom: "15vh", borderRadius: "10px", textAlign:'left'}}>
                <br />
                <div id="conferences"><ul></ul></div>
                </div>
            </div>

            <div
                style={{fontSize: "5vh", marginTop: "5vh", textAlign: "center"}}>
                <div class="dropdown-divider" />
                Comments
                <div
                style={{fontSize: "2.7vh", marginLeft: "30vh", marginRight: "30vh", borderStyle: "groove", padding: "30px", paddingBottom: "15vh", borderRadius: "10px", textAlign:'left'}}>
                <br />
                <div id="comments"></div>
                <div className="input-group">
                    <textarea className="form-control" ref="new_comment" aria-label="With textarea" />
                    <div className="input-group-prepend">
                    <buttion
                        className="btn btn-primary"
                        style={{
                        borderTopRightRadius: "10px",
                        borderBottomRightRadius: "10px"
                        }}
                        onClick = {this.addComment.bind(this)}
                    >
                        Add Comment
                    </buttion>
                    </div>
                </div>
                </div>
            </div>

            </div>
            <div style={{padding:"10vh"}}>
            </div>
            
        </div>
        );
    }
}

export default Paper_Det;