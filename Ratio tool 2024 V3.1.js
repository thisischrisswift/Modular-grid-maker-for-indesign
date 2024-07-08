// Set ruler units to points
var myDocument = app.activeDocument;
with (myDocument.viewPreferences) {
  // Set horizontal and vertical measurement units to points
  horizontalMeasurementUnits = MeasurementUnits.points;
  verticalMeasurementUnits = MeasurementUnits.points;
}

// Set the ruler origin to the page origin
myDocument.viewPreferences.rulerOrigin = RulerOrigin.pageOrigin;

// Determine if we are using an existing document or creating a new one
var doc;
if (app.documents.length > 0) {
  // Use the active document if one is open
  doc = app.activeDocument;
} else {
  // Create a new document if none are open
  doc = app.documents.add();
}

// Define aspect ratios for grid setup
var ratios = {
  "Golden Section (1.618)": 1.618,
  "Root 2 (1.414)": 1.414,
  "Root 3 (1.732)": 1.732,
  "4:3 (1.333)": 1.333,
  "3:2 (1.5)": 1.5,
  "16:9 (1.778)": 1.778
};

// Create an array of ratio names for dropdown selection
var ratioNames = [
  "Golden Section (1.618)",
  "Root 2 (1.414)",
  "Root 3 (1.732)",
  "4:3 (1.333)",
  "3:2 (1.5)",
  "16:9 (1.778)",
  "Custom"
];

// Create a dialog box for user input
var myDialog = app.dialogs.add({
  name: "Modular and Baseline Grid Generator",
  canCancel: true
});
with (myDialog) {
  with (dialogColumns.add()) {
    // Ratio dropdown and custom ratio input
    with (borderPanels.add()) {
      with (dialogColumns.add()) {
        staticTexts.add({ staticLabel: "Select Ratio or Enter Custom Ratio:" });
      }
      with (dialogColumns.add()) {
        var myRatioDropdown = dropdowns.add({
          stringList: ratioNames,
          selectedIndex: 0
        });
        var myCustomRatioField = realEditboxes.add({
          editValue: ratios["Golden Section (1.618)"]
        });
      }
    }
    // Max Height input
    with (borderPanels.add()) {
      with (dialogColumns.add()) {
        staticTexts.add({ staticLabel: "Max Height:" });
      }
      with (dialogColumns.add()) {
        var myHeightField = measurementEditboxes.add({ editValue: 792 });
      }
    }
    // Grid number input
    with (borderPanels.add()) {
      with (dialogColumns.add()) {
        staticTexts.add({ staticLabel: "Grid Number:" });
      }
      with (dialogColumns.add()) {
        var myGridSizeField = integerEditboxes.add({ editValue: 9 });
      }
    }
    // Leading input
    with (borderPanels.add()) {
      with (dialogColumns.add()) {
        staticTexts.add({ staticLabel: "Leading:" });
      }
      with (dialogColumns.add()) {
        var myLeadingSizeField = measurementEditboxes.add({ editValue: 12 });
      }
    }
    // Margin setup selection
    with (borderPanels.add()) {
      with (dialogColumns.add()) {
        staticTexts.add({ staticLabel: "Select Margin Setup:" });
      }
      with (dialogColumns.add()) {
        var myMarginSetupDropdown = dropdowns.add({
          stringList: ["Van de Graaf canon", "One grid unit"],
          selectedIndex: 0
        });
      }
    }
  }
}

// Show the dialog and capture user input
if (myDialog.show() == true) {
  var grid = myGridSizeField.editValue;
  var leading = myLeadingSizeField.editValue;
  var maxHeight = myHeightField.editValue;
  var selectedIndex = myRatioDropdown.selectedIndex;
  var selectedRatioName = ratioNames[selectedIndex];
  var ratio = selectedIndex === ratioNames.length - 1 ? myCustomRatioField.editValue : ratios[selectedRatioName];
  var marginSetupIndex = myMarginSetupDropdown.selectedIndex;
  myDialog.destroy();
} else {
  myDialog.destroy();
  exit();
}

// Create a new master spread named after the selected ratio
var masterName = selectedRatioName.replace(/[^\w\s]/gi, '').replace(/\s+/g, '_');
var masterSpread = doc.masterSpreads.add();
masterSpread.baseName = masterName; // Set the name

// Calculate the page dimensions based on user input
var pageHeight = maxHeight;
var pageWidth = maxHeight / ratio;
var rh1 = pageHeight / grid;
var rw1 = pageWidth / grid;
var leadingUnit = leading / grid;
var vertLeading = leading / ratio;
var vertLeadingUnit = vertLeading / grid;

var gridArray = [];

// Adjust page size to fit modular grid and leading
var totalModuleHeight = rh1 * grid;
var leadingIntoModuleHeight = rh1 / leading;
var lmhRounded = Math.floor(leadingIntoModuleHeight);
var newLeadingSpace = leading * (grid - 1);
var newModuleSpace = (lmhRounded * leading) * grid;
var newPageHeight = newModuleSpace + newLeadingSpace;
var newPageWidth = newPageHeight / ratio;

// Change page size
doc.documentPreferences.pageWidth = newPageWidth;
doc.documentPreferences.pageHeight = newPageHeight;

var ph = doc.documentPreferences.pageHeight;
var pw = doc.documentPreferences.pageWidth;
var rh = ph / grid;
var rw = pw / grid;
var vertLeadingUnit = vertLeading / grid;

// Define grid units for margins
var gridUnits = {
  vertical: rh + leadingUnit,
  horizontal: rw + vertLeadingUnit
};

// Function to add guides to a page
function addGuidesToPage(page) {
  // Add horizontal guides
  for (var i = 1; i < grid; i++) {
    var gridline = i * rh;
    var down = leadingUnit * i;
    var up = leadingUnit * (grid - i);
    var mu = gridline - up;
    var md = gridline + down;
    gridArray.push(mu);

    with (page) {
      guides.add(undefined, { orientation: HorizontalOrVertical.horizontal, location: mu });
      guides.add(undefined, { orientation: HorizontalOrVertical.horizontal, location: md });
    }
  }

  // Add vertical guides
  for (var i = 1; i < grid; i++) {
    var gridline = i * rw;
    var down = vertLeadingUnit * i;
    var up = vertLeadingUnit * (grid - i);
    var mu = gridline - up;
    var md = gridline + down;

    with (page) {
      guides.add(undefined, { orientation: HorizontalOrVertical.vertical, location: mu });
      guides.add(undefined, { orientation: HorizontalOrVertical.vertical, location: md });
    }
  }

  // Set margins based on selected margin setup
  if (marginSetupIndex === 0) { // Van de Graaf canon
    if (grid <= 4) {
      alert("Your gutters are set to zero");
      with (page.marginPreferences) {
        properties = {
          top: 0,
          left: 0,
          right: 0,
          bottom: 0
        };
      }
    } else {
      with (page.marginPreferences) {
        // Calculate and set the top, left, right, and bottom margins
        properties = {
          top: rh + leadingUnit, // Top margin: one grid unit height plus one leading unit
          left: rw + vertLeadingUnit, // Left margin: one grid unit width plus one vertical leading unit
          right: (rw + vertLeadingUnit) * 2, // Right margin: twice the sum of one grid unit width and one vertical leading unit
          bottom: (rh + leadingUnit) * 2 // Bottom margin: twice the sum of one grid unit height and one leading unit
        };
      }
    }
  } else { // 1 grid unit for all sides
    with (page.marginPreferences) {
      properties = {
        top: rh + leadingUnit,
        left: rw + vertLeadingUnit,
        right: rw + vertLeadingUnit,
        bottom: rh + leadingUnit
      };
    }
  }
}

// Add guides to the new master spread
addGuidesToPage(masterSpread.pages.item(0)); // RECTO
if (doc.documentPreferences.facingPages) {
  if (masterSpread.pages.length < 2) {
    masterSpread.pages.add();
  }
  addGuidesToPage(masterSpread.pages.item(1)); // VERSO
}

// Set baseline grid settings
with (doc.gridPreferences) {
  baselineStart = 0;
  baselineDivision = leading;
  baselineShown = true;
}

// // Set the page size and bleed box
// doc.documentPreferences.properties = {
//   documentBleedBottomOffset: 3,
//   documentBleedTopOffset: 3,
//   documentBleedInsideOrLeftOffset: 3,
//   documentBleedOutsideOrRightOffset: 3
// };

// Alert the user that the page setup is complete
alert("Page setup complete! Page dimensions: " + doc.documentPreferences.pageWidth + " x " + doc.documentPreferences.pageHeight);