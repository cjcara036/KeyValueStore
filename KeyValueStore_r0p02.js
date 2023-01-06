/*
    File: KeyValueStore.js
    Author: C. Carandang
    Description: Interface to store key-value pairs in an IndexedDB database
    Revision #: 0.02
    Revision History:
    0.01  - Initial Class Write-up
    0.02  - Added Cache to improve read performance
*/

class KeyValueStore {

  /*
    Description: Creates a KeyValueStore Object
    Parameters:
      - nameDB: Name given to IndexedDB database created
      - func_rcvErr: Error-handling function for KeyValueStore Object
    Return Value: NONE
  */
  constructor(nameDB, func_rcvErr, MAX_CACHE_SIZE=1024) {
    this.nameDB = nameDB;
    this.func_rcvErr = func_rcvErr;
    this.cache = new Map();
    this.MAX_CACHE_SIZE = MAX_CACHE_SIZE;
  }

   /*
    Description: Creates a KeyValueStore Object
    Parameters:
      - keyValueMap: Map Object containing key-value pairs to be stored in the IndexedDB database
    Return Value: NONE
  */
  async setKV(keyValueMap) {

    //Store key-value pairs to cache
    keyValueMap.forEach((key,value) => {
      this.cache.set(key,value);
    });

    if(this.cache.size > this.MAX_CACHE_SIZE){
      for(let x=0; x<(this.cache.size-this.MAX_CACHE_SIZE); x++)
        this.cache.delete(map.keys().next().value);
    }
    

    // Open the IndexedDB database
    const request = indexedDB.open(this.nameDB);

    // Handle any errors that occur while opening the database
    request.onerror = this.func_rcvErr;

    request.onupgradeneeded = (event) => {
      // Get a reference to the database
      const db = event.target.result;

      // Create an object store to hold the key-value pairs
      const store = db.createObjectStore(this.nameDB, { keyPath: "key" });
    };

    request.onsuccess = (event) => {
      // Get a reference to the database
      const db = event.target.result;

      // Use the nameDB property instead of the hardcoded object store name
      const objectStore = db.transaction(this.nameDB, "readwrite").objectStore(this.nameDB);

      // Store the key-value pairs in the database
      for (const [key, value] of keyValueMap) {
        objectStore.put({ key, value });
      }

      //Close the database after use
      db.close();
    }
  }
      

/*
Description: Retrieves key-value pairs from the cache and the IndexedDB database
Parameters:
  - keys: Array of keys to be search in the IndexedDB database
Return Value: Map object containing all matching key-value pairs
*/
async getKV(keys) {
  return new Promise((resolve, reject) => {
    const resultMap = new Map();

    // First check the cache for the keys
    for (const key of keys) {
      if (this.cache.has(key)) {
        resultMap.set(key, this.cache.get(key));
      }
    }

    // If not all of the keys were found in the cache, look for them in the database
    if (resultMap.size < keys.length) {
      const request = indexedDB.open(this.nameDB);

      request.onerror = this.func_rcvErr;

      request.onsuccess = (event) => {
        const db = event.target.result;

        // Use the nameDB property instead of the hardcoded object store name
        const objectStore = db.transaction(this.nameDB).objectStore(this.nameDB);

        for (const key of keys) {
          if (!resultMap.has(key)) {
            const request = objectStore.get(key);
            request.onsuccess = (event) => {
              resultMap.set(key, event.target.result.value);
            };
          }
        }

        db.close();

        resolve(resultMap);
      };
    } else {
      // All of the keys were found in the cache
      resolve(resultMap);
    }
  });
}

  
}