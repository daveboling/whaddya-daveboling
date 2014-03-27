$(document).ready( function () {

	//Set the value to a random word from this array
	var random_terms = ['Mount Snow', 'unicorns', 'cosmos', 'ponies', 'people', 'love', 'music', 'world change', 'world news', 'politics', 'conflict', 'tragedy', 'art'];
	var random_value = Math.floor((Math.random()*random_terms.length)+1);

	$('.top #what').val(random_terms[random_value]);



	//Hide content on page load
	$('#content').hide();

	$('#huh').submit( function (e) {
		e.stopPropagation();
		e.preventDefault();

		searchFixed();

		$('.youtube, .google_plus, .flickr').html('');

		var term = $(this).find("#what").val();

		whaddya_youtube(term);
		whaddya_plus(term);
		whaddya_imagur(term);

		$('#content').fadeIn(1400);
	});

	//Display Info
	$('.pageTurn').on('mouseover', function () {
		
		$('.info').show().animate({
			position: 'fixed',
			height: '500px',
			width: '300px',
			top: '50px',
			right: '50px'
		}, 1200);
	});

	$(document).on('click', function () {
		$('.info').animate({
			position: 'fixed',
			height: '0%',
			width: '0%',
			top: '0%',
			right: '0%'
		});
	});


});



var searchFixed = function () {

		$('.top')
		.animate({'margin-top': '0', 'margin-bottom': '0'}, 1000)
		.css({position: 'absolute', top: '0'}, 1200);

		$('.wrapper').animate({'padding-top': '125px'}, 200);

		$('#look').hide();
		
		$('.find').fadeIn(1200);


};

//YouTube Display
var youtube = function (vid){
	var tube = $('.templates .tube ').clone();

	var name = tube.find('.name');
	var img = tube.find('.img');

	tube.hide();

	name.html('<span class="title y_title">' + vid.snippet.title.substring(0, 55) + '</span>');
	img.html('<a href="http://www.youtube.com/watch?v=' + vid.id.videoId + '"><img src="' + vid.snippet.thumbnails.medium.url + '" alt=""/></a>');

	tube.fadeIn(1000);
	return tube;

};

//Youtube API Callback
var whaddya_youtube = function(search) {
	//Sets API KEy for Google API
	gapi.client.setApiKey('AIzaSyAp-mddC_ggTR-ZG9hnfzxnLze0XD2zM-k');
	//Parameters go here for the YouTube.Search method
	var what = {part: "snippet", q: search, maxResults: 50};


	var result = gapi.client.request({
		path: '/youtube/v3/search',
		params: what,
	});


	result.execute(function (response){

		$.each(response.items, function (i, items){
			var videos = youtube(items);
			$('.youtube').append(videos);
		});
	});
};


//GOOGLE PLUS DISPLAY FUNCTION
var plus = function (person){
	var p = $('.templates .plus ').clone();

	//Quick Variables
	var name = p.find('.p_name');
	var img = p.find('.p_img');
	var content = p.find('.p_content');
	var attachments = person.object.attachments;

	p.hide();

	//Add content
	p.find('.profile_link').attr('href', person.actor.url);
	name.html('<span class="title p_title">' + person.actor.displayName + '</span>');
	img.html('<img src="' + person.actor.image.url + '" alt=""/></a>');
	
	//Got pictures?
	if (attachments) {
		content.html('<span class="description">' + person.object.content + '</span> <img src="' + attachments[0].image.url +'"/>');
	}
	else {
		content.html('<span class="description">' + person.object.content + '</span>');
 	}
	//End content

	p.fadeIn(2000);
	return p;

};


//GOOGLE PLUS API CALLBACK
var whaddya_plus = function (search) {

	//Sets API key for Google API
	gapi.client.setApiKey('AIzaSyAp-mddC_ggTR-ZG9hnfzxnLze0XD2zM-k');
	//Parameters go here for the YouTube.Search method
	var what = {query: search, maxResults: 20};

	var result = gapi.client.request({
		path: 'plus/v1/activities',
		params: what,
		method: 'GET',
	});

	result.execute(function (response){

		$.each(response.items, function (i, items){
			var activites = plus(items);
			$('.google_plus').append(activites);
		});

		if (response.items.length === undefined) {
			$('.google_plus').html('Nothing was found.');
		}
	});
};

//Flickr Display
var flickr = function (pic){
	var imagur = $('.templates .flickr_img ').clone();

	var img = imagur.find('.img_holder');

	imagur.hide();

	img.html('<img class="f_img" src="' + pic.media.m + '"/>');

	imagur.fadeIn(3000);
	return imagur;

};

//Bing Image Search
var whaddya_imagur = function (search) {


	//Parameter
	var flickrAPI = 'http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?';

	var result = $.getJSON( flickrAPI ,
        {
          tags: search,
          tagmode: "any",
          format: "json"
    }).done(function (img) {
	
		$.each(img.items, function (i, pictures){
			var activites = flickr(pictures);
			$('.flickr').append(activites);
			if ( i == 30 ) return false;
		});
	});
};
