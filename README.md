# Movie Finder
###Introduction
A simple single-page web app which lists the movies that have been filmed in San Francisco, and shows them on the map. 
The data is directly retrieved from: <https://data.sfgov.org/Arts-Culture-and-Recreation-/Film-Locations-in-San-Francisco/yitu-d5am>

###Frontend Libraries
- Backbone.js - support the implementation of each view

- Require.js - address the JS libraries dependency

- jQuery UI -  autocomplete widget to implement the feature of searching film name

- Mustache - Mustache template for different views.

- Google Map Javascript API V3

- Google Geocoding API 



### NPM Dependencies
- "express": "3.4.0",
- "jade": "*",
- "node-cache" : "1.0.0",
- "underscore" : "1.6.0" ,
- "request" : "*" 


###Design

The web app should allow users to do or accomplish the following requirements.

1. The app should show a list of the movies, including the basic information for each one, such as title, location address

2. The app should show a map where each movie record will be pinned based on the location information

3. When user interact with the item, e.g. click on the record in list, the corresponding one in map should be hightlighted/emphasized.

4.  Due to large amount of data, the pagination should be implemented for list, and reflected on map. The default value is, start from the first item, and show 10 items per page.  

5. There should be a text field which allows user to typing in film name and filter to a specific film record result

###Implementation

#### Front-end
The frontend codes were built by utilizing the concepts of views in Backbone.js. The idea is split the single-page web app into three pieces of subviews, based on their functionalities. In this project, there are three views: MainView, ListView and MapView.

```
-MainView
	|-ListView
	|-MapView
```
1. ** MainView **: Main view is containing two seperate divs for holding `ListView` and `MapView`, in addtion, it will include the top bar where the search input field and pagination control live. Its major responsiblities include:
	- Initialize the map, as well as the google geocoder object for retrieving latitude and longtitude value
	
	- Retrieving the data from backend
	
	- Initialize ListView and MapView once data received
	
	- Rerender ListView and MapView when searching film by name, and go to prev/next page

2. ** ListView **: ListView only holds the `<ul>` and use the Mustache template to populate the html. Its major task is only to render contents, based on the data retrieved. 

3. ** MapView ** : MapView's task is similar to ListView, the only difference is it only paints/repaints the Map by pinning `markers` on the map which has been initialized in `MainView`. With that said, the map will only be created once, and all of the rest is to "render" markers on it. For each rendered marker, I stored the data id on it so that it is easy to find one marker by a certain data id in list.

4. **ListView --> MapView**: 
There are some UI interactions occor between `ListView` and `MapView`, for example, clicking one item in list should highlight that matched marker in MapView, so that the user will understand visually regarding the exact location of the interested film. The approach is to passing `mapView` object to `listView`, so when an item clicked, it will trigger a `selectMarker` function, passing the itemId, and in MapView it can easily find the marker and call a Google API function on the `InfoWindow` of that marker, to expand the info window. 


####Back-end

The backend is written by Node.js, backed by Express.js framework and is serving two major RESTful APIs:

**Getting the film Data** :
`/data/:title/?start={startIndex}&num={num of records}`

where title is the name of the film if filtering happens, and start is the current starting pagination index, and num is how many items should be displayed on one page.

The route will firstly getting all of the records and then apply filtering or pagination, note that the original records will be cached, so that it only hit the third party data source when initializing app at the  very first time, after that all of the requests will get cached results.

The response would be a json object, looking like

```
{
	"allData" : [{filmDataJSONObject}],   
    "length" :  Integer                   
}
```
where `allData` is the data that will be sent to client side after applying filter or pagination; `length` indicates the total number of records without applying pagination. For example, if I have 20 items, but only want to display 5 for current page, the `allData` will contain 5 objects while the `length` value is 10.
          
**Getting all the film names**: 	`/movies`
 
 This is mainly for populating the autocompletion text field. The movies data will be retrieved once load the page at the first time, after launch the server. And the movies will be used by `MainView`. The results will also be cached on the node serve.

###Improvements

1. It is better to add some features regarding the current location where the user located, for example, find the nearest location of an interested film. Even more attractive, some features can be added such as get directions to the location point.

2. Add more filters. Currently, the only filter is the film name. To make the data more accessible, it is feasible to add more filter options such as release year, production company, casts, etc.

3. Other options to getting Latitude and Longtitude. Currently, the data only includes the address contents for each film, and Google Map API expects to pass in LatLng object. The current approach is to get the location string and send a AJAX request to Google Geocoding api for each record, when get the response, I parse it and use it to pin the marker. Some other options maybe do the requests on backend, and initialize the data with lat and lng info.

4. Responsive Design. Even thought it is called a web app, but I still want to make it adaptable for mobile or touch device. This means the whole view should be scalable and responsive to the viewport size changes.


	



