import fs from "fs";
//--------------------------------------------------------------
// program Cradle;

//--------------------------------------------------------------
// Constant Declarations

const TAB = "\t";
const CR = "\n";

//--------------------------------------------------------------
// Variable Declarations

let Look: string; // Lookahead Character

//--------------------------------------------------------------
// Read New Character From Input Stream

function getChar(): void {
  let buffer = Buffer.alloc(1);
  fs.readSync(0, buffer, 0, 1, null);
  Look = buffer.toString("utf8");
}

//--------------------------------------------------------------
// Report an Error

function error(s: string): void {
  console.log();
  console.log("Error: ", s, ".");
}

//--------------------------------------------------------------
// Report Error and Halt

function abort(s: string): void {
  error(s);
  process.exit(-1);
}

//--------------------------------------------------------------
// Report What Was Expected

function expected(s: string): void {
  abort(s + " Expected");
}

//--------------------------------------------------------------
// Match a Specific Input Character

function match(x: string): void {
  if (Look === x) {
    getChar();
  } else {
    expected("'" + x + "'");
  }
}

//--------------------------------------------------------------
// Recognize an Alpha Character

function isAlpha(c: string): boolean {
  return /^[A-Z]$/i.test(c);
}

//--------------------------------------------------------------
// Recognize a Decimal Digit

function isDigit(c: string): boolean {
  return /^\d+$/.test(c);
}

//--------------------------------------------------------------
// Recognize an Addop

function isAddop(c: string): boolean {
  return ["+", "-"].includes(c);
}

//--------------------------------------------------------------
// Get an Identifier

function getName(): string {
  if (!isAlpha(Look)) {
    expected("Name");
  }
  const result = Look.toUpperCase();
  getChar();
  return result;
}

//--------------------------------------------------------------
// Get a Number

function getNum(): string {
  if (!isDigit(Look)) {
    expected("Integer");
  }
  const result = Look;
  getChar();
  return result;
}

//--------------------------------------------------------------
// Output a String with Tab

function emit(s: string): void {
  console.log(TAB, s);
}

//--------------------------------------------------------------
// Output a String with Tab and CRLF

function emitLn(s: string): void {
  emit(s);
}

//--------------------------------------------------------------
// Initialize

function init(): void {
  getChar();
}

//---------------------------------------------------------------
// Parse and Translate an Identifier

function ident(): void {
  const name = getName();
  if (Look === "(") {
    match("(");
    match(")");
    emitLn("BSR " + name);
  } else {
    emitLn("MOVE " + name + "(PC),D0");
  }
}

//---------------------------------------------------------------
// Parse and Translate a Math Factor

function factor(): void {
  if (Look === "(") {
    match("(");
    expression();
    match(")");
  } else if (isAlpha(Look)) {
    ident();
  } else {
    emitLn("MOVE #" + getNum() + ",D0");
  }
}

//--------------------------------------------------------------
// Recognize and Translate a Multiply

function multiply(): void {
  match("*");
  factor();
  emitLn("MULS (SP)+,D0");
}

//--------------------------------------------------------------
// Recognize and Translate a Divide

function divide(): void {
  match("/");
  factor();
  emitLn("MOVE (SP)+,D1");
  emitLn("DIVS D1,D0");
}

//---------------------------------------------------------------
// Parse and Translate a Term

function term(): void {
  factor();
  while (["*", "/"].includes(Look)) {
    emitLn("MOVE D0,-(SP)");

    ((
      {
        "*": multiply,
        "/": divide,
      }[Look] as Function
    )());
  }
}

//--------------------------------------------------------------
// Recognize and Translate an Add

function add(): void {
  match("+");
  term();
  emitLn("ADD (SP)+,D0");
}

//-------------------------------------------------------------
// Recognize and Translate a Subtract

function subtract(): void {
  match("-");
  term();
  emitLn("SUB (SP)+,D0");
  emitLn("NEG D0");
}

//---------------------------------------------------------------
// Parse and Translate an Expression

function expression(): void {
  if (isAddop(Look)) {
    emitLn("CLR D0");
  } else {
    term();
  }
  while (isAddop(Look)) {
    emitLn("MOVE D0,-(SP)");

    ((
      {
        "+": add,
        "-": subtract,
      }[Look] as Function
    )());
  }
}

//--------------------------------------------------------------
// Parse and Translate an Assignment Statement
function assignment(): void {
  const name = getName();
  match("=");
  expression();
  emitLn("LEA " + name + "(PC),A0");
  emitLn("MOVE D0,(A0)");
}

//--------------------------------------------------------------
// Main Program

init();
assignment();
// @ts-ignore
if (Look !== CR) {
  expected("NewLine");
}
//--------------------------------------------------------------
