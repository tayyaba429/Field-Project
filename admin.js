// CHECK ADMIN LOGIN

const adminUser = getCurrentUser();

if (!adminUser || adminUser.role !== "admin") {

    window.location.href = "login.html";

}

// DISPLAY ADMIN NAME

const adminName =
    document.getElementById("adminName");

if (adminName && adminUser) {

    adminName.textContent =
        adminUser.name || "Admin";

}

// SET TEXT HELPER

function setText(id, value) {

    const element =
        document.getElementById(id);

    if (element) {

        element.textContent = value;

    }

}

// GENERATE 4 DIGIT HANDOVER CODE


function generateHandoverCode() {

    return Math.floor(
        1000 + Math.random() * 9000
    ).toString();

}

// DASHBOARD STATISTICS

async function loadAdminStatistics() {

    try {

        const users =
            await getAllData("users");

        const items =
            await getAllData("items");

        const claims =
            await getAllData("claims");

        // USER COUNTS
        
        const totalUsers =
            users.length;

        const students =
            users.filter(function (user) {

                return user.role === "student";

            }).length;

        const securityStaff =
            users.filter(function (user) {

                return user.role === "security";

            }).length;

        const admins =
            users.filter(function (user) {

                return user.role === "admin";

            }).length;

        // ITEM COUNTS
        
        const totalReports =
            items.length;

        const lostItems =
            items.filter(function (item) {

                return item.type === "LOST";

            }).length;

        const foundItems =
            items.filter(function (item) {

                return item.type === "FOUND";

            }).length;

        const returnedItems =
            items.filter(function (item) {

                return item.status === "RETURNED";

            }).length;

        // CLAIM COUNTS

        const pendingClaims =
            claims.filter(function (claim) {

                return claim.status === "PENDING";

            }).length;

        const approvedClaims =
            claims.filter(function (claim) {

                return claim.status === "APPROVED";

            }).length;

        const rejectedClaims =
            claims.filter(function (claim) {

                return claim.status === "REJECTED";

            }).length;

        // ADMIN DASHBOARD IDS

        setText(
            "totalUsers",
            totalUsers
        );

        setText(
            "totalReports",
            totalReports
        );

        setText(
            "totalLost",
            lostItems
        );

        setText(
            "totalFound",
            foundItems
        );

        setText(
            "lostItems",
            lostItems
        );

        setText(
            "foundItems",
            foundItems
        );

        setText(
            "returnedItems",
            returnedItems
        );

        setText(
            "pendingClaims",
            pendingClaims
        );

        setText(
            "approvedClaims",
            approvedClaims
        );

        setText(
            "rejectedClaims",
            rejectedClaims
        );

        setText(
            "securityStaff",
            securityStaff
        );

        setText(
            "students",
            students
        );

        setText(
            "adminUsers",
            admins
        );

        // USERS PAGE SUMMARY IDS

        setText(
            "totalStudents",
            students
        );

        setText(
            "totalSecurity",
            securityStaff
        );

        setText(
            "totalAdmins",
            admins
        );

    }

    catch (error) {

        console.error(
            "Error loading admin statistics:",
            error
        );

    }

}

// REPORT MANAGEMENT

let allReports = [];

// LOAD REPORTS

async function loadReports() {

    const tableBody =
        document.getElementById(
            "reportsTableBody"
        );


    if (!tableBody) {
        return;
    }


    try {

        allReports =
            await getAllData("items");


        console.log(
            "Reports loaded:",
            allReports
        );


        updateReportSummary(
            allReports
        );


        displayReports(
            allReports
        );

    }

    catch (error) {

        console.error(
            "Error loading reports:",
            error
        );


        tableBody.innerHTML = `

            <tr class="empty-row">

                <td colspan="7">

                    <div class="empty-reports">

                        <div>⚠️</div>

                        <h3>
                            Unable to Load Reports
                        </h3>

                        <p>
                            Please refresh the page.
                        </p>

                    </div>

                </td>

            </tr>

        `;

    }

}

// REPORT SUMMARY

async function updateReportSummary(items) {

    try {

        const claims =
            await getAllData("claims");


        const total =
            items.length;


        const lost =
            items.filter(function (item) {

                return item.type === "LOST";

            }).length;


        const found =
            items.filter(function (item) {

                return item.type === "FOUND";

            }).length;


        const pending =
            claims.filter(function (claim) {

                return claim.status === "PENDING";

            }).length;


        setText(
            "totalReports",
            total
        );

        setText(
            "lostReports",
            lost
        );

        setText(
            "foundReports",
            found
        );

        setText(
            "pendingReports",
            pending
        );

    }

    catch (error) {

        console.error(
            "Error updating report summary:",
            error
        );

    }

}

// DISPLAY REPORTS


function displayReports(items) {

    const tableBody =
        document.getElementById(
            "reportsTableBody"
        );


    if (!tableBody) {
        return;
    }


    tableBody.innerHTML = "";


    if (items.length === 0) {

        tableBody.innerHTML = `

            <tr class="empty-row">

                <td colspan="7">

                    <div class="empty-reports">

                        <div>📭</div>

                        <h3>
                            No Reports Found
                        </h3>

                        <p>
                            Try changing your search or filters.
                        </p>

                    </div>

                </td>

            </tr>

        `;

        return;

    }


    items.forEach(function (item) {

        const row =
            document.createElement("tr");

        // TYPE

        let typeText =
            item.type || "-";

        let typeClass =
            "";


        if (
            item.type === "LOST"
        ) {

            typeText =
                "Lost";

            typeClass =
                "type-lost";

        }

        else if (
            item.type === "FOUND"
        ) {

            typeText =
                "Found";

            typeClass =
                "type-found";

        }


        // ======================================
        // STATUS
        // ======================================

        const rawStatus =
            item.status || "-";


        let statusText =
            rawStatus;

        let statusClass =
            "";


        if (
            rawStatus === "LOST"
        ) {

            statusText =
                "Lost";

            statusClass =
                "status-pending";

        }

        else if (
            rawStatus === "FOUND"
        ) {

            statusText =
                "Found";

            statusClass =
                "status-active";

        }

        else if (
            rawStatus === "VERIFIED"
        ) {

            statusText =
                "Verified";

            statusClass =
                "status-active";

        }

        else if (
            rawStatus === "CLAIMED"
        ) {

            statusText =
                "Claimed";

            statusClass =
                "status-claimed";

        }

        else if (
            rawStatus === "RETURNED"
        ) {

            statusText =
                "Returned";

            statusClass =
                "status-returned";

        }


        row.innerHTML = `

            <td>
                <strong>
                    ${escapeHTML(
                        item.title || "-"
                    )}
                </strong>
            </td>


            <td>

                <span class="type-badge ${typeClass}">
                    ${typeText}
                </span>

            </td>


            <td>
                ${escapeHTML(
                    item.category || "-"
                )}
            </td>


            <td>
                ${escapeHTML(
                    item.location || "-"
                )}
            </td>


            <td>
                ${escapeHTML(
                    item.date || "-"
                )}
            </td>


            <td>

                <span class="status-badge ${statusClass}">
                    ${statusText}
                </span>

            </td>


            <td>

                <button
                    type="button"
                    class="view-report-btn"
                    onclick="viewReportDetails(${Number(item.id)})">

                    View Details

                </button>

            </td>

        `;


        tableBody.appendChild(
            row
        );

    });

}


// ==========================================
// SEARCH + FILTER REPORTS
// ==========================================

function filterReports() {

    const searchInput =
        document.getElementById(
            "reportSearch"
        );


    const typeFilter =
        document.getElementById(
            "reportType"
        );


    const categoryFilter =
        document.getElementById(
            "reportCategory"
        );


    const statusFilter =
        document.getElementById(
            "reportStatus"
        );


    const searchText =
        searchInput
        ? searchInput.value
            .trim()
            .toLowerCase()
        : "";


    const selectedType =
        typeFilter
        ? typeFilter.value
        : "all";


    const selectedCategory =
        categoryFilter
        ? categoryFilter.value
        : "all";


    const selectedStatus =
        statusFilter
        ? statusFilter.value
        : "all";


    const filteredReports =
        allReports.filter(function (item) {


            // ==================================
            // SEARCH
            // ==================================

            const title =
                (item.title || "")
                    .toLowerCase();


            const description =
                (item.description || "")
                    .toLowerCase();


            const location =
                (item.location || "")
                    .toLowerCase();


            const category =
                (item.category || "")
                    .toLowerCase();


            const reportedBy =
                (item.reportedByName || "")
                    .toLowerCase();


            const studentId =
                String(
                    item.studentId || ""
                ).toLowerCase();


            const matchesSearch =

                !searchText ||

                title.includes(
                    searchText
                ) ||

                description.includes(
                    searchText
                ) ||

                location.includes(
                    searchText
                ) ||

                category.includes(
                    searchText
                ) ||

                reportedBy.includes(
                    searchText
                ) ||

                studentId.includes(
                    searchText
                );


            // ==================================
            // TYPE
            // ==================================

            let matchesType =
                true;


            if (
                selectedType !== "all"
            ) {

                if (
                    selectedType === "Lost"
                ) {

                    matchesType =
                        item.type === "LOST";

                }

                else if (
                    selectedType === "Found"
                ) {

                    matchesType =
                        item.type === "FOUND";

                }

            }


            // ==================================
            // CATEGORY
            // ==================================

            const matchesCategory =

                selectedCategory === "all" ||

                item.category ===
                selectedCategory;


            // ==================================
            // STATUS
            // ==================================

            let matchesStatus =
                true;


            if (
                selectedStatus !== "all"
            ) {

                if (
                    selectedStatus === "Pending"
                ) {

                    matchesStatus =
                        item.status ===
                        "LOST";

                }

                else if (
                    selectedStatus === "Active"
                ) {

                    matchesStatus =
                        item.status ===
                            "FOUND" ||
                        item.status ===
                            "VERIFIED";

                }

                else if (
                    selectedStatus === "Claimed"
                ) {

                    matchesStatus =
                        item.status ===
                        "CLAIMED";

                }

                else if (
                    selectedStatus === "Returned"
                ) {

                    matchesStatus =
                        item.status ===
                        "RETURNED";

                }

            }


            return (
                matchesSearch &&
                matchesType &&
                matchesCategory &&
                matchesStatus
            );

        });


    console.log(
        "Filtered reports:",
        filteredReports
    );


    displayReports(
        filteredReports
    );

}


// ==========================================
// VIEW REPORT DETAILS
// ==========================================

async function viewReportDetails(
    itemId
) {

    try {

        const item =
            await getData(
                "items",
                Number(itemId)
            );


        if (!item) {

            alert(
                "Report not found."
            );

            return;

        }


        let studentName =
            item.reportedByName || "-";


        let studentId =
            item.studentId || "-";


        // ======================================
        // GET USER DETAILS
        // ======================================

        if (
            item.reportedBy !== undefined &&
            item.reportedBy !== null
        ) {

            const user =
                await getData(
                    "users",
                    Number(item.reportedBy)
                );


            if (user) {

                studentName =
                    user.name ||
                    studentName;


                studentId =
                    user.studentId ||
                    studentId;

            }

        }


        const details =
            document.getElementById(
                "reportDetails"
            );


        if (!details) {
            return;
        }


        let imageHTML =
            "";


        if (item.image) {

            imageHTML = `

                <img
                    src="${item.image}"
                    alt="Item Photo"
                    style="
                        max-width:100%;
                        max-height:300px;
                        display:block;
                        margin:0 auto 20px;
                        border-radius:12px;
                        object-fit:contain;
                    "
                >

            `;

        }


        details.innerHTML = `

            ${imageHTML}


            <div class="report-detail-row">

                <strong>
                    Item Name
                </strong>

                <span>
                    ${escapeHTML(
                        item.title || "-"
                    )}
                </span>

            </div>


            <div class="report-detail-row">

                <strong>
                    Type
                </strong>

                <span>
                    ${
                        item.type === "LOST"
                        ? "Lost"
                        : "Found"
                    }
                </span>

            </div>


            <div class="report-detail-row">

                <strong>
                    Category
                </strong>

                <span>
                    ${escapeHTML(
                        item.category || "-"
                    )}
                </span>

            </div>


            <div class="report-detail-row">

                <strong>
                    Description
                </strong>

                <span>
                    ${escapeHTML(
                        item.description || "-"
                    )}
                </span>

            </div>


            <div class="report-detail-row">

                <strong>
                    Location
                </strong>

                <span>
                    ${escapeHTML(
                        item.location || "-"
                    )}
                </span>

            </div>


            <div class="report-detail-row">

                <strong>
                    Date
                </strong>

                <span>
                    ${escapeHTML(
                        item.date || "-"
                    )}
                </span>

            </div>


            ${
                item.storageLocation
                ? `

                    <div class="report-detail-row">

                        <strong>
                            Storage Location
                        </strong>

                        <span>
                            ${escapeHTML(
                                item.storageLocation
                            )}
                        </span>

                    </div>

                `
                : ""
            }


            <div class="report-detail-row">

                <strong>
                    Reported By
                </strong>

                <span>
                    ${escapeHTML(
                        studentName
                    )}
                </span>

            </div>


            <div class="report-detail-row">

                <strong>
                    Student ID
                </strong>

                <span>
                    ${escapeHTML(
                        studentId
                    )}
                </span>

            </div>


            <div class="report-detail-row">

                <strong>
                    Status
                </strong>

                <span>
                    ${escapeHTML(
                        item.status || "-"
                    )}
                </span>

            </div>

        `;


        const modal =
            document.getElementById(
                "reportModal"
            );


        if (modal) {

            modal.classList.add(
                "show"
            );

        }

    }

    catch (error) {

        console.error(
            "Error loading report details:",
            error
        );


        alert(
            "Unable to load report details."
        );

    }

}


// ==========================================
// CLOSE REPORT MODAL
// ==========================================

function closeReportModal() {

    const modal =
        document.getElementById(
            "reportModal"
        );


    if (modal) {

        modal.classList.remove(
            "show"
        );

    }

}


// ==========================================
// USERS
// ==========================================

let allUsers = [];


// ==========================================
// LOAD USERS
// ==========================================

async function loadUsers() {

    const tableBody =
        document.getElementById(
            "usersTableBody"
        );


    if (!tableBody) {
        return;
    }


    try {

        allUsers =
            await getAllData("users");


        displayUsers(
            allUsers
        );

    }

    catch (error) {

        console.error(
            "Error loading users:",
            error
        );


        tableBody.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    class="empty-table">

                    Unable to load users.

                </td>

            </tr>

        `;

    }

}


// ==========================================
// DISPLAY USERS
// ==========================================

function displayUsers(
    users
) {

    const tableBody =
        document.getElementById(
            "usersTableBody"
        );


    if (!tableBody) {
        return;
    }


    tableBody.innerHTML = "";


    if (users.length === 0) {

        tableBody.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    class="empty-table">

                    👥 No users found

                </td>

            </tr>

        `;

        return;

    }


    users.forEach(function (user) {

        const row =
            document.createElement("tr");


        const status =
            user.status ||
            "active";


        const joined =
            user.joinedDate
            ? new Date(
                user.joinedDate
            ).toLocaleDateString()
            : "-";


        let roleText =
            user.role || "-";


        if (
            user.role ===
            "security"
        ) {

            roleText =
                "Security Staff";

        }


        row.innerHTML = `

            <td>

                <strong>
                    ${escapeHTML(
                        user.name || "-"
                    )}
                </strong>

            </td>


            <td>
                ${escapeHTML(
                    user.studentId || "-"
                )}
            </td>


            <td>
                ${escapeHTML(
                    user.email || "-"
                )}
            </td>


            <td>
                ${roleText}
            </td>


            <td>

                <span class="status-badge ${status}">

                    ${status}

                </span>

            </td>


            <td>
                ${joined}
            </td>


            <td>

                <button
                    type="button"
                    onclick="openEditUserModal(${Number(user.id)})">

                    Edit

                </button>


                <button
                    type="button"
                    onclick="deleteUser(${Number(user.id)})">

                    Delete

                </button>

            </td>

        `;


        tableBody.appendChild(
            row
        );

    });

}


// ==========================================
// FILTER USERS
// ==========================================

function filterUsers() {

    const searchInput =
        document.getElementById(
            "userSearch"
        );


    const roleFilter =
        document.getElementById(
            "roleFilter"
        );


    const statusFilter =
        document.getElementById(
            "statusFilter"
        );


    const search =
        searchInput
        ? searchInput.value
            .trim()
            .toLowerCase()
        : "";


    const role =
        roleFilter
        ? roleFilter.value
        : "all";


    const status =
        statusFilter
        ? statusFilter.value
        : "all";


    const filteredUsers =
        allUsers.filter(function (user) {

            const matchesSearch =

                !search ||

                (
                    user.name &&
                    user.name
                        .toLowerCase()
                        .includes(search)
                ) ||

                (
                    user.email &&
                    user.email
                        .toLowerCase()
                        .includes(search)
                ) ||

                (
                    user.studentId &&
                    user.studentId
                        .toLowerCase()
                        .includes(search)
                );


            const matchesRole =

                role === "all" ||

                user.role === role;


            const userStatus =
                user.status ||
                "active";


            const matchesStatus =

                status === "all" ||

                userStatus === status;


            return (
                matchesSearch &&
                matchesRole &&
                matchesStatus
            );

        });


    displayUsers(
        filteredUsers
    );

}


// ==========================================
// OPEN ADD USER MODAL
// ==========================================

function openAddUserModal() {

    const modal =
        document.getElementById(
            "addUserModal"
        );


    if (modal) {

        modal.style.display =
            "flex";

    }

}


// ==========================================
// CLOSE ADD USER MODAL
// ==========================================

function closeAddUserModal() {

    const modal =
        document.getElementById(
            "addUserModal"
        );


    const form =
        document.getElementById(
            "addUserForm"
        );


    if (modal) {

        modal.style.display =
            "none";

    }


    if (form) {

        form.reset();

    }

}


// ==========================================
// ADD USER
// ==========================================

async function addUser(
    event
) {

    event.preventDefault();


    const name =
        document.getElementById(
            "userName"
        ).value.trim();


    const studentId =
        document.getElementById(
            "studentId"
        ).value.trim();


    const email =
        document.getElementById(
            "userEmail"
        ).value.trim();


    const password =
        document.getElementById(
            "userPassword"
        ).value;


    const role =
        document.getElementById(
            "userRole"
        ).value;


    if (
        !name ||
        !email ||
        !password ||
        !role
    ) {

        alert(
            "Please fill all required fields."
        );

        return;

    }


    if (
        password.length < 6
    ) {

        alert(
            "Password must contain at least 6 characters."
        );

        return;

    }


    try {

        const users =
            await getAllData("users");


        // ======================================
        // CHECK EMAIL
        // ======================================

        const emailExists =
            users.some(function (user) {

                return (
                    user.email &&
                    user.email
                        .toLowerCase() ===
                    email.toLowerCase()
                );

            });


        if (emailExists) {

            alert(
                "This email is already registered."
            );

            return;

        }


        // ======================================
        // CHECK ID
        // ======================================

        if (studentId) {

            const idExists =
                users.some(function (user) {

                    return (
                        user.studentId &&
                        user.studentId
                            .toLowerCase() ===
                        studentId.toLowerCase()
                    );

                });


            if (idExists) {

                alert(
                    "This ID is already registered."
                );

                return;

            }

        }


        // ======================================
        // CREATE USER
        // ======================================

        const newUser = {

            name:
                name,

            studentId:
                studentId || "",

            email:
                email,

            password:
                password,

            role:
                role,

            status:
                "active",

            joinedDate:
                new Date().toISOString()

        };


        await addData(
            "users",
            newUser
        );


        // ======================================
        // MESSAGE
        // ======================================

        if (
            role ===
            "security"
        ) {

            alert(
                "Security Staff account created successfully!"
            );

        }

        else if (
            role ===
            "admin"
        ) {

            alert(
                "Admin account created successfully!"
            );

        }

        else {

            alert(
                "Student account created successfully!"
            );

        }


        closeAddUserModal();


        await loadUsers();

        await loadAdminStatistics();

    }

    catch (error) {

        console.error(
            "Error adding user:",
            error
        );


        alert(
            "Unable to add user.\n\n" +
            error.message
        );

    }

}


// ==========================================
// OPEN EDIT USER MODAL
// ==========================================

async function openEditUserModal(
    userId
) {

    try {

        const user =
            await getData(
                "users",
                Number(userId)
            );


        if (!user) {

            alert(
                "User not found."
            );

            return;

        }


        document.getElementById(
            "editUserId"
        ).value =
            user.id;


        document.getElementById(
            "editUserName"
        ).value =
            user.name || "";


        document.getElementById(
            "editUserEmail"
        ).value =
            user.email || "";


        document.getElementById(
            "editUserRole"
        ).value =
            user.role || "student";


        document.getElementById(
            "editUserStatus"
        ).value =
            user.status || "active";


        const modal =
            document.getElementById(
                "editUserModal"
            );


        if (modal) {

            modal.style.display =
                "flex";

        }

    }

    catch (error) {

        console.error(
            "Error opening edit user:",
            error
        );


        alert(
            "Unable to open user."
        );

    }

}

// CLOSE EDIT USER MODAL


function closeEditUserModal() {

    const modal =
        document.getElementById(
            "editUserModal"
        );


    const form =
        document.getElementById(
            "editUserForm"
        );


    if (modal) {

        modal.style.display =
            "none";

    }


    if (form) {

        form.reset();

    }

}


// ==========================================
// UPDATE USER
// ==========================================

async function updateUser(
    event
) {

    event.preventDefault();


    const userId =
        Number(
            document.getElementById(
                "editUserId"
            ).value
        );


    const name =
        document.getElementById(
            "editUserName"
        ).value.trim();


    const email =
        document.getElementById(
            "editUserEmail"
        ).value.trim();


    const role =
        document.getElementById(
            "editUserRole"
        ).value;


    const status =
        document.getElementById(
            "editUserStatus"
        ).value;


    if (
        !userId ||
        !name ||
        !email ||
        !role
    ) {

        alert(
            "Please fill all required fields."
        );

        return;

    }


    try {

        const user =
            await getData(
                "users",
                userId
            );


        if (!user) {

            alert(
                "User not found."
            );

            return;

        }


        const users =
            await getAllData("users");


        // ======================================
        // CHECK EMAIL
        // ======================================

        const emailExists =
            users.some(function (
                otherUser
            ) {

                return (
                    Number(otherUser.id) !==
                    Number(userId) &&

                    otherUser.email &&

                    otherUser.email
                        .toLowerCase() ===
                    email.toLowerCase()
                );

            });


        if (emailExists) {

            alert(
                "This email is already used by another user."
            );

            return;

        }


        // ======================================
        // UPDATE
        // ======================================

        user.name =
            name;

        user.email =
            email;

        user.role =
            role;

        user.status =
            status;


        await updateData(
            "users",
            user
        );


        // ======================================
        // UPDATE LOCAL STORAGE
        // ======================================

        if (
            adminUser &&
            Number(user.id) ===
            Number(adminUser.id)
        ) {

            localStorage.setItem(
                "loggedInUser",
                JSON.stringify(user)
            );

        }


        alert(
            "User updated successfully."
        );


        closeEditUserModal();


        await loadUsers();

        await loadAdminStatistics();

    }

    catch (error) {

        console.error(
            "Error updating user:",
            error
        );


        alert(
            "Unable to update user.\n\n" +
            error.message
        );

    }

}


// ==========================================
// DELETE USER
// ==========================================

async function deleteUser(
    userId
) {

    const id =
        Number(userId);


    // ======================================
    // PREVENT SELF DELETE
    // ======================================

    if (
        adminUser &&
        Number(adminUser.id) === id
    ) {

        alert(
            "You cannot delete the currently logged-in Admin."
        );

        return;

    }


    const confirmed =
        confirm(
            "Are you sure you want to delete this user?"
        );


    if (!confirmed) {
        return;
    }


    try {

        await deleteData(
            "users",
            id
        );


        alert(
            "User deleted successfully."
        );


        await loadUsers();

        await loadAdminStatistics();

    }

    catch (error) {

        console.error(
            "Error deleting user:",
            error
        );


        alert(
            "Unable to delete user."
        );

    }

}


// ==========================================
// APPROVE CLAIM
// ==========================================

async function approveClaim(
    claimId
) {

    try {

        const claim =
            await getData(
                "claims",
                Number(claimId)
            );


        if (!claim) {

            alert(
                "Claim not found."
            );

            return;

        }


        if (
            claim.status ===
            "APPROVED"
        ) {

            alert(
                "This claim is already approved."
            );

            return;

        }


        // ======================================
        // APPROVE
        // ======================================

        claim.status =
            "APPROVED";


        claim.handoverCode =
            generateHandoverCode();


        claim.approvedDate =
            new Date().toISOString();


        claim.approvedBy =
            adminUser.id;


        await updateData(
            "claims",
            claim
        );


        // ======================================
        // NOTIFICATION
        // ======================================

        const notification = {

            userId:
                Number(
                    claim.studentId
                ),

            message:
                "Your claim has been approved. Your handover code is " +
                claim.handoverCode,

            read:
                false,

            date:
                new Date().toISOString()

        };


        await addData(
            "notifications",
            notification
        );


        alert(
            "Claim approved successfully!\n\n" +
            "Handover Code: " +
            claim.handoverCode
        );


        await loadAdminStatistics();

        await loadClaims();

    }

    catch (error) {

        console.error(
            "Error approving claim:",
            error
        );


        alert(
            "Unable to approve claim.\n\n" +
            error.message
        );

    }

}


// ==========================================
// REJECT CLAIM
// ==========================================

async function rejectClaim(
    claimId
) {

    try {

        const claim =
            await getData(
                "claims",
                Number(claimId)
            );


        if (!claim) {

            alert(
                "Claim not found."
            );

            return;

        }


        claim.status =
            "REJECTED";


        claim.rejectedDate =
            new Date().toISOString();


        claim.rejectedBy =
            adminUser.id;


        await updateData(
            "claims",
            claim
        );


        // ======================================
        // NOTIFICATION
        // ======================================

        const notification = {

            userId:
                Number(
                    claim.studentId
                ),

            message:
                "Your claim has been rejected.",

            read:
                false,

            date:
                new Date().toISOString()

        };


        await addData(
            "notifications",
            notification
        );


        alert(
            "Claim rejected."
        );


        await loadAdminStatistics();

        await loadClaims();

    }

    catch (error) {

        console.error(
            "Error rejecting claim:",
            error
        );


        alert(
            "Unable to reject claim.\n\n" +
            error.message
        );

    }

}


// ==========================================
// LOAD CLAIMS
// ==========================================

async function loadClaims() {

    const container =
        document.getElementById(
            "claimsContainer"
        );


    if (!container) {
        return;
    }


    try {

        const claims =
            await getAllData("claims");


        container.innerHTML = "";


        if (claims.length === 0) {

            container.innerHTML = `

                <div class="no-claims">

                    <div class="no-claims-icon">
                        📋
                    </div>

                    <h3>
                        No Claims Found
                    </h3>

                    <p>
                        No student claims are available.
                    </p>

                </div>

            `;

            return;

        }


        for (
            const claim of claims
        ) {

            const item =
                await getData(
                    "items",
                    Number(claim.itemId)
                );


            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "claim-card";


            const status =
                claim.status ||
                "PENDING";


            card.innerHTML = `

                <h3>
                    ${escapeHTML(
                        item
                        ? item.title
                        : "Unknown Item"
                    )}
                </h3>


                <p>
                    <strong>
                        Claim ID:
                    </strong>

                    ${claim.id}
                </p>


                <p>
                    <strong>
                        Student ID:
                    </strong>

                    ${escapeHTML(
                        String(
                            claim.studentId ||
                            "-"
                        )
                    )}
                </p>


                <p>
                    <strong>
                        Reason:
                    </strong>

                    ${escapeHTML(
                        claim.reason ||
                        "-"
                    )}
                </p>


                <p>
                    <strong>
                        Status:
                    </strong>

                    <span class="claim-status ${status.toLowerCase()}">

                        ${status}

                    </span>

                </p>


                ${
                    status === "PENDING"
                    ? `

                        <button
                            type="button"
                            onclick="approveClaim(${Number(claim.id)})">

                            Approve

                        </button>


                        <button
                            type="button"
                            onclick="rejectClaim(${Number(claim.id)})">

                            Reject

                        </button>

                    `
                    : ""
                }


                ${
                    status === "APPROVED" &&
                    claim.handoverCode
                    ? `

                        <p>

                            <strong>
                                Handover Code:
                            </strong>

                            ${claim.handoverCode}

                        </p>

                    `
                    : ""
                }

            `;


            container.appendChild(
                card
            );

        }

    }

    catch (error) {

        console.error(
            "Error loading claims:",
            error
        );

    }

}


// ==========================================
// ESCAPE HTML
// ==========================================

function escapeHTML(value) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        String(
            value === undefined ||
            value === null
            ? ""
            : value
        );


    return div.innerHTML;

}


// ==========================================
// CLOSE ADD/EDIT MODALS WHEN CLICKING OUTSIDE
// ==========================================

window.addEventListener(
    "click",
    function (event) {

        const addModal =
            document.getElementById(
                "addUserModal"
            );


        const editModal =
            document.getElementById(
                "editUserModal"
            );


        const reportModal =
            document.getElementById(
                "reportModal"
            );


        if (
            addModal &&
            event.target ===
            addModal
        ) {

            closeAddUserModal();

        }


        if (
            editModal &&
            event.target ===
            editModal
        ) {

            closeEditUserModal();

        }


        if (
            reportModal &&
            event.target ===
            reportModal
        ) {

            closeReportModal();

        }

    }
);


// ==========================================
// ADMIN LOGOUT
// ==========================================

function adminLogout() {

    localStorage.removeItem(
        "loggedInUser"
    );

    window.location.href =
        "login.html";

}


// ==========================================
// LOGOUT BUTTONS
// ==========================================

const logoutButtons =
    document.querySelectorAll(
        ".logout"
    );


logoutButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                adminLogout();

            }
        );

    }
);


const logoutButtons2 =
    document.querySelectorAll(
        ".logout-btn"
    );


logoutButtons2.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                adminLogout();

            }
        );

    }
);

// LOAD ADMIN DATA


if (
    adminUser &&
    adminUser.role === "admin"
) {

    loadAdminStatistics();

    loadReports();

    loadUsers();

    loadClaims();

}