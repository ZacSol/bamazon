const express=require("express");
const app= express();
const path=require("path");
const db = require('./models');
const PORT=process.env.PORT||8080;

app.use(express.static("public"));
app.use(express.urlencoded({extend:true}));
app.use(express.json());



require("./routes/api-routes.js")(app);
require("./routes/html-routes")(app);



db.sequelize.sync().then(function () {
    // console.log('Database is synced!');
    app.listen(PORT, function () {
        console.log("Listening on PORT " + PORT);
    });
});
