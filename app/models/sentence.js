var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var SentenceSchema = new Schema({
  lang: String,
  sentence: String,
});


mongoose.model('Sentence',SentenceSchema )
