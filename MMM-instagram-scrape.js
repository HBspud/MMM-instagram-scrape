Module.register('MMM-instagram-scrape', {
    defaults: {
        username: 'natgeo',
        maxImages: 4,
        animationSpeed: 1000,
        updateInterval: 86400000 // 1 day
    },
    
    getScripts: function() {
        return [];
    },
    
    getStyles: function() {
        return ['instagram-scrape.css'];
    },
    
    start: function() {
        this.images = {};
        this.grabPhotos();
        setInterval(this.grabPhotos.bind(this), this.config.updateInterval);
    },
    
    grabPhotos: function() {
        this.sendSocketNotification("INSTAGRAM_GET", this.config.username);
        
    },
    
    getDom: function() {
        var wrapper = document.createElement("div");
        wrapper.className = "instagram-scrape-wrapper cf";
        
        for (var i = 0; i < this.config.maxImages; i++) {
            var tempimage = this.images[i];
            
            // image
            var imageEl = document.createElement('div');
            imageEl.innerHTML = "<img src='" + tempimage + "'>";
            imageEl.className = "instagram-scrape-img";
            wrapper.appendChild(imageEl);
        }
        
        return wrapper;
    },
    
    // override socketNotificationReceived
    socketNotificationReceived: function(notification, payload) {
        if (notification === 'INSTAGRAM_RETURN_IMAGES')
        {
            this.images = payload;
            this.updateDom(this.config.animationSpeed);
        }
    }
    
});