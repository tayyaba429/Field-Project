// =====================================================
// STUDENT JAVASCRIPT
// =====================================================


// =====================================================
// CHECK STUDENT LOGIN
// =====================================================

const currentUser = getCurrentUser();

if (!currentUser || currentUser.role !== "student") {

    window.location.href = "login.html";

}


// =====================================================
// DISPLAY STUDENT NAME
// =====================================================

const studentName =
    document.getElementById("studentName");

if (studentName && currentUser) {

    studentName.textContent =
        currentUser.name;

}


// =====================================================
// REPORT LOST ITEM
// =====================================================

const reportForm =
    document.getElementById("reportForm");

if (reportForm) {

    reportForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            try {

                // Get values
                const itemName =
                    document.getElementById("itemName")
                        .value.trim();

                const category =
                    document.getElementById("category")
                        .value;

                const lostDate =
                    document.getElementById("lostDate")
                        .value;

                const location =
                    document.getElementById("location")
                        .value;

                const description =
                    document.getElementById("description")
                        .value.trim();


                // Validation
                if (
                    !itemName ||
                    !category ||
                    !lostDate ||
                    !location ||
                    !description
                ) {

                    alert(
                        "Please fill all required fields."
                    );

                    return;

                }


                // Image
                const imageInput =
                    document.getElementById("itemImage");

                let image = "";

                if (
                    imageInput &&
                    imageInput.files &&
                    imageInput.files.length > 0
                ) {

                    image =
                        await convertImageToBase64(
                            imageInput.files[0]
                        );

                }


                // Create LOST item
                const item = {

                    type: "LOST",

                    title: itemName,

                    category: category,

                    description: description,

                    location: location,

                    date: lostDate,

                    image: image,

                    status: "LOST",

                    reportedBy: currentUser.id,

                    reportedByName:
                        currentUser.name,

                    reportedDate:
                        new Date().toISOString()

                };


                console.log(
                    "Saving LOST item:",
                    item
                );


                // Save
                const id =
                    await addData(
                        "items",
                        item
                    );


                console.log(
                    "LOST item saved. ID:",
                    id
                );


                alert(
                    "Lost report submitted successfully!"
                );


                window.location.href =
                    "dashboard.html";


            }
            catch (error) {

                console.error(
                    "Error saving lost report:",
                    error
                );

                alert(
                    "Unable to save lost report."
                );

            }

        }
    );

}


// =====================================================
// REPORT FOUND ITEM
// =====================================================

const foundReportForm =
    document.getElementById(
        "foundReportForm"
    );

if (foundReportForm) {

    foundReportForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            try {

                // Get values from report-found.html
                const foundItemName =
                    document.getElementById(
                        "foundItemName"
                    ).value.trim();


                const foundCategory =
                    document.getElementById(
                        "foundCategory"
                    ).value;


                const foundDate =
                    document.getElementById(
                        "foundDate"
                    ).value;


                const foundLocation =
                    document.getElementById(
                        "foundLocation"
                    ).value;


                const foundDescription =
                    document.getElementById(
                        "foundDescription"
                    ).value.trim();


                const storageLocationInput =
                    document.getElementById(
                        "storageLocation"
                    );


                const storageLocation =
                    storageLocationInput
                        ? storageLocationInput.value.trim()
                        : "";


                // Validation
                if (
                    !foundItemName ||
                    !foundCategory ||
                    !foundDate ||
                    !foundLocation ||
                    !foundDescription
                ) {

                    alert(
                        "Please fill all required fields."
                    );

                    return;

                }


                // Image
                const imageInput =
                    document.getElementById(
                        "foundItemImage"
                    );

                let image = "";


                if (
                    imageInput &&
                    imageInput.files &&
                    imageInput.files.length > 0
                ) {

                    image =
                        await convertImageToBase64(
                            imageInput.files[0]
                        );

                }


                // Create FOUND item
                const foundItem = {

                    type: "FOUND",

                    title: foundItemName,

                    category: foundCategory,

                    description: foundDescription,

                    location: foundLocation,

                    date: foundDate,

                    image: image,

                    status: "FOUND",

                    reportedBy:
                        currentUser.id,

                    reportedByName:
                        currentUser.name,

                    reportedDate:
                        new Date().toISOString(),

                    storageLocation:
                        storageLocation

                };


                console.log(
                    "Saving FOUND item:",
                    foundItem
                );


                // Save to IndexedDB
                const id =
                    await addData(
                        "items",
                        foundItem
                    );


                console.log(
                    "FOUND item saved. ID:",
                    id
                );


                // Show message
                const message =
                    document.getElementById(
                        "message"
                    );

                if (message) {

                    message.innerHTML = `
                        <div class="success-message">
                            ✅ Found report submitted successfully!
                        </div>
                    `;

                }


                alert(
                    "Found report submitted successfully!"
                );


                // Redirect to dashboard
                window.location.href =
                    "dashboard.html";


            }
            catch (error) {

                console.error(
                    "Error saving found report:",
                    error
                );

                alert(
                    "Unable to save found report."
                );

            }

        }
    );

}


// =====================================================
// IMAGE TO BASE64
// =====================================================

function convertImageToBase64(file) {

    return new Promise(
        function (resolve, reject) {

            const reader =
                new FileReader();


            reader.onload =
                function () {

                    resolve(
                        reader.result
                    );

                };


            reader.onerror =
                function () {

                    reject(
                        new Error(
                            "Image could not be read."
                        )
                    );

                };


            reader.readAsDataURL(file);

        }
    );

}


// =====================================================
// FOUND ITEM IMAGE PREVIEW
// =====================================================

const foundItemImage =
    document.getElementById(
        "foundItemImage"
    );

const foundImagePreview =
    document.getElementById(
        "foundImagePreview"
    );


if (
    foundItemImage &&
    foundImagePreview
) {

    foundItemImage.addEventListener(
        "change",
        function () {

            const file =
                this.files[0];


            foundImagePreview.innerHTML =
                "";


            if (!file) {

                return;

            }


            const reader =
                new FileReader();


            reader.onload =
                function (event) {

                    foundImagePreview.innerHTML = `
                        <img
                            src="${event.target.result}"
                            alt="Found Item Preview"
                            style="
                                width:180px;
                                height:180px;
                                object-fit:cover;
                                border-radius:12px;
                                margin-top:10px;
                            "
                        >
                    `;

                };


            reader.readAsDataURL(file);

        }
    );

}


// =====================================================
// LOAD MY REPORTS
// =====================================================

async function loadMyReports() {

    const container =
        document.getElementById(
            "myReportsContainer"
        );


    if (
        !container ||
        !currentUser
    ) {

        return;

    }


    try {

        const items =
            await getAllData(
                "items"
            );


        const myItems =
            items.filter(
                function (item) {

                    return (
                        item.reportedBy ===
                        currentUser.id
                    );

                }
            );


        container.innerHTML =
            "";


        if (myItems.length === 0) {

            container.innerHTML =
                "<p>No reports found.</p>";

            return;

        }


        myItems.forEach(
            function (item) {

                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "item-card";


                card.innerHTML = `

                    <h3>
                        ${item.title}
                    </h3>

                    <p>
                        <strong>Type:</strong>
                        ${item.type}
                    </p>

                    <p>
                        <strong>Category:</strong>
                        ${item.category}
                    </p>

                    <p>
                        <strong>Location:</strong>
                        ${item.location}
                    </p>

                    <p>
                        <strong>Date:</strong>
                        ${item.date}
                    </p>

                    <p>
                        <strong>Status:</strong>
                        ${item.status}
                    </p>

                `;


                container.appendChild(
                    card
                );

            }
        );


    }
    catch (error) {

        console.error(
            "Error loading reports:",
            error
        );

    }

}


// =====================================================
// DASHBOARD STATISTICS
// =====================================================

async function loadStudentStatistics() {

    if (!currentUser) {

        return;

    }


    try {

        const items =
            await getAllData(
                "items"
            );


        const myItems =
            items.filter(
                function (item) {

                    return (
                        item.reportedBy ===
                        currentUser.id
                    );

                }
            );


        const lost =
            myItems.filter(
                function (item) {

                    return (
                        item.type ===
                        "LOST"
                    );

                }
            ).length;


        const found =
            myItems.filter(
                function (item) {

                    return (
                        item.type ===
                        "FOUND"
                    );

                }
            ).length;


        const returned =
            myItems.filter(
                function (item) {

                    return (
                        item.status ===
                        "RETURNED"
                    );

                }
            ).length;


        const lostCount =
            document.getElementById(
                "lostCount"
            );


        const foundCount =
            document.getElementById(
                "foundCount"
            );


        const returnedCount =
            document.getElementById(
                "returnedCount"
            );


        if (lostCount) {

            lostCount.textContent =
                lost;

        }


        if (foundCount) {

            foundCount.textContent =
                found;

        }


        if (returnedCount) {

            returnedCount.textContent =
                returned;

        }


    }
    catch (error) {

        console.error(
            "Error loading statistics:",
            error
        );

    }

}


// =====================================================
// LOGOUT
// =====================================================

const logoutButtons =
    document.querySelectorAll(
        ".logout-btn"
    );


logoutButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function (event) {

                event.preventDefault();


                localStorage.removeItem(
                    "loggedInUser"
                );


                window.location.href =
                    "login.html";

            }
        );

    }
);


// =====================================================
// RUN DASHBOARD FUNCTIONS
// =====================================================

loadMyReports();

loadStudentStatistics();