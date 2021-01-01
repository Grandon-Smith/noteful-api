const FoldersService = {
    getAllFolders(knex) {
        return knex.select('*').from('noteful-folders')
    }
}