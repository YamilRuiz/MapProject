


  var locationData = [
  {
    name: "Castillo San Felipe del Morro",
    location: {
      lat: 18.4694809,
      lng: -66.1174480
    },
    category: "Monument",
    foursquareId:"4b4705a2f964a5209a2a26e3"
  },
  {
    name: "Casa Bacardi",
    location: {
      lat: 18.4581391,
      lng: -66.1391283
    },
    category: "Drinks"
  },
  {
    name: "Puerto Rico Convention Center",
    location: {
      lat: 18.4540396,
      lng: -66.0919402
    },
    category: "Venue"
  },
  {
    name: "La Fortaleza",
    location: {
      lat: 18.4642518,
      lng: -66.1189661
    },
    category: "Monument"
  },
  {
    name: "Plaza de Armas",
    location: {
      lat: 18.4652605,
      lng: -66.1169112
    },
    category: "Monument"
 }];
 
//var name = [];
//var location=[];

var map;
var markers = [];
var markerCategory = [];

function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 18.2387995, lng: -66.0352490},
          zoom: 12
        });
        var largeInfowindow = new google.maps.InfoWindow();
        var bounds = new google.maps.LatLngBounds();
        for ( b=0; b < locationData.length; b ++ ){
			//names.push(locationData[i].name);
			//location.push(locationData[i].location);
	

			var position = locationData[b].location;
			var title = locationData[b].name;
			var category = locationData[b].category;

			var marker = new google.maps.Marker({
				map:map,
				position: position,
				title: title,
				animation: google.maps.Animation.DROP,
				id:b
			});//closer for marker
		
			markers.push(marker);
			//Load marker data to array
	
			markerCategory.push(category);
			viewModel.locationList()[b].marker = marker;	

			bounds.extend(marker.position);

			marker.addListener('click', function() {
				populateInfoWindow(this, largeInfowindow);
				toggleBounce(this,marker);						
			});//closer for addlistener		
			map.fitBounds(bounds);

			// Makes marker bounce when clicked
			function toggleBounce(marker) {
			  if (marker.getAnimation() !== null) {
			    marker.setAnimation(null);
			  } else {
			    marker.setAnimation(google.maps.Animation.BOUNCE);
			  }
			  setTimeout(function(){
			  	marker.setAnimation(null);
			  }, 3000);
			}//closer togglebounce
		
			function populateInfoWindow(marker, infowindow){
				if (infowindow.marker != marker){
					infowindow.marker = marker;
					infowindow.setContent();
					infowindow.open(map, marker);
					infowindow.addListener('closeclick', function(){
						infowindow.marker = null;
					});//closer addListener
				}//closer if			
				var clientId = "YOURCLIENTID";
			    var clientSecret = "YOURCLIENTSECRETS";
			    var urlF = "https://api.foursquare.com/v2/venues/search?&near=san%20juan&query=" + marker.title + "&limit=1&client_id="+ clientId +"&client_secret="+ clientSecret +"&v=20180124";
			    var infoContent;
			    var infoContenturl = "<div><a href='https://foursquare.com/v/" + infoContent + "'>" +"Click here" +"</a></div>";		    		    	   
				$.getJSON(urlF, function(data){
			        	//selecting the first item in Foursquare
			        	var responses=data;
			        	infoContent= responses.response.venues[0].id;
			        	var infoContenturl = marker.title+"<div><a href='https://foursquare.com/v/" + infoContent + "'>" +"FOURSQUARE INFO" +"</a></div>";
			        	infowindow.setContent(infoContenturl);		        	   	
			        }).fail(function() {
					    alert( "Failed to get Location from Foursquare" );
					  })
			           
			}//closer populateinfowindow
		}//closer for loop
}//initmap closure
function googleError() {
	alert("Failed to load Map ");
}


var locationmap = function(data){
	var self = this;
	this.title= data.name;
	this.location= data.location;
	this.view= ko.observable(true);
	this.category=data.category;
};//Closer Location


var viewModel = function (){
	var self= this;
	this.locationList= ko.observableArray();
	this.filtertext= ko.observable("");
	this.selectedValues= ko.observableArray(["None", "Monument", "Drinks", "Venue"]);
	this.selectedValue= ko.observable("");
	

	for(i=0; i<locationData.length; i++){
		var list= new locationmap(locationData[i]);
		self.locationList.push(list);
	}//closer for
	
	this.searchfunction=ko.computed(function(){
		var filter = self.filtertext().toLowerCase();

		for(b=0; b<self.locationList().length; b++){
			if(self.locationList()[b].title.toLowerCase().indexOf(filter) > -1)
			{
				self.locationList()[b].view(true);
				if (self.locationList()[b].marker)
				{
					self.locationList()[b].marker.setMap(map);
				}
			}else
				{
					self.locationList()[b].view(false);
					if(self.locationList()[b].marker)
					{
						self.locationList()[b].marker.setMap(null);
					}//closer iff
				}//closer else
			
		}//closer for
	});//closer searchfunction
	

	this.showLocation = function(locations) {
	    google.maps.event.trigger(locations.marker, "click");
	};//closer show location


};//Closer view model




viewModel = new viewModel();
ko.applyBindings(viewModel);


		




