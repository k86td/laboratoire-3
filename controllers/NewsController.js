const Repository = require('../models/repository');
const NewModel = require('../models/new');

module.exports =
    class WordsController extends require('./Controller') {
        constructor(HttpContext) {
            super(HttpContext, new Repository(new NewModel()));
            this.params = HttpContext.path.params;
        }

        error(message) {
            this.params["error"] = message;
            this.HttpContext.response.JSON(this.params);
            return false;
        }

        get() {
            let allNews = this.repository.getAll();
            if(this.params != null){
                if(this.params.page != null){
                    const newsLimit = 4;
                    let page = parseInt(this.params.page);
                    let newsEndIndex = newsLimit * page;
                    let counter = 0;
                    let newsToSend = [];
                    if(page > 1){
                        counter = (page * newsLimit) - newsLimit;
                    }

                    for (let i = counter; i < newsEndIndex; i++) {
                        if(i == allNews.length) break;
                        newsToSend.push(allNews[i]);
                    }
                    this.HttpContext.response.JSON(newsToSend);
                }else{
                    this.error("Page parameter is missing");
                }
            }else{
                this.HttpContext.response.JSON(allNews);
            }
        }
    }   