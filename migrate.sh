#!/bin/bash

# Simple migration script that you can run first time you
# start your docker image to populate your database

cd /app

npm run sequelize db:migrate
npm run sequelize db:seed:all