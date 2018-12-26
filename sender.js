var fs = require('fs');
process.binding('http_parser').HTTPParser = require('http-parser-js').HTTPParser;
var request = require('request');
var looptime = process.argv[3];
var ipGateway = "10.10.131.131";

var currentDate = '[' + new Date().toUTCString() + '] ';
fs.appendFileSync('error.txt', currentDate + " - Error log started.. " + "\r\n");

var loadArray = function(callback){
    var arr = [];
    fs.readFile("blacklist.txt", "utf8", function(errLn, blacklist){
        fs.readFile("message.txt", "utf8", function(err, message) {
            if(message.length > 0){
                var messageOriginal = mensaje;            
                var lineReader = require('readline').createInterface({
                    input: require('fs').createReadStream('numbers.txt')
                });                
    
                lineReader.on('close', function(){
                    callback(arr);
                });

                lineReader.on('line', function (line) {
                    var str_arr = line.split("****");
                    var number = str_arr[0];
                    if(listanegra.search(number) == -1){                    
                        if(str_arr.length == 2){                        
                            var name = str_arr[1]; //name
                            var messageSemd = encodeURIComponent(messageOriginal.replace("****NAME****", name));
                            
                            var obj = {};
                            obj.number = number;
                            obj.name = name;

                            obj.options = {
                                url: 'http://' + ipGateway + '/cgi/WebCGI?1500101=account=apisms&password=ciba2018&port=' + process.argv[2] + '&destination=' + number + '&content=' + messageSemd,
                                method: 'GET',
                                timeout: 3000
                            };
                            arr.push(obj);
                        }
                    }else{
                        console.log('The number: ' + number + ' is on the blacklist.');
                    }
                })                           
            }else{
                console.log("Error: Message null");
            }        
        });
    });
}

var sendMessage = function(obj, current, total, callback){
    console.log("-----------------------------------------------------------------------");
    console.log("Number: " + obj.number + " - Name: " + obj.name);    
    console.log("Counter: " + current + " - Total: " + total + " - Remaninder: " + (total - current));

    request(obj.options, function(error, response, body){
        if (!error && response.statusCode == 200) {
            console.log("OK! Message sent.");
            callback(true, "");
            //console.log(body);
        }else{
            if(error){
                    console.log("ERROR.");
                    callback(false, error.message);
                    //console.log(error);
            }else{
                callback(false, "");
            }
        }
    })
}

var i = 0;

function smsloop (arr) { 
    setTimeout(function () { 
       if (i < arr.length) { 
        sendMessage(arr[i], i, arr.length, function(seEnvio, message){
            if(seEnvio === false){
                fs.appendFileSync('error.txt', arr[i].number + "****" + message + "\r\n");
            }
            smsloop(arr);
        });
       }
       i++;  
    }, looptime)
 }
 
 loadArray(function(a){
    smsloop(a);
});