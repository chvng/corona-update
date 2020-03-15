import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Card,
  Container,
  Grid,
} from '@material-ui/core';

import './App.css';

function App() {
  const [confirmed, setConfirmed] = useState();
  const [dead, setDead] = useState();
  const [recovered, setRecovered] = useState();
  const [newToday, setNewToday] = useState();

  const REQUEST_URL = 'https://redutv-api.vg.no/corona/v1/sheets/norway-table-overview/?region=municipality';

  useEffect(() => {
    getCoronaCases();
  }, [])
  
  const getCoronaCases = async() => {
    return await axios.get(REQUEST_URL)
    .then(response => { 
      const data = response.data.totals;
      setConfirmed(data.confirmed)
      setDead(data.dead);
      setRecovered(data.recovered);
      setNewToday(data.changes.newToday);
    })
    .catch((error) => { console.log(error.respsonse)});
  }

  return (
    <div>
      <Container>
        <Grid
          container spacing={4}
        >
          <Grid
            item xs={3}
          >
            <Card>
              Confirmed: {confirmed}
            </Card>
          </Grid>
          <Grid
            item xs={3}
          >
            <Card>
              Dead: {dead}
            </Card>
          </Grid>
          <Grid
            item xs={3}
          >
            <Card>
              Recovered: {recovered}
            </Card>
          </Grid>
          <Grid
            item xs={3}
          >
            <Card>
              New today: {newToday}
            </Card>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}

export default App;
