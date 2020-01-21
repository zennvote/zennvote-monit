import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './App.css';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography';
import { TextField, Button } from '@material-ui/core';
import Grid, { GridSpacing } from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import axios from 'axios';
import { Doughnut } from 'react-chartjs-2';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    tf: {
      color: 'error',
    },
    typo: {

    },
    paper: {
      padding: theme.spacing(3),
    },
    title: {
      marginBottom: theme.spacing(3),
    },
    control: {
      padding: theme.spacing(2),
    },
  }),
);

const options = {
  maintainAspectRatio: false,
  legend: {
    display: false
  },
};

const getEpisodeData = (list) => {
    return {
      labels: list.map(x => x.producer) ?? [],
      datasets: [
        {
          data: list.map(x => x.total) ?? [],
          label: '득표',
          backgroundColor: ['#00e676BB', '#00e67699', '#00e67677', '#00e67655', '#00e67633']
        }
      ]
    };
  }

const App = () => {
    const classes = useStyles();

    const [statics, setStatics] = useState({});
    const [password, setPassword] = useState('');
    const [pitch, setPitch] = useState({});
    const [voice, setVoice] = useState({});
    const [funny, setFunny] = useState({});
    const [content, setContent] = useState({});
    const [original, setOriginal] = useState({});
    const [sleep, setSleep] = useState({});
    const [master, setMaster] = useState({});

    const getStatics = () => {
      axios.get('http://vote020.dev-shift.me:5001/api/vote/admin', {
        params: { password },
      }).then((res) => setStatics(res.data));
    };

    useEffect(() => {
      setMaster({
        labels: statics.master?.map(x => x.value) ?? [],
        datasets: [
          {
            data: statics.master?.map(x => x.total) ?? [],
            label: '득표',
            backgroundColor: ['#00e676BB', '#00e67699', '#00e67677', '#00e67655', '#00e67633']
          }
        ]
      });

      setPitch(getEpisodeData(statics.pitch || []))
      setVoice(getEpisodeData(statics.voice || []))
      setFunny(getEpisodeData(statics.funny || []))
      setContent(getEpisodeData(statics.content || []))
      setOriginal(getEpisodeData(statics.original || []))
      setSleep(getEpisodeData(statics.sleep || []))
    }, [statics]);

    return (
      <div className="App">
        <header className="App-header">
          <TextField label="비밀번호" value={password} className={classes.tf} onChange={e => setPassword(e.currentTarget.value)}/>
          <Button variant="contained" onClick={getStatics}>조회</Button>
          {statics.count &&
            <Typography variant="h4" component="h2" gutterBottom className={classes.title}>{statics.count.all}명 투표 / 총 {statics.count.filtered}개 투표 집계</Typography>
          }
          <Grid container spacing={2}>
            <Grid item xs={2}>
              <Paper className={classes.paper}>
                <Typography variant="h4" component="h2" gutterBottom className={classes.title}>대상</Typography>
                <Doughnut data={master} options={options} height={130} />
              </Paper>
            </Grid>
            {
              [
                { title: '가창력', data: pitch },
                { title: '목소리', data: voice },
                { title: '예능', data: funny },
                { title: '노래그이상', data: content },
                { title: '원곡재현', data: original },
                { title: '잠못', data: sleep },
              ].map(x => (
                <Grid item xs={2}>
                  <Paper className={classes.paper}>
                    <Typography variant="h4" component="h2" gutterBottom className={classes.title}>{x.title}</Typography>
                    <Doughnut data={x.data} options={options} height={130} />
                    {
                      <Typography gutterBottom className={classes.typo}></Typography>
                    }
                  </Paper>
                </Grid>
              ))
            }
          </Grid>
        </header>
      </div>
    );
  }

export default App;
