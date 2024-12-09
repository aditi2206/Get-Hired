const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql')
const { json } = require('body-parser')
var uuid = require('uuid');
var cors = require('cors')
const app = express()
const port = process.env.PORT || 3001
const {User, PersonalDetail, Education, Skills, Experience} = require("./models/User.js") ;
const {updateUser, insertEducation, deleteEducation, updateEducation, insertExperience, deleteExperience,
updateExperience, insertSkills,deleteSkills, updateSkill, searchQuery, createSearchQuery} = require("./commands/SqlCommands.js");
const {Company, Job} = require("./models/company.js");
app.use(bodyParser.json())
//mysql
const pool = mysql.createPool( {
connectionLimit: 10,
host: 'localhost',
user: 'root',
password: 'colorBlue123',
database: 'get_hired'
})
// APIs ----------------------------------
app.use(cors())
//get records
app.post('/login', (req, res) => {
pool.getConnection((err, connection) => {
if(err) throw err
console.log(`connected as id ${connection.threadId}`)
var loginQuery = getloginQueryStatement(req.body.username, req.body.password)
connection.query(loginQuery, (err, user_id) => {
connection.release()
if(!err) {
    if(!user_id || user_id.length === 0 ) {
        res.status(404).send('User not found')
        }
        res.send(user_id[0])
        }
        else {
        console.log(err);
        res.status(500).send("Could not find user");
        }
        })
        })
        })
        
        function getloginQueryStatement(user,pass) {
        var loginQuery = "SELECT user_id FROM login WHERE user_name='#userName' AND password='#passwordValue'";
        loginQuery = loginQuery.replace("#userName", user);
        loginQuery = loginQuery.replace("#passwordValue",pass);
        console.log(loginQuery)
        return loginQuery
        }
        function InsertLoginStatement (user, pass, uid ) {
        var insertLoginQuery = "INSERT INTO login(user_name, password, user_id) VALUES('#username','#password', '#uid');";
        insertLoginQuery = insertLoginQuery.replace("#username", user);
        insertLoginQuery = insertLoginQuery.replace("#password",pass);
        insertLoginQuery = insertLoginQuery.replace("#uid",uid);
        console.log(insertLoginQuery);
        return insertLoginQuery
        }
        
        function InsertUserStatement (dob, firstName, lastName, email, user_id) {
        var insertUserQuery = "INSERT INTO user(FirstName, LastName, DOB, email, user_id) VALUES ('#fname', '#lname', '#birthday', '#email','#uid');";
        insertUserQuery = insertUserQuery.replace("#fname", firstName);
        insertUserQuery = insertUserQuery.replace("#lname",lastName);
        insertUserQuery = insertUserQuery.replace("#birthday", dob);
        insertUserQuery = insertUserQuery.replace("#email",email);
        insertUserQuery = insertUserQuery.replace("#uid", user_id);
        console.log(insertUserQuery);
        return insertUserQuery
        }
        function getUserDetailsQuery(userId) {
        var userQuery = "SELECT * FROM user WHERE user_id= '#uid'";
        userQuery = userQuery.replace("#uid", userId);
return userQuery
}
function getEducationQuery(userId) {
var educationQuery = "SELECT * FROM education WHERE user_id= '#uid'";
educationQuery = educationQuery.replace("#uid", userId);
return educationQuery
}
function getExperienceQuery(userId) {
var experienceQuery = "SELECT * FROM experience WHERE user_id= '#uid'";
experienceQuery = experienceQuery.replace("#uid", userId)
return experienceQuery
}
function getSkillQuery(userId) {
var skillQuery = "SELECT * FROM skill WHERE user_id= '#uid'";
skillQuery = skillQuery.replace("#uid", userId)
return skillQuery
}
function updateUserDetail(firstName, lastName, dob,email, user_id) {
var updateUserQuery = `UPDATE user SET FirstName='#fname', LastName = '#ln
ame', DOB = '#birthday', email = '#mail' WHERE user_id = '#uid'`
updateUserQuery = updateUserQuery.replace("#fname", firstName)
updateUserQuery = updateUserQuery.replace("#lname", lastName)
updateUserQuery = updateUserQuery.replace("#birthday", dob)
updateUserQuery = updateUserQuery.replace("#mail", email)
updateUserQuery = updateUserQuery.replace("#uid", user_id)
return updateUserQuery

}
app.post('/createLogin', (req, res) => {
pool.getConnection((err, connection) => {
if(err) {
console.log(err)
res.status(500).send('server error');
}
console.log(`connected as id ${connection.threadId}`)
var loginQuery = getloginQueryStatement(req.body.username, req.body.password)
connection.query(loginQuery, (err, user_detail_id) => {
if(!err) {
if(user_detail_id && user_detail_id.length > 0 ) {
connection.release()
res.status(400).send("user already exist");
} else {
    let userIdUUID = uuid.v1();
    var insertUserQuery = InsertUserStatement(req.body.DOB, req.body.firstName, req.body.lastName, req.body.email, userIdUUID)
    connection.query(insertUserQuery, (err, insertResponse) =>
    {
    if(err) {
    console.log(err);
    res.status(500).send('server error');
    } else {
    console.log(insertResponse);
    var insertLoginQuery = InsertLoginStatement(req.body.username, req.body.password, userIdUUID)
    connection.query(insertLoginQuery, (err, loginResponse) => {
    connection.release()
    if(err) {
    console.log(err);
    res.status(500).send('server error');
    }
    })
    res.send({'user_id': userIdUUID})
    }
    })
    }
    }
    else if(err) {
    connection.release()
    console.log(err);
    res.status(500).send("Could not find user");
    }
    })
    })
    })
    app.get('/userProfile', (req, res) => {
    var userId = req.query["user_id"]
    if(!userId){
    console.log('empty user id');
    res.status(500).send("user id is empty");
    }
    var userInfo = new User(userId)
    pool.getConnection((err, connection) => {
    if(err) {
    console.log(err)
    res.status(500).send('server error');
}
console.log(`connected as id ${connection.threadId}`)
var userQuery = getUserDetailsQuery(userId);
connection.query(userQuery, (err, userDetailsList) => {
// console.log(userDetailsList)
if(!err) {
if(!userDetailsList || userDetailsList.length === 0 ) {
connection.release()
res.status(404).send('User not found')
}
var userDetail = userDetailsList[0]
var personalObject = new PersonalDetail(userDetail.FirstName,
userDetail.LastName,
userDetail.DOB, userDetail.email)
userInfo.personalDetail = personalObject
var educationQuery = getEducationQuery(userId)
connection.query(educationQuery,(err, educationDetailsList
) => {
// console.log(educationDetailsList)
if(err) {
console.log(err)
}
for(var i =0; i< educationDetailsList.length; i++) {
var educationInfo = educationDetailsList[i]
var educationVal = new Education(educationInfo.education_id,educationInfo.institute_name, educationInfo.Degree,
dateFormatter(educationInfo.start_date), dateFormatter(educationInfo.end_date),
educationInfo.grade, educationInfo.cgpa)
userInfo.addEducation(educationVal)
}
var experienceQueryStatement = getExperienceQuery(userId)
connection.query(experienceQueryStatement,(err, experienceDetailsList) => {
console.log(experienceDetailsList)
if(err) {
console.log(err)
}

for(var i=0; i< experienceDetailsList.length; i++) {
var experienceInfo = experienceDetailsList[i]
var experienceValue = new Experience(experienceInfo.exp_id,dateFormatter(experienceInfo.start_date), dateFormatter(experienceInfo.end_date),
experienceInfo.job_title, experienceInfo.company_name, experienceInfo.job_type, experienceInfo.location)
userInfo.addExperience(experienceValue)
console.log('experience i' , experienceValue, 'userinfo experience - ', userInfo.experience)
}
var skillQueryStatement = getSkillQuery(userId)
connection.query(skillQueryStatement, (err, skillDetailsList) => {
console.log(skillDetailsList)
if(!err) {
for(var i=0; i< skillDetailsList.length; i++)
{
var skillInfo = skillDetailsList[i]
var skillObject = new Skills(skillInfo.skills_id, skillInfo.skills)
userInfo.addSkill(skillObject)
}

connection.release()

res.status(200).send(userInfo);
}
})
})
})
}
else {
connection.release()
console.log(err);
res.status(500).send("Could not find user");
}
})
})
})
app.post('/userProfile/update',(req, res) => {
var userDetail = req.body
pool.getConnection((err, connection) =>{
if(err) {
console.log(err)
res.status(500).send('server error');
}
console.log(`connected as id ${connection.threadId}`)
if(userDetail.personalDetail) {
var list = [{FirstName: userDetail.personalDetail.firstName, LastName: userDetail.personalDetail.lastName,
    DOB: userDetail.personalDetail.dob, email: userDetail.personalDetail.email}, {user_id:userDetail.userId }]
var respList = updateUser(connection, list);
}
// update education
var educationInsert = []
var educationDelete = []
var educationUpdateKeys = []
if(userDetail.education) {
userDetail.education.forEach(function(element, index, object) {
if(!element.education_id) {
let edId = uuid.v1()
element.education_id = edId
educationInsert.push([edId, userDetail.userId ,element.institute_name, element.start_date, element.end_date,
element.cgpa, element.grade, element.degree])
}else if(element.isDeleted) {
educationDelete.push(element.education_id)
object.splice(index, 1)
} else if(element.isUpdated) {
educationUpdateKeys.push([{user_id: userDetail.userId,education_id: element.education_id ,
institute_name : element.institute_name,start_date : element.start_date,
end_date : element.end_date, cgpa : element.cgpa ,grade : element.grade, Degree : element.degree},
{education_id: element.education_id}])
}
})
}
if(educationInsert.length > 0) {
var respInsert = insertEducation(connection, educationInsert)
}
if(educationDelete.length > 0) {
respDelete = deleteEducation(connection, educationDelete)
}
if(educationUpdateKeys.length > 0) {
educationUpdateKeys.forEach( element => {
respUpdate = updateEducation(connection, element)
})
}
//update experience
var experienceInsert = []
var experienceDelete = []
var experienceUpdateKeys = []
if(userDetail.experience) {
userDetail.experience.forEach(function(element, index, object,) {
if(!element.exp_id) {
let exId = uuid.v1()
element.exp_id = exId
experienceInsert.push([exId, userDetail.userId, element.start_date, element.end_date,element.job_title,
element.company_name, element.job_type, element.location])
}else if(element.isDeleted) {
experienceDelete.push(element.exp_id)
object.splice(index, 1)
} else if(element.isUpdated) {
experienceUpdateKeys.push([{user_id: userDetail.userId,exp_id: element.exp_id ,
start_date : element.start_date,end_date : element.end_date,
job_title: element.job_title, company_name: element.company_name, job_type: element.job_type, location: element.location},
{exp_id: element.exp_id}])
}
})
}
if(experienceInsert.length > 0) {
var respInsert = insertExperience(connection, experienceInsert)
}
if(experienceDelete.length > 0) {
respDelete = deleteExperience(connection, experienceDelete)
}
if(experienceUpdateKeys.length > 0) {
experienceUpdateKeys.forEach( element => {
respUpdate = updateExperience(connection, element)
})
}

//update skills
var skillInsert = []
var skillDelete = []
var skillUpdate = []
if(userDetail.skillDetails) {
userDetail.skillDetails.forEach(function(element, index, object) {
    if(!element.skills_id) {
        let skillId = uuid.v1()
        element.skills_id = skillId
        skillInsert.push([skillId,userDetail.userId, element.skill
        ])
        }
        else if(element.isDeleted) {
        skillDelete.push(element.skills_id)
        object.splice(index, 1)
        }
        else if(element.isUpdated) {
        skillUpdate.push([{skills: element.skill},
        {skills_id: element.skills_id}])
        }
        })
        }
        
        if(skillInsert.length > 0) {
        var respInsert = insertSkills(connection, skillInsert)
        }
        if(skillDelete.length > 0) {
        var respInsert = deleteSkills(connection, skillDelete)
        }
        if(skillUpdate.length > 0) {
        skillUpdate.forEach( element => {
        respUpdate = updateSkill(connection, element)
        })
        }
        connection.release()
        res.status(200).send(userDetail)
        
        })
        })
        function getCompanyDetailsQuery(company_id) {
        var companyQuery = "SELECT * FROM company WHERE company_id= '#cid'";
        companyQuery = companyQuery.replace("#cid", company_id);
        return companyQuery
        }
        app.get('/companyProfile', (req, res) => {
            var company_id = req.query["company_id"]
            if(!company_id){
            console.log('empty company id');
            return res.status(500).send("company id is empty");
            }
            pool.getConnection((err, connection) => {
            if(err) {
            console.log(err)
            return res.status(500).send('server error');
            }
            console.log(`connected as id ${connection.threadId}`)
            var companyQuery = getCompanyDetailsQuery(company_id) ;
            connection.query(companyQuery, (err, companyDetailsList) => {
            if(!err) {
            if(!companyDetailsList || companyDetailsList.length === 0 ) {
            connection.release()
            return res.status(404).send('User not found')
            }
            var companyDetail = companyDetailsList[0]
            var companyObject = new Company(companyDetail.company_id,companyDetail.name, companyDetail.description,
            companyDetail.website, companyDetail.address)
            
            var activeJobsQuery = getCompanyCurrentJobsQuery(company_id)
            connection.query(activeJobsQuery, (err, jobList) => {
            connection.release()
            if(!err) {
            jobList.forEach( jobs => {
            jobObject = new Job(jobs.job_id, jobs.company_id,
            jobs.created_date, null, jobs.job_location, jobs.position, jobs.job_type,
            null, null, null, jobs.end_date, jobs.company_name)
            companyObject.activeJobs.push(jobObject)
            })
            }
            return res.status(200).send(companyObject);
            })
            } else {
            connection.release()
            return res.status(500).send('server error')
            }
        })
    })
    })
    app.post('/companyProfile/update',(req,res) => {
    var companyDetail = req.body
    pool.getConnection((err, connection) => {
    if(err) {
    console.log(err)
    res.status(500).send('server error')
    }
    console.log(`connected as id ${connection.threadId}`)
    })
    })
    function getJobDetailsQuery(job_id) {
    var companyQuery = `SELECT * FROM job WHERE job_id= '${job_id}'`
    return companyQuery
    }
    
    function getJobDetailsQuery(job_id) {
    var jobQuery = `SELECT * FROM job WHERE job_id= '${job_id}'`
    return jobQuery
    }
    function getCompanyNameDetailQuery(company_id) {
    return `SELECT name FROM company WHERE company_id = '${company_id}'`
    }
    function getCompanyCurrentJobsQuery(company_id) {
    return `SELECT * FROM job WHERE company_id = '${company_id}' AND end_date
    >= CURRENT_DATE()`
    }
    
    function dateFormatter(date) {
    var isoDate = date + ''
    return isoDate.split('T')[0]
    }
    app.get('/jobPage', (req, res) => {
    var job_id = req.query["job_id"]
    if(!job_id){
    console.log('empty job id');
    res.status(500).send("job id is empty");
    }
    pool.getConnection((err, connection) => {
        if(err) {
        console.log(err)
        res.status(500).send('server error');
        }
        console.log(`connected as id ${connection.threadId}`)
        var jobQuery = getJobDetailsQuery(job_id) ;
        connection.query(jobQuery, (err, jobList) => {
        // console.log(jobDetailsList)
        //connection.release()
        if(!err) {
        if(!jobList || jobList.length === 0 ) {
        connection.release()
        res.status(404).send('job not found')
        }
        var company_id = jobList[0].company_id
        var companyQuery = getCompanyNameDetailQuery(company_id)
        connection.query(companyQuery, (err, companyNameList) => {
        if(!err) {
        if(!companyNameList || companyNameList.length == 0) {
        connection.release()
        res.status(404).send('company not found')
        }
        var companyName = companyNameList[0].name
        var jobDetail = jobList[0]
        var jobObject = new Job(jobDetail.job_id, jobDetail.company_id, jobDetail.created_date, jobDetail.job_description,
        jobDetail.job_location, jobDetail.position, jobDetail.job_type, jobDetail.qualification, jobDetail.industry,
        jobDetail.responsibilities,jobDetail.end_date, companyName)
        
        res.status(200).send(jobObject);
        
        }
        else{
        connection.release()
        console.log(err)
        res.status(500).send('server error');
        }
        } )
        }
        else {
        connection.release()
        console.log(err)
        res.status(500).send('server error')
    }
})
})
})

app.post('/search', (req, res) => {
var reqBody = req.body
if(!reqBody){
console.log('empty request body');
res.status(404).send("invalid request");
}
pool.getConnection((err, connection) => {
if(err) {
console.log(err)
res.status(500).send('server error');
}
console.log(`connected as id ${connection.threadId}`)
const query = reqBody.q
const dbMap = createSearchQuery(reqBody.filters, query)
connection.query( dbMap.searchQuery, dbMap.valueList, (err, resultList
) => {
if(err) {
console.log(err)
connection.release();
res.status(500).send("server error")
}else {
console.log('jobList app js -- ', resultList)
var companyIds = []
if(resultList.length > 0){
resultList.forEach(element => {
companyIds.push(element.company_id)
})
}
connection.query( 'SELECT company_id, name FROM company WHERE company_id in (?)', companyIds, (err, companyResult) => {
if(err) {
connection.release();
res.status(500).send('SERVER ERROR')
}else {
var companyMap = {};
companyResult.forEach(element => {
companyMap[element.company_id] = element.name;
})
var jobList = []
resultList.forEach(element => {
element.company_name = companyMap[element.company_id]
})
connection.release();
res.status(200).send(resultList)
}
})
}
})
})
})

//listen on port 3001
app.listen(port, () => console.log(`Listen on port ${port}`), )