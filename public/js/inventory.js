'use strict';

// Make sure the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  const classificationList = document.querySelector("#classificationList");
  const inventoryDisplay = document.getElementById("inventoryDisplay");

  if (!classificationList) return; // safety check

  classificationList.addEventListener("change", function () {
    const classification_id = classificationList.value;
    console.log(`classification_id is: ${classification_id}`);

    const classIdURL = "/inv/getInventory/" + classification_id;

    fetch(classIdURL)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Network response was not OK");
      })
      .then(data => {
        console.log(data);
        buildInventoryList(data);
      })
      .catch(error => {
        console.error("JSON fetch error:", error.message);
      });
  });

  // Build inventory items into HTML table
  function buildInventoryList(data) {
    if (!inventoryDisplay) return;

    let dataTable = '<thead>';
    dataTable += '<tr><th>Vehicle Name</th><td>&nbsp;</td><td>&nbsp;</td></tr>';
    dataTable += '</thead>';
    dataTable += '<tbody>';

    if (Array.isArray(data) && data.length > 0) {
      data.forEach(element => {
        dataTable += `<tr>`;
        dataTable += `<td>${element.inv_make} ${element.inv_model}</td>`;
        dataTable += `<td><a href='/inv/edit/${element.inv_id}' title='Click to update'>Modify</a></td>`;
        dataTable += `<td><a href='/inv/delete/${element.inv_id}' title='Click to delete'>Delete</a></td>`;
        dataTable += `</tr>`;
      });
    } else {
      dataTable += `<tr><td colspan="3">No vehicles found for this classification.</td></tr>`;
    }

    dataTable += '</tbody>';
    inventoryDisplay.innerHTML = dataTable;
  }
});
