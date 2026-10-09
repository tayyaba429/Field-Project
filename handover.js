// =====================================================
// HANDOVER JAVASCRIPT
// =====================================================


// =====================================================
// CHECK SECURITY LOGIN
// =====================================================

const handoverSecurityUser = getCurrentUser();


if (
    !handoverSecurityUser ||
    handoverSecurityUser.role !== "security"
) {

    window.location.href = "login.html";

}


// =====================================================
// VARIABLES
// =====================================================

let allApprovedClaims = [];

let selectedClaimId = null;


// =====================================================
// LOAD APPROVED CLAIMS
// =====================================================

async function loadHandoverClaims() {

    const container =
        document.getElementById(
            "handoverClaimsContainer"
        );


    if (!container) {

        return;

    }


    try {

        const claims =
            await getAllData("claims");


        // Only approved claims
        const approvedClaims =
            claims.filter(function (claim) {

                return claim.status === "APPROVED";

            });


        allApprovedClaims =
            [];


        // Get related item for each claim
        for (
            const claim of approvedClaims
        ) {

            const item =
                await getData(
                    "items",
                    claim.itemId
                );


            allApprovedClaims.push({

                claim: claim,

                item: item

            });

        }


        displayHandoverClaims(
            allApprovedClaims
        );


    }
    catch (error) {

        console.error(
            "Error loading approved claims:",
            error
        );


        container.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    ⚠️
                </div>

                <h3>
                    Unable to Load Claims
                </h3>

                <p>
                    Please refresh the page and try again.
                </p>

            </div>

        `;

    }

}


// =====================================================
// DISPLAY CLAIMS
// =====================================================

function displayHandoverClaims(
    claimData
) {

    const container =
        document.getElementById(
            "handoverClaimsContainer"
        );


    const count =
        document.getElementById(
            "claimCount"
        );


    if (!container) {

        return;

    }


    // Count
    if (count) {

        count.textContent =
            `${claimData.length} ${
                claimData.length === 1
                    ? "Claim"
                    : "Claims"
            }`;

    }


    // Empty
    if (claimData.length === 0) {

        container.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    📋
                </div>

                <h3>
                    No Approved Claims
                </h3>

                <p>
                    Approved claims will appear here.
                </p>

            </div>

        `;

        return;

    }


    container.innerHTML = "";


    claimData.forEach(
        function (data) {

            const claim =
                data.claim;

            const item =
                data.item;


            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "handover-claim-card";


            card.innerHTML = `

                <div class="claim-card-top">

                    <h3>
                        ${escapeHTML(
                            item
                                ? item.title
                                : "Item"
                        )}
                    </h3>

                    <span class="approved-badge">
                        APPROVED
                    </span>

                </div>


                <div class="claim-details">


                    <div class="claim-detail">

                        <strong>
                            Claim ID
                        </strong>

                        <span>
                            ${escapeHTML(
                                String(
                                    claim.id
                                )
                            )}
                        </span>

                    </div>


                    <div class="claim-detail">

                        <strong>
                            Student ID
                        </strong>

                        <span>
                            ${escapeHTML(
                                String(
                                    claim.studentId
                                )
                            )}
                        </span>

                    </div>


                    <div class="claim-detail">

                        <strong>
                            Category
                        </strong>

                        <span>
                            ${escapeHTML(
                                item
                                    ? item.category
                                    : "-"
                            )}
                        </span>

                    </div>


                    <div class="claim-detail">

                        <strong>
                            Location
                        </strong>

                        <span>
                            ${escapeHTML(
                                item
                                    ? item.location
                                    : "-"
                            )}
                        </span>

                    </div>


                    <div class="claim-detail">

                        <strong>
                            Claim Status
                        </strong>

                        <span>
                            APPROVED
                        </span>

                    </div>


                </div>


                <button
                    type="button"
                    class="handover-button"
                    onclick="openHandoverModal(${claim.id})"
                >
                    🔐 Verify Code & Complete Handover
                </button>

            `;


            container.appendChild(
                card
            );

        }
    );

}


// =====================================================
// OPEN HANDOVER MODAL
// =====================================================

async function openHandoverModal(
    claimId
) {

    selectedClaimId =
        claimId;


    const modal =
        document.getElementById(
            "handoverModal"
        );


    const details =
        document.getElementById(
            "selectedItemDetails"
        );


    const codeInput =
        document.getElementById(
            "handoverCode"
        );


    const message =
        document.getElementById(
            "handoverMessage"
        );


    if (message) {

        message.textContent =
            "";

    }


    if (codeInput) {

        codeInput.value =
            "";

    }


    try {

        const claim =
            await getData(
                "claims",
                claimId
            );


        if (!claim) {

            alert(
                "Claim not found."
            );

            return;

        }


        const item =
            await getData(
                "items",
                claim.itemId
            );


        if (details) {

            details.innerHTML = `

                <h3>
                    ${escapeHTML(
                        item
                            ? item.title
                            : "Item"
                    )}
                </h3>

                <p>
                    <strong>Student ID:</strong>
                    ${escapeHTML(
                        String(
                            claim.studentId
                        )
                    )}
                </p>

                <p>
                    <strong>Category:</strong>
                    ${escapeHTML(
                        item
                            ? item.category
                            : "-"
                    )}
                </p>

                <p>
                    <strong>Status:</strong>
                    ${escapeHTML(
                        claim.status
                    )}
                </p>

            `;

        }


        if (modal) {

            modal.classList.add(
                "show"
            );

        }


        if (codeInput) {

            codeInput.focus();

        }

    }
    catch (error) {

        console.error(
            "Error opening handover:",
            error
        );

        alert(
            "Unable to open handover."
        );

    }

}


// =====================================================
// CLOSE HANDOVER MODAL
// =====================================================

function closeHandoverModal() {

    const modal =
        document.getElementById(
            "handoverModal"
        );


    const codeInput =
        document.getElementById(
            "handoverCode"
        );


    const message =
        document.getElementById(
            "handoverMessage"
        );


    if (modal) {

        modal.classList.remove(
            "show"
        );

    }


    if (codeInput) {

        codeInput.value =
            "";

    }


    if (message) {

        message.textContent =
            "";

    }


    selectedClaimId =
        null;

}


// =====================================================
// COMPLETE HANDOVER
// =====================================================

async function completeHandoverFromModal() {

    const codeInput =
        document.getElementById(
            "handoverCode"
        );


    const message =
        document.getElementById(
            "handoverMessage"
        );


    if (!codeInput) {

        return;

    }


    const enteredCode =
        codeInput.value.trim();


    // Check code
    if (
        !/^\d{4}$/.test(
            enteredCode
        )
    ) {

        if (message) {

            message.textContent =
                "Please enter a valid 4-digit code.";

        }
        else {

            alert(
                "Please enter a valid 4-digit code."
            );

        }

        return;

    }


    if (!selectedClaimId) {

        alert(
            "No claim selected."
        );

        return;

    }


    try {

        // ---------------------------------------------
        // GET CLAIM
        // ---------------------------------------------

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


        // ---------------------------------------------
        // CHECK CLAIM STATUS
        // ---------------------------------------------

        if (
            claim.status !== "APPROVED"
        ) {

            alert(
                "This claim is not approved."
            );

            return;

        }


        // ---------------------------------------------
        // CHECK HANDOVER CODE
        // ---------------------------------------------

        if (
            claim.handoverCode !==
            enteredCode
        ) {

            if (message) {

                message.textContent =
                    "❌ Invalid handover code.";

            }
            else {

                alert(
                    "Invalid handover code."
                );

            }

            return;

        }


        // ---------------------------------------------
        // GET ITEM
        // ---------------------------------------------

        const item =
            await getData(
                "items",
                claim.itemId
            );


        // ---------------------------------------------
        // UPDATE CLAIM
        // ---------------------------------------------

        claim.status =
            "RETURNED";


        claim.handoverDate =
            new Date().toISOString();


        claim.handedOverBy =
            handoverSecurityUser.id;


        claim.handedOverByName =
            handoverSecurityUser.name;


        await updateData(
            "claims",
            claim
        );


        // ---------------------------------------------
        // UPDATE ITEM
        // ---------------------------------------------

        if (item) {

            item.status =
                "RETURNED";


            item.returnedDate =
                new Date().toISOString();


            item.returnedBy =
                handoverSecurityUser.id;


            item.returnedByName =
                handoverSecurityUser.name;


            await updateData(
                "items",
                item
            );

        }


        // ---------------------------------------------
        // SAVE HANDOVER
        // ---------------------------------------------

        const handover = {

            claimId:
                claim.id,

            securityId:
                handoverSecurityUser.id,

            securityName:
                handoverSecurityUser.name,

            code:
                enteredCode,

            date:
                new Date().toISOString()

        };


        await addData(
            "handovers",
            handover
        );


        // ---------------------------------------------
        // STUDENT NOTIFICATION
        // ---------------------------------------------

        try {

            await addData(
                "notifications",
                {

                    userId:
                        Number(
                            claim.studentId
                        ),

                    message:
                        "Your item has been successfully handed over by the Security Desk.",

                    read:
                        false,

                    date:
                        new Date().toISOString()

                }
            );

        }
        catch (
            notificationError
        ) {

            console.error(
                "Notification error:",
                notificationError
            );

        }


        alert(
            "✅ Handover completed successfully!"
        );


        // Close modal
        closeHandoverModal();


        // Reload claims
        loadHandoverClaims();


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
// SEARCH CLAIMS
// =====================================================

function filterHandoverClaims() {

    const searchInput =
        document.getElementById(
            "handoverSearch"
        );


    if (!searchInput) {

        return;

    }


    const search =
        searchInput.value
            .trim()
            .toLowerCase();


    if (!search) {

        displayHandoverClaims(
            allApprovedClaims
        );

        return;

    }


    const filtered =
        allApprovedClaims.filter(
            function (data) {

                const claim =
                    data.claim;

                const item =
                    data.item;


                const itemName =
                    item
                        ? String(
                            item.title || ""
                          ).toLowerCase()
                        : "";


                const studentId =
                    String(
                        claim.studentId || ""
                    ).toLowerCase();


                const claimId =
                    String(
                        claim.id || ""
                    ).toLowerCase();


                return (
                    itemName.includes(search) ||
                    studentId.includes(search) ||
                    claimId.includes(search)
                );

            }
        );


    displayHandoverClaims(
        filtered
    );

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
// SEARCH EVENT
// =====================================================

const handoverSearch =
    document.getElementById(
        "handoverSearch"
    );


if (handoverSearch) {

    handoverSearch.addEventListener(
        "input",
        filterHandoverClaims
    );

}


// =====================================================
// CLOSE MODAL BY CLICKING OUTSIDE
// =====================================================

const handoverModal =
    document.getElementById(
        "handoverModal"
    );


if (handoverModal) {

    handoverModal.addEventListener(
        "click",
        function (event) {

            if (
                event.target ===
                handoverModal
            ) {

                closeHandoverModal();

            }

        }
    );

}


// =====================================================
// ENTER KEY FOR CODE
// =====================================================

const handoverCode =
    document.getElementById(
        "handoverCode"
    );


if (handoverCode) {

    handoverCode.addEventListener(
        "input",
        function () {

            // Allow only numbers
            this.value =
                this.value
                    .replace(
                        /\D/g,
                        ""
                    )
                    .slice(0, 4);

        }
    );


    handoverCode.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key ===
                "Enter"
            ) {

                event.preventDefault();

                completeHandoverFromModal();

            }

        }
    );

}


// =====================================================
// LOAD PAGE
// =====================================================

if (
    handoverSecurityUser &&
    handoverSecurityUser.role === "security"
) {

    loadHandoverClaims();

}