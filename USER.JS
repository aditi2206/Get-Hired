class User {
    constructor(userId) {
    this.userId = userId;
    }
    personalDetail
    education = []
    skillDetails = []
    experience = []
    addEducation(educationInfo) {
    this.education.push(educationInfo)
    }
    addExperience(experienceInfo) {
    this.experience.push(experienceInfo)
    }
    addSkill(skillInfo) {
    this.skillDetails.push(skillInfo)
    }
    }
    class PersonalDetail {
    constructor(firstName, lastName, dob, email) {
    this.firstName = firstName
    this.lastName = lastName
    this.dob = dob
    this.email = email ;
    }
    }
    class Education{
    constructor(education_id,institute_name, degree, start_date, end_date, grade, cgpa) {
    this.education_id = education_id
    this.institute_name = institute_name
    this.start_date = start_date
    this.end_date = end_date
    this.grade = grade
    this.cgpa = cgpa
    this.degree = degree
    }
    }
    class Experience {
    
    
    constructor(exp_id,start_date, end_date, job_title, company_name,job_type,
    location ) {
    this.exp_id = exp_id
    this.start_date = start_date
    this.end_date = end_date
    this.job_title = job_title
    this.company_name = company_name
    this.job_type = job_type
    this.location = location
    }
    }
    class Skills {
    constructor(skills_id, skills) {
    this.skills_id = skills_id
    this.skill = skills
    }
    }
    
    module.exports = {
    User, PersonalDetail, Education, Skills, Experience
    }