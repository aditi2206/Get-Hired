const insertEducationQuery = "INSERT INTO education (education_id, user_id, institute_name, start_date, end_date, cgpa, grade, Degree) VALUES ?"const deleteEducationQuery = "DELETE FROM education WHERE education_id in (?)"
    const updateEducationQuery = "UPDATE education SET ? WHERE ?"
    const insertExperienceQuery = "INSERT INTO experience (exp_id, user_id, start_date, end_date, job_title, company_name, job_type, location) VALUES ?"
    const deleteExperienceQuery = "DELETE FROM experience WHERE exp_id in (?)"
    const updateExperienceQuery = "UPDATE experience SET ? WHERE ?"
    const insertSkillQuery = "INSERT INTO skill (skills_id, user_id, skills) VALUES ?"
    const deleteSkillQuery = "DELETE FROM skill WHERE skills_id in (?)"
    const updateSkillQuery = "UPDATE skill SET ? WHERE ?"
    const insertCompanyDetailsQuery = "INSERT INTO company (company_id, name, description, industry, pprofile_picture, website, address) 
    VALUES ?"async function updateUser(connection, list) {try{var respList = await connection.query('UPDATE user SET ? WHERE ?', list)console.log(respList)return respList;} catch(err){console.log(err)
    return null;
    }
    }
    function asynqQuery(connection, query, params) {
    return new Promise((resolve, reject) =>{
    connection.query(query, params, (err, result) => {
    if (err)
    return reject(err);
    resolve(result);
    });
    });
    }
    
    
    

    
    async function insertEducation(connection, list) {
    try{
    var respList = await asynqQuery(connection, insertEducationQuery, [list])
    console.log('insert response',respList)
    return respList;
    } catch(err){
    console.log(err)
    return null;
    }
    }
    async function deleteEducation(connection, list) {
    try{
    var respList = await asynqQuery(connection, deleteEducationQuery, [list])
    console.log(respList)
    return respList;
    } catch(err){
    console.log(err)
    return null;
    }
    }
    async function updateEducation(connection, keyList) {
    try {
    var respList = await asynqQuery(connection, updateEducationQuery, keyList)
    console.log(respList)
    return respList;
    } catch(err) {
    console.log(err)
    return null;
    }
    }
    async function insertExperience(connection, list) {
    try{
    var respList = await asynqQuery(connection, insertExperienceQuery, [list])
    console.log('insert response',respList)
    return respList;
    } catch(err){
    console.log(err)
    return null;
    }
    }
    async function deleteExperience(connection, list) {
        try{
        var respList = await asynqQuery(connection, deleteExperienceQuery, [list])
        console.log(respList)
        return respList;
        } catch(err){
        console.log(err)
        return null;
        }
        }
        async function updateExperience(connection, keyList) {
        try {
        var respList = await asynqQuery(connection, updateExperienceQuery, keyList)
        console.log(respList)
        return respList;
        } catch(err) {
        console.log(err)
        return null;
        }
        }
        async function insertSkills(connection, list) {
        try{
        var respList = await asynqQuery(connection, insertSkillQuery, [list])
        console.log('insert response',respList)
        return respList;
        } catch(err){
        console.log(err)
        return null;
        }
        }
        async function deleteSkills(connection, list) {
        try{
        var respList = await asynqQuery(connection, deleteSkillQuery, [list])
        console.log(respList)
        return respList;
        } catch(err){
        console.log(err)
        return null;
        }
        }
        async function updateSkill(connection, keyList) {
            try {
            var respList = await asynqQuery(connection, updateSkillQuery, keyList)
            console.log(respList)
            return respList;
            } catch(err) {
            console.log(err)
            return null;
            }
            }
            function createSearchQuery(filterList, query) {
            var searchFilterQuery = `SELECT * FROM job WHERE position LIKE '%${query}%
            ' #whereClause LIMIT 10`
            var whereClause = ''
            var resultList = []
            if(filterList && filterList.length > 0) {
            filterList.forEach(element => {
            if(element.job_location) {
            var value = element.job_location
            whereClause += 'AND job_location in (?)'
            resultList.push(value)
            }
            if(element.job_type) {
            var value = element.job_type
            whereClause += 'AND job_type in (?)'
            resultList.push(value)
            }
            });
            console.log('where query -- : ', whereClause)
            }
            searchFilterQuery = searchFilterQuery.replace('#whereClause', whereClause)
            console.log('search query -- : ', searchFilterQuery)
            return {searchQuery : searchFilterQuery , valueList: resultList}
            }
            async function searchQuery(connection, searchFilterQuery, resultList) {
            try {
            var respList = await asynqQuery(connection, searchFilterQuery, resultList)
            console.log('response list : ',jobList)
            return jobList;
            } catch(err) {
            console.log(err)
            return null;
}
}

module.exports = {updateUser, insertEducation, deleteEducation,
updateEducation, insertExperience, deleteExperience, updateExperience,
insertSkills, deleteSkills, updateSkill, searchQuery, createSearchQuery}