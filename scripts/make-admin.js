#!/bin/node
const rocket = require('rcktship');
const inquirer = require('inquirer');

const config = require('../config.json');
require('../dist/db');
const User = require('../dist/models/User').User;

async function run() {
  let answer = await inquirer.prompt([{
    type: 'input',
    name: 'answer',
    message: 'What google ID do you want to make admin?'
  }]);
  const userid = answer.answer;

  try {
    const user = await User.findOne({where: {googleID: userid}});
    user.isAdmin = true;
    await user.save();
    console.log('USER IS NOW ADMIN!');
  }
  catch(e) {
    console.error(e);
  }
}

run();
