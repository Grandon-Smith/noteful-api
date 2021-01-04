// const path = require('path')
// const express = require('express')
// const xss = require('xss')
// const FoldersService = require('./folders-service')
// const foldersRouter = express.Router()
// const jsonParser = express.json()

// foldersRouter
//     .route('/folders')
//     .get((req, res, next) => {
//         const knexInstance = req.app.get('db')
//         FoldersService.getAllFolders(knexInstance)
//         .then(folders => {
//             res.json(folders)
//         })
//         .catch(next)
//     })
//     .post(jsonParser, (req, res, next) => {
//         const { folder_id, folder_name } = req.body;
//         const newFolder = { folder_id, folder_name }
    
//         for (const [key, value] of Object.entries(newFolder)) {
//             if (value == null) {
//                 return res.status(400).json({
//                     error: { message: `Missing '${key}' in request body` }
//                 })
//             }
//         }
    
//         FoldersService.insertFolder(
//             req.app.get('db'),
//             newFolder
//         )
//         .then(folder => {
//             res
//                 .status(201)
//                 .location(path.posix.join('http://localhost:8000', `/folders/${folder_id}`))
//                 .json(newFolder)
//         })
//         .catch(next)
//     })

// foldersRouter
//     .route('/folder/folder_id')
//     .delete((req, res, next) => {
//         FoldersService.deleteFolder(
//             req.app.get('db'),
//             req.params.folder_id
//         )
//         .then(folder => {
//             if(!folder) {
//                 return res.status(404).json({
//                     error: {message: `Folder does not exist`}
//                 })
//             }
//             res.folder = folder
//             next()
//         })
//         .then(numRowsAffected => {
//             res.status(204).end()
//         })
//         .catch(next)
//     })

// module.exports = foldersRouter