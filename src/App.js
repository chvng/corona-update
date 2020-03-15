import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Card,
  Container,
  Grid,
} from '@material-ui/core';

import './App.css';

function App() {
  const [confirmed, setConfirmed] = useState(),
        [recovered, setRecovered] = useState(),
        [dead, setDead] = useState(),
        [infectedToday, setInfectedToday] = useState(),
        [infectedYesterday, setInfectedYesterday] = useState();

  const URL_ADDRESS = 'https://redutv-api.vg.no/sports/corona-viruset/norway-table-overview?region=municipality';
  const API_ADDRESS = 'https://www.vg.no/spesial/2020/corona-viruset/data/norway-region-data/';

  const getCoronaCases = async() => {
    return await axios.get(URL_ADDRESS)
    .then(response => {
      const {confirmed, recovered} = response.data.totals;
      const {newToday, newYesterday} = response.data.totals.changes;

      setConfirmed(confirmed);
      setRecovered(recovered);
      setInfectedToday(newToday);
      setInfectedYesterday(newYesterday);
    })
    .catch((error) => console.log(error));
  }

  const getOtherData = async() => {
    return await axios.get(API_ADDRESS)
    .then(response => {
      const {dead} = response.data.metadata;

      setDead(dead.total);
    })
    .catch((error) => console.log(error));
  }

  useEffect(() => {
    getCoronaCases();
    getOtherData();
  }, []);

  return (
    <Container style={{ textAlign: 'center' }}>
      <h1>COVID-19 NORWAY</h1>
      <Grid
        container spacing={4}
      >
        <Grid
          item xs={12}
        >
          <Card>
            <h3>{confirmed}</h3>
            <h5>Been tested and confirmed</h5>
          </Card>
        </Grid>
        <Grid
          item xs={12}
        >
          <Card>
            <h3>{dead}</h3>
            <h5>Dead in total</h5>
          </Card>
        </Grid>
        <Grid
          item xs={12}
        >
          <Card>
            <h3>{recovered}</h3>
            <h5>Recovered in total</h5>
          </Card>
        </Grid>
        <Grid
          item xs={12}
        >
          <Card>
            <h3>{infectedToday}</h3>
            <h5>New infected and confirmed cases today</h5>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default App;
