import fs from "fs";
//--------------------------------------------------------------
// program Cradle;

//--------------------------------------------------------------
// Constant Declarations

const TAB = "\t";

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
  if (Look === x) getChar();
  else expected("''" + x + "''");
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
// Get an Identifier

function getName(): string {
  if (!isAlpha(Look)) expected("Name");
  return Look.toUpperCase();
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
// Parse and Translate a Math Factor

function factor(): void {
  emitLn("MOVE #" + getNum() + ",D0");
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

function term(): void {
  factor();
  while (["*", "/"].includes(Look)) {
    emitLn("MOVE D0,-(SP)");
    switch (Look) {
      case "*":
        multiply();
        break;
      case "/":
        divide();
        break;
      default:
        expected("Mulop");
    }
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
  term();
  while (["+", "-"].includes(Look)) {
    emitLn("MOVE D0,-(SP)");
    switch (Look) {
      case "+":
        add();
        break;
      case "-":
        subtract();
        break;
      default:
        expected("Addop");
    }
  }
}

//--------------------------------------------------------------
// Main Program

init();
expression();
//--------------------------------------------------------------
