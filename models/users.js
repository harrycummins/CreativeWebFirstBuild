const userData = [ //array of some basic user accounts
    {
        username: 'user1',
        password: '123,'  
    },
    {
        username: 'user2',
        password: '456,'  
    }
];

function checkUser(givenUser) { //check username if user name is taken
    return userData.find(user => user.username === givenUser);
}

function checkPassword(givenUser, givenPassword) { //check password matches the user account name
    let matchedUser = checkUser(givenUser);
    if (matchedUser) {
        return givenPassword === matchedUser.password;
    }
    return false;
}

function addNewUser(givenUser,givenPassword){ //add new user
    if(checkUser(givenUser)) {
        return false
    } else{
        let newUser={ //allows the user to add the correct data into the array 
            username: givenUser,
            password: givenPassword,
        }
            userData.push(newUser) //push data to index.js
            return true
        
    }
}

module.exports = { //exports all fucntions into index.js
    checkUser,
    checkPassword,
    addNewUser
};