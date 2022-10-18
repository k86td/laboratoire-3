const Model = require('./model');
module.exports =
    class New extends Model {
        constructor(title, url, category, texte) {
            super();

            console.log(`Trying to create a News title=${title}, url=${url}, category=${category}, texte=${texte}`)

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