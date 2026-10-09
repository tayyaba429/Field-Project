// CLAIMS JAVASCRIPT

// CHECK STUDENT LOGIN

const claimUser = getCurrentUser();

if (!claimUser || claimUser.role !== "student") {

    alert("Student access required.");

    window.location.href = "login.html";
}

// LOAD MY CLAIMS

async function loadMyClaims() {

    const container =
        document.getElementById("claimsContainer");

    if (!container) return;


    try {

        const claims =
            await getAllData("claims");

        // Get only current student's claims
        const myClaims =
            claims.filter(function (claim) {

                return claim.studentId === claimUser.id;

            });


        container.innerHTML = "";


        if (myClaims.length === 0) {

            container.innerHTML = `
                <div class="no-claims">
                    <p>No claims found.</p>
                </div>
            `;

            updateClaimCounts([]);

            return;
        }

        // Display claims
        for (const claim of myClaims) {

            const item =
                await getData(
                    "items",
                    claim.itemId
                );


            const card =
                document.createElement("div");

            card.className = "claim-card";


            let statusClass = "";

            if (claim.status === "PENDING") {

                statusClass = "pending";

            } else if (claim.status === "APPROVED") {

                statusClass = "approved";

            } else if (claim.status === "REJECTED") {

                statusClass = "rejected";

            } else if (claim.status === "RETURNED") {

                statusClass = "returned";
            }


            card.innerHTML = `

                <div class="claim-top">

                    <h3>
                        ${item
                            ? item.title
                            : "Unknown Item"}
                    </h3>

                    <span class="status ${statusClass}">
                        ${claim.status}
                    </span>

                </div>


                <p>
                    <strong>Claim ID:</strong>
                    ${claim.id}
                </p>


                <p>
                    <strong>Category:</strong>
                    ${item
                        ? item.category
                        : "-"}
                </p>


                <p>
                    <strong>Claim Reason:</strong>
                    ${claim.reason}
                </p>


                ${
                    claim.status === "APPROVED"
                    && claim.handoverCode
                    ? `
                        <div class="handover-code-box">

                            <span>
                                Handover Code
                            </span>

                            <strong>
                                ${claim.handoverCode}
                            </strong>

                        </div>
                    `
                    : ""
                }


                <button
                    class="view-claim-btn"
                    onclick="viewClaim(${claim.id})">
                    View Details
                </button>

            `;


            container.appendChild(card);
        }


        updateClaimCounts(myClaims);


    } catch (error) {

        console.error(
            "Error loading claims:",
            error
        );

    }
}

// UPDATE CLAIM COUNTS

function updateClaimCounts(claims) {

    const pending =
        claims.filter(function (claim) {

            return claim.status === "PENDING";

        }).length;


    const approved =
        claims.filter(function (claim) {

            return claim.status === "APPROVED";

        }).length;


    const rejected =
        claims.filter(function (claim) {

            return claim.status === "REJECTED";

        }).length;


    const returned =
        claims.filter(function (claim) {

            return claim.status === "RETURNED";

        }).length;


    setClaimText(
        "pendingClaims",
        pending
    );

    setClaimText(
        "approvedClaims",
        approved
    );

    setClaimText(
        "rejectedClaims",
        rejected
    );

    setClaimText(
        "returnedClaims",
        returned
    );
}

// SET CLAIM TEXT

function setClaimText(id, value) {

    const element =
        document.getElementById(id);

    if (element) {

        element.textContent = value;

    }
}

// VIEW CLAIM DETAILS

async function viewClaim(claimId) {

    try {

        const claim =
            await getData(
                "claims",
                claimId
            );


        if (!claim) {

            alert("Claim not found.");

            return;
        }


        const item =
            await getData(
                "items",
                claim.itemId
            );


        const modal =
            document.getElementById(
                "claimDetailsModal"
            );


        const details =
            document.getElementById(
                "claimDetails"
            );


        if (!modal || !details) return;


        details.innerHTML = `

            <h3>
                ${item
                    ? item.title
                    : "Unknown Item"}
            </h3>

            <p>
                <strong>Claim ID:</strong>
                ${claim.id}
            </p>

            <p>
                <strong>Category:</strong>
                ${item
                    ? item.category
                    : "-"}
            </p>

            <p>
                <strong>Description:</strong>
                ${item
                    ? item.description
                    : "-"}
            </p>

            <p>
                <strong>Location:</strong>
                ${item
                    ? item.location
                    : "-"}
            </p>

            <p>
                <strong>Your Reason:</strong>
                ${claim.reason}
            </p>

            <p>
                <strong>Status:</strong>
                ${claim.status}
            </p>

            ${
                claim.handoverCode
                ? `
                    <div class="handover-code-box">

                        <span>
                            Handover Code
                        </span>

                        <strong>
                            ${claim.handoverCode}
                        </strong>

                    </div>
                `
                : ""
            }

        `;


        modal.style.display = "flex";


    } catch (error) {

        console.error(error);

        alert(
            "Unable to load claim details."
        );

    }
}

// CLOSE CLAIM DETAILS MODAL

function closeClaimModal() {

    const modal =
        document.getElementById(
            "claimDetailsModal"
        );


    if (modal) {

        modal.style.display = "none";

    }
}

// SHOW HANDOVER CODE

async function showHandoverCode(claimId) {

    try {

        const claim =
            await getData(
                "claims",
                claimId
            );


        if (!claim) {

            alert("Claim not found.");

            return;
        }


        if (
            claim.status !== "APPROVED"
        ) {

            alert(
                "Handover code is available only after claim approval."
            );

            return;
        }


        if (!claim.handoverCode) {

            alert(
                "Handover code has not been generated yet."
            );

            return;
        }


        const modal =
            document.getElementById(
                "handoverCodeModal"
            );


        const code =
            document.getElementById(
                "displayHandoverCode"
            );


        if (modal && code) {

            code.textContent =
                claim.handoverCode;

            modal.style.display =
                "flex";
        }


    } catch (error) {

        console.error(error);

    }
}

// CLOSE HANDOVER CODE MODAL

function closeHandoverModal() {

    const modal =
        document.getElementById(
            "handoverCodeModal"
        );


    if (modal) {

        modal.style.display =
            "none";
    }
}

// FILTER CLAIMS

function filterClaims() {

    const filterElement =
        document.getElementById(
            "claimStatusFilter"
        );


    if (!filterElement) return;


    const selectedStatus =
        filterElement.value;


    const cards =
        document.querySelectorAll(
            ".claim-card"
        );


    cards.forEach(function (card) {

        if (
            !selectedStatus ||
            card.textContent.includes(
                selectedStatus
            )
        ) {

            card.style.display = "";

        } else {

            card.style.display = "none";

        }

    });
}

// LOGOUT

function claimLogout() {

    localStorage.removeItem(
        "loggedInUser"
    );

    window.location.href =
        "login.html";
}

// LOGOUT BUTTON

const logoutButtons =
    document.querySelectorAll(
        ".logout-btn"
    );

logoutButtons.forEach(function (button) {

    button.addEventListener(
        "click",
        function () {

            claimLogout();

        }
    );

});

// LOAD CLAIMS

if (
    claimUser &&
    claimUser.role === "student"
) {

    loadMyClaims();

}