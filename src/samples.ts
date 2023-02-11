/* eslint import/no-webpack-loader-syntax: off */
import geti from './assets/geti.bfr';
import hello from './assets/hello.bfr';
import hello2 from './assets/hello2.bfr';
import fizzbuzz from './assets/fizzbuzz.bfr';
import bfi from './assets/bfi.bfr';
import std from './assets/lib/std.bfr';
import future from './assets/lib/future.bfr';
import counter from './assets/lib/counter.bfr';
import fixedint from './assets/lib/fixedint.bfr';

const samples: {
  name: string,
  path: string,
  stdin: string
}[] = [
  {
    name: 'Decimal integer input',
    path: geti,
    stdin: '65\n'
  },
  {
    name: 'Hello World!',
    path: hello,
    stdin: ''
  },
  {
    name: 'Hello World! 2',
    path: hello2,
    stdin: ''
  },
  {
    name: 'FizzBuzz',
    path: fizzbuzz,
    stdin: '15\n'
  },
  {
    name: 'brainfuck interpreter',
    path: bfi,
    stdin: `[ FizzBuzz ]
[ Note:
FizzBuzz on Interpreter -> OK
FizzBuzz on Interpreter on Interpreter -> TOO SLOW
HelloWorld on Interpreter on Interpereter -> OK
]
>>>>,----------[-------------------------------------->>>[<<<++++++++++>>>-]<<<[>>>+<<<-],----------]<<<<+++>>>+++++>>>>[>>>>>>>>>[>>>>>>]+[>>+<[>-]>[-<++++++++++>>]<<->+<[>-<<[-<<<<<<]>>]>[-<++++++++++>>>>>+>>>]<<<][<<<<<<]<<<<<<++<<<<->+<[>->>>-<<<]>[-<+++>>>>>>>>>++++++++[-<++++++++>]<++++++.>+++++[-<+++++++>]<.+++++++++++++++++..[-]<<<<<<]>-<+>[<->>-<<]<[->+++++>>>>>>++++++++[-<++++++++>]<++.>+++++++[-<+++++++>]<++.+++++..[-]<<<<<<<]>>>>+<[>-]>[->>>>>>>>>>>[>>>>>>]>[<+>>>>>>>]<<<<<<[>>>>+++++++[-<++++++++>]<++<<<[>>>-<<<-]>>>.>+++++++[-<<<<++++++++>>>>]<<<<++>>>[<<<->>>-]<<<<-<<<<<]<[<<<<<<]<<<<]<<[-]>>>>+++++[-<<<<++++++>>>>]<<<<++.[-]>>>-]
\\15\n`
  },
  {
    name: 'Library: std.bfr',
    path: std,
    stdin: ''
  },
  {
    name: 'Library: counter.bfr',
    path: counter,
    stdin: 'A\n'
  },
  {
    name: 'Library: fixedint.bfr',
    path: fixedint,
    stdin: '-1234 5678\n'
  },
  {
    name: 'Library: future.bfr',
    path: future,
    stdin: ''
  }
];

export default samples;