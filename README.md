
Login page: log in page is within the top right hand corner of the ui within the home page. The screens used within the section are all within the views folder (apart from calls). These are all called within the index.js backend in order to run the application. Index.js contains all of the backend code needed for the login system aswell as navigation to all view files. To start the section run node index.js ensuring you are in the main application (Createive Web First Build).

Random key / room gernerator: This page of the website i experimented with generating a randomised code that allows for local users to join a session with names. This page works well with multiple users being able to join with the same code aswell as stopping users with the incorrect one. Everything to run this section is with the testing rooms folder. The frontend is roomJoin and the backend is roomsServer.js. To run this ensure you are in the testing rooms folder in the terminal and run node roomsServer.js. To see the random code it will allways be shown in the VS console aswell as on the page that genrerated the code at the top. Multiple tabs will be needed to see users join across screens

Daily Api: I experimented with the daily api which allows me to impliment live screen sharing, camera feeds aswell as a chat bar. The frontend for this experiment is found within the views folder called calls and the backend within index.js (notes within file to show where). The idea is to combine this api alongside my randomised code generator in the close future.This experiment is still a work in progress as there is a few issues ive found with the api. The lack of documenation in regards to how to get the right link to impliment aswell as setting up the screen sharing lead to issues with devlopment. After reviewing my code i believe the isseue is the api link its self not calling. Currently im exploring the teams api to see if it would be a better alternative for the project. To run this section ensure the terimal is running the whole project(creativewebfirstbuild) and run node index.js and navigate to the calls page.

Across the entire application i have been learning and implimenting bootsrap to style the application. Through this i can style the website efficently and ive learnt the core functions of bootstrap well and will continue to use it throughout the projet. Aswell as this i have been learning to use scss files to edit the bootstrap features which will allow me to select from a larger range of colors and change certein features when needed

