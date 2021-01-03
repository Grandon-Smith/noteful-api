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
}

module.exports = NotesService