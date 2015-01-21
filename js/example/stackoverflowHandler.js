
 var request = require('request'),
     zlib = require('zlib');

 const  HTTP_OK=200,
        GZIP='gzip',
        pageSize ='100',
        ENCODING= 'content-encoding',
        ERROR_MISSING_ID ='StackOverflowHandler- missing userId',
        ERROR_GET_STACKOVERFLOW_DATA = 'getStackOverflowData-missing data',
        ERROR_GET_STACKOVERFLOW_DATA_BY_USER_ID = 'getStackOverflowDataByUserId - missing id ',
        GENERAL_ERROR =  'error:';

 var    pageIndex= 1,
        URL_PREFIX = 'http://api.stackexchange.com/2.2/users/',
        URL_SUFFIX = '/network-activity?pagesize='+pageSize+'&page=',
        jsonArray=[];


 exports.getStackOverflowData = function(req,res){
        pageIndex=1;
        jsonArray=[];
        var userId = req.params.id;
        if(typeof userId === undefined || userId==null) {
            console.log(ERROR_MISSING_ID);
        }else{
                getStackOverflowDataByUserId(userId, function (data) {
                if(data != null ) {
                     res.send(handleStackOverflowResponse(data));
                }else{
                    console.log(ERROR_GET_STACKOVERFLOW_DATA);
                }
            })
        }
 }


 var urlSettings = {
        headers: {
            'Accept-Encoding' : GZIP
        },
        encoding: null
 };


 var getStackOverflowDataByUserId = function(id, callable){
        if(typeof id === undefined || id==null ) {
            console.log(ERROR_GET_STACKOVERFLOW_DATA_BY_USER_ID);
        }else {
            urlSettings.url = URL_PREFIX + id + URL_SUFFIX+pageIndex;
            request(urlSettings, function (error, response, body) {
                if (!error && response.statusCode == HTTP_OK) {
                    if (response.headers[ENCODING] == GZIP) {
                        zlib.gunzip(body, function (err, dezipped) {
                           collectResponse(dezipped.toString(),id,callable);
                        });
                    } else {
                        callable(body);
                    }
                } else {
                    callable(error);
                }
            });
        }

 };

 function collectResponse(data,id,callable){
     // collect till there are no more items (stackoverflow api has pageSize ~ pagination)
     if(data!=null){
         try{
             var json = JSON.parse(data);
             if(json.has_more===true){
                 pageIndex+=1;
                 jsonArray = jsonArray.concat(json.items);
                 getStackOverflowDataByUserId(id,callable);
             }else{
                 jsonArray = jsonArray.concat(json.items);
                 console.log("Number of loops = "+ pageIndex);
                 console.log("Number of items ="+jsonArray.length);
                 callable(jsonArray);
             }
         }catch (err){
             console.log(GENERAL_ERROR+err);
         }

     }
 }

 function handleStackOverflowResponse(json) {
     var resultDictionary = {};
     if(json!=null) {
         json.forEach(function (item) {
             var filter = item.activity_type;
             if (!resultDictionary.hasOwnProperty(filter)) {
                 resultDictionary[filter] = 1;
             } else {
                 resultDictionary[filter] = resultDictionary[filter] + 1;
             }
         });
     }else{
         console.log("no result");
     }
     return resultDictionary;
 }



