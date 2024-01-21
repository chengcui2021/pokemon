const express = require('express')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient();
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

app.post('/create-pokemons', async (req, res, next) => {

  try {
    const response = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=151&offset=0");
    let newRes = [];
    for (let i = 0; i < response.data.results.length; i++) {
    const subRes = await axios.get(response.data.results[i].url);
    const newResObj = {name:response.data.results[i].name, id:subRes.data.id, stats:subRes.data.stats, types:subRes.data.types}
    let newStats = []
    let newTypes = []
    for (let j = 0; j < subRes.data.stats.length; j++) {
      const newStat = {base_stat: subRes.data.stats[j].base_stat, effort: subRes.data.stats[j].effort, name:subRes.data.stats[j].stat.name, url:subRes.data.stats[j].stat.url}
      newStats.push(newStat)
    }

    for (let j = 0; j < subRes.data.types.length; j++) {
      const newType = {slot: subRes.data.types[j].slot, name: subRes.data.types[j].type.name, url: subRes.data.types[j].type.url}
      newTypes.push(newType)
    }

    const name = response.data.results[i].name;
    await createPokemon(name, newTypes, newStats);
    }
    res.json({created:true})
  }
  catch (err) {
    next(err)
  }
});


app.get('/get-pokemons', async (req, res, next) => {
  try {
    const pokemons = await prisma.pokemon.findMany({
      include: {
        types: true,
        stats: true,
      },
    });
    res.status(200).json(pokemons);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

const createPokemon = async (name, types, stats) => {
  try {
    const newPokemon = await prisma.pokemon.create({
      data: {
        name,
        types: {
          create: types,
        },
        stats: {
          create: stats,
        },
      },
      include: {
        types: true, // Include the types in the response
        stats: true, // Include the stats in the response
      }
    });
  } catch (e) {
    res.status(500).json({ error: e });
  }
};

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})