document.addEventListener("DOMContentLoaded", () => {
  const uploadForm = document.getElementById("uploadForm");
  const fileList = document.getElementById("fileList");
  const csvTable = document.getElementById("csvTable");
  const searchInput = document.getElementById("search");

  let currentData = [];
  let currentFileIndex = 0;
  let currentSortColumn = null; // Store the currently sorted column
  let isAscending = true; // Flag for sorting order (true for ascending)
  let currentPage = 1; // Current page number
  const recordsPerPage = 2; // Number of records to display per page

  // Handle file upload
  uploadForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(uploadForm);

    try {
      const response = await fetch("/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const responseData = await response.json();
        currentData = responseData; // Update the current data

        // Clear existing options in the <select> element
        fileList.innerHTML = "";

        // Iterate through the response data and append filenames to the <select>
        responseData.forEach((fileData) => {
          const option = document.createElement("option");
          option.value = fileData.filename;
          option.text = fileData.filename;
          fileList.appendChild(option);
        });

        // Add an event listener for the <select> element to display data in the table
        fileList.addEventListener("change", (event) => {
          const selectedFilename = event.target.value;
          const selectedFileData = responseData.find(
            (file) => file.filename === selectedFilename
          );
          currentFileIndex = responseData.findIndex(
            (file) => file.filename === selectedFilename
          );

          if (selectedFileData) {
            if (searchInput.value.trim() === "")
              displayCSVData(selectedFileData.data);
            else displayFilteredCSVData(searchInput.value.trim());
          }
        });
        displayCSVData(responseData[0].data);
      } else {
        console.error("File upload failed.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  });

  // Function to display CSV data in the table
  function displayCSVData(data) {
    // Clear existing table data
    csvTable.innerHTML = "";

    // Create table headers from the first data row
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    Object.keys(data[0]).forEach((header) => {
      const th = document.createElement("th");
      th.setAttribute("scope", "col");
      th.innerHTML = `${header}<i class="fa-solid fa-arrow-right-arrow-left sort"></i>`;
      // th.textContent = header;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    csvTable.appendChild(thead);

    // Create table body with data rows
    const tbody = document.createElement("tbody");
    data.forEach((row, index) => {
      const dataRow = document.createElement("tr");
      if (index % 2 === 0) dataRow.classList.add("table-primary");
      Object.values(row).forEach((cellData) => {
        const cell = document.createElement("td");
        cell.textContent = cellData;
        dataRow.appendChild(cell);
      });
      tbody.appendChild(dataRow);
    });
    csvTable.appendChild(tbody);
    setTimeout(() => {
      addEventListenerToTable();
    }, 500);
  }
  // Function to display Filtered CSV data
  function displayFilteredCSVData(searchText) {
    // Clear existing table data
    csvTable.innerHTML = "";

    // Create table headers from the first data row
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");

    Object.keys(currentData[0].data[0]).forEach((header) => {
      const th = document.createElement("th");
      th.setAttribute("scope", "col");
      // th.textContent = header;
      th.innerHTML = `${header}<i class="fa-solid fa-arrow-right-arrow-left sort"></i>`;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    csvTable.appendChild(thead);

    // Create table body with filtered data rows
    const tbody = document.createElement("tbody");
    // currentData.forEach((fileData) => {
    const fileData = currentData[currentFileIndex];
    const filteredData = fileData.data.filter((row) => {
      // Filter based on the value in any column (adjust as needed)
      return Object.values(row).some((cellData) => {
        return cellData
          .toString()
          .toLowerCase()
          .includes(searchText.toLowerCase());
      });
    });
    if (filteredData.length === 0) {
      const dataRow = document.createElement("tr");
      tr.classList.add("table-primary");
      const cell = document.createElement("td");
      cell.textContent = "No data";
      dataRow.appendChild(cell);
      tbody.appendChild(dataRow);
    }
    filteredData.forEach((row, index) => {
      const dataRow = document.createElement("tr");
      if (index % 2 === 0) dataRow.classList.add("table-primary");
      Object.values(row).forEach((cellData) => {
        const cell = document.createElement("td");
        cell.textContent = cellData;
        dataRow.appendChild(cell);
      });
      tbody.appendChild(dataRow);
    });
    // });
    csvTable.appendChild(tbody);
    setTimeout(() => {
      addEventListenerToTable();
    }, 500);
  }
  // Function to sort the table data based on a column
  function sortTable(columnIndex) {
    if (currentSortColumn === columnIndex) {
      // If clicking on the same column, reverse the sorting order
      isAscending = !isAscending;
    } else {
      // If clicking on a different column, set sorting order to ascending
      isAscending = true;
    }

    currentSortColumn = columnIndex;

    // Sort the data based on the selected column
    const fileData = currentData[currentFileIndex];
    fileData.data.sort((a, b) => {
      const aValue = a[Object.keys(a)[columnIndex]];
      const bValue = b[Object.keys(b)[columnIndex]];

      if (isAscending) {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });

    // Re-display the sorted data
    displayFilteredCSVData(searchInput.value.trim());
  }

  // Add event listeners to table headers for sorting
  function addEventListenerToTable() {
    const tableSorter = document.querySelectorAll(".sort");
    tableSorter.forEach((header, index) => {
      header.addEventListener("click", () => {
        sortTable(index);
      });
    });
  }
  // Add an event listener for the search input
  searchInput.addEventListener("input", () => {
    const searchText = searchInput.value.trim();
    displayFilteredCSVData(searchText);
  });
});
