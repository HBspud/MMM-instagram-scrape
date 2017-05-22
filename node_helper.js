var NodeHelper = require("node_helper");
var InstagramPosts, streamOfPosts;
InstagramPosts = require('instagram-screen-scrape').InstagramPosts;

module.exports = NodeHelper.create({
    // subclass start method.
    start: function() {
        console.log("Starting node_helper for module [" + this.name + "]");
    },
    
    // subclass socketNotificationReceived
    socketNotificationReceived: function(notification, config){
        if (notification === 'INSTAGRAM_GET') {
            this.getImagesFromJSON(config.username, config.maxImages);
        }
    },
    
    getImagesFromJSON: function(username, maxImages) {
        var self = this;
        var images = [];
        
        streamOfPosts = new InstagramPosts({
            username: username
        });
        
        streamOfPosts.on('data', function(post) {
            if(images.length >= maxImages) {
                this.destroy();
            } else {
                if(post.type == "image") {
                    images.push(post.media);
                }
            }
        });
        
        streamOfPosts.on('end', function() {
            self.sendSocketNotification('INSTAGRAM_RETURN_IMAGES', images);
        });
    }
});