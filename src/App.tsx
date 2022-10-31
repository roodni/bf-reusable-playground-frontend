import React, { useEffect, useState } from 'react';
import { Alert, Box, Button, Switch, Container, FormControlLabel,Grid, Link, MenuItem, Select, TextField, Typography } from '@mui/material';
import samples from './samples';
import { RunnerState, Runner } from './bfi';

function App() {
  const [samplei, setSamplei] = useState(2);
  const [program, setProgram] = useState('');
  const [showLayout, setShowLayout] = useState(false);
  const [apiWaiting, setApiWaiting] = useState(false);
  const [bfreErrMsg, setBfreErrMsg] = useState('');
  const [bfcode, setBfcode] = useState('');
  const [stdin, setStdin] = useState('');
  const [stdout, setStdout] = useState('');

  const putSample = (i: number) => {
    const s = samples[i];
    fetch(s.path)
      .then((res) => res.text())
      .then((program) => {
        setProgram(program);
        setBfcode('');
        setStdin(s.stdin);
        setStdout('');
      });
    // 本当はfetchなんか使いたくないんだが、
    // create-react-appで作成したプロジェクトでは
    // raw-loaderあるいはasset/sourceのimport
    // を行う方法がejectする以外に無いらしい。
    // '!!raw-loader!...' で可能という記述を複数箇所で見かけたが
    // 何故かfile-loader相当の挙動になりダメ
  };

  useEffect(() => { putSample(samplei) }, [samplei]);

  const codegenHandler = () => {
    setBfreErrMsg('');
    setBfcode('');
    setApiWaiting(true);

    fetch('http://localhost:3001/codegen', {
      method: 'POST',
      body: new URLSearchParams({
        'program': program,
        'show-layout': showLayout ? '1' : '0',
      }),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          return Promise.reject();
        }
      })
      .then((obj) => {
        const { status, stdout, stderr } = obj;
        switch (status) {
        case 'OK':
          setBfcode(stdout);
          setBfreErrMsg(stderr);
          break;
        case 'NG':
          setBfreErrMsg(stderr);
          break;
        case 'TIMEOUT':
          setBfreErrMsg('時間制限を超過した');
          break;
        case 'MAXBUF':
          setBfreErrMsg('出力が大きすぎる');
          break;
        default:
          console.error('レスポンスのbodyがおかしい', obj);
          return Promise.reject();
        }
      })
      .catch(() => {
        setBfreErrMsg('通信に失敗した');
      })
      .finally(() => {
        setApiWaiting(false);
      });
  };

  const [runnerErrMsg, setRunnerErrMsg] = useState('');
  const [runningRunner, setRunningRunner] = useState<Runner | null>(null);

  const bfRunHandler = () => {
    if (runningRunner !== null) {
      return;
    }

    setStdout('');
    setRunnerErrMsg('');

    let runner: Runner;
    try {
      let outstr = '';
      runner = new Runner(bfcode, stdin, (output, state) => {
        outstr += String.fromCodePoint(...output);
        setStdout(outstr);
        switch (state) {
          case RunnerState.Finished:
          case RunnerState.Stopped:
            setRunningRunner(null);
            break;
          case RunnerState.PointerOutOfRange:
            setRunnerErrMsg('ポインタが範囲外に移動した');
            setRunningRunner(null);
            break;
          case RunnerState.Running:
            // do nothing
        }
      });
    } catch (e) {
      setRunnerErrMsg(`括弧 [] の対応が取れていない`);
      return;
    }

    setRunningRunner(runner);
    runner.run();
  };
  const bfStopHandler = () => {
    if (runningRunner !== null) {
      runningRunner.stop();
    }
  };

  return (
    <Container maxWidth="lg">
      <Box marginY={2}>
        <Typography variant="h5" marginY={1}>The Bf-Reusable Language Playground</Typography>
        <Typography variant="body1">
          <Link href="https://github.com/roodni/bf-reusable">bf-reusable</Link>
          は@rood_niがbrainfuckのコードを生成するために作った言語です。
        </Typography>
      </Box>

      <Box marginY={5}>
        サンプル:
        <Select
          size="small"
          fullWidth
          value={samplei}
          onChange={(e) => {
            const i = Number(e.target.value);
            setSamplei(i);
          }}
        >
          {samples.map((sample, i) =>
            <MenuItem value={i} key={i}>
              {sample.name}
            </MenuItem>
          )}
        </Select>
      </Box>

      <Box marginY={5}>
        bf-reusableのプログラム:
        <TextField
          multiline
          minRows={10}
          maxRows={25}
          fullWidth
          placeholder="ここにbf-reusableのプログラムを書く"
          value={program}
          onChange={(e) => { setProgram(e.target.value); }}
          InputProps={{
            sx: { fontFamily: 'Monospace', fontSize: 14, wordBreak: 'break-all' },
            spellCheck: false
          }}
        />
        <Box margin={1}>
          <FormControlLabel
            control={
              <Switch checked={showLayout} onChange={(e) => { setShowLayout(e.target.checked); }} />
            }
            label="セルのレイアウトを出力する"
          />
        </Box>
        <Box>
          <Button
            variant="contained"
            size="large"
            onClick={codegenHandler}
            disabled={apiWaiting}
          >
            コード生成
          </Button>
        </Box>
        { (bfreErrMsg !== '') &&
          <Alert severity="error" sx={{ marginY: 1 }}>
            {bfreErrMsg}
          </Alert>
        }
      </Box>

      <Grid container marginY={5} spacing={1}>
        <Grid item xs={12} md={6}>
          brainfuckのコード:
          <TextField
            multiline
            minRows={1}
            maxRows={15}
            fullWidth
            value={bfcode}
            onChange={(e) => { setBfcode(e.target.value); }}
            placeholder="ここにbrainfuckのコードが出る"
            InputProps={{
                sx: { fontFamily: 'Monospace', fontSize: 14, wordBreak: 'break-all' },
                spellCheck: false
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          標準入力:
          <TextField
            multiline
            minRows={1}
            maxRows={15}
            fullWidth
            value={stdin}
            onChange={(e) => { setStdin(e.target.value); }}
            InputProps={{
              sx: { fontFamily: 'Monospace', fontSize: 14, wordBreak: 'break-all' },
               spellCheck: false
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            onClick={bfRunHandler}
            disabled={bfcode === '' || runningRunner !== null}
            variant="contained"
            size="large"
          >実行</Button>
          <Button
            onClick={bfStopHandler}
            disabled={runningRunner === null}
            variant='contained'
            size="large"
            color="error"
            sx={{ marginX: 1 }}
          >停止</Button>
        </Grid>
        { (runnerErrMsg !== '') &&
          <Grid item xs={12}>
            <Alert severity="error">{runnerErrMsg}</Alert>
          </Grid>
        }
        <Grid item xs={12} marginY={5}>
          標準出力:
          <TextField
            multiline
            minRows={5}
            fullWidth
            value={stdout}
            InputProps={{
              sx: { fontFamily: 'Monospace', fontSize: 14, wordBreak: 'break-all' },
              spellCheck: false,
            }}
          />
        </Grid>
      </Grid>
    </Container>
  );
}

export default App;
