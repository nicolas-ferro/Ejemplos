$.ajax({
    url: "banners/",
    success: function (data) {
        $(data).find("a:contains(.swf)").each(getData);
    }
});

function getData() {
	var nameSwf = this.href.replace(window.location.host, "").replace("http:///", "/banners/");

	$.ajax({
		url: "../php/AnalFlash.php?file=.."+nameSwf+"",
		success: function (json) {
		    var obj = jQuery.parseJSON(json);
		    organizeData(obj, nameSwf);
		}
	});			    
};


function organizeData(obj, nameSwf) {

// Get other file types names

	var nameJpg = nameSwf.replace(".swf", ".jpg");
	var nameGif = nameSwf.replace(".swf", ".gif");

// Use SWF Name to get a class name for later use

	var className = nameSwf.replace("/banners/", "");
	var className = className.replace(".swf", "");

// Create SWF object

	var swfObject = "<object type='application/x-shockwave-flash' data='"+nameSwf+"' width='"+obj.width+"' height='"+obj.height+"' scale='noScale' wmode='transparent'>Alertnative Content Here</object>";

// Get SWF specs description paragraph
	
	var bannerSize = obj.size/1000;
	var bannerSpecs = "<p><h5><b>Flash Banner</b></h5><br>Width: "+obj.width+" px</br>Height: "+obj.height+" px</br>Version: "+obj.version+"</br>FPS: "+obj.fps[1]+"</br>File Size: "+bannerSize+" Kb</p>";

// Execute function to write the dom

	getImages(obj, nameSwf, nameJpg, nameGif, className, swfObject, bannerSpecs);

}

function writeDom(obj, nameSwf, nameJpg, nameGif, className, swfObject, bannerSpecs, backupImage, backupImageSpecs, description) {

// Define Header for modal

	var modalHeader = '<div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button><h4 class="modal-title" id="gridSystemModalLabel">File Name: <b>'+className+'</b></h4></div>';

// Decide grid depending the size of the banner

	if (obj.width <= 499) {
		var modalGrid = '<div class="modal-body"><div class="container-fluid"><div class="row"><div class="col-md-6">'+swfObject+'</div><div class="col-md-6">'+backupImage+'</div></div><div class="row"><div class="col-md-6">'+bannerSpecs+'</div><div class="col-md-6">'+backupImageSpecs+'</div></div></div></div>';
	} else {
		var modalGrid = '<div class="modal-body"><div class="container-fluid"><div class="row"><div class="col-md-12">'+swfObject+'</div></div><div class="row"><div class="col-md-12">'+bannerSpecs+'</div></div><div class="row"><div class="col-md-12">'+backupImage+'</div></div><div class="row"><div class="col-md-12">'+backupImageSpecs+'</div></div></div></div>';
	}

// Create hidden modal layers

	$("body").append('<div class="modal fade '+className+'" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true"><div class="modal-dialog modal-lg"><div class="modal-content">'+modalHeader+modalGrid+'</div></div></div>');	

// Create list with button and description for each banner

	$("#list").append('<li><h4>'+className+'</br><small>'+description+'</small></h4><button type="button" id="preview" class="btn btn-primary preview" data-toggle="modal" data-target=".'+className+'">Preview</button></br><img src="img/linea.png"></li>');

};

function getImages(obj, nameSwf, nameJpg, nameGif, className, swfObject, bannerSpecs) {

// Create image object and get dimensions

	backupJpg = $("<img src="+nameJpg+">");
	backupGif = $("<img src="+nameGif+">");
	
	var jpgWidth = backupJpg.get(0).naturalWidth;
	var jpgHeight = backupJpg.get(0).naturalHeight;

	var gifWidth = backupGif.get(0).naturalWidth;
	var gifHeight = backupGif.get(0).naturalHeight;

// Validate JPG

	if (jpgWidth === 0 && jpgHeight === 0) {
		var backupJpg = false;
	} else {
		var backupJpg = true;
	}

// Validate GIF

	if (gifWidth === 0 && gifHeight === 0) {
		var backupGif = false;
	} else {
		var backupGif = true;
	}

// Validate Images & Define description wheter its only a flash file or also a backup JPG/GIF

	if (backupJpg === false && backupGif === false) {
		var backupImage = "NO IMAGE";
		var backupImageSpecs = "NO SPECS";
		var description = "Flash File";
	} else if (backupJpg === true) {
		var backupImage = "<img src="+nameJpg+">";
		var backupImageSpecs = "<p><h5><b>Backup Image</b></h5></br>Width: "+jpgWidth+" px</br>Height: "+jpgHeight+" px</p>";
		var description = "Flash File & JPG Backup";
	} else {
		var backupImage = "<img src="+nameGif+">";
		var backupImageSpecs = "<p><h5><b>Backup Image</b></h5></br>Width: "+gifWidth+" px</br>Height: "+gifHeight+" px</p>";
		var description = "Flash File & GIF Backup";
	}

	writeDom(obj, nameSwf, nameJpg, nameGif, className, swfObject, bannerSpecs, backupImage, backupImageSpecs, description);

}

jQuery(document).ready(function($){
	// browser window scroll (in pixels) after which the "back to top" link is shown
	var offset = 300,
		//browser window scroll (in pixels) after which the "back to top" link opacity is reduced
		offset_opacity = 1200,
		//duration of the top scrolling animation (in ms)
		scroll_top_duration = 700,
		//grab the "back to top" link
		$back_to_top = $('.cd-top');

	//hide or show the "back to top" link
	$(window).scroll(function(){
		( $(this).scrollTop() > offset ) ? $back_to_top.addClass('cd-is-visible') : $back_to_top.removeClass('cd-is-visible cd-fade-out');
		if( $(this).scrollTop() > offset_opacity ) { 
			$back_to_top.addClass('cd-fade-out');
		}
	});

	//smooth scroll to top
	$back_to_top.on('click', function(event){
		event.preventDefault();
		$('body,html').animate({
			scrollTop: 0 ,
		 	}, scroll_top_duration
		);
	});

});