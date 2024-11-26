const userData = [
    {
        username: 'user1',
        password: '123,'  // Don't forget the comma if it's part of the password!
    },
    {
        username: 'user2',
        password: '456,'  // Same here
    }
];

function checkUser(givenUser) {
    return userData.find(user => user.username === givenUser);
}

function checkPassword(givenUser, givenPassword) {
    let matchedUser = checkUser(givenUser);
    if (matchedUser) {
        return givenPassword === matchedUser.password;
    }
    return false;
}

function addNewUser(givenUser,givenPassword){
    if(checkUser(givenUser)) {
        return false
    } else{
        let newUser={
            username: givenUser,
            password: givenPassword,
        }
            userData.push(newUser)
            return true
        
    }
}

module.exports = {
    checkUser,
    checkPassword,
    addNewUser
};