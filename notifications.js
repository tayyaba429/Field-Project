// ==========================================
// CAMPUS LOST & FOUND PORTAL
// NOTIFICATIONS JAVASCRIPT
// ==========================================


// ==========================================
// CHECK LOGIN
// ==========================================

const notificationUser =
    getCurrentUser();


if (!notificationUser) {

    window.location.href =
        "login.html";

}


// ==========================================
// FORMAT DATE
// ==========================================

function formatNotificationDate(dateValue) {

    if (!dateValue) {
        return "";
    }


    const date =
        new Date(dateValue);


    if (isNaN(date.getTime())) {
        return "";
    }


    return date.toLocaleString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        }
    );

}


// ==========================================
// GET NOTIFICATION ICON
// ==========================================

function getNotificationIcon(message) {

    const text =
        (message || "").toLowerCase();


    if (
        text.includes("approved") ||
        text.includes("handover")
    ) {

        return "✅";

    }


    if (
        text.includes("rejected")
    ) {

        return "❌";

    }


    if (
        text.includes("found")
    ) {

        return "📦";

    }


    if (
        text.includes("lost")
    ) {

        return "🔍";

    }


    if (
        text.includes("claim")
    ) {

        return "🤝";

    }


    return "🔔";

}


// ==========================================
// GET NOTIFICATION TITLE
// ==========================================

function getNotificationTitle(message) {

    const text =
        (message || "").toLowerCase();


    if (
        text.includes("claim has been approved")
    ) {

        return "Claim Approved";

    }


    if (
        text.includes("claim has been rejected")
    ) {

        return "Claim Rejected";

    }


    if (
        text.includes("handover")
    ) {

        return "Handover Update";

    }


    if (
        text.includes("found")
    ) {

        return "Found Item Update";

    }


    if (
        text.includes("lost")
    ) {

        return "Lost Item Update";

    }


    return "Notification";

}


// ==========================================
// LOAD NOTIFICATIONS
// ==========================================

async function loadNotifications() {

    const container =
        document.getElementById(
            "notificationsContainer"
        );


    if (!container || !notificationUser) {
        return;
    }


    try {

        const allNotifications =
            await getAllData(
                "notifications"
            );


        // ==========================================
        // CURRENT USER NOTIFICATIONS
        // ==========================================

        const userNotifications =
            allNotifications
                .filter(function (notification) {

                    return Number(
                        notification.userId
                    ) === Number(
                        notificationUser.id
                    );

                })
                .sort(function (a, b) {

                    return new Date(
                        b.date || 0
                    ) - new Date(
                        a.date || 0
                    );

                });


        // ==========================================
        // UNREAD COUNT
        // ==========================================

        const unreadNotifications =
            userNotifications.filter(
                function (notification) {

                    return notification.read !== true;

                }
            );


        const unreadCountElement =
            document.getElementById(
                "unreadCount"
            );


        if (unreadCountElement) {

            unreadCountElement.textContent =
                unreadNotifications.length +
                (
                    unreadNotifications.length === 1
                    ? " Unread"
                    : " Unread"
                );

        }


        // ==========================================
        // EMPTY STATE
        // ==========================================

        if (userNotifications.length === 0) {

            container.innerHTML = `

                <div class="empty-notifications">

                    <div class="empty-icon">
                        🔔
                    </div>

                    <h3>
                        No Notifications
                    </h3>

                    <p>
                        You will see updates about your
                        reports and claims here.
                    </p>

                </div>

            `;

            return;

        }


        // ==========================================
        // DISPLAY NOTIFICATIONS
        // ==========================================

        container.innerHTML = "";


        userNotifications.forEach(
            function (notification) {

                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "notification-item";


                if (
                    notification.read !== true
                ) {

                    item.classList.add(
                        "unread"
                    );

                }


                const icon =
                    getNotificationIcon(
                        notification.message
                    );


                const title =
                    getNotificationTitle(
                        notification.message
                    );


                const date =
                    formatNotificationDate(
                        notification.date
                    );


                // ==========================================
                // HANDOVER CODE
                // ==========================================

                let handoverCodeHTML = "";


                if (
                    notification.message &&
                    notification.message
                        .toLowerCase()
                        .includes("handover code")
                ) {

                    const match =
                        notification.message.match(
                            /\b\d{4}\b/
                        );


                    if (match) {

                        handoverCodeHTML = `

                            <div class="handover-code">

                                🔐 Handover Code:
                                &nbsp;
                                ${match[0]}

                            </div>

                        `;

                    }

                }


                item.innerHTML = `

                    <div class="notification-icon">
                        ${icon}
                    </div>


                    <div class="notification-content">

                        <h3>
                            ${title}
                        </h3>

                        <p>
                            ${notification.message || ""}
                        </p>

                        ${handoverCodeHTML}

                        <div class="notification-date">
                            ${date}
                        </div>

                    </div>


                    ${
                        notification.read !== true
                        ? `<div class="unread-dot"></div>`
                        : ""
                    }

                `;


                // ==========================================
                // CLICK TO MARK READ
                // ==========================================

                item.addEventListener(
                    "click",
                    async function () {

                        if (
                            notification.read !== true
                        ) {

                            await markNotificationAsRead(
                                notification.id
                            );

                        }

                    }
                );


                container.appendChild(
                    item
                );

            }
        );

    }


    catch (error) {

        console.error(
            "Error loading notifications:",
            error
        );


        container.innerHTML = `

            <div class="empty-notifications">

                <div class="empty-icon">
                    ⚠️
                </div>

                <h3>
                    Unable to Load Notifications
                </h3>

                <p>
                    Please refresh the page and try again.
                </p>

            </div>

        `;

    }

}


// ==========================================
// MARK ONE NOTIFICATION AS READ
// ==========================================

async function markNotificationAsRead(
    notificationId
) {

    try {

        const notification =
            await getData(
                "notifications",
                Number(notificationId)
            );


        if (!notification) {
            return;
        }


        notification.read =
            true;


        await updateData(
            "notifications",
            notification
        );


        await loadNotifications();

    }


    catch (error) {

        console.error(
            "Error marking notification as read:",
            error
        );

    }

}


// ==========================================
// MARK ALL NOTIFICATIONS AS READ
// ==========================================

async function markAllNotificationsRead() {

    if (!notificationUser) {
        return;
    }


    try {

        const allNotifications =
            await getAllData(
                "notifications"
            );


        const userNotifications =
            allNotifications.filter(
                function (notification) {

                    return Number(
                        notification.userId
                    ) === Number(
                        notificationUser.id
                    );

                }
            );


        for (
            const notification
            of userNotifications
        ) {

            if (
                notification.read !== true
            ) {

                notification.read =
                    true;


                await updateData(
                    "notifications",
                    notification
                );

            }

        }


        await loadNotifications();


    }


    catch (error) {

        console.error(
            "Error marking all notifications:",
            error
        );

    }

}


// ==========================================
// LOAD NOTIFICATIONS WHEN PAGE OPENS
// ==========================================

loadNotifications();