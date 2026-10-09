// ANALYTICS JAVASCRIPT

// LOAD ANALYTICS

async function loadAnalytics() {

    try {

        // Get database data
        const items =
            await getAllData("items");

        const users =
            await getAllData("users");

        const claims =
            await getAllData("claims");


        console.log("Analytics Items:", items);
        console.log("Analytics Users:", users);
        console.log("Analytics Claims:", claims);

        // REPORT STATISTICS

        const totalReports =
            items.length;


        const lostItems =
            items.filter(function (item) {

                return String(item.type).toUpperCase() === "LOST";

            }).length;


        const foundItems =
            items.filter(function (item) {

                return String(item.type).toUpperCase() === "FOUND";

            }).length;


        const returnedItems =
            items.filter(function (item) {

                return String(item.status).toUpperCase() === "RETURNED";

            }).length;

        // SUMMARY CARDS
    
        setAnalyticsText(
            "analyticsTotalReports",
            totalReports
        );


        setAnalyticsText(
            "analyticsLost",
            lostItems
        );


        setAnalyticsText(
            "analyticsFound",
            foundItems
        );


        setAnalyticsText(
            "analyticsReturned",
            returnedItems
        );
       
        // REPORT STATISTICS
       
        setAnalyticsText(
            "statLost",
            lostItems
        );


        setAnalyticsText(
            "statFound",
            foundItems
        );

        setAnalyticsText(
            "statReturned",
            returnedItems
        );

        // PROGRESS BARS

        const maxReports =
            Math.max(
                totalReports,
                1
            );


        setBarWidth(
            "lostBar",
            lostItems,
            maxReports
        );


        setBarWidth(
            "foundBar",
            foundItems,
            maxReports
        );


        setBarWidth(
            "returnedBar",
            returnedItems,
            maxReports
        );

        // CATEGORY STATISTICS
        
        const categories = {

            Electronics: "electronics",
            Documents: "documents",
            Wallet: "wallet",
            Keys: "keys",
            Bag: "bag",
            Clothing: "clothing",
            Accessories: "accessories",
            Other: "other"

        };


        const categoryCounts = {};


        // Initialize all categories
        Object.keys(categories).forEach(function (category) {

            categoryCounts[category] = 0;

        });


        // Count items
        items.forEach(function (item) {

            if (!item.category) {
                return;
            }


            const itemCategory =
                String(item.category)
                    .trim()
                    .toLowerCase();


            const matchedCategory =
                Object.keys(categories).find(function (category) {

                    return (
                        category.toLowerCase() ===
                        itemCategory
                    );

                });


            if (matchedCategory) {

                categoryCounts[matchedCategory]++;

            }
            else {

                categoryCounts.Other++;

            }

        });

        // Find maximum category count
        const maxCategory =
            Math.max(
                ...Object.values(categoryCounts),
                1
            );


        // Display categories
        Object.keys(categories).forEach(function (category) {

            const prefix =
                categories[category];


            const count =
                categoryCounts[category];

            // Count
            setAnalyticsText(
                prefix + "Count",
                count
            );

            // Progress bar
            const bar =
                document.getElementById(
                    prefix + "Bar"
                );

            if (bar) {

                const percentage =
                    (count / maxCategory) * 100;

                bar.style.width =
                    percentage + "%";
            }

        });

        // USER STATISTICS
        
        const students =
            users.filter(function (user) {

                return user.role === "student";

            }).length;

        const security =
            users.filter(function (user) {

                return user.role === "security";

            }).length;

        const admins =
            users.filter(function (user) {

                return user.role === "admin";

            }).length;

        setAnalyticsText(
            "analyticsStudents",
            students
        );

        setAnalyticsText(
            "analyticsSecurity",
            security
        );

        setAnalyticsText(
            "analyticsAdmins",
            admins
        );

        // CLAIM STATISTICS

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

        // Returned claims/items
        const returnedClaims =
            items.filter(function (item) {

                return String(item.status).toUpperCase() === "RETURNED";

            }).length;


        setAnalyticsText(
            "analyticsPendingClaims",
            pendingClaims
        );

        setAnalyticsText(
            "analyticsApprovedClaims",
            approvedClaims
        );

        setAnalyticsText(
            "analyticsRejectedClaims",
            rejectedClaims
        );

        setAnalyticsText(
            "analyticsReturnedClaims",
            returnedClaims
        );
        
        // CONSOLE RESULT

        console.log(
            "=============================="
        );

        console.log(
            "ANALYTICS LOADED"
        );

        console.log(
            "Total Reports:",
            totalReports
        );

        console.log(
            "Lost Items:",
            lostItems
        );

        console.log(
            "Found Items:",
            foundItems
        );

        console.log(
            "Returned Items:",
            returnedItems
        );

        console.log(
            "Category Counts:",
            categoryCounts
        );

        console.log(
            "=============================="
        );

    }

    catch (error) {

        console.error(
            "Error loading analytics:",
            error
        );

    }

}

// SET TEXT

function setAnalyticsText(
    id,
    value
) {

    const element =
        document.getElementById(id);


    if (element) {

        element.textContent =
            value;

    }

}

// SET PROGRESS BAR

function setBarWidth(
    id,
    value,
    max
) {

    const bar =
        document.getElementById(id);


    if (!bar) {
        return;
    }


    let percentage =
        (value / max) * 100;


    if (percentage > 100) {

        percentage = 100;

    }


    bar.style.width =
        percentage + "%";

}

// LOAD WHEN PAGE IS READY

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadAnalytics();

    }
);