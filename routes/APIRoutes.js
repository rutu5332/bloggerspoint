const { request } = require("express");
const express = require("express");
const router = express.Router();
const fetch = require("node-fetch"); 

router.get("/", (req, res) => {
    res.render("auth/api");
  });
  router.get("/word/", (req, res) => {
    let a = req.query.meaning;
    fetch("https://aplet123-wordnet-search-v1.p.rapidapi.com/master?word=" + a, {
      method: "GET",
      headers: {
        "x-rapidapi-key": "d00d745d82msh49a483b75ee89fdp14464ajsneb0658917638",
        "x-rapidapi-host": "aplet123-wordnet-search-v1.p.rapidapi.com",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        let d = JSON.stringify(data.definition);
        
       // console.log(d);
        let arr = d.split(";");
        // res.send(arr[0]);
        
         let def=arr[0];
         res.render("auth/api", { def:def });
      })
      .catch((err) => {
        console.error(err);
      });
  });
    module.exports = router;