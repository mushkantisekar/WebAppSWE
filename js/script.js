try {
	/**
	 * Executes function on window load.
	 */
	window.onload = function(){
		/**
		 * if href is clicked ask for confirmation and execute get currentPosition method.
		 * get current position transfers control to showPosition & Error method.
		 * If user declines/geolocation is not compatible don't redirect.
		 *
		 * @return boolean page redirects based on return value.
		 */
		document.getElementById("getLocation").onclick = function() {
			if (navigator.geolocation) {
				if (confirm("Do you want to change to current location?")) {
					navigator.geolocation.getCurrentPosition(showPosition, error);
				}
			} 
			else {
				alert("Geolocation is not supported by this browser.");
			}
			return false;
		}
		var elements = document.getElementsByClassName('catEl');
		console.log(elements.length);
		for (var i=0; i < elements.length; i++) {
			elements[i].onclick = function() {
				console.log("Ele: " + this);
				var optionArg = this.id;
				document.getElementById("selected").value = optionArg;
				console.log("Selected: " + optionArg);
				return false;
			}
		}
		/**
		 * showPosition
		 *
		 * Set cookie to current latitude and longitude.
		 * Cookie is valid for 1 week.
		 * Page refreshes after setting cookie value to reflect changes.
		 *
		 * @param position contains the current coordinates
		 */
		function showPosition(position) {
			var lat = String(position.coords.latitude).substring(0,8);
			var lng = String(position.coords.longitude).substring(0,8);
			var d = new Date();
			d.setTime(d.getTime() + (7*24*60*60*1000));
			var expires = "expires="+ d.toUTCString();
			document.cookie = "latCookie=" + lat + ";" + expires + ";path=/";
			document.cookie = "longCookie=" + lng + ";" + expires + ";path=/";
			location.reload(true);
		}
		/**
		 * error
		 * 
		 * Alerts the user with error message.
		 *
		 * @param err error object
		 */
		function error(err) {
			switch(error.code) {
				case error.PERMISSION_DENIED:
				  alert("Location Error: " + "User denied the request for Geolocation.")
				  break;
				case error.POSITION_UNAVAILABLE:
				  alert("Location Error: " + "Location information is unavailable.")
				  break;
				case error.TIMEOUT:
				  alert("Location Error: " + "The request to get user location timed out.")
				  break;
				case error.UNKNOWN_ERR:
				  alert("Location Error: " + "An unknown error occurred.")
				  break;
			}
		}
	}
	var map;
	var service;
	var infowindow;
	var count = 0;
	
	/**
	 * initMap
	 *
	 * Initialise Map.
	 * Set center of map get the coordinates from website arguments.
	 * Initialise circle with center and radius arguments.
	 * Restrict map to circular bounds.
	 * Set custom stylesheet for Map.
	 * Pass the request from user arguments.
	 * Initialise Home Marker.
	 */
	function initMap() {
	var home = new google.maps.LatLng(<?php echo $latLong; ?>);
	
	var OMAHA_CIRCLE = new google.maps.Circle({
		center: home,
		radius: parseInt('<?php echo $radius; ?>', 10)
	});
	var OMAHA_BOUNDS = OMAHA_CIRCLE.getBounds();
	
	infowindow = new google.maps.InfoWindow();

	map = new google.maps.Map(document.getElementById('map'), {
		center: home,
		restriction: {
				latLngBounds: OMAHA_BOUNDS,
				strictBounds: false
			},
		zoom: 11,
		mapTypeControl: false,
		mapTypeControlOptions: {
		  style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
		  position: google.maps.ControlPosition.TOP_CENTER
		},
		zoomControl: true,
		zoomControlOptions: {
		  position: google.maps.ControlPosition.LEFT_CENTER
		},
		scaleControl: true,
		streetViewControl: false,
		streetViewControlOptions: {
		  position: google.maps.ControlPosition.LEFT_TOP
		},
		fullscreenControl: true,
		styles: [
			{
				featureType: "administrative",
				elementType: "labels.text",
				stylers: [
					{
						visibility: "off"
					}
				]
			},
			{
				featureType: "administrative.locality",
				elementType: "labels.text",
				stylers: [
					{
						visibility: "off"
					}
				]
			},
			{
				featureType: "administrative.neighborhood",
				elementType: "labels.text",
				stylers: [
					{
						visibility: "off"
					}
				]
			},
			{
				featureType: "landscape.man_made",
				elementType: "labels.text",
				stylers: [
					{
						visibility: "off"
					}
				]
			},
			{
				featureType: "landscape.natural",
				elementType: "geometry.fill",
				stylers: [
					{
						visibility: "on"
					},
					{
						color: "#e0efef"
					}
				]
			},
			{
				featureType: "landscape.natural",
				elementType: "labels.text",
				stylers: [
					{
						visibility: "off"
					}
				]
			},
			{
				featureType: "poi",
				elementType: "geometry.fill",
				stylers: [
					{
						visibility: "on"
					},
					{
						hue: "#1900ff"
					},
					{
						color: "#c0e8e8"
					}
				]
			},
			{
				featureType: "poi",
				elementType: "labels.text",
				stylers: [
					{
						visibility: "off"
					}
				]
			},
			{
				featureType: "poi",
				elementType: "labels.icon",
				stylers: [
					{
						visibility: "off"
					}
				]
			},
			{
				featureType: "road",
				elementType: "geometry",
				stylers: [
					{
						lightness: 100
					},
					{
						visibility: "simplified"
					}
				]
			},
			{
				featureType: "road",
				elementType: "labels",
				stylers: [
					{
						visibility: "off"
					}
				]
			},
			{
				featureType: "transit",
				elementType: "labels.text",
				stylers: [
					{
						visibility: "off"
					}
				]
			},
			{
				featureType: "transit",
				elementType: "labels.icon",
				stylers: [
					{
						visibility: "off"
					}
				]
			},
			{
				featureType: "transit.line",
				elementType: "geometry",
				stylers: [
					{
						visibility: "on"
					},
					{
						lightness: 700
					}
				]
			},
			{
				featureType: "water",
				elementType: "all",
				stylers: [
					{
						color: "#7dcdcd"
					}
				]
			}
		]
	});
	var centerControlDiv = document.createElement('div');
	var centerControl = new CenterControl(centerControlDiv, map);

	centerControlDiv.index = 1;
	map.controls[google.maps.ControlPosition.TOP_CENTER].push(centerControlDiv);

	var request = {
	  query: '<?php echo $option; ?>',
	  location: home,
	  radius: '<?php echo $radius; ?>',
	  minPriceLevel: '<?php echo $price; ?>',
	  maxPriceLevel: '<?php echo $price; ?>'
	};

	service = new google.maps.places.PlacesService(map);
	
	var HOME_MARKER = new google.maps.Marker({
		position: home,
		map: map,
		animation: google.maps.Animation.DROP,
		title: '<?php echo $address; ?>',
		<?php if($address == "Home") {?> 
		icon: 'images/home.png',
		<?php } else {?>
		label: {
			text: '<?php echo $address; ?>',
			fontSize: '10px',
			fontWeight: 'bold'
		},
		<?php } ?>
	});
	
	// add legend elements			
	var legend = document.getElementById('legend');
	
	var div = document.createElement('div');
	div.innerHTML = '<img alt = "Open Red" width = "16" height = "16" src="' + 'images/blue.png'  + '"> ' + "Open<br>";
	div.id = "legendEntry";
	legend.appendChild(div);
	
	var div2 = document.createElement('div');
	div2.innerHTML = '<img alt = "Closed Red" width = "16" height = "16" src="' + 'images/red.png'  + '"> ' + "Closed";
	div2.id = "legendEntry";
	legend.appendChild(div2);
	
	var div3 = document.createElement('div');
	div3.innerHTML = "1.1 Distance";
	div3.id = "legendEntry";
	legend.appendChild(div3);
	
	<?php if($address == "Home") {?> 
	var div4 = document.createElement('div');
	div4.innerHTML = '<img alt = "Batcave Home" width = "16" height = "16" src="' + 'images/home.png'  + '"> ' + "<?php echo $address; ?>";
	div4.id = "legendEntry";
	legend.appendChild(div4);
	<?php } ?>
	// move legend div inside map.
	map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(legend);
	
	/**
	 * textSearch
	 *
	 * Get all the results, loop through them.
	 * Count all the results within circular bounds.
	 * If none within bounds alert user.
	 * Create Custom marker for each result.
	 * If there are any errors while adding marker log it to console.
	 *
	 * @param request request object containing all paramters for search.
	 * @param results contains all resulting objects from results.
	 * @param status ensures that the google places API is up and running.
	 */
	service.textSearch(request, function(results, status) {
	  if (status === google.maps.places.PlacesServiceStatus.OK) {
		for (var i = 0; i < results.length; i++) {
		  if (map.getBounds().contains(results[i].geometry.location)) {
			  count++;
		  }
		  try {
			createMarker(results[i]);
		  }
		  catch(addMarkerErr) {
			console.log("Add Marker Error: " + addMarkerErr.message + " for result no: " + i + results[i].name)
		  }
		}
		console.log("Results within bounds: " + count);
		
		if (count === 0) {
			alert("No Places found for Restraunt type: <?php echo $option; ?> and price level: <?php echo $price; ?>\nPlease choose something else.");
		}
	  }
	});
	}
	
	/**
	 * createMarker
	 *
	 * Add markers to map.
	 * Labeled with approx distance from home to restraunt in miles.
	 * Marker icon is blue and bold text if place open. uses red icon if closed.
	 * Added Listener which displays more infor like address and link to view on gmaps on click.
	 *
	 * @param place contains the place information.
	 */
	function createMarker(place) {
		var weightOfFont = "normal";
		var openNow = "Business Hours Info Unavailable";
		var color = "blue";
		try {
			var open = place.opening_hours.open_now;
			if (open != null) {
				weightOfFont = open? "bold":"lighter";
				openNow = open? "<strong>Open</strong>":"<i>Closed</i>";
				color = open?"blue":"red";
			}
		}
		catch(undefinedErr) {
			console.log("Open now warning: " + undefinedErr.message);
		}
		var place_icon = {
			url: 'images/'+ color +'.png', 
			labelOrigin: new google.maps.Point(15.25,10)
		};
		var home = new google.maps.LatLng(<?php echo $latLong; ?>);
		//get diff
		var diffInMiles = google.maps.geometry.spherical.computeDistanceBetween(home, place.geometry.location) * 0.000621371;
		//convert diff to number from float and truncate digits and to string
		var diffString = Number.parseFloat(diffInMiles).toFixed(1).toString();
		var marker = new google.maps.Marker({
		  map: map,
		  title: place.name,
		  position: place.geometry.location,
		  animation: google.maps.Animation.DROP,
		  label: {
			text: diffString,
			fontSize: '8px',
			fontWeight: weightOfFont,
		  },
		  icon: place_icon,
		});
		
		google.maps.event.addListener(marker, 'click', function() {
		  infowindow.setContent("<em>"+ place.name + "</em><br>" + place.formatted_address + "<br>" + "Approx Distance from <?php echo $address; ?>: " + diffString + "mi<br>"
		  + "Rating: " + place.rating + "/5<br>" + openNow + "<br>"
		  + "<a target= '_blank' href = 'https://www.google.com/maps/search/?api=1&query=" + escape(place.name) + "&query_place_id=" + place.place_id + "'>View on Google Maps</a>");
		  infowindow.open(map, this);
		});
	}
	/**
	* The CenterControl adds a control to the map that recenters the map on
	* Chicago.
	* This constructor takes the control DIV as an argument.
	* @constructor
	*/
	function CenterControl(controlDiv, map) {

		// Set CSS for the control border.
		var controlUI = document.createElement('div');
		controlUI.style.backgroundColor = '#fff';
		controlUI.style.border = '2px solid #fff';
		controlUI.style.borderRadius = '3px';
		controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
		controlUI.style.cursor = 'pointer';
		controlUI.style.marginBottom = '22px';
		controlUI.style.textAlign = 'center';
		controlUI.title = 'Show Legend';
		controlDiv.appendChild(controlUI);

		// Set CSS for the control interior.
		var controlText = document.createElement('div');
		controlText.id = "legendButton";
		controlText.style.color = 'rgb(25,25,25)';
		controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
		controlText.style.fontSize = '16px';
		controlText.style.lineHeight = '38px';
		controlText.style.paddingLeft = '5px';
		controlText.style.paddingRight = '5px';
		controlText.innerHTML = 'Show Legend';
		controlUI.appendChild(controlText);

		// Setup the click event listeners: simply set the map to Chicago.
		controlUI.addEventListener('click', function() {
		  var legendButton = document.getElementById('legendButton');
		  
		  if(legend.style.display == "none") {
		   legend.style.display = "block";
		   legendButton.innerHTML = "Hide Legend";
		  }
		  else {
			legend.style.display = "none";
			legendButton.innerHTML = "Show Legend";
		  }
		});
	}
}
catch(generalError) {
	//General error logging to console.
	console.log("General Error: " + generalError.message);
}