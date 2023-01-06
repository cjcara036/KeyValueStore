//Description: Create Database and store/read a single key-value pair
async function test01(){
    //Create a Key Value Database 
    let db = new KeyValueStore("testDB",errHandler, 128);

    //Store a key-value pair
    let kv1 = new Map();
    kv1.set("key01","value01");
    await db.setKV(kv1);
    let x = await db.getKV(["key01"]);
    console.log(x);
    console.log ("Done test01");
}

//Description: Create Database and store/read a multiple key-value pair
async function test02(){
    //Create a Key Value Database 
    let db = new KeyValueStore("testDB",errHandler, 128);

    //Store a key-value pair
    let kv1 = new Map();
    kv1.set("key01","value01");
    kv1.set("key02","value02");
    kv1.set("key02","value03");
    await db.setKV(kv1);
    let x = await db.getKV(["key01","key02"]);
    console.log(x);
    console.log("Done A Part");
    kv1.clear();
    console.log("kv1 content cleared");
    console.log(kv1);
    let kv2 = new Map();
    kv2.set("key01","value0A");             
    kv2.set("key02","value0B");
    console.log(kv2);
    await db.setKV(kv2);
    let y = await db.getKV(["key01","key02"]);
    console.log(y);
    console.log ("Done test02");
}

//Description: Multiple read-write to IndexedDB to check
async function test03(){

    //Create a Key Value Database 
    let db = new KeyValueStore("testDB",errHandler,1024);

    // Set the number of loops to run
    const CYCLE_NUM = 100000;

    // Run the specified number of loops
     // Create a new map
     const myMap = new Map();
    for (let i = 0; i < CYCLE_NUM; i++) {
        // Add a key-value pair to the map
        myMap.set(i, Date.now().toString());
    }

    // record Time to store data
    let startTime = Date.now();
    await db.setKV(myMap);
    let endTime = Date.now();
    console.log(`set Time: ${endTime-startTime}ms`);

    // Create an array
    let numbers = [];
    for (let i = 0; i < CYCLE_NUM; i++) {
        numbers.push(i);
    }

    //record Time to retrieve data
    let startTime1 = Date.now();
    let x = await db.getKV(numbers);
    let endTime1 = Date.now();
    console.log(`get Time: ${endTime1-startTime1}ms`);
    
}

function errHandler(err){
    console.log(err);
}

//test01();
//test02();
test03();