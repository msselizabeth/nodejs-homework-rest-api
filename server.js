const app = require('./app')
const mongoose = require("mongoose");

const DB_HOST = "mongodb+srv://msselizabeth:KeUczi4rlvMIbxhz@cluster0.govejgr.mongodb.net/db-contacts?retryWrites=true&w=majority";
  
mongoose.set('strictQuery', true);

mongoose.connect(DB_HOST)
  .then(() => {
    console.log("Database connection successful");
    app.listen(3000, () => {
  console.log("Server running. Use our API on port: 3000")
}) 
  })
  .catch(error => {
  console.log(error.message);
  process.exit(1);
  })


// 

