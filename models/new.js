const Model = require('./model');
module.exports =
    class New extends Model {
        constructor(title, url, category, texte) {
            super();

            this.Title = title !== undefined ? title : "";
            this.ImageUrl = url !== undefined ? url : "";
            this.Category = category !== undefined ? category : "";
            this.Texte = texte !== undefined ? texte : "";
            this.Date = Date.now();

            this.setKey("Id");
            // this.addValidator('Title', 'string');
            // this.addValidator('Url', 'url');
            // this.addValidator('Category', 'string');
        }
    }