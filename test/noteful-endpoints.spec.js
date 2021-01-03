const knex = require('knex');
const supertest = require('supertest');
const app = require('../src/app');
const { makeFoldersArray } = require('./folders-fixtures');

describe('Test Folders Endpoints', function() {
    let db

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.DB_URL,
        })
        app.set('db', db)
    })

      after('DC from db', () => db.destroy())
      before('clean the table', () => db.raw('TRUNCATE noteful_folders, noteful_notes RESTART IDENTITY CASCADE'))
    //   afterEach('cleanup',() => db.raw('TRUNCATE noteful_folders, noteful_notes RESTART IDENTITY CASCADE'))

    describe(`GET /folders`, () => {
        context('given no folders', () => {
            it('returns a 200', () => {
                return supertest(app)
                    .get('/folders')
                    .expect(200, [])
            })
        })
        context('Given articles in datatabase', ()=> {
            const testFolders = makeFoldersArray();
            beforeEach('insert articles', () => {
                return db
                    .into('noteful_folders')
                    .insert(testFolders)
            })
            it('responds with 200 and array of folders', () => {
                return supertest(app)
                    .get('/folders')
                    .expect(200)
            })
        })
    })

})