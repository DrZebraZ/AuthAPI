class ResultValidation {

    errorList:any[]
    result:any

    constructor(){
        this.errorList=[]
        this.result=null
    }

    concatErrors(resultValidation: ResultValidation) {
        this.errorList = this.errorList.concat(resultValidation.errorList)
    }

    addError(tag:string , message:any, isCritical:boolean = false) {
        this.errorList.push({"tag": tag, "message": message, "critical": isCritical});
    }

    setResult(result:any) {
        this.result = result;
    }

    hasError() {
        return this.errorList.length > 0;
    }

    hasCriticalError() {
        return this.errorList.filter(error => error.critical).length > 0;
    }

    getErrorList() {
        return this.errorList.map(error => { return {"tag": `${error.tag}`, "message": `${error.message}`} });
    }

    isResultEmpty() {
        return this.result === undefined || !this.result || this.result.length === 0;
    }

    getResult() {
        return this.result;
    }

    findErrorByTags(tagList:string[]) {
        return this.errorList.filter(error => tagList.includes(error.tag)).length > 0;
    }
}

export default ResultValidation
