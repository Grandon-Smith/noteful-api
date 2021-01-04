const NotesService = {
    getAllNotes(knex) {
        return knex.select('*').from('noteful_notes')
    },
    getNoteById(knex, id) {
        return knex
          .from('noteful_notes')
          .select('*')
          .where('id', id)
          .first()
      },
    deleteNote(knex, id) {
        return knex('noteful_notes')
            .where({ id })
            .delete()
    },
    updateFolder(knex, id, newUserFields) {
        return knex('noteful_notes')
          .where({ id })
          .update(newUserFields)
      },
}

module.exports = NotesService