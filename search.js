// SEARCH.JS

document.addEventListener("DOMContentLoaded", function () {

    const searchInput = document.getElementById("searchInput");
    const typeFilter = document.getElementById("typeFilter");
    const categoryFilter = document.getElementById("categoryFilter");
    const statusFilter = document.getElementById("statusFilter");
    const searchBtn = document.getElementById("searchBtn");
    const resultsContainer =
        document.getElementById("searchResults");

    // Load all items when page opens
    loadSearchItems();

    // Search button
    if (searchBtn) {
        searchBtn.addEventListener("click", loadSearchItems);
    }

    // Search while typing
    if (searchInput) {
        searchInput.addEventListener("input", loadSearchItems);
    }

    if (typeFilter) {
        typeFilter.addEventListener("change", loadSearchItems);
    }

    if (categoryFilter) {
        categoryFilter.addEventListener("change", loadSearchItems);
    }

    if (statusFilter) {
        statusFilter.addEventListener("change", loadSearchItems);
    }

    // LOAD & FILTER ITEMS

    async function loadSearchItems() {

        if (!resultsContainer) return;

        try {

            const items = await getAllData("items");

            const searchText =
                searchInput ?
                searchInput.value.toLowerCase().trim() : "";

            const type =
                typeFilter ? typeFilter.value : "";

            const category =
                categoryFilter ? categoryFilter.value : "";

            const status =
                statusFilter ? statusFilter.value : "";


            const filteredItems = items.filter(function (item) {

                // Search text
                const matchesSearch =
                    !searchText ||
                    (item.title || "")
                        .toLowerCase()
                        .includes(searchText) ||

                    (item.description || "")
                        .toLowerCase()
                        .includes(searchText) ||

                    (item.location || "")
                        .toLowerCase()
                        .includes(searchText);


                // Type
                const matchesType =
                    !type ||
                    item.type === type;


                // Category
                const matchesCategory =
                    !category ||
                    item.category === category;


                // Status
                const matchesStatus =
                    !status ||
                    item.status === status;


                return (
                    matchesSearch &&
                    matchesType &&
                    matchesCategory &&
                    matchesStatus
                );

            });


            displayResults(filteredItems);

        } catch (error) {

            console.error(
                "Error loading items:",
                error
            );

            resultsContainer.innerHTML =
                "<p>Unable to load items.</p>";
        }
    }

    // DISPLAY RESULTS
    
    function displayResults(items) {

        if (!resultsContainer) return;

        resultsContainer.innerHTML = "";


        if (items.length === 0) {

            resultsContainer.innerHTML = `
                <div class="no-results">
                    <h3>🔍 No Items Found</h3>
                    <p>
                        Try changing your search or filters.
                    </p>
                </div>
            `;

            return;
        }


        items.forEach(function (item) {

            const card =
                document.createElement("div");

            card.className = "item-card";


            let statusClass =
                (item.status || "")
                .toLowerCase();


            card.innerHTML = `

                <div class="item-image">

                    ${
                        item.image
                        ?
                        `<img src="${item.image}"
                              alt="${item.title}">`
                        :
                        `<div class="no-image">
                            📦
                         </div>`
                    }

                </div>


                <div class="item-info">

                    <span class="item-type">
                        ${item.type || "Item"}
                    </span>

                    <h3>
                        ${item.title || "Unknown Item"}
                    </h3>

                    <p>
                        ${item.description || "No description"}
                    </p>

                    <p>
                        📍 ${item.location || "Unknown location"}
                    </p>

                    <p>
                        📅 ${item.date || "Unknown date"}
                    </p>

                    <p>
                        🏷️ ${item.category || "Other"}
                    </p>

                    <span class="status ${statusClass}">
                        ${item.status || "UNKNOWN"}
                    </span>

                    <button
                        class="view-btn"
                        onclick="viewItem('${item.id}')">
                        View Details
                    </button>

                </div>
            `;


            resultsContainer.appendChild(card);

        });

    }

});

// VIEW ITEM DETAILS

async function viewItem(itemId) {

    try {

        const item =
            await getData("items", itemId);

        if (!item) {

            alert("Item not found.");
            return;
        }


        const modal =
            document.getElementById("itemModal");

        const details =
            document.getElementById("itemDetails");


        if (!modal || !details) return;


        details.innerHTML = `

            <h2>${item.title || "Item Details"}</h2>

            <p>
                <strong>Type:</strong>
                ${item.type || "-"}
            </p>

            <p>
                <strong>Category:</strong>
                ${item.category || "-"}
            </p>

            <p>
                <strong>Description:</strong>
                ${item.description || "-"}
            </p>

            <p>
                <strong>Location:</strong>
                ${item.location || "-"}
            </p>

            <p>
                <strong>Date:</strong>
                ${item.date || "-"}
            </p>

            <p>
                <strong>Status:</strong>
                ${item.status || "-"}
            </p>

        `;


        modal.style.display = "flex";

    } catch (error) {

        console.error(
            "Error viewing item:",
            error
        );

        alert("Unable to load item details.");
    }
}

// CLOSE MODAL

function closeItemModal() {

    const modal =
        document.getElementById("itemModal");

    if (modal) {
        modal.style.display = "none";
    }
}

// LOGOUT

function searchLogout() {

    localStorage.removeItem("loggedInUser");

    window.location.href = "login.html";
}