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

function getChar() {
  let buffer = Buffer.alloc(1);
  fs.readSync(0, buffer, 0, 1, null);
  return buffer.toString("utf8");
}

//--------------------------------------------------------------
// Report an Error

function error(s: string) {
  console.log();
  console.log("Error: ", s, ".");
}

//--------------------------------------------------------------
// Report Error and Halt

function abort(s: string) {
  error(s);
  process.exit(-1);
}

//--------------------------------------------------------------
// Report What Was Expected

function expected(s: string) {
  abort(s + " Expected");
}

//--------------------------------------------------------------
// Match a Specific Input Character

function match(x: string) {
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
  if (!isDigit(Look)) expected("Integer");
  return Look;
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
  console.log();
}

//--------------------------------------------------------------
// Initialize

function init(): void {
  getChar();
}

//--------------------------------------------------------------
// Main Program

init();
//--------------------------------------------------------------
