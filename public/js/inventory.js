'use strict';

document.addEventListener("DOMContentLoaded", () => {
  const classificationList = document.querySelector("#classificationList");
  const inventoryDisplay = document.getElementById("inventoryDisplay");

  if (!classificationList || !inventoryDisplay) return; // safety check

  // Function to fetch and build inventory table
  const loadInventory = (classification_id) => {
    if (!classification_id) {
      inventoryDisplay.innerHTML = `<tr><td colspan="9">Please select a classification.</td></tr>`;
      return;
    }

    fetch(`/inv/getInventory/${classification_id}`)
      .then(response => {
        if (!response.ok) throw new Error("Network response was not OK");
        return response.json();
      })
      .then(data => buildInventoryTable(data))
      .catch(err => {
        console.error("JSON fetch error:", err.message);
        inventoryDisplay.innerHTML = `<tr><td colspan="9">Error fetching inventory.</td></tr>`;
      });
  };

  // Event listener for dropdown change
  classificationList.addEventListener("change", () => {
    loadInventory(classificationList.value);
  });

  // Auto-load first classification on page load
  if (classificationList.options.length > 1) {
    const firstValue = classificationList.options[1].value; // skip "Choose a Classification" placeholder
    classificationList.value = firstValue;
    loadInventory(firstValue);
  }

  // Build inventory table function
  function buildInventoryTable(data) {
    const theadHTML = `
      <thead>
        <tr>
          <th>Vehicle Name</th>
          <th>Make</th>
          <th>Model</th>
          <th>Year</th>
          <th>Price</th>
          <th>Miles</th>
          <th>Color</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
    `;

    let tbodyHTML = '<tbody>';

    if (Array.isArray(data) && data.length > 0) {
      data.forEach(item => {
        const statusColor = item.inv_status === "Available" ? "green"
                          : item.inv_status === "Sold" ? "red"
                          : item.inv_status === "Reserved" ? "orange"
                          : "black";

        tbodyHTML += `
          <tr>
            <td>${item.inv_make} ${item.inv_model}</td>
            <td>${item.inv_make}</td>
            <td>${item.inv_model}</td>
            <td>${item.inv_year}</td>
            <td>$${Number(item.inv_price).toLocaleString()}</td>
            <td>${Number(item.inv_miles).toLocaleString()}</td>
            <td>${item.inv_color}</td>
            <td style="color:${statusColor}; font-weight:bold;">${item.inv_status}</td>
            <td>
              <a href="/inv/edit/${item.inv_id}">Edit</a> |
              <a href="/inv/delete/${item.inv_id}">Delete</a>
            </td>
          </tr>
        `;
      });
    } else {
      tbodyHTML += `<tr><td colspan="9">No vehicles found for this classification.</td></tr>`;
    }

    tbodyHTML += '</tbody>';
    inventoryDisplay.innerHTML = theadHTML + tbodyHTML;
  }
});
