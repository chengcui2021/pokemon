import logo from './logo.svg';
import './App.css';
import axios from "axios";
import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function App() {
  const [pokemons, setPokemons] = useState([])
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const getData = async () => {
    setIsLoading(true);
    const { data } = await axios.get(`http://localhost:3000/get-pokemons`);
    setPokemons(data);
    setIsLoading(false)
  };
  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };
  useEffect(() => {
    getData();
    const searchedPokemons = pokemons.filter((pokemon)=>pokemon.name.includes(searchTerm))
    setSearchResults(searchedPokemons)
    setIsLoading(false)
  }, [searchTerm]);
  return (
    <div className="App">
       <input 
        type="text"
        placeholder="search pokemon name"
        value={searchTerm}
        onChange={handleChange}
      />
      {!isLoading?<TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="right">id</TableCell>
            <TableCell align="right">image</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {searchResults.length!=0&&searchResults.map((pokemon) => (
            <TableRow
              key={pokemon.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {pokemon.name}
              </TableCell>
              <TableCell align="right">{pokemon.id}</TableCell>
              <TableCell align="right"><img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`} /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>:<div style={{ color: 'black' }}>Loading...</div>}
    </div>
  );
}

export default App;
