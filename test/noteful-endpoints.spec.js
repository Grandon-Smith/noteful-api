const knex = require('knex');
const app = require('../src/app');
const { makeFoldersArray } = require('./folders-fixtures');

describe('Test Folders Endpoints', () => {
    let db

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.DB_URL,
        })
        app.set('db', db)
      })

      after('DC from db', ()=> db.destroy())
      before('clean the table', () => db.raw('TRUNCATE noteful_folders, noteful_notes RESTART IDENTITY CASCADE'))
      afterEach('cleanup',() => db.raw('TRUNCATE noteful_folders, noteful_notes RESTART IDENTITY CASCADE'))

      describe(`GET /`)

})