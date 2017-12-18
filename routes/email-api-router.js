const express = require("express");

const Email = require("../models/email-model");

const router = express.Router();

router.get("/emails(/page/:skip)?", (req, res, next) => {
  let skip = Number(req.params.skip);
  if (!skip) {
    skip = 0;
  }
  Email
    .find()
    .limit(25)
    .skip(skip)
    .sort({createdAt: -1})
    .exec()
    .then((emailResults) => {
      //respond with the QUERY RESULTS in the json format
      res.status(200).json(emailResults);
    })
    .catch((err) => {
      console.log('GET /emails ERROR');
      console.log(err);

      res.status(500).json({
        error: 'Email list database error'
      });
    });
}); // GET /emailSchema

//DELETE  /emailSchema

router.delete("/emails",(req,res,next)=>{
  console.log(req.body);
  let listOfEmails = req.body.emailId;
  Email
  .deleteMany({_id: listOfEmails})
  .then(()=>{
    res.status(200).json({
      message: "Delete successful"
    });

  })
  .catch((err) => {
    console.log("/DELETE MANY ERROR");
    console.log(err);

    res.status(500).json({
      error: " Email delete database error"
    });
  });
});


router.post("/emails", (req, res, next) => {
  if (req.body.emailAddress === undefined ||
    req.body.emailAddress.match(/[/.+@.+/]/i) === null) {

    res.status(400).json({
      error: 'Email is invalid'
    });
    return;
  }
  Email
    .findOne({
      emailAddress: req.body.emailAddress
    })
    .then((emailFromDb) => {

      //Check if the email is in the database
      if (emailFromDb != null) {
        res.status(400).json({
          error: 'Email is already registered'
        });
        return;
      }
      const theEmail = new Email({
        emailAddress: req.body.emailAddress,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phoneNumber: req.body.phoneNumber
      });
      return theEmail.save();
    })
    .then((theEmail) => {
      res.status(200).json(theEmail);
    })
    .catch((err) => {
      console.log('POST /emails ERROR');
      console.log(err);

      if (err.errors) {
        res.status(400).json(err.errors);
      } else {
        res.status(500).json({
          error: " Email save database error"
        });
      }
    });

}); // POST /emails


router.get("/emails/:id", (req, res, next) => {
  if (req.user === undefined) {
    res.status(400).json({
      error: "Not logged in"
    });
    return;
  }

  Email.findById(req.params.id)
    .then((emailFromDb) => {
      //respond with the QUERY RESULTS in the JSON format
      res.status(200).json(emailFromDb);
    })
    .catch((err) => {
      console.log("GET /emails/:id ERROR!");
      console.log(err);
      res.status(500).json({
        error: "Email details database ERROR "
      });
    });
}); // GET /emails:id


router.delete("/emails/:id", (req, res, next) => {
  if (req.user === undefined) {
    res.status(400).json({
      error: "Not logged in"
    });
    return;
  }
  Email.findByIdAndRemove(req.params.id)
    .then((emailFromDb) => {
      //404 if email doesnt't exist
      if (emailFromDb === null) {
        //respond with an ERROR MESSAEG in the JSON format
        res.status(404).json({
          error: "Email not found"
        });
      } else {
        res.status(200).json(emailFromDb);
      }
    })
    .catch((err) => {
      console.log("DELETE /emails/:id ERROR!");
      console.log(err);

      res.status(500).json({
        error: "Email delete database error"
      });
    });
}); // DELETE /emails:id

router.put("/emails/:id", (req, res, next) => {
  Email.findById(req.params.id)
    .then((emailFromDb) => {
      emailFromDb.set({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phoneNumber: req.body.phoneNumber
      });
      return emailFromDb.save();
    })
    .then((emailFromDb) => {
      //respond with the QUERY RESULTS in the JSON format
      res.status(200).json(emailFromDb);
    })
    .catch((err) => {
      console.log("PUT, /emails/:id");
      console.log(err);
      //400 status code if validation error

      if (err.errors) {
        // Respond with an ERROR MESSAGE in the  JSON format
        res.status(400).json(err.errors);
      } else {
        //respond with an ERRO MESSAGE in the JSON format
        res.status(500).json({
          error: "Email update database error"
        });
      }

    });
}); //PUT email/:id

module.exports = router;
