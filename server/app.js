const express = require('express')
const nodemailer = require('nodemailer');
const axios = require('axios')
const cors = require('cors')
const app = express()
const port = 3000
app.use(cors())

const bodyParser = require('body-parser');

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(bodyParser.json());

app.get('/get-pokemen', async (req, res, next) => {

  try {
    const response = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=151&offset=0");
    let newRes = [];
    for (let i = 0; i < response.data.results.length; i++) {
    const subRes = await axios.get(response.data.results[i].url);
    const newResObj = {name:response.data.results[i].name, id:subRes.data.id, stats:subRes.data.stats, types:subRes.data.types}
    newRes.push(newResObj);
   
    }
    res.json(newRes)
  }
  catch (err) {
    next(err)
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})