/**
 * https://localforage.github.io/localForage/#localforage
 */


var db = function(nameDB, tableName, driver, size, description){
    this.config = {
        name: 'ssc-'+nameDB || 'ssc-website',
        description: description || '',
        storeName: tableName || 'public'
    };
    if(driver){
        this.config.driver = driver;
    }
    if(size){
        this.config.size = size;
    }

};

db.prototype.create = function () {
    this.store = localforage.createInstance(this.config);
};


/**
 * Saves data to an offline store. You can store the following types of JavaScript objects
 * @param key
 * @param value
 * @returns {*}
 */
db.prototype.set = function(key, value) {
    return this.store.setItem(key, value);
};


/**
 * Gets an item from the storage library and supplies the result to a callback. If the key does not exist, getItem() will return null
 * @param key
 * @returns {*}
 */
db.prototype.get = function(key) {
    return this.store.getItem(key);
};


/**
 * Removes the value of a key
 * @param key
 * @returns {*}
 */
db.prototype.remove = function(key) {
    return this.store.removeItem(key);
};


/**
 * Removes every key from the database
 * @returns {*}
 */
db.prototype.clear = function() {
    return this.store.clear();
};


/**
 * Gets the number of keys in the offline store
 */
db.prototype.length = function() {
    return this.store.length();
};


/**
 * Get the name of a key based on its ID
 */
db.prototype.key = function (keyIndex) {
    return this.store.key(keyIndex);
};


/**
 * Get the list of all keys in the datastore
 */
db.prototype.keys = function() {
    return this.store.keys();
};
