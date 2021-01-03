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
}

module.exports = FoldersService