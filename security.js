// =====================================================
// SECURITY JAVASCRIPT
// =====================================================


// =====================================================
// CHECK SECURITY LOGIN
// =====================================================

function checkSecurityLogin() {

    const user = getCurrentUser();

    if (!user || user.role !== "security") {

        alert("Security Staff access required.");

        window.location.href = "login.html";

        return false;
    }

    return true;
}


// =====================================================
// CURRENT SECURITY USER
// =====================================================

const securityUser = getCurrentUser();

if (
    !securityUser ||
    securityUser.role !== "security"
) {

    window.location.href = "login.html";
}


// =====================================================
// DISPLAY SECURITY STAFF NAME
// =====================================================

const securityName =
    document.getElementById("securityName");

if (securityName && securityUser) {

    securityName.textContent =
        securityUser.name;

}


// =====================================================
// GENERATE 4-DIGIT HANDOVER CODE
// =====================================================

function generateHandoverCode() {

    return Math.floor(
        1000 + Math.random() * 9000
    ).toString();

}


// =====================================================
// SECURITY DASHBOARD STATISTICS
// =====================================================

async function loadSecurityStatistics() {

    try {

        const items =
            await getAllData("items");

        const claims =
            await getAllData("claims");


        // ---------------------------------------------
        // ALL FOUND ITEMS
        // ---------------------------------------------

        const foundItems =
            items.filter(function (item) {

                return item.type === "FOUND";

            });


        // ---------------------------------------------
        // PENDING VERIFICATION
        //
        // FOUND  = reported by student
        // RECEIVED = received by security
        // ---------------------------------------------

        const pendingItems =
            foundItems.filter(function (item) {

                return (
                    item.status === "FOUND" ||
                    item.status === "RECEIVED"
                );

            });


        // ---------------------------------------------
        // VERIFIED ITEMS
        // ---------------------------------------------

        const verifiedItemsList =
            foundItems.filter(function (item) {

                return item.status === "VERIFIED";

            });


        // ---------------------------------------------
        // RETURNED ITEMS
        // ---------------------------------------------

        const returnedItemsList =
            foundItems.filter(function (item) {

                return item.status === "RETURNED";

            });


        // ---------------------------------------------
        // DASHBOARD ELEMENTS
        // ---------------------------------------------

        const totalFoundItems =
            document.getElementById(
                "totalFoundItems"
            );


        const pendingVerification =
            document.getElementById(
                "pendingVerification"
            );


        const verifiedItems =
            document.getElementById(
                "verifiedItems"
            );


        const returnedItems =
            document.getElementById(
                "returnedItems"
            );


        // ---------------------------------------------
        // SET COUNTS
        // ---------------------------------------------

        if (totalFoundItems) {

            totalFoundItems.textContent =
                foundItems.length;

        }


        if (pendingVerification) {

            pendingVerification.textContent =
                pendingItems.length;

        }


        if (verifiedItems) {

            verifiedItems.textContent =
                verifiedItemsList.length;

        }


        if (returnedItems) {

            returnedItems.textContent =
                returnedItemsList.length;

        }

    }
    catch (error) {

        console.error(
            "Error loading security statistics:",
            error
        );

    }

}


// =====================================================
// LOAD RECENT FOUND ITEMS
// =====================================================

async function loadRecentFoundItems() {

    const container =
        document.getElementById(
            "recentFoundItems"
        );


    if (!container) {

        return;
    }


    try {

        const items =
            await getAllData("items");


        // ---------------------------------------------
        // GET ALL FOUND ITEMS
        // ---------------------------------------------

        const foundItems =
            items.filter(function (item) {

                return item.type === "FOUND";

            });


        // ---------------------------------------------
        // NO FOUND ITEMS
        // ---------------------------------------------

        if (foundItems.length === 0) {

            container.innerHTML = `

                <div class="empty-security">

                    <div>📦</div>

                    <h3>No Found Items</h3>

                    <p>
                        No found items are available right now.
                    </p>

                </div>

            `;

            return;
        }


        // ---------------------------------------------
        // SORT NEWEST FIRST
        // ---------------------------------------------

        foundItems.sort(
            function (a, b) {

                return new Date(
                    b.reportedDate ||
                    b.receivedDate ||
                    0
                ) -
                new Date(
                    a.reportedDate ||
                    a.receivedDate ||
                    0
                );

            }
        );


        // Latest 5
        const recentItems =
            foundItems.slice(0, 5);


        container.innerHTML = "";


        // ---------------------------------------------
        // DISPLAY ITEMS
        // ---------------------------------------------

        recentItems.forEach(
            function (item) {

                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "recent-item-card";


                // Image
                let imageHTML = `
                    <div class="recent-item-image no-image">
                        📦
                    </div>
                `;


                if (item.image) {

                    imageHTML = `
                        <img
                            src="${item.image}"
                            alt="Found Item"
                            class="recent-item-image"
                        >
                    `;

                }


                card.innerHTML = `

                    <div class="recent-item-top">

                        ${imageHTML}

                        <div class="recent-item-info">

                            <h3>
                                ${escapeHTML(
                                    item.title ||
                                    "Unnamed Item"
                                )}
                            </h3>

                            <p>
                                <strong>Category:</strong>
                                ${escapeHTML(
                                    item.category || "-"
                                )}
                            </p>

                            <p>
                                <strong>Location:</strong>
                                ${escapeHTML(
                                    item.location || "-"
                                )}
                            </p>

                            <p>
                                <strong>Date Found:</strong>
                                ${escapeHTML(
                                    item.date || "-"
                                )}
                            </p>

                            <p>
                                <strong>Reported By:</strong>
                                ${escapeHTML(
                                    item.reportedByName || "-"
                                )}
                            </p>

                        </div>

                    </div>

                    <div class="recent-item-bottom">

                        <span class="security-status">
                            ${escapeHTML(
                                item.status || "FOUND"
                            )}
                        </span>

                        <a
                            href="verify-item.html"
                            class="verify-button"
                        >
                            View / Verify
                        </a>

                    </div>

                `;


                container.appendChild(card);

            }
        );

    }
    catch (error) {

        console.error(
            "Error loading recent found items:",
            error
        );

    }

}


// =====================================================
// RECEIVE FOUND ITEM
// =====================================================

const receiveForm =
    document.getElementById(
        "receiveItemForm"
    );


if (receiveForm) {

    receiveForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            try {

                const title =
                    document.getElementById(
                        "itemTitle"
                    ).value.trim();


                const category =
                    document.getElementById(
                        "category"
                    ).value;


                const description =
                    document.getElementById(
                        "description"
                    ).value.trim();


                const location =
                    document.getElementById(
                        "location"
                    ).value.trim();


                const foundDate =
                    document.getElementById(
                        "foundDate"
                    ).value;


                const submittedBy =
                    document.getElementById(
                        "submittedBy"
                    ).value.trim();


                const contact =
                    document.getElementById(
                        "contact"
                    ).value.trim();


                const storageLocation =
                    document.getElementById(
                        "storageLocation"
                    ).value.trim();


                if (
                    !title ||
                    !category ||
                    !description ||
                    !location ||
                    !foundDate ||
                    !submittedBy ||
                    !contact ||
                    !storageLocation
                ) {

                    alert(
                        "Please fill all fields."
                    );

                    return;
                }


                const newItem = {

                    type: "FOUND",

                    title: title,

                    category: category,

                    description: description,

                    location: location,

                    date: foundDate,

                    submittedBy: submittedBy,

                    contact: contact,

                    storageLocation:
                        storageLocation,

                    image: "",

                    status: "RECEIVED",

                    receivedBy:
                        securityUser.id,

                    receivedByName:
                        securityUser.name,

                    receivedDate:
                        new Date().toISOString()

                };


                await addData(
                    "items",
                    newItem
                );


                alert(
                    "Found item received successfully!"
                );


                receiveForm.reset();


                loadSecurityStatistics();

                loadRecentFoundItems();

            }
            catch (error) {

                console.error(
                    "Error saving received item:",
                    error
                );

                alert(
                    "Unable to save found item."
                );

            }

        }
    );

}


// =====================================================
// LOAD ITEMS FOR VERIFICATION
// =====================================================

async function loadItemsForVerification() {

    const container =
        document.getElementById(
            "verifyItemsContainer"
        );


    if (!container) {

        return;
    }


    try {

        const items =
            await getAllData("items");


        // ---------------------------------------------
        // IMPORTANT:
        // Include FOUND because students directly
        // report found items.
        // ---------------------------------------------

        const foundItems =
            items.filter(function (item) {

                return (
                    item.type === "FOUND" &&
                    (
                        item.status === "FOUND" ||
                        item.status === "RECEIVED" ||
                        item.status === "VERIFIED"
                    )
                );

            });


        container.innerHTML = "";


        // ---------------------------------------------
        // NO ITEMS
        // ---------------------------------------------

        if (foundItems.length === 0) {

            container.innerHTML = `

                <div class="empty-security">

                    <div>📦</div>

                    <h3>No Found Items</h3>

                    <p>
                        Received items will appear here
                        for verification.
                    </p>

                </div>

            `;

            updateVerificationCount(0);

            return;
        }


        updateVerificationCount(
            foundItems.length
        );


        // ---------------------------------------------
        // SORT NEWEST FIRST
        // ---------------------------------------------

        foundItems.sort(
            function (a, b) {

                return new Date(
                    b.reportedDate ||
                    b.receivedDate ||
                    0
                ) -
                new Date(
                    a.reportedDate ||
                    a.receivedDate ||
                    0
                );

            }
        );


        // ---------------------------------------------
        // CREATE CARDS
        // ---------------------------------------------

        foundItems.forEach(
            function (item) {

                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "verify-card";


                let imageHTML = "";


                if (item.image) {

                    imageHTML = `
                        <img
                            src="${item.image}"
                            alt="Found Item"
                            style="
                                width:120px;
                                height:120px;
                                object-fit:cover;
                                border-radius:12px;
                                margin-bottom:12px;
                            "
                        >
                    `;

                }


                let buttonsHTML = "";


                if (
                    item.status === "FOUND" ||
                    item.status === "RECEIVED"
                ) {

                    buttonsHTML = `

                        <div class="verify-actions">

                            <button
                                type="button"
                                onclick="verifyItem(${item.id})"
                            >
                                ✅ Verify
                            </button>

                            <button
                                type="button"
                                onclick="rejectItem(${item.id})"
                            >
                                ❌ Reject
                            </button>

                        </div>

                    `;

                }
                else if (
                    item.status === "VERIFIED"
                ) {

                    buttonsHTML = `

                        <div class="verified-message">
                            ✅ Item Verified
                        </div>

                    `;

                }


                card.innerHTML = `

                    ${imageHTML}

                    <h3>
                        ${escapeHTML(
                            item.title ||
                            "Unnamed Item"
                        )}
                    </h3>

                    <p>
                        <strong>Category:</strong>
                        ${escapeHTML(
                            item.category || "-"
                        )}
                    </p>

                    <p>
                        <strong>Location:</strong>
                        ${escapeHTML(
                            item.location || "-"
                        )}
                    </p>

                    <p>
                        <strong>Date Found:</strong>
                        ${escapeHTML(
                            item.date || "-"
                        )}
                    </p>

                    <p>
                        <strong>Description:</strong>
                        ${escapeHTML(
                            item.description || "-"
                        )}
                    </p>

                    <p>
                        <strong>Reported By:</strong>
                        ${escapeHTML(
                            item.reportedByName || "-"
                        )}
                    </p>

                    <p>
                        <strong>Status:</strong>
                        ${escapeHTML(
                            item.status || "FOUND"
                        )}
                    </p>

                    ${buttonsHTML}

                `;


                container.appendChild(card);

            }
        );

    }
    catch (error) {

        console.error(
            "Error loading items for verification:",
            error
        );

    }

}


// =====================================================
// UPDATE VERIFICATION PAGE COUNT
// =====================================================

function updateVerificationCount(count) {

    // Try common count IDs used by verification page
    const countElements = [

        document.getElementById("verifyItemCount"),

        document.getElementById("verificationCount"),

        document.getElementById("resultCount")

    ];


    for (
        let i = 0;
        i < countElements.length;
        i++
    ) {

        if (countElements[i]) {

            countElements[i].textContent =
                count;

        }

    }

}


// =====================================================
// VERIFY ITEM
// =====================================================

async function verifyItem(id) {

    try {

        const item =
            await getData(
                "items",
                id
            );


        if (!item) {

            alert(
                "Item not found."
            );

            return;
        }


        // ---------------------------------------------
        // Make sure it is a found item
        // ---------------------------------------------

        if (item.type !== "FOUND") {

            alert(
                "This is not a found item."
            );

            return;
        }


        // ---------------------------------------------
        // Change status
        // ---------------------------------------------

        item.status =
            "VERIFIED";


        item.verifiedBy =
            securityUser.id;


        item.verifiedByName =
            securityUser.name;


        item.verifiedDate =
            new Date().toISOString();


        await updateData(
            "items",
            item
        );


        alert(
            "Item verified successfully!"
        );


        // Refresh page data
        loadItemsForVerification();

        loadSecurityStatistics();

        loadRecentFoundItems();

    }
    catch (error) {

        console.error(
            "Error verifying item:",
            error
        );

        alert(
            "Unable to verify item."
        );

    }

}


// =====================================================
// REJECT ITEM
// =====================================================

async function rejectItem(id) {

    try {

        const item =
            await getData(
                "items",
                id
            );


        if (!item) {

            alert(
                "Item not found."
            );

            return;
        }


        item.status =
            "REJECTED";


        item.rejectedBy =
            securityUser.id;


        item.rejectedByName =
            securityUser.name;


        item.rejectedDate =
            new Date().toISOString();


        await updateData(
            "items",
            item
        );


        alert(
            "Item rejected."
        );


        loadItemsForVerification();

        loadSecurityStatistics();

        loadRecentFoundItems();

    }
    catch (error) {

        console.error(
            "Error rejecting item:",
            error
        );

        alert(
            "Unable to reject item."
        );

    }

}


// =====================================================
// LOAD APPROVED CLAIMS
// =====================================================

async function loadApprovedClaims() {

    const container =
        document.getElementById(
            "approvedClaimsContainer"
        );


    if (!container) {

        return;
    }


    try {

        const claims =
            await getAllData("claims");


        const approvedClaims =
            claims.filter(function (claim) {

                return (
                    claim.status === "APPROVED"
                );

            });


        container.innerHTML = "";


        if (approvedClaims.length === 0) {

            container.innerHTML =
                "<p>No approved claims available.</p>";

            return;
        }


        for (
            const claim of approvedClaims
        ) {

            const item =
                await getData(
                    "items",
                    claim.itemId
                );


            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "claim-card";


            card.innerHTML = `

                <h3>
                    ${
                        item
                            ? escapeHTML(item.title)
                            : "Item"
                    }
                </h3>

                <p>
                    <strong>Claim ID:</strong>
                    ${claim.id}
                </p>

                <p>
                    <strong>Student ID:</strong>
                    ${escapeHTML(
                        String(
                            claim.studentId
                        )
                    )}
                </p>

                <p>
                    <strong>Status:</strong>
                    ${escapeHTML(
                        claim.status
                    )}
                </p>

                <button
                    type="button"
                    onclick="openHandover(${claim.id})"
                >
                    Complete Handover
                </button>

            `;


            container.appendChild(
                card
            );

        }

    }
    catch (error) {

        console.error(
            "Error loading approved claims:",
            error
        );

    }

}


// =====================================================
// OPEN HANDOVER
// =====================================================

let selectedClaimId = null;


function openHandover(claimId) {

    selectedClaimId =
        claimId;


    const modal =
        document.getElementById(
            "handoverModal"
        );


    if (modal) {

        modal.style.display =
            "flex";

    }

}


// =====================================================
// CLOSE HANDOVER
// =====================================================

function closeHandover() {

    const modal =
        document.getElementById(
            "handoverModal"
        );


    if (modal) {

        modal.style.display =
            "none";

    }


    selectedClaimId =
        null;

}


// =====================================================
// COMPLETE HANDOVER
// =====================================================

async function completeHandover() {

    const codeInput =
        document.getElementById(
            "handoverCode"
        );


    if (!codeInput) {

        return;
    }


    const enteredCode =
        codeInput.value.trim();


    if (
        !/^\d{4}$/.test(
            enteredCode
        )
    ) {

        alert(
            "Please enter a valid 4-digit code."
        );

        return;
    }


    if (!selectedClaimId) {

        alert(
            "No claim selected."
        );

        return;
    }


    try {

        const claim =
            await getData(
                "claims",
                selectedClaimId
            );


        if (!claim) {

            alert(
                "Claim not found."
            );

            return;
        }


        if (
            claim.handoverCode !==
            enteredCode
        ) {

            alert(
                "Invalid 4-digit handover code."
            );

            return;
        }


        // ---------------------------------------------
        // UPDATE CLAIM
        // ---------------------------------------------

        claim.status =
            "RETURNED";


        claim.handoverDate =
            new Date().toISOString();


        claim.handedOverBy =
            securityUser.id;


        await updateData(
            "claims",
            claim
        );


        // ---------------------------------------------
        // UPDATE ITEM
        // ---------------------------------------------

        const item =
            await getData(
                "items",
                claim.itemId
            );


        if (item) {

            item.status =
                "RETURNED";


            await updateData(
                "items",
                item
            );

        }


        // ---------------------------------------------
        // SAVE HANDOVER RECORD
        // ---------------------------------------------

        const handover = {

            claimId:
                claim.id,

            securityId:
                securityUser.id,

            securityName:
                securityUser.name,

            code:
                enteredCode,

            date:
                new Date().toISOString()

        };


        await addData(
            "handovers",
            handover
        );


        alert(
            "Handover completed successfully!"
        );


        codeInput.value =
            "";


        closeHandover();


        loadApprovedClaims();

        loadSecurityStatistics();

        loadRecentFoundItems();

    }
    catch (error) {

        console.error(
            "Error completing handover:",
            error
        );

        alert(
            "Unable to complete handover."
        );

    }

}


// =====================================================
// ESCAPE HTML
// =====================================================

function escapeHTML(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";
    }


    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


// =====================================================
// LOGOUT
// =====================================================

function securityLogout() {

    localStorage.removeItem(
        "loggedInUser"
    );

    window.location.href =
        "login.html";

}


function logout() {

    securityLogout();

}


// =====================================================
// LOGOUT
// =====================================================

function securityLogout() {

    localStorage.removeItem("loggedInUser");

    window.location.href = "login.html";
}


function logout() {

    securityLogout();

}


// Handle all security logout buttons
document.querySelectorAll(
    ".logout, .logout-btn"
).forEach(function (button) {

    button.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            securityLogout();

        }
    );

});


// =====================================================
// LOAD SECURITY DATA
// =====================================================

if (
    securityUser &&
    securityUser.role === "security"
) {

    loadSecurityStatistics();

    loadRecentFoundItems();

    loadItemsForVerification();

    loadApprovedClaims();

}


// =====================================================
// AUTO REFRESH
// =====================================================

setInterval(
    function () {

        if (
            securityUser &&
            securityUser.role === "security"
        ) {

            loadSecurityStatistics();

            loadRecentFoundItems();

        }

    },
    5000
);