const app = require("./app")
const connectDatabase = require('./config/database')


const dotenv = require('dotenv');

// Handle the uncaught exceptions
process.on('uncaughtException',err =>{
    console.log(`Error: ${err.stack}`);
    console.log('Shutting down the server due to uncaught exceptions');
    process.exit(1);
})
// Setting up config files
dotenv.config({ path: 'backend/config/config.env'})

// Connecting to database
connectDatabase();

const server = app.listen(process.env.PORT, ()=>{
    console.log(`Server started on port: ${process.env.PORT} in ${process.env.NODE_ENV} mode`);
})

// Handle Unhandled Promise Rejections 
process.on('unhandledRejection',err=>{ 
    console.log(`ERROR: ${err.stack}`);
    console.log("Shutting down the server due to unhandled promise rejection");
    server.close(()=>{
    process.exit(1)
});

})