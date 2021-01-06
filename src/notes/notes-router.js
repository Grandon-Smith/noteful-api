const path = require('path')
const express = require('express')
const xss = require('xss')
const NotesService = require('./notes-service')
const notesRouter = express.Router()
const jsonParser = express.json()

notesRouter
    .route('/notes')
    .get((req, res, next) => {
        console.log('hi')
        const knexInstance = req.app.get('db')
        NotesService.getAllNotes(knexInstance)
        .then(notes => {
            res.json(notes)
        })
        .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const { name, content, modified, folder_id } = req.body;
        const id = Math.floor(Math.random() * 100)
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

notesRouter
    .route('/notes/:note_id')
    .get((req, res, next) => {
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
    .delete((req, res, next) => {
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

    module.exports = notesRouter