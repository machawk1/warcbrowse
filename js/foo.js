$(document).ready(function(){
 var txt = $(document.body).text();
 var records = txt.split("WARC/0.17");
 var str = "<html><head><style type=\"text/css\">"+
 			"ul {text-align: right; border: 1px solid #333; position: fixed; list-style-type: none; margin: 5px 0 0 0; padding: 2px; right: 5px; top: 5px;} li {display: block; float: left;} div {width: 200px;} .warcinfo {background-color: #ddf;} .warcresponse {background-color: #fdd;} .warcrequest {background-color: #dfd;} .metadata {background-color: #dff;}"+
 			"</style></head><body>";
 str += "<nav><ul><li class=\"warcinfo\">=warcinfo</li><li class=\"warcrequest\">warcrequest</li><li class=\"warcresponse\">warcresponse</li><li class=\"metadata\">metadata</li></ul></nav>";
 $(records).each(function(i,v){
 	str += "<div class=\"";
 	if(v.indexOf("WARC-Type: warcinfo") > -1){
 		str += "warcinfo\">";
 		var wrr = new WARCRecord(v);
 		str += " CL: "+wrr.len;
 	}else if(v.indexOf("WARC-Type: response") > -1){
 		str += "warcresponse\">";
 		var wrr = new WARCRecord(v);
 		str += " CL: "+wrr.len;
 	}else if(v.indexOf("WARC-Type: request") > -1){
 		str += "warcrequest\">";
 		var wrr = new WARCRecord(v);
 		str += " CL: "+wrr.len;
  	}else if(v.indexOf("WARC-Type: metadata") > -1){
 		str += "metadata\">";
 		var wrr = new WARCRecord(v);
 		str += " CL: "+wrr.len;
 	}else if(v.length > 0){
 		str += "?\">";
 		var wrr = new WARCRecord(v);
 		str += " CL: "+wrr.len;
 	}else {
 		str += "\" style=\"display: none;\">";
 	}
 	str += "</div>";
 });

 $(document.body).html(str);
});

function WARCRecord(data){ 
	if(!data){return;}
	var re = /Content-Length:\s*(\d+?)\n/g
	var xx = re.exec(data); 
	this.len = xx[1];
}

function WARCResponseRecord(v){if(!v || v == undefined){return;} return new WARCRecord(v);}
WARCResponseRecord.prototype = new WARCRecord();
WARCResponseRecord.prototype.constructor = WARCResponseRecord;