const JSDOM = require("jsdom").JSDOM
const dom = new JSDOM("<!DOCTYPE html><p id='hello'>Hello, World!</p>")
console.log(dom.serialize())

const document = dom.window.document
const paragraph = document.getElementById("hello")
