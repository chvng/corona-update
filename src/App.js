import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent';
import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Typography from '@material-ui/core/Typography';

import './App.css';

const RenderSingleCard = (props) => {
  const { title, children, string } = props;

  return (
    <Card className="covid-card">
      <CardContent>
        <div className="covid-card-title">
          <Typography>{title}</Typography>
        </div>
        <div className="covid-card-content">
          <div className="covid-card-item">
            <Typography
              variant="h5"
              className="covid-card-number covid-card--red"
            >
              {children}
            </Typography>
            <Typography
              variant="subtitle2"
              className="covid-card-text covid-card--red"
            >
              {string}
            </Typography>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const RenderMultiCard = (props) => {
  const { title, firstValue, firstString, secondValue, secondString } = props;
  
  return (
    <Card className="covid-card">
      <CardContent>
        <div className="covid-card-title">
          <Typography>{title}</Typography>
        </div>
        <div className="covid-card-content">
          <div className="covid-card-item">
            <Typography
              variant="h5"
              className="covid-card-number"
            >
              {firstValue}
            </Typography>
            <Typography
              variant="subtitle2"
              className="covid-card-text"
            >
              {firstString}
            </Typography>
          </div>
          <Divider
            orientation="vertical"
            flexItem
          />
          <div className="covid-card-item">
            <Typography
              variant="h5"
              className="covid-card-number covid-card--red"
            >
              {secondValue}
            </Typography>
            <Typography
              variant="subtitle2"
              className="covid-card-text covid-card--red"
            >
              {secondString}
            </Typography>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function App() {
  const [confirmed, setConfirmed] = useState(),
        [dead, setDead] = useState(),
        [deadToday, setDeadToday] = useState(),
        [hospitalized, setHospitalized] = useState(),
        [infectedToday, setInfectedToday] = useState(),
        [tested, setTested] = useState(),
        [world, setWorld] = useState([]);

  const URL_ADDRESS = 'https://www.vg.no/spesial/2020/corona-viruset/data/norway-region-data/';
  const URL_HOSPITALIZED = 'https://www.vg.no/corona/v1/hospitalized';
  const URL_TESTED = 'https://www.vg.no/corona/v1/sheets/fhi/tested';
  const URL_WORLD = 'https://www.vg.no/corona/v1/sheets/world/reports';

  const getCoronaCases = async() => {
    return await axios.get(URL_ADDRESS)
    .then(response => {
      const { total, newToday } = response.data.metadata.confirmed;
      const { dead } = response.data.metadata;
      setConfirmed(total);
      setDead(dead.total);
      setDeadToday(dead.newToday);
      setInfectedToday(newToday);
    })
    .catch((error) => console.log(error));
  }

  const getHospitalized = async() => {
    return await axios.get(URL_HOSPITALIZED)
    .then(response => {
      const { hospitalized } = response.data.current.total;
      setHospitalized(hospitalized);
    })
    .catch((error) => console.log(error));
  }

  const getTested = async() => {
    return await axios.get(URL_TESTED)
    .then(response => {
      const { count } = response.data.current;
      setTested(count);
    })
    .catch((error) => console.log(error));
  }

  const getWorldData = async() => {
    return await axios.get(URL_WORLD)
    .then(response => {
      const { data } = response.data;
      setWorld(data);
    })
    .catch((error) => console.log(error));
  }

  useEffect(() => {
    getCoronaCases();
    getHospitalized();
    getTested();
    getWorldData();
  }, []);

  const descendingComparator = (a, b, orderBy) => {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if(b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  const getComparator = (order, orderBy) => {
    return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
  }

  const stableSort = (array, comparator) => {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map(el => el[0]);
  }

  const headCells = [
    { id: 'countryNorwegian', numeric: false, disablePadding: true, label: 'Countries'},
    { id: '', numeric: false, disablePadding: false, label: 'Coronavirus cases'},
    { id: '', numeric: false, disablePadding: false, label: 'Per 100K citizens'},
    { id: '', numeric: false, disablePadding: false, label: 'Deaths'},
    { id: '', numeric: false, disablePadding: false, label: 'Recovered'},
  ]

  return (
    <Container>
      <Container
        className="title"
      >        
        <Typography
          variant="h1"
          align="center"
          gutterBottom
          style={{fontWeight: "bold"}}
        >
          COVID-19 OUTBREAK
      </Typography>
      </Container>

      <Container maxWidth="md">
        <Grid
          container 
          spacing={3}
          direction="row"
          justify="flex-start"
          alignItems="center"
        >
          <Grid item xs={12} md={3}>
            <RenderMultiCard 
              title="Confirmed cases"
              firstValue={infectedToday} 
              firstString="NEW TODAY"
              secondValue={confirmed} 
              secondString="TOTAL"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <RenderMultiCard
              title="Deaths"
              firstValue={deadToday}
              firstString="NEW TODAY"
              secondValue={dead}
              secondString="TOTAL"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <RenderSingleCard 
              title="Hospitalized"
              children={hospitalized} 
              string="AS OF NOW" 
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <RenderSingleCard 
              title="Tested"
              children={tested}
              string="Per 21/3"
            />
          </Grid>
        </Grid>
      </Container>

      <Container className="covid-world">
        <Table>
          <TableHead>

          </TableHead>
        </Table>
      </Container>

    </Container>
  );
}

export default App;
