// INDEXEDDB DATABASE
// DATABASE SETTINGS

const DB_NAME = "CampusLostFoundDB";
const DB_VERSION = 3;

let db = null;

// OPEN DATABASE

const dbReady = new Promise(function (resolve, reject) {

    const request = indexedDB.open(
        DB_NAME,
        DB_VERSION
    );

    // DATABASE UPGRADE / CREATE

    request.onupgradeneeded = function (event) {

        db = event.target.result;

        // USERS

        if (!db.objectStoreNames.contains("users")) {

            const users =
                db.createObjectStore("users", {
                    keyPath: "id",
                    autoIncrement: true
                });

            users.createIndex(
                "email",
                "email",
                {
                    unique: true
                }
            );

            users.createIndex(
                "role",
                "role",
                {
                    unique: false
                }
            );

        }


        // ==========================================
        // ITEMS
        // ==========================================

        if (!db.objectStoreNames.contains("items")) {

            const items =
                db.createObjectStore("items", {
                    keyPath: "id",
                    autoIncrement: true
                });

            items.createIndex(
                "type",
                "type",
                {
                    unique: false
                }
            );

            items.createIndex(
                "category",
                "category",
                {
                    unique: false
                }
            );

            items.createIndex(
                "status",
                "status",
                {
                    unique: false
                }
            );

            items.createIndex(
                "reportedBy",
                "reportedBy",
                {
                    unique: false
                }
            );

        }
        else {

            const transaction =
                event.target.transaction;

            const items =
                transaction.objectStore("items");

            if (!items.indexNames.contains("reportedBy")) {

                items.createIndex(
                    "reportedBy",
                    "reportedBy",
                    {
                        unique: false
                    }
                );

            }

        }

        // CLAIMS
        
        if (!db.objectStoreNames.contains("claims")) {

            const claims =
                db.createObjectStore("claims", {
                    keyPath: "id",
                    autoIncrement: true
                });

            claims.createIndex(
                "itemId",
                "itemId",
                {
                    unique: false
                }
            );

            claims.createIndex(
                "studentId",
                "studentId",
                {
                    unique: false
                }
            );

            claims.createIndex(
                "status",
                "status",
                {
                    unique: false
                }
            );

        }
        else {

            const transaction =
                event.target.transaction;

            const claims =
                transaction.objectStore("claims");

            if (!claims.indexNames.contains("itemId")) {

                claims.createIndex(
                    "itemId",
                    "itemId",
                    {
                        unique: false
                    }
                );

            }

            if (!claims.indexNames.contains("studentId")) {

                claims.createIndex(
                    "studentId",
                    "studentId",
                    {
                        unique: false
                    }
                );

            }

            if (!claims.indexNames.contains("status")) {

                claims.createIndex(
                    "status",
                    "status",
                    {
                        unique: false
                    }
                );

            }

        }

        // NOTIFICATIONS

        if (!db.objectStoreNames.contains("notifications")) {

            const notifications =
                db.createObjectStore(
                    "notifications",
                    {
                        keyPath: "id",
                        autoIncrement: true
                    }
                );

            notifications.createIndex(
                "userId",
                "userId",
                {
                    unique: false
                }
            );

            notifications.createIndex(
                "read",
                "read",
                {
                    unique: false
                }
            );

        }
        else {

            const transaction =
                event.target.transaction;

            const notifications =
                transaction.objectStore(
                    "notifications"
                );

            if (
                !notifications.indexNames.contains("userId")
            ) {

                notifications.createIndex(
                    "userId",
                    "userId",
                    {
                        unique: false
                    }
                );

            }

        }

        // HANDOVERS

        if (!db.objectStoreNames.contains("handovers")) {

            const handovers =
                db.createObjectStore(
                    "handovers",
                    {
                        keyPath: "id",
                        autoIncrement: true
                    }
                );

            handovers.createIndex(
                "claimId",
                "claimId",
                {
                    unique: false
                }
            );

            handovers.createIndex(
                "securityId",
                "securityId",
                {
                    unique: false
                }
            );

            handovers.createIndex(
                "code",
                "code",
                {
                    unique: false
                }
            );

        }
        else {

            const transaction =
                event.target.transaction;

            const handovers =
                transaction.objectStore(
                    "handovers"
                );

            if (
                !handovers.indexNames.contains("claimId")
            ) {

                handovers.createIndex(
                    "claimId",
                    "claimId",
                    {
                        unique: false
                    }
                );

            }

            if (
                !handovers.indexNames.contains("securityId")
            ) {

                handovers.createIndex(
                    "securityId",
                    "securityId",
                    {
                        unique: false
                    }
                );

            }

            if (
                !handovers.indexNames.contains("code")
            ) {

                handovers.createIndex(
                    "code",
                    "code",
                    {
                        unique: false
                    }
                );

            }

        }


        console.log(
            "Database structure created / upgraded."
        );

    };

    // DATABASE SUCCESS

    request.onsuccess = function (event) {

        db =
            event.target.result;

        console.log(
            "IndexedDB connected successfully"
        );

        console.log(
            "Database:",
            db.name
        );

        console.log(
            "Version:",
            db.version
        );

        console.log(
            "Stores:",
            Array.from(
                db.objectStoreNames
            )
        );

        db.onversionchange = function () {

            db.close();

            console.log(
                "Database connection closed because a newer version was opened."
            );

        };


        resolve(db);

    };

    // DATABASE ERROR
    
    request.onerror = function (event) {

        console.error(
            "IndexedDB error:",
            event.target.error
        );

        reject(
            event.target.error
        );

    };

    // DATABASE BLOCKED
    
    request.onblocked = function () {

        console.warn(
            "Database upgrade blocked. Close other tabs of this project."
        );

    };

});

// GET DATABASE

async function getDB() {

    if (db) {

        return db;

    }

    return await dbReady;

}

// ADD DATA

async function addData(
    storeName,
    data
) {

    const database =
        await getDB();


    return new Promise(
        function (resolve, reject) {

            try {

                const transaction =
                    database.transaction(
                        storeName,
                        "readwrite"
                    );


                const store =
                    transaction.objectStore(
                        storeName
                    );


                const request =
                    store.add(data);


                request.onsuccess =
                    function () {

                        resolve(
                            request.result
                        );

                    };


                request.onerror =
                    function () {

                        reject(
                            request.error
                        );

                    };


                transaction.onerror =
                    function () {

                        reject(
                            transaction.error
                        );

                    };


                transaction.onabort =
                    function () {

                        reject(
                            transaction.error ||
                            new Error(
                                "Transaction aborted."
                            )
                        );

                    };

            }
            catch (error) {

                reject(error);

            }

        }
    );

}

// GET ALL DATA

async function getAllData(
    storeName
) {

    const database =
        await getDB();


    return new Promise(
        function (resolve, reject) {

            try {

                const transaction =
                    database.transaction(
                        storeName,
                        "readonly"
                    );


                const store =
                    transaction.objectStore(
                        storeName
                    );


                const request =
                    store.getAll();


                request.onsuccess =
                    function () {

                        resolve(
                            request.result
                        );

                    };


                request.onerror =
                    function () {

                        reject(
                            request.error
                        );

                    };


                transaction.onerror =
                    function () {

                        reject(
                            transaction.error
                        );

                    };

            }
            catch (error) {

                reject(error);

            }

        }
    );

}

// GET ONE DATA

async function getData(
    storeName,
    id
) {

    const database =
        await getDB();


    return new Promise(
        function (resolve, reject) {

            try {

                const transaction =
                    database.transaction(
                        storeName,
                        "readonly"
                    );


                const store =
                    transaction.objectStore(
                        storeName
                    );


                let request;

                /*
                    First try the ID as provided.
                */

                request =
                    store.get(id);


                request.onsuccess =
                    function () {

                        /*
                            If not found and the ID looks
                            like a number, try numeric ID.
                        */

                        if (
                            request.result === undefined &&
                            !isNaN(id)
                        ) {

                            const numericId =
                                Number(id);


                            if (
                                numericId !== id
                            ) {

                                const secondRequest =
                                    store.get(
                                        numericId
                                    );


                                secondRequest.onsuccess =
                                    function () {

                                        resolve(
                                            secondRequest.result
                                        );

                                    };


                                secondRequest.onerror =
                                    function () {

                                        reject(
                                            secondRequest.error
                                        );

                                    };

                                return;

                            }

                        }


                        resolve(
                            request.result
                        );

                    };


                request.onerror =
                    function () {

                        reject(
                            request.error
                        );

                    };


                transaction.onerror =
                    function () {

                        reject(
                            transaction.error
                        );

                    };

            }
            catch (error) {

                reject(error);

            }

        }
    );

}

// UPDATE DATA

async function updateData(
    storeName,
    data
) {

    const database =
        await getDB();


    return new Promise(
        function (resolve, reject) {

            try {

                const transaction =
                    database.transaction(
                        storeName,
                        "readwrite"
                    );


                const store =
                    transaction.objectStore(
                        storeName
                    );


                const request =
                    store.put(data);


                request.onsuccess =
                    function () {

                        resolve(
                            request.result
                        );

                    };


                request.onerror =
                    function () {

                        reject(
                            request.error
                        );

                    };


                transaction.onerror =
                    function () {

                        reject(
                            transaction.error
                        );

                    };

            }
            catch (error) {

                reject(error);

            }

        }
    );

}

// DELETE DATA

async function deleteData(
    storeName,
    id
) {

    const database =
        await getDB();


    return new Promise(
        function (resolve, reject) {

            try {

                const transaction =
                    database.transaction(
                        storeName,
                        "readwrite"
                    );


                const store =
                    transaction.objectStore(
                        storeName
                    );


                /*
                    Convert numeric IDs properly.
                */

                let deleteId =
                    id;


                if (
                    typeof id === "string" &&
                    !isNaN(id)
                ) {

                    deleteId =
                        Number(id);

                }


                const request =
                    store.delete(
                        deleteId
                    );


                request.onsuccess =
                    function () {

                        resolve(true);

                    };


                request.onerror =
                    function () {

                        reject(
                            request.error
                        );

                    };


                transaction.onerror =
                    function () {

                        reject(
                            transaction.error
                        );

                    };

            }
            catch (error) {

                reject(error);

            }

        }
    );

}

// CLEAR STORE

async function clearData(
    storeName
) {

    const database =
        await getDB();


    return new Promise(
        function (resolve, reject) {

            try {

                const transaction =
                    database.transaction(
                        storeName,
                        "readwrite"
                    );


                const store =
                    transaction.objectStore(
                        storeName
                    );


                const request =
                    store.clear();


                request.onsuccess =
                    function () {

                        resolve(true);

                    };


                request.onerror =
                    function () {

                        reject(
                            request.error
                        );

                    };


                transaction.onerror =
                    function () {

                        reject(
                            transaction.error
                        );

                    };

            }
            catch (error) {

                reject(error);

            }

        }
    );

}

// COUNT DATA

async function countData(
    storeName
) {

    const database =
        await getDB();


    return new Promise(
        function (resolve, reject) {

            try {

                const transaction =
                    database.transaction(
                        storeName,
                        "readonly"
                    );


                const store =
                    transaction.objectStore(
                        storeName
                    );


                const request =
                    store.count();


                request.onsuccess =
                    function () {

                        resolve(
                            request.result
                        );

                    };


                request.onerror =
                    function () {

                        reject(
                            request.error
                        );

                    };

            }
            catch (error) {

                reject(error);

            }

        }
    );

}

// CHECK DATABASE

async function checkDatabase() {

    try {

        const database =
            await getDB();


        console.log(
            "================================"
        );

        console.log(
            "DATABASE INFORMATION"
        );

        console.log(
            "Name:",
            database.name
        );

        console.log(
            "Version:",
            database.version
        );

        console.log(
            "Stores:",
            Array.from(
                database.objectStoreNames
            )
        );

        console.log(
            "================================"
        );

    }

    catch (error) {

        console.error(
            "Database check failed:",
            error
        );

    }

}