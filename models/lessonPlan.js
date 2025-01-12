const mongoose=require('mongoose')

const {Schema, model} = mongoose

const planSchema = new Schema({
    lessonName: String,
    date: String,
    lessonDetail: String,
    otherDetails: String,

})

const planData= model('PlanItem', postSchema)


function getRecentPlan(na){
    return planData.slice(-n)
}

function addNewPlan(username, message){
    let newPost={
        lessonName: lessonName,
        date: date,
        lessonDetail, message,
        otherDetails, message,
    }
   
}