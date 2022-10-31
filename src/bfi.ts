// 雑なbrainfuckインタプリタ
// 私は今こんなものを書いている場合ではないのだ

const tapeLen = 1000000;

enum Cmd {
  Incr, Shift, Put, Get, While, Wend
}

enum RunnerState {
  Running, Finished, Stopped, PointerOutOfRange
}

type callback =
  (output: number[], state: RunnerState) => void;

class Runner {
  cmds: Cmd[];
  params: number[];

  input: string;
  callback: callback;

  state: RunnerState;

  constructor(code: string, input: string, callback: callback) {
    this.cmds = [];
    this.params = [];

    const whiles: number[] = [];
    let incr = 0;
    let shift = 0;

    let ip = 0;
    const pushCmd = (cmd: Cmd, param: number = 0) => {
      this.cmds.push(cmd);
      this.params.push(param);
      ip++;
    };
    for (let i = 0; i < code.length + 1; i++) {
      const c = code[i] ?? 'end';
      if (incr !== 0) {
        switch (c) {
          case '>':
          case '<':
          case '.':
          case ',':
          case '[':
          case ']':
          case 'end':
            pushCmd(Cmd.Incr, incr);
            incr = 0;
        }
      }
      if (shift !== 0) {
        switch (c) {
          case '+':
          case '-':
          case '.':
          case ',':
          case '[':
          case ']':
          case 'end':
            pushCmd(Cmd.Shift, shift);
            shift = 0;
        }
      }
      switch (c) {
        case '+':
          incr++;
          break;
        case '-':
          incr--;
          break;
        case '>':
          shift++;
          break;
        case '<':
          shift--;
          break;
        case '.':
          pushCmd(Cmd.Put);
          break;
        case ',':
          pushCmd(Cmd.Get);
          break;
        case '[':
          whiles.push(ip);
          pushCmd(Cmd.While);
          break;
        case ']':
          const w = whiles.pop();
          if (w === undefined) {
            throw new Error(`余分な ']' がある`);
          }
          this.params[w] = ip;
          pushCmd(Cmd.Wend, w);
          break;
      }
    }
    if (whiles.length > 0) {
      throw new Error(`余分な '[' がある`);
    }

    this.input = input;

    this.callback = callback;
    this.state = RunnerState.Running;
  }

  run() {
    let ip = 0;
    let p = 0;

    const tape = new Array(tapeLen).fill(0);
    const getv = (p: number) => {
      return tape[p] ?? 0;
    };

    const input: number[] = [];
    for (let i = 0; i < this.input.length; i++) {
      input.push(this.input.charCodeAt(i) & 255);
    }

    let output: number[] = [];

    const loop = () => {
      floop:
      for (let i = 0; i < 1000000; i++) {
        if (ip >= this.cmds.length) {
          this.state = RunnerState.Finished;
          break;
        }
        const cmd = this.cmds[ip];
        switch (cmd) {
          case Cmd.Incr:
            tape[p] = (getv(p) + this.params[ip]) & 255;
            break;
          case Cmd.Shift:
            p += this.params[ip];
            if (p < 0 || tapeLen <= p) {
              this.state = RunnerState.PointerOutOfRange;
              break floop;
            }
            break;
          case Cmd.Put:
            output.push(getv(p));
            if (output.length > 100) {
              ip++; // とても汚いバグ修正
              break floop;
            }
            break;
          case Cmd.Get:
            tape[p] = input.shift() ?? 0;
            break;
          case Cmd.While:
            if (getv(p) === 0) {
              ip = this.params[ip];
            }
            break;
          case Cmd.Wend:
            if (getv(p) !== 0) {
              ip = this.params[ip];
            }
            break;
        }
        ip++;
      }
      if (this.state === RunnerState.Running) {
        if (output.length > 0) {
          this.callback(output, this.state);
        }
        setTimeout(loop);
      } else {
        this.callback(output, this.state);
      }
      output = [];
      // console.log('loop', performance.now());
    };
    setTimeout(loop);
  }

  stop() {
    this.state = RunnerState.Stopped;
  }
}


export { RunnerState, Runner };