console.log('Script.js starting to load...');

function initializeApp() {
  console.log('Initializing application...');

  const RAW_FILE_URL = 'RoD_Item.txt';
  const VERSION_URL = 'version.json';
  const FIELD_COUNT = 31; // Now 31 fields including ID

  // Human friendly names for each field index (ID column added at index 0)
  const FIELD_LABELS = [
    'ID', 'Type', 'Wearloc', 'Name', 'Lv', 'AC', '-AC', 'd1', 'd2', 'HR', 'DR',
    'HP', 'MP', 'ST', 'DE', 'CO', 'IN', 'WI', 'LK', 'CH', 'MV',
    'Wgt', 'Value', 'Flags', 'Antis', 'Races', 'Other', 'Mob/Room', 'Area', 'Added', 'Edited'
  ];

  // Field types for sorting (ID column added at index 0)
  const FIELD_TYPES = [
    'number', 'string', 'string', 'string', 'number', 'number', 'number', 'number', 'number', 'number', 'number',
    'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number',
    'number', 'number', 'string', 'string', 'string', 'string', 'string', 'string', 'string', 'string'
  ];

  let items = [];
  let itemsPerPage = 25;
  
  // Get DOM elements
  const searchInput = document.getElementById('search');
  const typeSelect = document.getElementById('typeFilter');
  const raceSelect = document.getElementById('raceFilter');
  const classSelect = document.getElementById('classFilter');
  const alignSelect = document.getElementById('alignFilter');
  const wearlocSelect = document.getElementById('wearlocFilter');
  const areaSelect = document.getElementById('areaFilter');
  const openFiltersBtn = document.getElementById('openFilters');
  const defaultViewBtn = document.getElementById('defaultView');
  const filterModal = document.getElementById('filterModal');
  const closeFiltersBtn = document.getElementById('closeFilters');
  const applyFiltersBtn = document.getElementById('applyFilters');
  const cancelFiltersBtn = document.getElementById('cancelFilters');
  const tbody = document.querySelector('#results tbody');
  const paginationDiv = document.getElementById('pagination');
  const versionDiv = document.getElementById('version');
  const tableContainer = document.getElementById('table-container');
  const tableHeaders = document.querySelectorAll('#results th');

  let currentPage = 1;
  let currentResults = [];
  let reactFilters = {};
  let currentSort = { column: 0, direction: 'asc' }; // Default sort by ID ascending
  let hiddenColumns = new Set(); // Track hidden columns
  let touchTimer = null; // For mobile long press

  console.log('DOM elements found:', {
    searchInput: !!searchInput,
    typeSelect: !!typeSelect,
    wearlocSelect: !!wearlocSelect,
    areaSelect: !!areaSelect,
    tbody: !!tbody,
    tableContainer: !!tableContainer
  });

  // Function to update main content layout dynamically
  function updateMainContentLayout() {
    const headerHeight = document.querySelector("h1").offsetHeight;
    const controlsHeight = document.getElementById("controls").offsetHeight;
    const totalFixedHeaderHeight = headerHeight + controlsHeight;
    const paginationHeight = Math.max(50, document.getElementById("pagination").offsetHeight);
    console.log("paginationHeight:", {paginationHeight});
    document.body.style.paddingTop = `${totalFixedHeaderHeight}px`;
    document.body.style.paddingBottom = `${paginationHeight}px`;
    
    // Recalculate items per page after layout change
    calculateItemsPerPage();
    displayResults();
    displayPagination();
  }
  function calculateItemsPerPage() {
    if (!tableContainer) return 25;
    
    const viewportHeight = window.innerHeight;
    const clientHeight = document.documentElement.clientHeight;
    const tableHeaderHeight = document.querySelector("#results thead").offsetHeight;
    const bodyPaddingTop = parseFloat(getComputedStyle(document.body).paddingTop);
    const bodyPaddingBottom = parseFloat(getComputedStyle(document.body).paddingBottom);
    const rowHeight = 22; // Keep existing row height
    
    const availableHeight = viewportHeight - bodyPaddingTop - tableHeaderHeight - bodyPaddingBottom; // Reduced buffer
    const calculatedItems = Math.floor(availableHeight / rowHeight);
    itemsPerPage = Math.max(5, Math.min(100, calculatedItems)); // Min 5, max 100
    
    console.log("Pagination calculation:", {
      viewportHeight,
      clientHeight,
      bodyPaddingTop,
      bodyPaddingBottom,
      tableHeaderHeight,
      availableHeight,
      calculatedItems,
      finalItemsPerPage: itemsPerPage
    });
    
    return itemsPerPage;
  }

  // Recalculate pagination on window resize
  function handleResize() {
    const oldItemsPerPage = itemsPerPage;
    
    // Update layout first
    updateMainContentLayout();
    
    if (oldItemsPerPage !== itemsPerPage && currentResults.length > 0) {
      // Adjust current page to maintain roughly the same position
      const currentFirstItem = (currentPage - 1) * oldItemsPerPage;
      currentPage = Math.floor(currentFirstItem / itemsPerPage) + 1;
      displayResults();
      displayPagination();
    }
  }

  // Default view -  // Reset all filters to defaults
  function resetToDefaults() {
    console.log('Resetting to defaults');
    
    // Clear search and filters
    if (searchInput) searchInput.value = '';
    if (typeSelect) typeSelect.value = '';
    if (raceSelect) raceSelect.value = '';
    if (classSelect) classSelect.value = '';
    if (alignSelect) alignSelect.value = '';
    if (wearlocSelect) wearlocSelect.value = '';
    if (areaSelect) areaSelect.value = '';
    
    // Reset sorting to ID ascending
    currentSort = { column: 0, direction: 'asc' };
    updateSortArrows();
    
    // Reset hidden columns
    hiddenColumns.clear();
    updateColumnVisibility();
    
    // Reset React filters
    reactFilters = {};
    if (window.resetReactFilters) {
      window.resetReactFilters();
    }
    
    // Refresh data
    filterItems();
  }

  // Sort data by column
  function sortData(columnIndex, direction) {
    const fieldType = FIELD_TYPES[columnIndex];
    
    currentResults.sort((a, b) => {
      let aVal = a[columnIndex] || '';
      let bVal = b[columnIndex] || '';
      
      if (fieldType === 'number') {
        // Handle level ranges like "47-48"
        aVal = parseFloat(aVal.toString().split('-')[0]) || 0;
        bVal = parseFloat(bVal.toString().split('-')[0]) || 0;
      } else {
        aVal = aVal.toString().toLowerCase();
        bVal = bVal.toString().toLowerCase();
      }
      
      let comparison = 0;
      if (aVal < bVal) comparison = -1;
      if (aVal > bVal) comparison = 1;
      
      return direction === 'desc' ? -comparison : comparison;
    });
  }

  // Update sort arrows in headers
  function updateSortArrows() {
    tableHeaders.forEach((header, index) => {
      const arrow = header.querySelector('.sort-arrow');
      if (arrow) {
        arrow.className = 'sort-arrow';
        if (index === currentSort.column) {
          arrow.classList.add(currentSort.direction);
        }
      }
    });
  }

  // Adjust the last visible column width to fill the grid if needed
  function adjustLastVisibleColumnWidth() {
    const table = document.getElementById('results');
    const tableContainer = document.getElementById('table-container');
    
    if (!table || !tableContainer) return;
    
    // Get all visible columns
    const visibleColumns = [];
    tableHeaders.forEach((header, index) => {
      if (!hiddenColumns.has(index)) {
        visibleColumns.push(index);
      }
    });
    
    if (visibleColumns.length === 0) return;
    
    // Calculate total width of visible columns
    let totalVisibleWidth = 0;
    const columnWidths = [
      40, 80, 60, 200, 50, 40, 40, 40, 40, 40, 40, 40, 40,
      40, 40, 40, 40, 40, 40, 40, 50, 50, 80, 60, 100,
      80, 150, 120, 100, 80, 80
    ];
    
    visibleColumns.forEach(colIndex => {
      totalVisibleWidth += columnWidths[colIndex];
    });
    
    const containerWidth = tableContainer.clientWidth;
    const lastVisibleColumnIndex = visibleColumns[visibleColumns.length - 1];
    
    // If total width is less than container width, extend the last column
    if (totalVisibleWidth < containerWidth) {
      const extraWidth = containerWidth - totalVisibleWidth;
      const lastColumnClass = getCellClass(lastVisibleColumnIndex);
      
      // Create or update a dynamic style rule for the last visible column
      let styleElement = document.getElementById('dynamic-column-styles');
      if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = 'dynamic-column-styles';
        document.head.appendChild(styleElement);
      }
      
      const newWidth = columnWidths[lastVisibleColumnIndex] + extraWidth;
      styleElement.textContent = `
        .${lastColumnClass} {
          width: ${newWidth}px !important;
          min-width: ${newWidth}px !important;
          max-width: ${newWidth}px !important;
        }
      `;
    } else {
      // Remove dynamic styles if not needed
      const styleElement = document.getElementById('dynamic-column-styles');
      if (styleElement) {
        styleElement.remove();
      }
    }
  }

  // Update column visibility
  function updateColumnVisibility() {
    // Update headers
    tableHeaders.forEach((header, index) => {
      if (hiddenColumns.has(index)) {
        header.classList.add('hidden-column');
      } else {
        header.classList.remove('hidden-column');
      }
    });
    
    // Update data cells
    const rows = tbody.querySelectorAll('tr');
    rows.forEach(row => {
      const cells = row.querySelectorAll('td');
      cells.forEach((cell, index) => {
        if (hiddenColumns.has(index)) {
          cell.classList.add('hidden-column');
        } else {
          cell.classList.remove('hidden-column');
        }
      });
    });
    
    // After hiding/showing columns, adjust the last visible column width
    adjustLastVisibleColumnWidth();
  }

  // Handle column header clicks for sorting
  function handleHeaderClick(columnIndex, event) {
    event.preventDefault();
    
    if (currentSort.column === columnIndex) {
      // Toggle direction
      currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
    } else {
      // New column - set default direction based on type
      const fieldType = FIELD_TYPES[columnIndex];
      currentSort.column = columnIndex;
      currentSort.direction = fieldType === 'number' ? 'desc' : 'asc';
    }
    
    sortData(currentSort.column, currentSort.direction);
    updateSortArrows();
    currentPage = 1; // Reset to first page
    displayResults();
    displayPagination();
  }

  // Handle column hiding (middle click or long press)
  function handleColumnHide(columnIndex) {
    if (hiddenColumns.has(columnIndex)) {
      hiddenColumns.delete(columnIndex);
    } else {
      hiddenColumns.add(columnIndex);
    }
    updateColumnVisibility();
  }

  // Mobile long press detection
  function handleTouchStart(columnIndex, event) {
    touchTimer = setTimeout(() => {
      handleColumnHide(columnIndex);
      touchTimer = null;
    }, 2000);
  }

  function handleTouchEnd() {
    if (touchTimer) {
      clearTimeout(touchTimer);
      touchTimer = null;
    }
  }

  // Make this available globally for React components
  window.applyReactFilters = function(filters) {
    console.log('React filters applied:', filters);
    reactFilters = filters;
    filterItems();
  };

  // Parse the pipe-delimited data file and add ID column
  function parseData(text) {
    console.log('Parsing data, text length:', text.length);
    const lines = text.split('\n').filter(line => line.trim() && !line.startsWith('<<<'));
    console.log('Found', lines.length, 'data lines');
    
    const parsedItems = lines.map((line, index) => {
      const fields = line.split('|').map(field => field.trim());
      while (fields.length < 30) { // Ensure we have 30 original fields
        fields.push('');
      }
      // Add ID as the first column (1-based row number)
      return [(index + 1).toString(), ...fields];
    });
    
    console.log('Parsed', parsedItems.length, 'items with ID column');
    return parsedItems;
  }

  // Populate the filter dropdowns
  function populateFilters(items) {
    console.log('Populating filters with', items.length, 'items');
    const types = new Set();
    const races = new Set();
    const classes = new Set();
    const alignments = new Set();
    const wearlocs = new Set();
    const areas = new Set();
    
    // Define available races, classes, and alignments
    const availableRaces = ['Human', 'Dwarf', 'Elf', 'Halfling', 'Pixie', 'Half-Elf', 'Half-Ogre', 'Half-Orc', 'Half-Troll', 'Gith', 'Sea-Elf', 'Drow', 'Lizardman', 'Gnome', 'Dragonborn', 'Tiefling'];
    const availableClasses = ['Mage', 'Cleric', 'Thief', 'Warrior', 'Vampire', 'Druid', 'Ranger', 'Augurer', 'Paladin', 'Nephandi', 'Fathomer', 'Bladesinger', 'Barbarian'];
    const availableAlignments = ['Good', 'Evil', 'Neutral'];
    
    items.forEach(item => {
      if (item[1]) types.add(item[1]); // Type field (index 1 after ID)
      if (item[2]) wearlocs.add(item[2]); // Wearloc field (index 2 after ID)
      if (item[28]) areas.add(item[28]); // Area field (index 28 after ID)
    });
    
    console.log('Found', types.size, 'types,', wearlocs.size, 'wear locations, and', areas.size, 'areas');
    
    // Populate Type filter
    if (typeSelect) {
      typeSelect.innerHTML = '<option value="">All Types</option>';
      Array.from(types).sort().forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = type;
        typeSelect.appendChild(option);
      });
    }
    
    // Populate Race filter
    if (raceSelect) {
      raceSelect.innerHTML = '<option value="">All Races</option>';
      availableRaces.forEach(race => {
        const option = document.createElement('option');
        option.value = race;
        option.textContent = race;
        raceSelect.appendChild(option);
      });
    }
    
    // Populate Class filter
    if (classSelect) {
      classSelect.innerHTML = '<option value="">All Classes</option>';
      availableClasses.forEach(cls => {
        const option = document.createElement('option');
        option.value = cls;
        option.textContent = cls;
        classSelect.appendChild(option);
      });
    }
    
    // Populate Alignment filter
    if (alignSelect) {
      alignSelect.innerHTML = '<option value="">All Aligns</option>';
      availableAlignments.forEach(align => {
        const option = document.createElement('option');
        option.value = align;
        option.textContent = align;
        alignSelect.appendChild(option);
      });
    }
    
    // Populate Wearloc filter
    if (wearlocSelect) {
      wearlocSelect.innerHTML = '<option value="">All Wearlocs</option>';
      Array.from(wearlocs).sort().forEach(wearloc => {
        const option = document.createElement('option');
        option.value = wearloc;
        option.textContent = wearloc;
        wearlocSelect.appendChild(option);
      });
    }
    
    // Populate Area filter
    if (areaSelect) {
      areaSelect.innerHTML = '<option value="">All Areas</option>';
      Array.from(areas).sort().forEach(area => {
        const option = document.createElement('option');
        option.value = area;
        option.textContent = area;
        areaSelect.appendChild(option);
      });
    }
  }

  // Filter items based on search and dropdown selections
  function filterItems() {
    if (!items.length) return;
    
    const searchTerm = searchInput.value.toLowerCase();
    const selectedType = typeSelect.value;
    const selectedRace = raceSelect.value;
    const selectedClass = classSelect.value;
    const selectedAlign = alignSelect.value;
    const selectedWearloc = wearlocSelect.value;
    const selectedArea = areaSelect.value;
    
    currentResults = items.filter(item => {
      // Basic text search in name field (index 3)
      const nameMatch = !searchTerm || item[3].toLowerCase().includes(searchTerm);
      
      // Type filter (index 1)
      const typeMatch = !selectedType || item[1] === selectedType;
      
      // Race compatibility filter (anti-flag logic)
      // Check Races column (index 25) for "anti-[race]"
      let raceMatch = true;
      if (selectedRace) {
        const racesField = item[25] || '';
        raceMatch = !racesField.toLowerCase().includes(`anti-${selectedRace.toLowerCase()}`);
      }
      
      // Class compatibility filter (anti-flag logic)
      // Check Antis column (index 24) for "anti-[class]"
      let classMatch = true;
      if (selectedClass) {
        const antisField = item[24] || '';
        classMatch = !antisField.toLowerCase().includes(`anti-${selectedClass.toLowerCase()}`);
      }
      
      // Alignment compatibility filter (anti-flag logic)
      // Check Antis column (index 24) for "anti-[align]"
      let alignMatch = true;
      if (selectedAlign) {
        const antisField = item[24] || '';
        alignMatch = !antisField.toLowerCase().includes(`anti-${selectedAlign.toLowerCase()}`);
      }
      
      // Wear location filter (index 2)
      const wearlocMatch = !selectedWearloc || item[2] === selectedWearloc;
      
      // Area filter (index 28)
      const areaMatch = !selectedArea || item[28] === selectedArea;
      
      // React filters (from the filter panel)
      let reactMatch = true;
      if (Object.keys(reactFilters).length > 0) {
        // Apply React filters here - for now just pass through
        // This will be expanded to handle the complex filter logic
      }
      
      return nameMatch && typeMatch && raceMatch && classMatch && alignMatch && wearlocMatch && areaMatch && reactMatch;
    });
    
    // Apply current sorting
    sortData(currentSort.column, currentSort.direction);
    
    console.log('Filtered to', currentResults.length, 'items');
    currentPage = 1;
    displayResults();
    displayPagination();
  }
  // Display the filtered results in the table with all columns
  function displayResults() {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageItems = currentResults.slice(startIndex, endIndex);
    
    console.log('Displaying', pageItems.length, 'items on page', currentPage);
    
    tbody.innerHTML = '';
    
    if (pageItems.length === 0) {
      tbody.innerHTML = '<tr><td colspan="31">No items found</td></tr>';
      return;
    }
    
    pageItems.forEach(item => {
      const row = document.createElement('tr');
      
      // Create cells for all 31 columns (including ID)
      const cells = [];
      for (let i = 0; i < FIELD_COUNT; i++) {
        const cell = document.createElement("td");
        cell.className = getCellClass(i);
        if (hiddenColumns.has(i)) {
          cell.classList.add("hidden-column");
        }
        cell.textContent = item[i] || "";
        cell.title = item[i] || ""; // Tooltip for truncated content
        cells.push(cell);
      }

      // Add colorization classes based on flags
      const flags = item[23] ? item[23].toLowerCase() : ""; // Flags column is index 23
      if (flags.includes("pkill")) {
        row.classList.add("pkill-item");
      }
      if (flags.includes("gloried")) {
        row.classList.add("gloried-item");
      }
      if (flags.includes("not_in_game")) {
        row.classList.add("not-in-game-item");
      }

      cells.forEach((cell) => row.appendChild(cell));
      tbody.appendChild(row);
    });
    
    // Adjust column widths after displaying results
    adjustLastVisibleColumnWidth();
  }

  // Get CSS class for column based on index (including ID column)
  function getCellClass(index) {
    const classes = [
      'col-id', 'col-type', 'col-wearloc', 'col-name', 'col-lv', 'col-ac', 'col-acadd',
      'col-d1', 'col-d2', 'col-hr', 'col-dr', 'col-hp', 'col-mp',
      'col-st', 'col-de', 'col-co', 'col-in', 'col-wi', 'col-lk',
      'col-ch', 'col-mv', 'col-wgt', 'col-value', 'col-flags', 'col-antis',
      'col-races', 'col-other', 'col-mob', 'col-area', 'col-date', 'col-user'
    ];
    return classes[index] || '';
  }

  // Display pagination controls with static buttons
  function displayPagination() {
    const totalPages = Math.ceil(currentResults.length / itemsPerPage);
    
    paginationDiv.innerHTML = '';
    
    if (totalPages <= 1) {
      const countDiv = document.createElement('div');
      countDiv.className = 'results-count';
      countDiv.textContent = `Showing ${currentResults.length} items`;
      paginationDiv.appendChild(countDiv);
      return;
    }
    
    // First button (always present)
    const firstBtn = document.createElement('button');
    firstBtn.textContent = 'First';
    firstBtn.disabled = currentPage === 1;
    firstBtn.onclick = () => {
      currentPage = 1;
      displayResults();
      displayPagination();
    };
    paginationDiv.appendChild(firstBtn);
    
    // Previous button (always present)
    const prevBtn = document.createElement('button');
    prevBtn.textContent = 'Previous';
    prevBtn.disabled = currentPage === 1;
    prevBtn.onclick = () => {
      if (currentPage > 1) {
        currentPage--;
        displayResults();
        displayPagination();
      }
    };
    paginationDiv.appendChild(prevBtn);
    
    // Page numbers
    const maxVisiblePages = window.innerWidth < 768 ? 3 : 5;
    const halfVisible = Math.floor(maxVisiblePages / 2);
    
    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      const pageBtn = document.createElement('button');
      pageBtn.textContent = i;
      pageBtn.className = i === currentPage ? 'active' : '';
      pageBtn.onclick = () => {
        currentPage = i;
        displayResults();
        displayPagination();
      };
      paginationDiv.appendChild(pageBtn);
    }
    
    // Next button (always present)
    const nextBtn = document.createElement('button');
    nextBtn.textContent = 'Next';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.onclick = () => {
      if (currentPage < totalPages) {
        currentPage++;
        displayResults();
        displayPagination();
      }
    };
    paginationDiv.appendChild(nextBtn);
    
    // Results count
    const countDiv = document.createElement('div');
    countDiv.className = 'results-count';
    const startItem = ((currentPage - 1) * itemsPerPage) + 1;
    const endItem = Math.min(currentPage * itemsPerPage, currentResults.length);
    countDiv.textContent = `Showing ${startItem}-${endItem} of ${currentResults.length} items (${itemsPerPage} per page)`;
    paginationDiv.appendChild(countDiv);
  }

  // Setup scroll-to-paginate functionality
  function setupScrollToPaginate() {
    if (tableContainer) {
      let isScrolling = false;
      let scrollTimeout;
      
      tableContainer.addEventListener('wheel', (event) => {
        event.preventDefault();
        
        if (isScrolling) return;
        
        const totalPages = Math.ceil(currentResults.length / itemsPerPage);
        
        if (event.deltaY > 0) {
          // Scroll down - next page
          if (currentPage < totalPages) {
            currentPage++;
            displayResults();
            displayPagination();
            isScrolling = true;
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => { isScrolling = false; }, 300);
          }
        } else {
          // Scroll up - previous page
          if (currentPage > 1) {
            currentPage--;
            displayResults();
            displayPagination();
            isScrolling = true;
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => { isScrolling = false; }, 300);
          }
        }
      });
      
      // Touch events for mobile swipe
      let touchStartY = 0;
      let touchEndY = 0;
      
      tableContainer.addEventListener('touchstart', (event) => {
        touchStartY = event.touches[0].clientY;
      });
      
      tableContainer.addEventListener('touchend', (event) => {
        touchEndY = event.changedTouches[0].clientY;
        handleSwipe();
      });
      
      function handleSwipe() {
        const swipeThreshold = 50; // Minimum distance for a swipe
        const swipeDistance = touchStartY - touchEndY;
        
        if (Math.abs(swipeDistance) > swipeThreshold) {
          const totalPages = Math.ceil(currentResults.length / itemsPerPage);
          
          if (swipeDistance > 0) {
            // Swipe up - next page
            if (currentPage < totalPages) {
              currentPage++;
              displayResults();
              displayPagination();
            }
          } else {
            // Swipe down - previous page
            if (currentPage > 1) {
              currentPage--;
              displayResults();
              displayPagination();
            }
          }
        }
      }
    }
  }

  // Setup table headers with sorting and hiding functionality
  function setupTableHeaders() {
    tableHeaders.forEach((header, index) => {
      // Add sort arrow
      const arrow = document.createElement('span');
      arrow.className = 'sort-arrow';
      header.appendChild(arrow);
      
      // Click event for sorting
      header.addEventListener('click', (event) => handleHeaderClick(index, event));
      
      // Middle click for hiding (desktop)
      header.addEventListener('mousedown', (event) => {
        if (event.button === 1) { // Middle mouse button
          event.preventDefault();
          handleColumnHide(index);
        }
      });
      
      // Touch events for mobile long press
      header.addEventListener('touchstart', (event) => handleTouchStart(index, event));
      header.addEventListener('touchend', handleTouchEnd);
      header.addEventListener('touchcancel', handleTouchEnd);
    });
    
    // Initial sort arrow setup
    updateSortArrows();
  }

  // Event listeners
  if (searchInput) searchInput.addEventListener('input', filterItems);
  if (typeSelect) typeSelect.addEventListener('change', filterItems);
  if (raceSelect) raceSelect.addEventListener('change', filterItems);
  if (classSelect) classSelect.addEventListener('change', filterItems);
  if (alignSelect) alignSelect.addEventListener('change', filterItems);
  if (wearlocSelect) wearlocSelect.addEventListener('change', filterItems);
  if (areaSelect) areaSelect.addEventListener('change', filterItems);
  if (defaultViewBtn) {
    defaultViewBtn.addEventListener('click', resetToDefaults);
  }

  // Modal functionality
  if (openFiltersBtn && filterModal) {
    openFiltersBtn.addEventListener('click', () => {
      console.log('Opening filter modal');
      filterModal.style.display = 'block';
      filterModal.classList.add('show');
    });
  }

  if (closeFiltersBtn && filterModal) {
    closeFiltersBtn.addEventListener('click', () => {
      console.log('Resetting filters to defaults');
      reactFilters = {};
      if (window.resetReactFilters) {
        window.resetReactFilters();
      }
      filterModal.style.display = 'none';
      filterModal.classList.remove('show');
      filterItems();
    });
  }

  if (applyFiltersBtn && filterModal) {
    applyFiltersBtn.addEventListener('click', () => {
      console.log('Applying filters');
      filterModal.style.display = 'none';
      filterModal.classList.remove('show');
      filterItems();
    });
  }

  if (cancelFiltersBtn && filterModal) {
    cancelFiltersBtn.addEventListener('click', () => {
      console.log('Canceling filter changes');
      filterModal.style.display = 'none';
      filterModal.classList.remove('show');
    });
  }

  // Close modal when clicking outside
  window.addEventListener('click', (event) => {
    if (event.target === filterModal) {
      filterModal.style.display = 'none';
      filterModal.classList.remove('show');
    }
  });

  // Window resize handler for dynamic pagination
  window.addEventListener('resize', handleResize);

  // Load version info
  fetch(VERSION_URL)
    .then(resp => resp.json())
    .then(data => {
      if (versionDiv) {
        versionDiv.textContent = `Version ${data.version}`;
      }
    })
    .catch(() => {
      if (versionDiv) {
        versionDiv.textContent = 'Version unknown';
      }
    });

  // Load and parse data
  console.log('Starting data fetch...');
  fetch(RAW_FILE_URL)
    .then(resp => {
      console.log('Data fetch response:', resp.status, resp.statusText);
      if (!resp.ok) {
        throw new Error(`HTTP error! status: ${resp.status}`);
      }
      return resp.text();
    })
    .then(parseData)
    .then(data => {
      items = data;
      console.log(`Successfully loaded ${items.length} items`);
      populateFilters(items);
      updateMainContentLayout(); // Call after filters are populated and before initial filterItems
      setupTableHeaders();
      setupScrollToPaginate();
      filterItems();
    })
    .catch(err => {
      console.error('Error loading data:', err);
      if (tbody) {
        tbody.innerHTML = `<tr><td colspan="30">Error loading data: ${err.message}</td></tr>`;
      }
    });

  console.log('Script initialization complete');
}

// Initialize immediately if DOM is ready, otherwise wait for DOMContentLoaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}

console.log('Script.js loaded');

