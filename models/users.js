//code was done following in class tutorial

// const userData = [ //array of some basic user accounts
//     {
//         username: 'user1',
//         password: '123,'  
//     },
//     {
//         username: 'user2',
//         password: '456,'  
//     }
// ];


const mongoose = require('mongoose')
const {Schema, model} = mongoose

const userScheme =  new Schema ({
    username: String,
    password: String,
    userLessonPlan: {
        lessonName:[String],
        lessonDate:[Number],
        lessonDetails:[String],
    }

})

const userData = model('User', userScheme)

async function checkUser(givenUser) { 
    //check username if user name is taken
    let matchedUser=null
    matchedUser = await userData.findOne({username: givenUser})
    return matchedUser
}

async function checkPassword(givenUser, givenPassword) { //check password matches the user account name
    let matchedUser = await checkUser(givenUser);
    if (matchedUser) {
        return givenPassword === matchedUser.password;
    }
    console.log("no user")
    return false;
}

async function addNewUser(givenUser,givenPassword){ //add new user
    if(await checkUser(givenUser)) {
        return false
    } else{
        let newUser={ //allows the user to add the correct data into the array 
            username: givenUser,
            password: givenPassword,
        }
            userData.create(newUser)
            .catch(err=>{
                console.log("error" *err)
            })
            // userData.push(newUser) //push data to index.js
            return true
        
    }
}

  
// Function to add a new lesson plan to the user document
async function addNewPlan(username, lessonName, lessonDate, lessonDetails) {
  try {
    // Find the user by username and push the new lesson details into the arrays
    const user = await User.findOneAndUpdate(
      { username: username },
      {
        $push: {
          'userLessonPlan.lessonName': lessonName,
          'userLessonPlan.lessonDate': lessonDate,
          'userLessonPlan.lessonDetails': lessonDetails,
        }
      },
      { new: true } // Return the updated document
    );

    if (!user) {
      throw new Error('User not found');
    }

    console.log('Lesson plan added successfully');
  } catch (err) {
    console.error("Error adding lesson plan: ", err);
    throw err;
  }
}

    



   



module.exports = { //exports all fucntions into index.js
    checkUser,
    checkPassword,
    addNewUser,
    addNewPlan,
};