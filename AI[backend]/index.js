var express = require("express");
var bodyParser = require("body-parser");
const fs = require('fs');
https=require('https')

var app = express();
var ba64 = require("ba64");
const tf = require('@tensorflow/tfjs')
const mobilenet = require('@tensorflow-models/mobilenet');
const cocoSsd = require('@tensorflow-models/coco-ssd');
global.fetch = require('node-fetch');
require('@tensorflow/tfjs-node')
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));
var jsonParser=bodyParser.json()


const jpeg = require('jpeg-js');

const NUMBER_OF_CHANNELS = 3

var cors = require('cors')


//SE SI USA SERVER HTTPS BISOGNA UTILIZZARE UN CERTIFICATO DEL DOMINIO
//var key= fs.readFileSync('sslcert/stealth.run.key');
//var cert=fs.readFileSync('sslcert/stealth.crt');
//var ca=fs.readFileSync('sslcert/CA.crt');

//var httpsOptions ={
//key:key,
//cert:cert,
//ca:ca
//};

app.use(cors())

const readImage = path => {
  const buf = fs.readFileSync(path)
  const pixels = jpeg.decode(buf, true)
  return pixels
}

const imageByteArray = (image, numChannels) => {
  const pixels = image.data
  const numPixels = image.width * image.height;
  const values = new Int32Array(numPixels * numChannels);

  for (let i = 0; i < numPixels; i++) {
    for (let channel = 0; channel < numChannels; ++channel) {
      values[i * numChannels + channel] = pixels[i * 4 + channel];
    }
  }

  return values
}

const imageToInput = (image, numChannels) => {
  const values = imageByteArray(image, numChannels)
  const outShape = [image.height, image.width, numChannels];
  const input = tf.tensor3d(values, outShape, 'int32');

  return input
}




app.post("/image",jsonParser,async (req,res,next)=>{
  var image=req.body.image;
  //console.log( req.body);
  image="data:image/jpeg;base64,"+image;

  ba64.writeImageSync("myimage", image);

  const value = readImage("myimage.jpeg")
  const input = imageToInput(value, NUMBER_OF_CHANNELS)


  const model= await cocoSsd.load()
  const predictions = await model.detect(input)
  input.dispose()
  model.dispose()


  console.log('classification results:', predictions)


    //res.status(201).send(predictions);
res.set({
  'Content-Type': 'text/html; charset=utf-8',
   'Connection' :'keep-alive'
})
console.log(predictions)
if(predictions.length>0){
res.json({result:predictions[0]["class"],location:predictions[0]["bbox"] });}
else{

res.json({result:'unknown'});
}
});

//QUESTO BLOCCO SI USA PER AVVIARE IN LOCALE
app.listen(3000, () => {
 console.log("Server running on port 3000");
});

//QUESTO BLOCCO SI USA PER AVVIARLO SU SERVER HTTPS
//https.createServer(httpsOptions, app).listen(443,function(){
//console.log('server started\n');
//});
