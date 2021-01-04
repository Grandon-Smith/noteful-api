const FoldersService = {
    getAllFolders(knex) {
        return knex.select('*').from('noteful_folders')
    },
    getFolderById(knex, id) {
        return knex
          .from('noteful_folders')
          .select('*')
          .where('id', id)
          .first()
      },
    deleteFolder(knex, folder_id) {
        return knex('noteful_folders')
            .where({ folder_id })
            .delete()
    },
    updateFolder(knex, folder_id, newUserFields) {
        return knex('noteful_folders')
          .where({ folder_id })
          .update(newUserFields)
      },
}

module.exports = FoldersService