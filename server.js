const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");

const dotenv = require("dotenv");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
require("dotenv").config();
const MONGODB_URI = `mongodb+srv://Abdulboriy:zerotomastery@cluster0.mpywc.mongodb.net/memoDb`;
mongoose.connect(MONGODB_URI || "mongodb://localhost:27017/memoDb");

const PORT = process.env.PORT || 5000;

const memoDbSchema = {
  date: String,
  authour: String,
  category: String,
  body: String,
};

const Memo = mongoose.model("Memo", memoDbSchema);

app.get("/", (req, res) => {
  Memo.find({}, (err, memo) => {
    res.render("index", { memo: memo });
  });
});

app.get("/create", (req, res) => {
  res.render("create");
});

app.post("/create_note", (req, res) => {
  console.log(req.body);
  const memo = new Memo(req.body);
  memo.save();

  Memo.find({}, (err, memo) => {
    if (!err) {
      console.log(memo);
      //   res.render("index", { memo: memo });
      res.redirect("/");
    } else {
      console.log("error is ", err);
    }
  });
});

app.get("/delete/:id", (req, res) => {
  Memo.findByIdAndDelete(req.params.id, (err) => {
    err ? console.error(err) : console.log("deleted successfully");

    res.redirect("/");
  });
});

// app.get("/edit/:id", (req, res) => {
//   Memo.find({}, (err, memo) => {
//     Memo.findOneAndUpdate(
//       { _id: req.params.id },
//       { $set: req.body },
//       (err, result) => {
//         if (!err) {
//           res.render("update", { memo: memo });
//           console.log("edited successfully !");
//         } else {
//           console.log(err);
//         }
//       }
//     );
//   });
// });

app.get("/edit/:id", (req, res) => {
  Memo.find({ _id: req.params.id }, (err, memo) => {
    if (!err) {
      res.render("update", { memo: memo });
    } else {
      console.table(err);
    }
  });
});

app.post("/edit/:id", (req, res) => {
  Memo.findOneAndUpdate(
    { _id: req.params.id },
    { $set: req.body },
    (err, result) => {
      if (!err) {
        res.redirect("/");
        console.log("edited successfully !");
      } else {
        console.log(err);
      }
    }
  );
});

app.listen(process.env.PORT, () => {
  console.log("listening on port 3333");
});
