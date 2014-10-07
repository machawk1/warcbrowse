// WARCBrowse is an implementation of pure JavaScript processing of WARC files for analysis, visualization, and general procrastination.
// By @machawk1

$(document).ready(function(){
 var txt = $(document.body).text();
 var records = txt.split("WARC/0.17");
 var str = "<html><head><style type=\"text/css\">"+
 			"ul {text-align: right; border: 1px solid #333; position: fixed; list-style-type: none; margin: 5px 0 0 0; padding: 2px; right: 5px; top: 5px;} li {display: block; float: left;} div {width: 100%;} .warcinfo {background-color: #ddf;} .warcresponse {background-color: #fdd;} .warcrequest {background-color: #dfd;} .metadata {background-color: #dff;}"+
 			".uri span {margin-bottom: 1px; padding: 1px 3px 1px 3px;} .has {background-color: #ddffdd; border: 1px solid #99ff99;} .hasnot {background-color: #ffdddd; border: 1px solid #ff9999;}"+
 			"h1 {margin: 0; padding: 0; font-size: 14px;}"+
 			"</style></head><body>";
 //str += "<nav><ul><li class=\"warcinfo\">warcinfo</li><li class=\"warcrequest\">warcrequest</li><li class=\"warcresponse\">warcresponse</li><li class=\"metadata\">metadata</li></ul></nav>";
 
 var dataStr = "";
 dataStr += "<div id=\"data\">";
 $(records).each(function(i,v){
 	str += "<div class=\"";
 	if(v.indexOf("WARC-Type: warcinfo") > -1){
 		dataStr += "warcinfo\">";
 		var wrr = new WARCRecord(v);
 		dataStr += "Target URI: " + wrr.targetURI + " CL: "+wrr.contentLength;
 		addToURIArray(wrr);
 	}else if(v.indexOf("WARC-Type: response") > -1){
 		dataStr += "warcresponse\">";
 		var wrr = new WARCRecord(v);
 		dataStr += "Target URI: " + wrr.targetURI + " CL: "+wrr.contentLength;
 		addToURIArray(wrr);
 	}else if(v.indexOf("WARC-Type: request") > -1){
 		dataStr += "warcrequest\">";
 		var wrr = new WARCRecord(v);
 		dataStr += "Target URI: " + wrr.targetURI + " CL: "+wrr.contentLength;
 		addToURIArray(wrr);
  	}else if(v.indexOf("WARC-Type: metadata") > -1){
 		dataStr += "metadata\">";
 		var wrr = new WARCRecord(v);
 		dataStr += "Target URI: " + wrr.targetURI + " CL: "+wrr.contentLength;
 		addToURIArray(wrr);
 	}else if(v.length > 0){
 		dataStr += "?\">";
 		var wrr = new WARCRecord(v);
 		dataStr += "Target URI: " + wrr.targetURI + " CL: "+wrr.contentLength;
 		addToURIArray(wrr);
 	}else {
 		dataStr += "\" style=\"display: none;\">";
 	}
 	
 	dataStr += "</div>";
 });
 dataStr += "</div>"; //end data
 
 $(document.body).html(str);
 
 var objsData = "<h1>WARC Contents ("+records.length+" records, "+Object.keys(uris).length+" URIs)</h1>";

 for(uri in uris){
 	objsData += "<div class=\"uri\">";
 	objsData += "<span class=\""+(uris[uri].request  ? "has" : "hasnot")+"\">req</span>";
 	objsData += "<span class=\""+(uris[uri].response ? "has" : "hasnot")+"\">resp</span>";
 	objsData += "<span class=\""+(uris[uri].metadata ? "has" : "hasnot")+"\">metadata</span>";
 	objsData += "<span>"+uris[uri].uri + "</span></div>";
 }


 
 $("body").append(objsData);
 
 $("#data").prepend("<p>"+Object.keys(uris).length + " URLs in the WARC file</p>");
 
 //console.log(uris);
});

function addToURIArray(warcRecord){
	if(!(uris[warcRecord.targetURI])){
		uris[warcRecord.targetURI] = {};
		uris[warcRecord.targetURI].records = [];
		uris[warcRecord.targetURI].uri = warcRecord.targetURI;
	}
	
	uris[warcRecord.targetURI].records.push(warcRecord);
	
	if(uris[warcRecord.targetURI][warcRecord.type] == null){
		uris[warcRecord.targetURI][warcRecord.type] = warcRecord;
	}else {
		console.log("ERROR! Multiple definitions of the same type for the same URI (TODO: check dates)");
		console.log(warcRecord);
	}
	
}

function WARCRecord(data){ 
	if(!data){return;}
	var re = /Content-Length:\s*(\d+?)\n/g
	var contentLength = re.exec(data); 
	
	var targetURIregex = /WARC-Target-URI:\s*(.*?)\n/g
	var targetURI = targetURIregex.exec(data);
	
	var warcTypeRegex = /WARC-Type:\s*(.*?)\n/g
	var warcType = warcTypeRegex.exec(data);
	
	this.contentLength = contentLength[1];
	this.targetURI = targetURI ? targetURI[1] : "";
	this.type = warcType[1];
}

function WARCResponseRecord(v){if(!v || v == undefined){return;} return new WARCRecord(v);}
WARCResponseRecord.prototype = new WARCRecord();
WARCResponseRecord.prototype.constructor = WARCResponseRecord;

function URI(){
	this.warcRecords = [];
}

var uris = [];
