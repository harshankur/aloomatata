const fs            = require('fs');
const express       = require('express');
const scissors      = require('scissors');                  // pdf editor oss
const fileUpload    = require('express-fileupload')         // handles file uploads

const app           = express()

app.use(express.json());
app.use(fileUpload());

app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});



app.get('/api/v1/checkConnection', (req, res) => {
    res.send("Connection OK");
})


/**
 * 
 * Split -> Include -> Range
 * Request body
 * 1. Input file in tag 'file'
 * 2. Range from in tag 'from'
 * 3. Range to in tag 'to'
 * 
 */
app.post('/api/v1/split/include/range', async (req, res) => {
    var inputFile           = await req.files.file;
    var inputFileLocation   = './input/' + inputFile.name;
    await inputFile.mv(inputFileLocation);

    var inputRangeFrom      = req.body.from;
    var inputRangeTo        = req.body.to;

    var outputFileName      = `ir_${inputFile.name}`;
    var outputFileLocation  = `./output/ir_${inputFile.name}`;

    scissors(inputFileLocation)
    .range(inputRangeFrom, inputRangeTo)
    .pdfStream()
    .pipe(fs.createWriteStream(outputFileLocation))
    .on('finish', function(){
      console.log("Successful");
      res.download(outputFileLocation, outputFileName);
    }).on('error',function(err){
      throw err;
    });
})


/**
 * 
 * Split -> Include -> Pages
 * Request body
 * 1. Input file in tag 'file'
 * 2. Pages in tag 'pages'
 * 
 */
 app.post('/api/v1/split/include/pages', async (req, res) => {
    var inputFile           = await req.files.file;
    var inputFileLocation   = './input/' + inputFile.name;
    await inputFile.mv(inputFileLocation);

    var inputPages          = req.body.pages;
    inputPages              = inputPages.split(',');

    var inputPagesInInt     = [];

    for (var i = 0; i < inputPages.length; i++) {
        inputPagesInInt.push(parseInt(inputPages[i]));
    }

    var outputFileName      = `ip_${inputFile.name}`;
    var outputFileLocation  = `./output/ip_${inputFile.name}`;

    scissors(inputFileLocation)
    .pages(inputPagesInInt)
    .pdfStream()
    .pipe(fs.createWriteStream(outputFileLocation))
    .on('finish', function(){
      console.log("Successful");
      res.download(outputFileLocation, outputFileName);
    }).on('error',function(err){
      throw err;
    });
})



//Server listening at port
const PORT = 3000;
app.listen(PORT, () => console.log(`Aloomatata listening on port ${PORT}!`));