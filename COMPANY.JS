class Company {
    constructor(company_id, name, description, website, address) {
    this.company_id = company_id
    this.name = name
    this.description = description
    this.website = website
    this.address = address
    }
    activeJobs = []
    }
    class Job {
    constructor(job_id, company_id, created_date, job_description,job_location
    , position,job_type,qualification,industry,responsibilities,
    end_date, company_name) {
    this.job_id = job_id
    this.company_id = company_id
    this.created_date = created_date
    this.job_description = job_description
    this.job_location = job_location
    this.position = position
    this.job_type = job_type
    this.qualification = qualification
    this.industry = industry
    this.responsibilities = responsibilities
    this.end_date = end_date
    this.company_name = company_name
    }
    }
    
    module.exports = {
    Company, Job
    }