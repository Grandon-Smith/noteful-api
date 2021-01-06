require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const foldersRouter = require('./folders/folders-router')
const notesRouter = require('./notes/notes-router')
const FoldersService = require('./folders/folders-service')
const NotesService = require('./notes/notes-service')
const jsonParser = express.json()
const path = require('path')


 
const app = express()

const morganOption = (NODE_ENV === 'production')
? 'tiny'
: 'common';

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

// app.use('/folders', foldersRouter)
// app.use('/folders/:folder_id', foldersRouter)
// app.use('/notes', notesRouter)
// app.use('/notes/:note_id', notesRouter)

app.get('/folders', (req, res, next) => {
    const knexInstance = req.app.get('db')
    FoldersService.getAllFolders(knexInstance)
    .then(folders => {
        res.json(folders)
    })
    .catch(next)
})

app.get('/notes', (req, res, next) => {
    const knexInstance = req.app.get('db')
    NotesService.getAllNotes(knexInstance)
    .then(notes => {
        res.json(notes)
    })
    .catch(next)
})
app.get('/notes/:note_id', (req, res, next) => {
    const knexInstance = req.app.get('db')
    const id = req.params.note_id
    NotesService.getNoteById(knexInstance, id)
    .then(note => {
        if(!note) {
            return res.status(404).json({
                error: { message: `Note with id ${id} not found`}
            })
        }
        res.status(200).json(note)
        next()
    })
    .catch(next)

})

app.delete('/folders/:folder_id', (req, res, next) => {
    FoldersService.deleteFolder(
        req.app.get('db'),
        req.params.folder_id
    )
    .then(folder => {
        if(!folder) {
            return res.status(404).json({
                error: {message: `Folder does not exist`}
            })
        }
        res.folder = folder
        next()
    })
    .then(numRowsAffected => {
        res.status(204).end()
    })
    .catch(next)
})

app.delete('/notes/:note_id', (req, res, next) => {
    NotesService.deleteNote(
        req.app.get('db'),
        req.params.note_id
    )
    .then(note => {
        if(!note) {
            return res.status(404).json({
                error: {message: `Note does not exist`}
            })
        }
        res.note = note
        next()
    })
    .then(numRowsAffected => {
        res.status(204).end()
    })
    .catch(next)
})

app.post(`/notes`, jsonParser, (req, res, next) => {
    const { name, content, modified, folder_id } = req.body;
    const id = Math.floor(Math.random() * 1000)
    const newNote = { id, name, content, modified, folder_id }

    for (const [key, value] of Object.entries(newNote)) {
        if (value == null) {
            return res.status(400).json({
                error: { message: `Missing '${key}' in request body` }
            })
        }
    }

    NotesService.insertNote(
        req.app.get('db'),
        newNote
    )
    .then(note => {
        res
            .status(201)
            .location(path.posix.join('http://localhost:8000', `/notes/${id}`))
            .json(newNote)
    })
    .catch(next)
})

app.post(`/folders`, jsonParser, (req, res, next) => {
    const { folder_id, folder_name } = req.body;
    const newFolder = { folder_id, folder_name }

    for (const [key, value] of Object.entries(newFolder)) {
        if (value == null) {
            return res.status(400).json({
                error: { message: `Missing '${key}' in request body` }
            })
        }
    }

    FoldersService.insertFolder(
        req.app.get('db'),
        newFolder
    )
    .then(folder => {
        res
            .status(201)
            .location(path.posix.join('http://localhost:8000', `/folders/${folder_id}`))
            .json(newFolder)
    })
    .catch(next)
})

app.get('/', (req, res) => {
    res.send('Hello, world!')
});


app.use(function errorHandler(error, req, res, next) {
    let response;
    if (NODE_ENV === 'production') {
        response = { error: { message: 'server error' } }
    } else {
        console.error(error)
        response = { message: error.message, error }
    }
    res.status(500).json(response)
});

module.exports = app;