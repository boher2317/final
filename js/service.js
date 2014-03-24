/**
 * service.js
 *
 * Computer Science 50
 * Problem Set 8
 *
 * Implements a shuttle service.
 */

// default height
var HEIGHT = 0.8;

// default latitude
var LATITUDE = 42.3745615030193;

// default longitude
var LONGITUDE = -71.11803936751632;

// default heading
var HEADING = 1.757197490907891;

// default number of seats
var SEATS = 10;

// default velocity
var VELOCITY = 50;

// global reference to shuttle's marker on 2D map
var bus = null;

// global reference to 3D Earth
var earth = null;

// global reference to 2D map
var map = null;

// global reference to shuttle
var shuttle = null;

//keep track of dropoffs/points
var points = 0;

// load version 1 of the Google Earth API
google.load("earth", "1");

// load version 3 of the Google Maps API
google.load("maps", "3", {other_params: "sensor=false"});

// once the window has loaded
$(window).load(function() {

    // listen for keydown anywhere in body
    $(document.body).keydown(function(event) {
        return keystroke(event, true);
    });

    // listen for keyup anywhere in body
    $(document.body).keyup(function(event) {
        return keystroke(event, false);
    });

    // listen for click on Drop Off button
    $("#dropoff").click(function(event) {
        dropoff();
    });

    // listen for click on Pick Up button
    $("#pickup").click(function(event) {
        pickup();
    });
    
    // listen for click on Slow Down button
    $("#slowdown").click(function(event) {
        slowdown();
    })
    
    // listen for click on Speed Up button
    $("#speedup").click(function(event) {
        speedup();
    })

    // load application
    load();
});

// unload application
$(window).unload(function() {
    unload();
});

/**
 * Renders seating chart.
 */
function chart()
{
    var html = "<ol start='0'>";
    for (var i = 0; i < shuttle.seats.length; i++)
    {
        if (shuttle.seats[i] == null)
        {
            html += "<li>Empty Seat</li>";
        }
        else
        {
            html += "<li>" + shuttle.seats[i] + "</li>";
        }
    }
    html += "</ol>";
    $("#chart").html(html);
}

//adjusts speed of shuttle, minimum of 10 and max of 300
function slowdown()
{
    if (shuttle.velocity > 10)
    {
        shuttle.velocity -= 10;
    }    
    else
    {
        $("#announcements").html("Shuttle is already at minimum speed");
    }
}

function speedup()
{
    if (shuttle.velocity < 300)
    {
        shuttle.velocity += 10;
    }
    else
    {
        $("#announcements").html("Shuttle is already at maximum speed");
    }
}

/**
 * Drops up passengers if their stop is nearby.
 */
function dropoff()
{
    //iterate through shuttle seats
    for (var j = 0; j < shuttle.seats.length; j++)
    {
        //see who, if anyone, is on board.  using this syntax to check because this is how
        //passengers are assigned to seats in the pickup function below.
        for (var i in PASSENGERS)
        {
            if (PASSENGERS[i].name + ", " + PASSENGERS[i].house == shuttle.seats[j])
            {
                //if near the house of someone currently on the shuttle
                if (shuttle.distance(HOUSES[PASSENGERS[i].house].lat, HOUSES[PASSENGERS[i].house].lng) <= 30)
                /*empty their seat, announce the drop off, update seating chart, and wait 2 seconds before 
                //checking if we are near any other passenger's houses, so the user can see who is getting off
                //one by one. learned about setTimeout function from a google search on how to pause in JS:
                http://stackoverflow.com/questions/19389200/javascript-sleep-delay-wait-function*/
                {
                    points++;
                    shuttle.seats[j] = null;
                    $("#announcements").html("Drop off at " + PASSENGERS[i].house + " successful!  Total points: " + points);
                    chart();
                    setTimeout(dropoff, 2000);
                    return;
                }
            }
        }
    }
    $("#announcements").html("Shuttle not within drop off range of any passenger's house.");
}

/**
 * Called if Google Earth fails to load.
 */
function failureCB(errorCode) 
{
    // report error unless plugin simply isn't installed
    if (errorCode != ERR_CREATE_PLUGIN)
    {
        alert(errorCode);
    }
}

/**
 * Handler for Earth's frameend event.
 */
function frameend() 
{
    shuttle.update();
}

/**
 * Called once Google Earth has loaded.
 */
function initCB(instance) 
{
    // retain reference to GEPlugin instance
    earth = instance;

    // specify the speed at which the camera moves
    earth.getOptions().setFlyToSpeed(100);

    // show buildings
    earth.getLayerRoot().enableLayerById(earth.LAYER_BUILDINGS, true);

    // disable terrain (so that Earth is flat)
    earth.getLayerRoot().enableLayerById(earth.LAYER_TERRAIN, false);

    // prevent mouse navigation in the plugin
    earth.getOptions().setMouseNavigationEnabled(false);

    // instantiate shuttle
    shuttle = new Shuttle({
        heading: HEADING,
        height: HEIGHT,
        latitude: LATITUDE,
        longitude: LONGITUDE,
        planet: earth,
        seats: SEATS,
        velocity: VELOCITY
    });

    // synchronize camera with Earth
    google.earth.addEventListener(earth, "frameend", frameend);

    // synchronize map with Earth
    google.earth.addEventListener(earth.getView(), "viewchange", viewchange);

    // update shuttle's camera
    shuttle.updateCamera();

    // show Earth
    earth.getWindow().setVisibility(true);

    // render seating chart
    chart();

    // populate Earth with passengers and houses
    populate();
}

/**
 * Handles keystrokes.
 */
function keystroke(event, state)
{
    // ensure we have event
    if (!event)
    {
        event = window.event;
    }
    
    //clear any announcements that were made
    $("#announcements").html("");

    // left arrow
    if (event.keyCode == 37)
    {
        shuttle.states.turningLeftward = state;
        return false;
    }

    // up arrow
    else if (event.keyCode == 38)
    {
        shuttle.states.tiltingUpward = state;
        return false;
    }

    // right arrow
    else if (event.keyCode == 39)
    {
        shuttle.states.turningRightward = state;
        return false;
    }

    // down arrow
    else if (event.keyCode == 40)
    {
        shuttle.states.tiltingDownward = state;
        return false;
    }

    // A, a
    else if (event.keyCode == 65 || event.keyCode == 97)
    {
        shuttle.states.slidingLeftward = state;
        return false;
    }

    // D, d
    else if (event.keyCode == 68 || event.keyCode == 100)
    {
        shuttle.states.slidingRightward = state;
        return false;
    }
  
    // S, s
    else if (event.keyCode == 83 || event.keyCode == 115)
    {
        shuttle.states.movingBackward = state;     
        return false;
    }

    // W, w
    else if (event.keyCode == 87 || event.keyCode == 119)
    {
        shuttle.states.movingForward = state;    
        return false;
    }
  
    return true;
}

/**
 * Loads application.
 */
function load()
{
    // embed 2D map in DOM
    var latlng = new google.maps.LatLng(LATITUDE, LONGITUDE);
    map = new google.maps.Map($("#map").get(0), {
        center: latlng,
        disableDefaultUI: true,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        scrollwheel: false,
        zoom: 17,
        zoomControl: true
    });

    // prepare shuttle's icon for map
    bus = new google.maps.Marker({
        icon: "https://maps.gstatic.com/intl/en_us/mapfiles/ms/micons/bus.png",
        map: map,
        title: "you are here"
    });

    // embed 3D Earth in DOM
    google.earth.createInstance("earth", initCB, failureCB);
}

/**
 * Picks up nearby passengers.
 */
function pickup()
{
    for (var i in PASSENGERS)
    {
        //check distance between shuttle and potential passengers
        if (shuttle.distance(PASSENGERS[i].lat, PASSENGERS[i].lng) <= 15)
        {
            //check if potential passenger lives in one of the houses in houses.js.  If not, he/she can't ride.
            if (PASSENGERS[i].house != "Adams House" && PASSENGERS[i].house != "Cabot House" && PASSENGERS[i].house != "Currier House"
            && PASSENGERS[i].house != "Dunster House" && PASSENGERS[i].house != "Eliot House" && PASSENGERS[i].house != "Kirkland House"
            && PASSENGERS[i].house != "Leverett House" && PASSENGERS[i].house != "Lowell House" && PASSENGERS[i].house != "Mather House"
            && PASSENGERS[i].house != "Pforzheimer House" && PASSENGERS[i].house != "Quincy House" && PASSENGERS[i].house != "Winthrop House")
            {
                $("#announcements").html(PASSENGERS[i].name + " is a freshman! Cannot pick up!");
                
                //change passengers lat so they can't be picked up again, even if markers are gone
                //or if passenger is a freshman
                PASSENGERS[i].lat = 0;
                
                /*calling pickup again so that if more than 1 eligible passenger was in range, they
                will all be picked up.  used setTimeout function to make it more clear to the user
                who has boarded the shuttle.  */
                setTimeout(pickup, 1500);
                return;
            }
            //else, board passenger, if there is an empty seat.
            else
            {
                for (var j = 0; j < shuttle.seats.length; j++)
                {
                    if (shuttle.seats[j] == null)
                    {
                        shuttle.seats[j] = PASSENGERS[i].name + ", " + PASSENGERS[i].house;
                        $("#announcements").html(PASSENGERS[i].name + " boarded the shuttle!");
                        //remove placemark and marker on 3d/2d maps.
                        var features = earth.getFeatures();
                        features.removeChild(PASSENGERS[i].placemark);
                        PASSENGERS[i].marker.setMap(null);
                        
                        PASSENGERS[i].lat = 0;
                        //update seating chart
                        chart();
                        setTimeout(pickup, 1500);
                        return;
                    }
                }
                $("#announcements").html("There is no more room on the shuttle right now.");
                return;
            }
        }        
    }
    //if there are no potential passengers within 15 meters.
    $("#announcements").html("There are no non-freshman passengers within 15 meters.");
}

/**
 * Populates Earth with passengers and houses.
 */
function populate()
{
    // mark houses
    for (var house in HOUSES)
    {
        // plant house on map
        new google.maps.Marker({
            icon: "https://google-maps-icons.googlecode.com/files/home.png",
            map: map,
            position: new google.maps.LatLng(HOUSES[house].lat, HOUSES[house].lng),
            title: house
        });
    }

    // get current URL, sans any filename
    var url = window.location.href.substring(0, (window.location.href.lastIndexOf("/")) + 1);

    // scatter passengers
    for (var i = 0; i < PASSENGERS.length; i++)
    {
        // pick a random building
        var building = BUILDINGS[Math.floor(Math.random() * BUILDINGS.length)];

        // prepare placemark
        var placemark = earth.createPlacemark("");
        
        //ensure student doesn't get placed at his/her own house
        while (PASSENGERS[i].house == building.name)
        {
            building = BUILDINGS[Math.floor(Math.random() * BUILDINGS.length)]; 
        }
        placemark.setName(PASSENGERS[i].name + " to " + PASSENGERS[i].house);
            
        // prepare icon
        var icon = earth.createIcon("");
        icon.setHref(url + "/img/" + PASSENGERS[i].username + ".jpg");

        // prepare style
        var style = earth.createStyle("");
        style.getIconStyle().setIcon(icon);
        style.getIconStyle().setScale(4.0);

        // prepare stylemap
        var styleMap = earth.createStyleMap("");
        styleMap.setNormalStyle(style);
        styleMap.setHighlightStyle(style);

        // associate stylemap with placemark
        placemark.setStyleSelector(styleMap);

        // prepare point
        var point = earth.createPoint("");
        point.setAltitudeMode(earth.ALTITUDE_RELATIVE_TO_GROUND);
        point.setLatitude(building.lat);
        point.setLongitude(building.lng);
        point.setAltitude(0.0);

        // associate placemark with point
        placemark.setGeometry(point);

        // add placemark to Earth
        earth.getFeatures().appendChild(placemark);

        // add marker to map
        var marker = new google.maps.Marker({
            icon: "https://maps.gstatic.com/intl/en_us/mapfiles/ms/micons/man.png",
            map: map,
            position: new google.maps.LatLng(building.lat, building.lng),
            title: PASSENGERS[i].name + " at " + building.name});
            
        // remember passenger's placemark and marker for pick-up's sake
        PASSENGERS[i].lat = building.lat;
        PASSENGERS[i].lng = building.lng;
        PASSENGERS[i].marker = marker;
        PASSENGERS[i].placemark = placemark;    
    }
}

/**
 * Handler for Earth's viewchange event.
 */
function viewchange() 
{
    // keep map centered on shuttle's marker
    var latlng = new google.maps.LatLng(shuttle.position.latitude, shuttle.position.longitude);
    map.setCenter(latlng);
    bus.setPosition(latlng);
}

/**
 * Unloads Earth.
 */
function unload()
{
    google.earth.removeEventListener(earth.getView(), "viewchange", viewchange);
    google.earth.removeEventListener(earth, "frameend", frameend);
}
