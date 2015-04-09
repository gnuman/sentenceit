/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , sentences = mongoose.model('Sentence');


exports.get = function (req, res) {
    var lang = req.query.lang;
    var word = req.query.word;
    if (word.length == 0){
	return res.json({'sentences':[]});
    }
    //var s = new sentences({'lang':'mr','sentence':'hello'});
    //s.save();
    /*
    var all = sentences.find(
	function (err, rst) {
	    if (err){
		return console.error(err);
	    }
	    console.log(rst)
	}
    ).where('lang').equals('mr');
    */
    var re = new RegExp(word, 'i');
    sentences.find()
	.where('lang').equals(lang)
        .where('sentence').regex(re)
	.select('sentence')
        .select('-_id')
        .limit(50)
	.exec(function (err, result) {
	    var s = [];
	    for(var i=0;i<result.length;i++){
		s.push(result[i].sentence);
	    }
            res.header("Access-Control-Allow-Origin", "*");
	    res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With");
	    res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
	    return res.json({'sentences':s});
	});

};
