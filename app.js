const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const e = require('express');

const app = express();
app.set("view engine", "ejs");


app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB");

const articalSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article", articalSchema);


app.route("/articles")
    .get(function (req, res) {
        Article.find(function (err, foundArticles) {
            if (!err) {
                res.send(foundArticles)
            } else {
                res.send(err)
            }
        })
    })
    .post(function (req, res) {
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });
        newArticle.save(function (err) {
            if (!err) {
                res.send("Successfully added a new article.");
            } else {
                res.send(err);
            }
        });
    })
    .delete(function (req, res) {
        Article.deleteMany(function (err) {
            if (!err) {
                res.send("Successfully deleted all articles.");
            } else {
                res.send(err);
            }
        })
    });

app.route("/articles/:articleTitle")
    .get(function (req, res) {
        Article.findOne({ title: req.params.articleTitle }, function (err, foundArticles) {
            if (!err) {
                res.send(foundArticles);
            } else {
                res.send(err)
            }
        })
    })
    .put(function (req, res) {
        Article.updateOne(
            { title: req.params.articleTitle },
            {
                title: req.body.title,
                content: req.body.content
            },

            function (err) {
                if (!err) {
                    res.send("Successfully Updated articles.")
                }
            }
        )
    })
    .patch(function (req, res) {
        Article.updateOne(
            { title: req.params.articleTitle },
            { $set: req.body },
            function (err) {
                if (!err) {
                    res.send("Succesfully updated article")
                } else {
                    res.send(err);
                }
            }

        )
    })  
    .delete(function (req, res) {
        Article.deleteOne({ title: req.params.articleTitle }, function (err) {
            if (!err) {
                res.send("Deleted Successfully");
            } else {
                res.send(err);
            }
        })
    });

app.listen(3000, function () {
    console.log("http://localhost:3000")
});
