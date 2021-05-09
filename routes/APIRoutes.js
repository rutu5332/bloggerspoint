const express = require("express");
const router = express.Router();
const fetch = require("node-fetch"); 

router.get("/", (req, res) => {
    res.render("auth/api");
  });
router.get("/word/",(req,res)=> {
    fetch("https://aplet123-wordnet-search-v1.p.rapidapi.com/master?word=" + req.params.word, {
  method: "GET",
  headers: {
    "x-rapidapi-key": "d00d745d82msh49a483b75ee89fdp14464ajsneb0658917638",
    "x-rapidapi-host": "aplet123-wordnet-search-v1.p.rapidapi.com",
  },
})
  .then((res) => res.json())
  .then(async (data) => {
    d = await JSON.stringify(data);
    console.log(d);
  })
  .catch((err) => {
    console.error(err);
  });
})
    module.exports = router;
