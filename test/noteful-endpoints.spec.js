const knex = require('knex');
const supertest = require('supertest');
const app = require('../src/app');
const { makeFoldersArray } = require('./folders-fixtures');
const { makeNotesArray } = require('./notes-fixtures');


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
    //   before('clean the table', () => db.raw('TRUNCATE noteful_folders, noteful_notes RESTART IDENTITY CASCADE'))
    //   afterEach('cleanup', () => db.raw('TRUNCATE noteful_folders, noteful_notes RESTART IDENTITY CASCADE'))

    describe(`GET /folders`, () => {
        context('given no folders', () => {
            it('returns a 200', () => {
                return supertest(app)
                    .get('/folders')
                    .expect(200, [])
            })
        })
        context('Given folders in datatabase', ()=> {
            const testFolders = makeFoldersArray();
            beforeEach('insert folders', () => {
                return db
                    .into('noteful_folders')
                    .insert(testFolders)
            })
            it('responds with 200 and array of folders', () => {
                return supertest(app)
                    .get('/folders')
                    .expect(200, testFolders)
            })
        })
    })
    describe(`GET /notes`, () => {
        context('given no notes', () => {
            it('returns a 200', () => {
                return supertest(app)
                    .get('/notes')
                    .expect(200, [])
            })
        })
        context('Given folders in datatabase', ()=> {
            const testNotes = makeNotesArray();
            beforeEach('insert folders', () => {
                return db
                    .into('noteful_notes')
                    .insert(testNotes)
            })
            it('responds with 200 and array of notes', () => {
                return supertest(app)
                    .get('/notes')
                    .expect(200, testNotes)
            })
        })
    })
    describe('DELETE /folders/:folder_id', () => {
        context(`given no folders`, () => {
            const folderId = 123;
            it(`returns a 404`, () => {
                supertest(app)
                    .delete(`/folders/${folderId}`)
                    .expect(404)
            })
        })
        context(`given there are folders`, () => {
            const testFolders = makeFoldersArray();
            beforeEach('insert folders', () => {
                return db
                    .into('noteful_folders')
                    .insert(testFolders)
            })
            it(`returns folders array and 204`, () => {
                const idToRemove = 1
                const expectedFolders = testFolders.filter(folder =>
                     folder.folder_id !== idToRemove)
                supertest(app)
                    .delete(`/folders/${idToRemove}`)
                    .expect(204)
                    .then(res =>
                        supertest(app)
                            .get(`/folders`)
                            .expect(expectedFolders))
            })
        })
    })
    describe('DELETE /notes/:note_id', () => {
        context(`given no notes`, () => {
            const noteId = 123;
            it(`returns a 404`, () => {
                supertest(app)
                    .delete(`/notes/${noteId}`)
                    .expect(404)
            })
        })
        context(`given there are notes`, () => {
            const testNotes = makeNotesArray();
            beforeEach('insert notes', () => {
                return db
                    .into('noteful_notes')
                    .insert(testNotes)
            })
            it(`returns notes array and 204`, () => {
                const idToRemove = 1
                const expectedNotes = testNotes.filter(note =>
                     note.note_id !== idToRemove)
                supertest(app)
                    .delete(`/notes/${idToRemove}`)
                    .expect(204)
                    .then(res =>
                        supertest(app)
                            .get(`/notes`)
                            .expect(expectedNotes))
            })
        })
    })
    describe.only(`POST to /notes`, () => {
        it(`creates article and responds with 201`, () => {
            const testNotes = makeNotesArray();
            const newNote = {
                id: 4,
                name: "four",
                content: "four four",
                modified: "2029-01-22T16:28:32.615Z",
                folder_id: 1
            }
            return supertest(app)
                .post(`/notes`)
                .send(newNote)
                .expect(201)
                .expect(res => {
                    expect(res.body.name).to.eql(newNote.name)
                })
                .then(res => 
                    supertest(app)
                        .get(`/notes/${res.body.id}`)
                        .expect(res.body)
                )
        })
    })
})