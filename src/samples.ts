/* eslint import/no-webpack-loader-syntax: off */
import atoi from './assets/atoi.bfr';
import itoa from './assets/itoa.bfr';
import hello from './assets/hello.bfr';
import hello2 from './assets/hello2.bfr';
import fizzbuzz from './assets/fizzbuzz.bfr';
import bfi from './assets/bfi.bfr';

const samples: {
  name: string,
  path: string,
  stdin: string
}[] = [
  {
    name: '数値の入力',
    path: atoi,
    stdin: '65\n'
  },
  {
    name: '数値の出力',
    path: itoa,
    stdin: 'A'
  },
  {
    name: 'Hello World!',
    path: hello,
    stdin: ''
  },
  {
    name: 'Hello World! (短い)',
    path: hello2,
    stdin: ''
  },
  {
    name: 'FizzBuzz',
    path: fizzbuzz,
    stdin: '15\n'
  },
  {
    name: 'brainfuckインタプリタ',
    path: bfi,
    stdin: `[ FizzBuzz ]
[ Note:
FizzBuzz on Interpreter -> OK
FizzBuzz on Interpreter on Interpreter -> TOO SLOW
HelloWorld on Interpreter on Interpereter -> OK
]
>>>>,----------[-------------------------------------->>>[<<<++++++++++>>>-]<<<[>>>+<<<-],----------]<<<<+++>>>+++++>>>>[>>>>>>>>>[>>>>>>]+[>>+<[>-]>[-<++++++++++>>]<<->+<[>-<<[-<<<<<<]>>]>[-<++++++++++>>>>>+>>>]<<<][<<<<<<]<<<<<<++<<<<->+<[>->>>-<<<]>[-<+++>>>>>>>>>++++++++[-<++++++++>]<++++++.>+++++[-<+++++++>]<.+++++++++++++++++..[-]<<<<<<]>-<+>[<->>-<<]<[->+++++>>>>>>++++++++[-<++++++++>]<++.>+++++++[-<+++++++>]<++.+++++..[-]<<<<<<<]>>>>+<[>-]>[->>>>>>>>>>>[>>>>>>]>[<+>>>>>>>]<<<<<<[>>>>+++++++[-<++++++++>]<++<<<[>>>-<<<-]>>>.>+++++++[-<<<<++++++++>>>>]<<<<++>>>[<<<->>>-]<<<<-<<<<<]<[<<<<<<]<<<<]<<[-]>>>>+++++[-<<<<++++++>>>>]<<<<++.[-]>>>-]
\\15\n`
  }
];

export default samples;