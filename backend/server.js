// import alert from 'alert-node'

let express = require('express')
let bodyParser = require('body-parser')
let morgan = require('morgan')
let pg = require('pg')
var session = require('express-session')
const { Router } = require('express')
const PORT = 5000;

let pool = new pg.Pool({
    port: 3306,
    password: 'secret',
    database: 'postgres',
    user: 'postgres'
});

// pool.connect((err, db, done) => {
//     if(err)
//         return console.log("error occured "+err)
//     else{
//         var id=3;
//         var user_name="Maryam Kaveshgar"
//         var user_school=1
//         var user_type="Assistant Professor"
//         var password="maryam@seas"
//         var user_mail="maryam.k@ahduni.edu.in"

//         console.log("Connection Occured.")
//         db.query('SELECT * FROM "User"', (err, data) => {
//             if(err){
//                 return console.log("Error in fetching "+err)
//             } else {
//                 console.log("You are lucky")
//                 return console.log(data.rows[0].user_mail)
//             }
//         });
//     }
// })

let app = express();


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.use(morgan('dev'));

app.use(function(request, response, next) {
    response.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.post('/api/login-credentials', function(request, response){
    pool.connect((err, db, done) => {
    if(err){
        response.status(400).send(err)
        console.log(err)
        return;
    } else {
        var user_mail=request.body.user_mail;
        var password=request.body.password;
        console.log("Connection Occured.")
        db.query('SELECT check_login($1, $2)',[user_mail, password], (err, data) => {
            if(err){
                return response.status(400).send(err)
            } else {
                console.log("You are lucky")
                console.log(data.rows)
                if(data.rows[0]["check_login"]==true){
                    console.log('Login Successfully Done :)')

                } else if(data.rows[0]["check_login"]==false){
                    console.log('Login Credentials Does not matched :(')
                
                } else {

                    console.log('Such User does not exist :| ')
                    data.rows[0]["check_login"] = "null"

                }
                response.status(201).send(data.rows[0]["check_login"])
            }
        });
    }
})
});

// app.use(function(request, response, next) {
//     response.header("Access-Control-Allow-Origin", "http://localhost:3000/home"); // update to match the domain you will make the request from
//     response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });


app.post('/api/searchKey', function(request, response){
    pool.connect((err, db, done) => {
    if(err){
        response.status(400).send(err)
        console.log(err)
        return;
    } else {
        console.log("Connection Occured.")
        db.query('call Search_using_Domains($1)',[request.body.search_key], (err, data) => {
            if(err){
                return response.status(400).send(err)
            } else {
                console.log("Scrapping the Database :() ")
                console.log("Search Results are being fetched...")
            }
        });
        db.query('select * from paper where paper_id in (select p_id from searched_resultpaper_domain)', (err, data) =>{
            if(err){
                return response.status(400).send(err)
            } else {
                // console.log(data.rows)
                console.log(data.rows)
                return response.status(201).send((data.rows))
            }
        });
    }
})
});

app.post('/api/addPaperDetails', function(request, response){
    console.log(request.body)
    pool.connect((err, db, done) => {
    if(err){
        response.status(400).send(err)
        console.log(err)
        return;
    } else {
        var paper_name = request.body.paperName;
        var paper_duration = request.body.paperDuration;
        var paper_submitDate = request.body.paperSubmitDate;
        var paper_acceptDate = request.body.paperAcceptDate;
        var paper_publishDate = request.body.paperPublishDate;
        var paper_citationType = request.body.paperCitationType;
        var paper_durationType = request.body.paperDurationType;
        var paper_author_mail = request.body.userMail;
        var paper_publication_name = request.body.publicationName;
        var paper_author_ids;
        
        if (request.body.paperAuthor == "") paper_author_ids=[]
        else paper_author_ids = (request.body.paperAuthor).split(',');

        var p_id = '';
        var usr_id = '';

        if(paper_durationType=="Year"){
            console.log("Year")
            paper_duration = paper_duration * 365;
        } else if(paper_durationType=="Month"){
            console.log("Month")
            paper_duration = paper_duration * 30;
        }

        console.log("Generating Unique Paper ID... :)")
        db.query('select Insert_Into_Paper_table($1, $2, $3, $4, $5, $6)',[paper_name, paper_duration, paper_submitDate, paper_acceptDate, paper_publishDate, paper_citationType], (err, data) => {
            if(err){
                return response.status(400).send(err)
            } else {
                console.log(data.rows)
                p_id = data.rows[0]["insert_into_paper_table"]
                if(data.rows[0]["insert_into_paper_table"]>=0){
                    console.log("Unique Paper ID Generated Successfully ;) ")
                    db.query('call insert_into_publication_table($1, $2)', [paper_publication_name, data.rows[0]["insert_into_paper_table"]], (err, data) => {
                        if(err){
                            return response.status(400).send(err)
                        } else {
                            console.log("Publication added Successfully :> ")
                            console.log(data)                     
                        }
                    });
                } else {
                    console.log("Paper Already Exists :/ ")
                    return response.status(201).send("PaperError");
                }
                db.query('select user_id from "User" where user_mail=$1', [paper_author_mail], (err, data) => {
                    if(err){
                        return response.status(400).send(err)
                    } else {
                        console.log("Fetched User_ID from the database :}")
                        usr_id = data.rows[0]["user_id"]
                    }
                    db.query('call insert_into_school_user_paper($1, $2)', [paper_author_ids.concat(usr_id), p_id], (err, data) => {
                        console.log(paper_author_ids)
                        if(err){
                            return response.status(400).send(err)
                        } else {
                            console.log("Done Successfully : )")
                            return response.status(201).send(JSON.stringify(p_id))
                        }
                    });
                });
                
            }
        });
    }
})
});


app.post('/api/addDomain', function(request, response){
    console.log(request.body)
    pool.connect((err, db, done) => {
    if(err){
        response.status(400).send(err)
        console.log(err)
        return;
    } else {
        console.log("Connection Occured.")
        db.query('call insert_into_domain_table($1, $2)',[request.body.domainName, request.body.paper_id], (err, data) => {
            if(err){
                return response.status(400).send(err)
            } else {
                console.log('Corresponding Domain Inserted :K')
                console.log(data)
                return response.status(201).send(JSON.stringify(data.command))
            }
        });
    }
})
});

app.post('/api/addReference', function(request, response){
    console.log(request.body)
    pool.connect((err, db, done) => {
    if(err){
        response.status(400).send(err)
        console.log(err)
        return;
    } else {
        console.log("Connection Occured.")
        console.log(request.body)
        var ref_paper_name = request.body.ref_paper_name
        var ref_publish_date = request.body.ref_paper_publish_date
        var authorName = (request.body.ref_author_name).split(',')
        var ref_publication = request.body.ref_paper_publication
        var doi_num = request.body.ref_paper_doi
        var paper_id = request.body.paper_id
        console.log(authorName)
        db.query('call insert_into_Reference_table($1, $2, $3, $4, $5, $6)',[ref_paper_name, ref_publish_date, authorName, ref_publication, doi_num, paper_id], (err, data) => {
            if(err){
                return response.status(400).send(err)
            } else {
                console.log('Corresponding Reference Paper Inserted : b')
                console.log(data)
                return response.status(201).send(JSON.stringify(data.command))
            }
        });
    }
})
});

app.post('/api/paperDetails', function(request, response){
    console.log(request.body)
    pool.connect((err, db, done) => {
    if(err){
        response.status(400).send(err)
        console.log(err)
        return;
    } else {
        console.log("Connection Occured.")
        let usr_mail = request.body.mail;
        let paperId = request.body.paperId;
        db.query('select * from Generate_report($1)',[paperId], (err, data) => {
            if(err){
                return response.status(400).send(err)
            } else {
                console.log('Showing Paper Details ;)')
                // console.log(data.rows[0]["generate_report"])
                console.log(data.rows[0]["generate_report"])
                return response.status(201).send(JSON.stringify(data.rows[0]["generate_report"]))
            }
        });
    }
})
});

app.post('/api/addConference', function(request, response){
    console.log(request.body)
    pool.connect((err, db, done) => {
    if(err){
        response.status(400).send(err)
        console.log(err)
        return;
    } else {
        console.log("Connection Occured.")
        console.log(request.body)
        var conf_name = request.body.conference_name;
        var conf_venue = request.body.conference_venue;
        var conf_date = request.body.conference_date;
        var conf_time = request.body.conference_time;
        var usr_mail = request.body.usr_mail;
        var paper_id = request.body.paper_id;

        db.query('call insert_into_conference_table($1, $2, $3, $4, $5)',[conf_name, conf_venue, conf_time, paper_id, conf_date], (err, data) => {
            if(err){
                return response.status(400).send(err)
            } else {
                console.log('Conference Details Inserted : b')
                console.log(data)
                return response.status(201).send(JSON.stringify(data.command))
            }
        });
    }
})
});

app.post('/api/fetchComments', function(request, response){
    console.log(request.body)
    pool.connect((err, db, done) => {
    if(err){
        response.status(400).send(err)
        console.log(err)
        return;
    } else {
        console.log("Connection Occured.")
        let usr_mail = request.body.mail;
        let paperId = request.body.paperId;
        db.query('select * from comment c inner join "User" u on c.comment_user=u.user_id where comment_paper_id=$1 order by comment_id',[paperId], (err, data) => {
            if(err){
                return response.status(400).send(err)
            } else {
                console.log('Comments are fetched ;)')
                // console.log(data.rows[0]["generate_report"])
                for(var i=0; i<data.rows.length; i++){
                    data.rows[i]["comment_date"] = data.rows[i]["comment_date"].toLocaleString()
                }   
                console.log(data.rows)
                return response.status(201).send(JSON.stringify(data.rows))
            }
        });
    }
})
});

app.post('/api/addComment', function(request, response){
    console.log(request.body)
    pool.connect((err, db, done) => {
    if(err){
        response.status(400).send(err)
        console.log(err)
        return;
    } else {
        console.log("Connection Occured.")
        var usr_mail = request.body.mail;
        var paperId = request.body.paper_id;
        var time = request.body.time;
        var date = request.body.date;
        var new_comment = request.body.new_comment;

        db.query('select user_id from "User" where user_mail=$1',[usr_mail], (err, data) => {
            if(err){
                console.log(err)
                return response.status(201).send(err)
            } else {
                console.log("User Id Fetched :-| ")
                console.log(data.rows[0]["user_id"])
                db.query('insert into comment values(0, $1, $2, $3, $4, $5)',[time, new_comment, data.rows[0]["user_id"], paperId, date], (err, data) => {
                    if(err){
                        return response.status(400).send(err)
                    } else {
                        console.log('Comment Inserted ;)')
                        // console.log(data.rows[0]["generate_report"])
                        console.log(data.rows)
                        return response.status(201).send(JSON.stringify("Success"))
                    }
                });
            }
        })
    }
})
});

app.post('/api/implementReach', function(request, response){
    console.log(request.body)
    pool.connect((err, db, done) => {
    if(err){
        response.status(400).send(err)
        console.log(err)
        return;
    } else {
        console.log("Connection Occured.")
        let usr_mail = request.body.usr_mail;
        let paperId = request.body.paper_id;
        let seas = request.body.seas;
        let amsom = request.body.amsom;
        let scs = request.body.scs;
        let sas = request.body.sas;
        let bls = request.body.bls;
        db.query('insert into reach values($1, $2, $3, $4, $5, $6)',[paperId, seas, amsom, scs, sas, bls], (err, data) => {
            if(err){
                return response.status(400).send(err)
            } else {
                console.log('Your Paper is Secured ;|')
                console.log(data.rows)
                return response.status(201).send(JSON.stringify(data.rows))
            }
        });
    }
})
});

app.post('/api/checkUser', function(request, response){
    console.log(request.body)
    pool.connect((err, db, done) => {
    if(err){
        response.status(400).send(err)
        console.log(err)
        return;
    } else {
        console.log("Connection Occured.")
        let usr_mail = request.body.usr_mail;
        let paperId = request.body.pageId;
        db.query('select user_id from "User" where user_mail=$1',[usr_mail], (err, data) => {
            if(err){
                console.log(err)
                return response.status(400).send(err)
            } else {
                userID = data.rows[0]["user_id"]
                console.log("User ID Fetched :-|")
                db.query('select user_id from user_paper where paper_id=$1', [paperId], (err, data) => {
                    if(err) return response.status(400).send(err)
                    else {
                        console.log("Checking for paper's author")
                        console.log(data.rows)
                        for(var i=0; i<data.rows.length; i++){
                            if(data.rows[i]["user_id"]==userID){
                                return response.status(201).send('[{"is_reachable" : 1}]')
                            }
                        }
                        db.query('select * from is_reachable($1, $2)',[paperId, userID], (err, data) => {
                            if(err){
                                return response.status(400).send(err)
                            } else {
                                console.log('You are being checked ;|')
                                console.log(data.rows)
                                return response.status(201).send(JSON.stringify(data.rows))
                            }
                        });
                    }
                });
            }
        })
    }
})
});

app.post('/api/trackUser', function(request, response){
    console.log(request.body)
    pool.connect((err, db, done) => {
    if(err){
        response.status(400).send(err)
        console.log(err)
        return;
    } else {
        console.log("Connection Occured.")
        let usr_mail = request.body.user_mail;
        let paperId = request.body.paper_id;
        let access_time = request.body.access_time;
        let access_date = request.body.access_date;
        let engage_time = request.body.engage_time;
        let action = request.body.action;
        
        db.query('select user_id from "User" where user_mail=$1', [usr_mail], (err, data) => {
            if(err){
                console.log(err)
                return response.status(400).send(err)
            } else {
                console.log("User ID Fetched Successfully :-|")
                console.log(data.rows[0]["user_id"])
                db.query('insert into view_history values($1, $2, $3, $4, $5, $6)',[data.rows[0]["user_id"], paperId, access_time, engage_time, access_date, action], (err, data) => {
                    if(err){
                        return response.status(400).send(err)
                    } else {
                        console.log('Added to History :-?')
                        console.log(data.rows)
                        return response.status(201).send(JSON.stringify("Added"));
                    }
                });
            }
        })
    }
})
});

app.post('/api/fetchHistory', function(request, response){
    console.log(request.body)
    pool.connect((err, db, done) => {
    if(err){
        response.status(400).send(err)
        console.log(err)
        return;
    } else {
        console.log("Connection Occured.")
        let usr_mail = request.body.usr_mail;
        db.query('select user_id from "User" where user_mail=$1',[usr_mail], (err, data) => {
            if(err){
                console.log(err)
                return response.status(400).send(err)
            } else {
                console.log("User ID Fetched :-|")
                db.query('select * from view_history where user_id=$1',[data.rows[0]["user_id"]], (err, data) => {
                    if(err){
                        return response.status(400).send(err)
                    } else {
                        console.log('Your History is fetched :->')
                        for(var i=0; i<data.rows.length; i++){
                            data.rows[i]["access_date"] = data.rows[i]["access_date"].toLocaleString()
                        }
                        console.log(data.rows)
                        return response.status(201).send(JSON.stringify(data.rows))
                    }
                });
            }
        })
    }
})
});

app.post('/api/fetchUserDet', function(request, response){
    console.log(request.body)
    pool.connect((err, db, done) => {
    if(err){
        response.status(400).send(err)
        console.log(err)
        return;
    } else {
        console.log("Connection Occured.")
        let usr_mail = request.body.usr_mail;
        db.query('select * from "User" where user_mail=$1',[usr_mail], (err, data) => {
            if(err){
                return response.status(400).send(err)
            } else {
                var userDet = []
                console.log('Fetching User')
                console.log(data.rows)
                let userId = data.rows[0]["user_id"]
                let schoolId = data.rows[0]["user_school"]
                userDet.push((data.rows[0]))
                // return response.status(201).send(JSON.stringify(data.rows))
                db.query('select school_name from school where school_id=$1', [schoolId], (err, data) => {
                    if(err) return response.status(400).send(err)
                    else {
                        console.log(data.rows)
                        userDet.push((data.rows[0]))
                        db.query('select * from paper where paper_id in (select paper_id from user_paper where user_id=$1)', [userId], (err, data) => {
                            if(err) return response.status(400).send(err)
                            else {
                                console.log(data.rows)
                                userDet.push((data.rows))
                                console.log(userDet)
                                return response.status(201).send(userDet)
                            }
                        })
                    }
                })
            }
        });
    }
})
});

app.listen(PORT, () => console.log('Listening on PORT '+PORT))
