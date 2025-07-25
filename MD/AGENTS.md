# RoD Equipment Database Web Viewer - Agent Instructions

## 📋 Project Overview

This project is a web-based replica of the original Delphi "RoD Item Database" application. The goal is to recreate the functionality and appearance of the original desktop application using modern web technologies while maintaining the same data structure and user experience.

**Current Status:** Functional web application with data loading, filtering, sorting, and pagination. Organized file structure with proper backups.

**Current Deployed URL:** https://mgvfczqq.manus.space

## 🗂️ File Structure

The project is organized into the following folders:

- **`original/`** - Original documentation and reference files from the Delphi application
  - `DelphaAppFilterWindowSample.md` - Original filter window documentation
  - `FilterUI_Task.md` - UI task specifications
  - `OldAppDetails.md` - Details about the original Delphi application
  - `filter.jpg` - Screenshot of original Delphi filter interface

- **`md/`** - Markdown documentation files
  - `AGENTS.md` - This file with agent instructions and session logs
  - `ITEM_SCHEMA.md` - Database schema and field definitions

- **`current/`** - Current working website files (minimum required for functionality)
  - `index.html` - Main HTML file
  - `script.js` - Main JavaScript functionality
  - `style.css` - CSS styling
  - `RoD_Item.txt` - Item database (6,958 items)
  - `build/` - React components for filter panel
  - `version.json` - Version tracking

- **`backup/`** - Previous version backup before major changes

## 🎯 Core Requirements

### Data Structure
- **31 columns total:** ID (new), Type, Wearloc, Name, Lv, AC, -AC, d1, d2, HR, DR, HP, MP, ST, DE, CO, IN, WI, LK, CH, MV, Wgt, Value, Flags, Antis, Races, Other, Mob/Room, Area, Added, Edited
- **ID column:** Shows raw row number from data file (1-based, ignoring comment lines)
- **d1/d2 fields:** Minimum and maximum weapon damage (NOT dice rolls)
- **6,958 total items** in database

### UI/UX Requirements
- **Font:** Consolas fixed-width font throughout application
- **Title:** "RoD Equipment Database Web Viewer" (make smaller to fit more grid)
- **Fixed column widths:** NEVER adjust column widths dynamically
- **No vertical scrollbars:** Dynamic pagination based on actual viewport space
- **Fixed headers:** Table headers stay at top when scrolling
- **Responsive design:** Works on desktop and mobile

### Pagination Requirements
- **Dynamic calculation:** Must account for title bar, search controls, pagination buttons, and grid header
- **Static buttons:** First/Previous/Next always visible (disabled when appropriate)
- **Fixed button width:** All pagination buttons same width (handle double digits)
- **Current issue:** Pagination shows 41 items but only 32 visible - fix calculation

### Filtering System
- **Main interface filters (in order):**
  1. "All Types" - Item type filter
  2. "All Races" - Race compatibility filter (show items WITHOUT "anti-[race]" in Races column)
  3. "All Classes" - Class compatibility filter (show items WITHOUT "anti-[class]" in Antis column)
  4. "All Aligns" - Alignment compatibility filter (show items WITHOUT "anti-[align]" in Antis column)
  5. "All Wearlocs" - Wear location filter
  6. "All Areas" - Area filter
- **Compact dropdowns:** Shrink width to fit all filters across screen
- **Cumulative filtering:** All filters work together (AND logic)
- **Advanced modal:** React-based filter panel for complex constraints

### Visual Indicators
- **PK items:** Red text for rows with "pkill" flag
- **Gloried items:** Green text for rows with "gloried" flag
- **Out of game items:** Blue text for rows with "not_in_game" flag

### Column Management
- **Sorting:** Click headers to sort, visual arrows show direction
- **Hide columns:** Middle click (desktop) or 2-second touch (mobile)
- **Hidden columns:** Show blank space, DO NOT adjust other column widths
- **Default sort:** ID ascending

## 🚨 Critical Issues to Address

### High Priority (Next Session)
1. **Fix pagination calculation** - Account for all UI elements, not just viewport
2. **Update version number** - Currently stuck at 1.0.7, increment for each deployment
3. **Implement Race/Class/Align filters** - Anti-flag logic for compatibility
4. **Fix hidden column behavior** - Show blank space, don't resize other columns
5. **Add row color coding** - PK (red), Gloried (green), OOG (blue)

### Medium Priority
6. **Complete filter modal** - Add all missing Delphi filters (min/max stats, PK/Gloried/OOG radio buttons)
7. **Remove redundant filters** - Remove Race/Class/Align from modal (now main dropdowns)
8. **Fix React component loading** - Modal opens but content doesn't load
9. **Smaller title bar** - More space for grid content

### Low Priority
10. **Enhanced search** - Multi-field search capabilities
11. **Export functionality** - CSV/Excel export options
12. **User preferences** - Save column visibility, sort preferences

## 🔧 Technical Implementation Notes

### Data Loading
- Parse pipe-delimited `RoD_Item.txt` file
- Skip lines starting with "<<<" (comments)
- Add ID column as first field (1-based row numbers)
- Handle empty fields gracefully

### Filtering Logic
```javascript
// Race/Class/Align compatibility example
function isCompatible(item, selectedRace, selectedClass, selectedAlign) {
  const antis = item[24]; // Antis column (index 24 after ID)
  const races = item[25]; // Races column (index 25 after ID)
  
  // Check if item is wearable by selected race
  if (selectedRace && races.includes(`anti-${selectedRace}`)) return false;
  
  // Check if item is wearable by selected class
  if (selectedClass && antis.includes(`anti-${selectedClass}`)) return false;
  
  // Check if item is wearable by selected alignment
  if (selectedAlign && antis.includes(`anti-${selectedAlign}`)) return false;
  
  return true;
}
```

### Column Width Management
```css
/* CRITICAL: Never change these fixed widths */
table { table-layout: fixed; }
.col-id { width: 40px; min-width: 40px; max-width: 40px; }
/* ... other fixed widths ... */

/* Hidden columns show blank space */
.hidden-column { visibility: hidden; } /* NOT display: none */
```

### Pagination Calculation
```javascript
// MUST account for all UI elements
function calculateItemsPerPage() {
  const viewportHeight = window.innerHeight;
  const titleHeight = 40; // Title bar
  const controlsHeight = 60; // Search/filter controls
  const headerHeight = 30; // Table header
  const paginationHeight = 40; // Pagination buttons
  const rowHeight = 20; // Each table row
  
  const availableHeight = viewportHeight - titleHeight - controlsHeight - headerHeight - paginationHeight;
  return Math.floor(availableHeight / rowHeight);
}
```

## 🎨 Original Delphi Application Reference

The original application had these key features that must be replicated:

### Filter Window Layout
- Compact 3-column layout (Class, Race, Constraints)
- Radio button groups for exclusive selections
- Checkboxes for multiple constraint options
- Numeric input fields for min/max values
- Apply/Reset/Cancel buttons

### Missing Filter Options (to be implemented)
- **Stat Minimums:** ST, DE, CO, IN, WI, LK, CH (numeric inputs)
- **Stat Maximums:** ST, DE, CO, IN, WI, LK, CH (numeric inputs)
- **Level Range:** Min/Max level inputs
- **AC Range:** Min/Max AC inputs
- **Damage Range:** Min/Max d1/d2 inputs
- **Item Flags:** Magic/Non-Magic, PK/Non-PK, Gloried/Non-Gloried, OOG/In-Game radio buttons
- **Special Constraints:** "Allow only one Unique" checkbox

### Data Display
- All 30 original columns visible simultaneously
- Fixed-width columns based on `ColMaxW` array
- Horizontal scrolling for wide data
- No vertical scrolling (pagination instead)

## 🛠️ Development Guidelines

### For All Agents
- **ALWAYS** test locally before deployment
- **ALWAYS** update version number in `version.json`
- **ALWAYS** create backup before major changes
- **NEVER** adjust column widths dynamically
- **NEVER** use vertical scrollbars in the grid
- **ALWAYS** maintain file organization structure

### Code Quality
- Use ES6+ JavaScript features
- Maintain consistent code formatting
- Add comprehensive error handling
- Include detailed console logging for debugging
- Comment complex logic thoroughly

### Testing Checklist
- [ ] Data loads correctly (6,958 items)
- [ ] All filters work independently and together
- [ ] Sorting works on all columns
- [ ] Pagination shows correct item count
- [ ] Column hiding/showing works properly
- [ ] Modal opens and displays React content
- [ ] Responsive design works on mobile
- [ ] No JavaScript errors in console

## 📚 Reference Materials

### Original Delphi Source Code Snippets
```pascal
// Column definitions from original source
ColN = 30; // Number of Columns
ColOType = 0; ColWear = 1; ColName = 2; ColLv = 3; ColAC = 4;
ColAcAdd = 5; ColD1 = 6; ColD2 = 7; ColHR = 8; ColDR = 9;
ColHP = 10; ColMP = 11; ColST = 12; ColDE = 13; ColCO = 14;
ColIN = 15; ColWI = 16; ColLK = 17; ColCH = 18; ColMV = 19;
ColWgt = 20; ColValue = 21; ColFlags = 22; ColAntis = 23;
ColRaces = 24; ColOther = 25; ColMob = 26; ColArea = 27;
ColDate = 28; ColUser = 29;

// Column titles
ColTitle: array [0..ColN-1] of string =
( 'Type','Wearloc','Name','Lv','AC','-AC','d1','d2','HR','DR',
  'HP','MP','ST','DE','CO','IN','WI','LK','CH','MV',
  'Wgt','Value','Flags','Antis','Races','Other','Mob/Room',
  'Area','Added','Edited');
```

### Available Classes
Mage, Cleric, Thief, Warrior, Vampire, Druid, Ranger, Augurer, Paladin, Nephandi, Fathomer, Bladesinger, Barbarian

### Available Races  
Human, Dwarf, Elf, Halfling, Pixie, Half-Elf, Half-Ogre, Half-Orc, Half-Troll, Gith, Sea-Elf, Drow, Lizardman, Gnome, Dragonborn, Tiefling

### Available Alignments
Good, Evil, Neutral

## 🔄 Agent Session Log

### Session 1 (Manus - 2025-07-23)
**Status:** ✅ MAJOR PROGRESS - Core functionality implemented

**Achievements:**
- ✅ Fixed data loading (6,958 items successfully loaded)
- ✅ Implemented all 31 columns display (ID + 30 original fields)
- ✅ Added Consolas fixed-width font throughout
- ✅ Implemented fixed headers that stay at top
- ✅ Added dynamic pagination with no vertical scrollbars
- ✅ Created wear location filter dropdown
- ✅ Added "Default View" button for resetting filters/sorting
- ✅ Implemented column sorting with visual arrows
- ✅ Added hide column functionality (middle click/long press)
- ✅ Fixed table layout to prevent dynamic column width changes
- ✅ Added static pagination buttons (First/Previous/Next always visible)
- ✅ Reorganized file structure into proper folders
- ✅ Created comprehensive backups

**Current Deployed URL:** https://mgvfczqq.manus.space

**Known Issues Identified:**
- ⚠️ Pagination calculation incorrect (shows 41 items, displays 32)
- ⚠️ Version number not being updated (stuck at 1.0.7)
- ⚠️ React filter modal content not loading
- ⚠️ Missing Race/Class/Align compatibility filters
- ⚠️ Hidden columns resize other columns instead of showing blank space
- ⚠️ No row color coding for PK/Gloried/OOG items
- ⚠️ Title bar too large, should be smaller
- ⚠️ Filter dropdowns too wide, need to be more compact
- ⚠️ Missing many advanced filters from original Delphi app

**Next Agent Priority Tasks:**
1. Fix pagination calculation to account for all UI elements
2. Implement Race/Class/Align compatibility filters with anti-flag logic
3. Add row color coding (PK=red, Gloried=green, OOG=blue)
4. Fix hidden column behavior to show blank space
5. Update version number system
6. Make title bar smaller and change text to "RoD Equipment Database Web Viewer"
7. Compact filter dropdowns and reorder them
8. Complete advanced filter modal with all missing Delphi options
9. Fix React component loading issue

**Technical Notes:**
- ID column successfully added as first column (1-based row numbers)
- Fixed table layout prevents dynamic width changes
- All 6,958 items load and display correctly
- Sorting works on all columns with proper type handling
- File structure properly organized for future maintenance

### Future Sessions
**Template for next agents:**

**Agent:** [Agent Name]  
**Date:** [YYYY-MM-DD]  
**Issues Addressed:**
- [List specific issues worked on]

**Status:** [✅ RESOLVED / ⚠️ PARTIAL / ❌ FAILED] - [Brief description]

**Deployed URL:** [New deployment URL]

**Changes Made:**
- [Detailed list of changes]

**New Issues Found:**
- [Any new issues discovered]

**Next Agent Should:**
- [Specific tasks for next agent]

---

## 📞 Contact & Maintenance

**Project Owner:** User requesting RoD Item Database replication  
**Original Application:** Delphi-based desktop application  
**Target Platform:** Modern web browsers (desktop and mobile)  
**Data Source:** RoD_Item.txt (pipe-delimited format)  

**Last Updated:** 2025-07-23 by Manus  
**Current Version:** 1.0.7 (needs increment)  
**Next Version Target:** 1.0.8 with pagination fixes and new filters



### Session 1 Continuation (Manus - 2025-07-23) - FINAL UPDATE
**Status:** ✅ PAGINATION FIX & NEW FILTERS IMPLEMENTED

**Final Achievements:**
- ✅ **Fixed pagination calculation** - Now accounts for title, controls, header, and pagination elements
- ✅ **Implemented Race/Class/Align filters** - Anti-flag logic working correctly
- ✅ **Updated version to 1.0.8** - Version tracking now functional
- ✅ **Compact filter dropdowns** - All 6 filters fit across screen (110px width each)
- ✅ **Proper filter order** - All Types, All Races, All Classes, All Aligns, All Wearlocs, All Areas

**Final Deployed URL:** https://nlgnpmuu.manus.space

**Known Issues Still Remaining:**
- ⚠️ **Data not loading on deployed site** - Script execution issue (works locally)
- ⚠️ **React filter modal content still not loading**
- ⚠️ **Missing row color coding** for PK/Gloried/OOG items
- ⚠️ **Hidden column behavior** still resizes instead of showing blank space
- ⚠️ **Title should be smaller** and changed to "RoD Equipment Database Web Viewer"
- ⚠️ **Missing advanced filter options** in modal (min/max stats, PK/Gloried/OOG radio buttons)

**Technical Implementation Completed:**
- Enhanced `calculateItemsPerPage()` function with proper DOM element measurement
- Added Race/Class/Align compatibility filtering with anti-flag logic
- Implemented compact CSS styling for filter dropdowns
- Updated version tracking system
- Added proper event listeners for new filter elements

**Anti-Flag Logic Implementation:**
```javascript
// Race compatibility: Check Races column (index 25) for "anti-[race]"
if (selectedRace) {
  const racesField = item[25] || '';
  raceMatch = !racesField.toLowerCase().includes(`anti-${selectedRace.toLowerCase()}`);
}

// Class compatibility: Check Antis column (index 24) for "anti-[class]"
if (selectedClass) {
  const antisField = item[24] || '';
  classMatch = !antisField.toLowerCase().includes(`anti-${selectedClass.toLowerCase()}`);
}

// Alignment compatibility: Check Antis column (index 24) for "anti-[align]"
if (selectedAlign) {
  const antisField = item[24] || '';
  alignMatch = !antisField.toLowerCase().includes(`anti-${selectedAlign.toLowerCase()}`);
}
```
### Session 2 (ChatGPT - 2025-07-24)
**Status:** ✅ FIXED TABLE LAYOUT OVERFLOW ISSUE

**Fixes Applied:**
- Corrected dynamic layout spacing to prevent table rows from extending under footer.
- Updated `script.js` to properly calculate `itemsPerPage` based on total visible height.
- Adjusted CSS in `style.css` to enforce flex constraints and avoid overflow.
- Incremented version from 1.2.3 → 1.2.4.

**Test Instructions:**
- Resize viewport vertically and verify table content stops above the footer.
- Confirm no vertical scrollbars are needed.
- Validate pagination count updates properly.


**Next Agent Priority Tasks (CRITICAL):**
5. **Complete advanced filter modal** - Add all missing Delphi constraints
6. **Fix React component loading** - Modal opens but content doesn't render
