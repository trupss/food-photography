const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const postsRoutes = require("./routes/posts");
const userRoutes = require("./routes/user");
const logger = require("./logfile/log");
const sanitizer = require('express-sanitizer');
const helmet = require('helmet');

const app = express();

mongoose
    .connect(
        "mongodb+srv://trupti:" +
        process.env.MONGO_ATLAS_PW +
        "@cluster0-uewqf.mongodb.net/test?retryWrites=true&w=majority", { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true })
    .then(() => {
        console.log("Connected to database!");
    })
    .catch(() => {
        console.log("Connection failed!");
    });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(sanitizer());
app.use("/images", express.static(path.join("images")));
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader(
        "Content-Security-Policy", "script-src 'self' https://apis.google.com"
    );
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PATCH, PUT, DELETE, OPTIONS"
    );
    next();
});
app.use(helmet());

app.use((req, res, next) => {
    logger.error(req.body);
    let oldSend = res.send;
    res.send = function(data) {
        logger.error(data);
        oldSend.apply(res, arguments);
    }
    next();
})

app.use("/api/posts", postsRoutes);
app.use("/api/posts/addcomment", postsRoutes);
app.use("/api/user", userRoutes);

module.exports = app;