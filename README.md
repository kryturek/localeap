# LocaLeap

The name is supposed to sound like a mash of locality and leap. It's also the part of this project that I'm the most proud of.

# Why?

Because a certain street view guessing game is one of my favourites. It's a very simple concept too, which makes me want to discover how it works exactly and build my own version of it from the scratch.

# What is different about this one?

Google Maps is obviously the king of geolocation and all that jazz, but whenever you want to create a project or use those services in any other way than using the maps as any normal person, you hit a paywall. Well, not exactly WHENEVER, they do give you a free trial and free monthly quota, but it's all a bit confusing if you're not very experienced (like me) and difficult to set limits so you don't accidentally get charged.

In this project I use open-source and free alternatives to Google Maps. Mapillary is a service that provides crowdsourced geotagged photos, similar to Google's street view. OpenStreetMap provides the map tiles which are then processed and put on a grid with Leaflet.js, so the clicked coordinates can then be compared to where the Mapillary photo was taken.