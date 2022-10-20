const Repository = require('../models/repository');
const NewModel = require('../models/new');

module.exports =
    class WordsController extends require('./Controller') {
        constructor(HttpContext) {
            super(HttpContext, new Repository(new NewModel()));
            this.params = HttpContext.path.params;
        }
    }   