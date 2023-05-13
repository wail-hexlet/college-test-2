#!/usr/bin/env node

import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const fileName = process.argv[2];
const content = fs.readFileSync(path.join(__dirname,fileName), 'utf-8');

// BEGIN
console.log(content)

const makeDataRow = (arr) => {
  return arr.map((element) => {
    return {
      creature: element[0].trim(),
      strength: Number(element[1].trim()),
      health: Number(element[2].trim()),
      quantity: Number(element[3].trim()),
      height: Number(element[4].trim()),
      weight: Number(element[5].trim()),
      cost: Number(element[6].trim())
    }
  })
}

const makeDataArray = (data) => {
  const parts = data.split('\r\n').slice(1).map((element) => {// will split rows by 'enter' and remove first row (captions);
      const a = element.split('|'); // will split row by '|'
      return a.filter((b) => b !== '') // return element if it's not '' 
  })
  for (let index = 0; index < parts.length; index++) {
    const element = parts[index];
    if(element.length === 0){
      parts.splice(index)
    }
  }
  return makeDataRow(parts);
};

const data = makeDataArray(content);
//console.log(data)

console.log(`Different creatures: ${data.length}`);

const orderByStrengthDesc = data.map((creature) => creature).sort((a, b) => a.strength-b.strength).reverse();

console.log(`Cost of 10 strengthest creatures (${orderByStrengthDesc[0].creature}): ${orderByStrengthDesc[0].cost * 10}`);
console.log(`Cost of 20 next creatures by strength (${orderByStrengthDesc[1].creature}): ${orderByStrengthDesc[1].cost * 20}`);


const orderByWeightDesc = data.map((creature) => creature).sort((a, b) => a.weight-b.weight).reverse();
console.log(`Cost of squad of max weight (${orderByWeightDesc[0].creature}, ${orderByWeightDesc[0].quantity} in a squad): ${orderByWeightDesc[0].cost * orderByWeightDesc[0].quantity}`);

const orderByWeightAsc = data.map((creature) => creature).sort((a, b) => a.weight-b.weight);
console.log(`Cost of squad of min weight (${orderByWeightAsc[0].creature}, ${orderByWeightAsc[0].quantity} in a squad): ${orderByWeightAsc[0].cost * orderByWeightAsc[0].quantity}`);

const orderByProfitDesc = data.map((creature) => creature).sort((a, b) => a.cost / a.power - b.cost / b.power);
console.log(`The best profitable creature: ${orderByProfitDesc[0].creature}`);

const orderByProfitAsc = data.map((creature) => creature).sort((a, b) => a.cost / a.power - b.cost / b.power).reverse();
console.log(`The worst profitable creature: ${orderByProfitAsc[0].creature}`);

const maxBestCreaturesFor10000 = Math.floor(10000/orderByProfitDesc[0].cost);

console.log(`The best army for 10000: ${orderByProfitDesc[0].creature}, ${maxBestCreaturesFor10000} creatures for ${orderByProfitDesc[0].cost * maxBestCreaturesFor10000}`);


// END