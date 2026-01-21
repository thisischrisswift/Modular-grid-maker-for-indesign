/**
 * Modular Grid Maker for InDesign
 * Creates modular and baseline grids based on ratio, height, and leading
 * Author: Christopher Swift
 * Updated: 2026
 */

(function () {
    'use strict';

    // Check if document exists or create new one
    var doc;
    if (app.documents.length > 0) {
        doc = app.activeDocument;
    } else {
        doc = app.documents.add();
    }

    // Set measurement units to points
    doc.viewPreferences.horizontalMeasurementUnits = MeasurementUnits.POINTS;
    doc.viewPreferences.verticalMeasurementUnits = MeasurementUnits.POINTS;
    doc.viewPreferences.rulerOrigin = RulerOrigin.PAGE_ORIGIN;

    // Define preset ratios
    var RATIOS = {
        "Golden Section (1.618)": 1.618,
        "Root 2 (1.414)": 1.414,
        "Root 3 (1.732)": 1.732,
        "4:3 (1.333)": 1.333,
        "3:2 (1.5)": 1.5,
        "16:9 (1.778)": 1.778
    };

    // Get user input
    var userInput = showDialog();
    if (!userInput) return;

    // Calculate page dimensions
    var pageDimensions = calculatePageDimensions(
        userInput.ratio,
        userInput.maxHeight,
        userInput.grid,
        userInput.leading
    );

    // Set page size
    doc.documentPreferences.pageWidth = pageDimensions.width;
    doc.documentPreferences.pageHeight = pageDimensions.height;

    // Create and name master spread
    var masterSpread = createMasterSpread(doc, userInput.ratioName);

    // Add guides to master spread pages
    addGuidesToMaster(
        masterSpread,
        doc,
        userInput.grid,
        userInput.leading,
        userInput.ratio,
        userInput.marginSetup
    );

    // Apply master spread to all pages
    applyMasterToPages(doc, masterSpread);

    // Set up baseline grid
    setupBaselineGrid(doc, userInput.leading);

    // Create paragraph styles if requested
    if (userInput.createStyles) {
        createParagraphStyles(
            doc,
            pageDimensions.width,
            userInput.grid,
            userInput.leading,
            userInput.ratio,
            userInput.marginSetup
        );
    }

    // Set bleed (optional)
    // setBleed(doc, 3);

    alert(
        "Page setup complete!\n\n" +
        "Ratio: " + userInput.ratioName + "\n" +
        "Dimensions: " + Math.round(pageDimensions.width) + " × " +
        Math.round(pageDimensions.height) + " pts\n" +
        "Grid divisions: " + userInput.grid + "\n" +
        "Leading: " + userInput.leading + " pts\n" +
        "Margin setup: " + userInput.marginSetup +
        (userInput.createStyles ? "\n\nParagraph styles created:\nHeader, Subhead, Body, Caption, Notes, Folio" : "")
    );
})();

/**
 * Display user input dialog
 */
function showDialog() {
    var RATIO_NAMES = [
        "Golden Section (1.618)",
        "Root 2 (1.414)",
        "Root 3 (1.732)",
        "4:3 (1.333)",
        "3:2 (1.5)",
        "16:9 (1.778)",
        "Custom"
    ];

    var RATIOS = {
        "Golden Section (1.618)": 1.618,
        "Root 2 (1.414)": 1.414,
        "Root 3 (1.732)": 1.732,
        "4:3 (1.333)": 1.333,
        "3:2 (1.5)": 1.5,
        "16:9 (1.778)": 1.778
    };

    var dialog = app.dialogs.add({
        name: "Modular and Baseline Grid Generator",
        canCancel: true
    });

    var ratioDropdown, customRatioField, heightField, gridField, leadingField, marginSetupDropdown;

    var column = dialog.dialogColumns.add();

    // Ratio selection
    var ratioPanel = column.borderPanels.add();
    ratioPanel.dialogColumns.add().staticTexts.add({
        staticLabel: "Select Ratio or Enter Custom:"
    });
    var ratioInputColumn = ratioPanel.dialogColumns.add();
    ratioDropdown = ratioInputColumn.dropdowns.add({
        stringList: RATIO_NAMES,
        selectedIndex: 0
    });
    customRatioField = ratioInputColumn.realEditboxes.add({
        editValue: RATIOS["Golden Section (1.618)"],
        minWidth: 80
    });

    // Max Height
    var heightPanel = column.borderPanels.add();
    heightPanel.dialogColumns.add().staticTexts.add({
        staticLabel: "Max Height (pts):"
    });
    heightField = heightPanel.dialogColumns.add().measurementEditboxes.add({
        editValue: 792,
        minWidth: 80
    });

    // Grid Number
    var gridPanel = column.borderPanels.add();
    gridPanel.dialogColumns.add().staticTexts.add({
        staticLabel: "Grid Divisions:"
    });
    gridField = gridPanel.dialogColumns.add().integerEditboxes.add({
        editValue: 9,
        minWidth: 80
    });

    // Leading
    var leadingPanel = column.borderPanels.add();
    leadingPanel.dialogColumns.add().staticTexts.add({
        staticLabel: "Baseline Leading (pts):"
    });
    leadingField = leadingPanel.dialogColumns.add().measurementEditboxes.add({
        editValue: 12,
        minWidth: 80
    });

    // Margin Setup
    var marginPanel = column.borderPanels.add();
    marginPanel.dialogColumns.add().staticTexts.add({
        staticLabel: "Margin Setup:"
    });
    marginSetupDropdown = marginPanel.dialogColumns.add().dropdowns.add({
        stringList: ["Van de Graaf canon", "One grid unit"],
        selectedIndex: 0
    });

    // Create Paragraph Styles
    var stylesPanel = column.borderPanels.add();
    stylesPanel.dialogColumns.add().staticTexts.add({
        staticLabel: "Create Paragraph Styles:"
    });
    var createStylesCheckbox = stylesPanel.dialogColumns.add().checkboxControls.add({
        staticLabel: "Based on grid system",
        checkedState: false
    });

    var result = dialog.show();

    if (result === true) {
        var selectedIndex = ratioDropdown.selectedIndex;
        var selectedRatioName = RATIO_NAMES[selectedIndex];
        var ratio = selectedIndex === RATIO_NAMES.length - 1
            ? customRatioField.editValue
            : RATIOS[selectedRatioName];

        var values = {
            ratio: ratio,
            ratioName: selectedRatioName,
            maxHeight: heightField.editValue,
            grid: gridField.editValue,
            leading: leadingField.editValue,
            marginSetup: marginSetupDropdown.selectedIndex === 0
                ? "Van de Graaf canon"
                : "One grid unit",
            createStyles: createStylesCheckbox.checkedState
        };

        dialog.destroy();
        return values;
    }

    dialog.destroy();
    return null;
}

/**
 * Calculate page dimensions based on ratio and constraints
 * Finds the largest page ≤ maxHeight that maintains grid alignment
 */
function calculatePageDimensions(ratio, maxHeight, gridDivisions, leading) {
    // Calculate space needed for leading/gutters
    var leadingSpace = leading * (gridDivisions - 1);

    // Calculate available space for modules
    var availableSpace = maxHeight - leadingSpace;

    // Find how many complete leading units fit in the available space
    // This ensures baseline grid aligns with modular grid
    var leadingUnitsPerModule = Math.floor(availableSpace / (leading * gridDivisions));

    // Calculate actual module space and final height
    var moduleSpace = leadingUnitsPerModule * leading * gridDivisions;
    var newPageHeight = moduleSpace + leadingSpace;
    var newPageWidth = newPageHeight / ratio;

    return {
        width: newPageWidth,
        height: newPageHeight,
        ratio: ratio
    };
}

/**
 * Create and name a new master spread
 */
function createMasterSpread(doc, ratioName) {
    var masterName = ratioName.replace(/[^\w\s]/gi, '').replace(/\s+/g, '_');
    var masterSpread = doc.masterSpreads.add();
    masterSpread.baseName = masterName;
    return masterSpread;
}

/**
 * Add guides to all pages in master spread
 */
function addGuidesToMaster(masterSpread, doc, gridDivisions, leading, ratio, marginSetup) {
    var pageHeight = doc.documentPreferences.pageHeight;
    var pageWidth = doc.documentPreferences.pageWidth;

    var gridHeight = pageHeight / gridDivisions;
    var gridWidth = pageWidth / gridDivisions;
    var leadingUnit = leading / gridDivisions;
    var vertLeading = leading / ratio;
    var vertLeadingUnit = vertLeading / gridDivisions;

    // Add guides to first page (recto)
    addGuidesToPage(
        masterSpread.pages.item(0),
        gridDivisions,
        gridHeight,
        gridWidth,
        leadingUnit,
        vertLeadingUnit,
        marginSetup
    );

    // Add guides to second page (verso) if facing pages
    if (doc.documentPreferences.facingPages) {
        if (masterSpread.pages.length < 2) {
            masterSpread.pages.add();
        }
        addGuidesToPage(
            masterSpread.pages.item(1),
            gridDivisions,
            gridHeight,
            gridWidth,
            leadingUnit,
            vertLeadingUnit,
            marginSetup
        );
    }
}

/**
 * Add guides and set margins for a single page
 */
function addGuidesToPage(page, divisions, gridHeight, gridWidth,
    leadingUnit, vertLeadingUnit, marginSetup) {
    // Add horizontal guides
    for (var i = 1; i < divisions; i++) {
        var gridLine = i * gridHeight;
        var downOffset = leadingUnit * i;
        var upOffset = leadingUnit * (divisions - i);
        var topGuide = gridLine - upOffset;
        var bottomGuide = gridLine + downOffset;

        page.guides.add(undefined, {
            orientation: HorizontalOrVertical.HORIZONTAL,
            location: topGuide
        });

        page.guides.add(undefined, {
            orientation: HorizontalOrVertical.HORIZONTAL,
            location: bottomGuide
        });
    }

    // Add vertical guides
    for (var i = 1; i < divisions; i++) {
        var gridLine = i * gridWidth;
        var downOffset = vertLeadingUnit * i;
        var upOffset = vertLeadingUnit * (divisions - i);
        var leftGuide = gridLine - upOffset;
        var rightGuide = gridLine + downOffset;

        page.guides.add(undefined, {
            orientation: HorizontalOrVertical.VERTICAL,
            location: leftGuide
        });

        page.guides.add(undefined, {
            orientation: HorizontalOrVertical.VERTICAL,
            location: rightGuide
        });
    }

    // Set margins
    setPageMargins(page, divisions, gridHeight, gridWidth,
        leadingUnit, vertLeadingUnit, marginSetup);
}

/**
 * Set page margins based on selected setup
 */
function setPageMargins(page, divisions, gridHeight, gridWidth,
    leadingUnit, vertLeadingUnit, marginSetup) {
    if (marginSetup === "Van de Graaf canon") {
        if (divisions <= 4) {
            page.marginPreferences.properties = {
                top: 0,
                left: 0,
                right: 0,
                bottom: 0
            };
        } else {
            page.marginPreferences.properties = {
                top: gridHeight + leadingUnit,
                left: gridWidth + vertLeadingUnit,
                right: (gridWidth + vertLeadingUnit) * 2,
                bottom: (gridHeight + leadingUnit) * 2
            };
        }
    } else {
        // One grid unit for all sides
        page.marginPreferences.properties = {
            top: gridHeight + leadingUnit,
            left: gridWidth + vertLeadingUnit,
            right: gridWidth + vertLeadingUnit,
            bottom: gridHeight + leadingUnit
        };
    }
}

/**
 * Apply master spread to all pages
 */
function applyMasterToPages(doc, masterSpread) {
    // Apply to all existing pages
    for (var i = 0; i < doc.pages.length; i++) {
        doc.pages.item(i).appliedMaster = masterSpread;
    }
}

/**
 * Set up baseline grid
 */
function setupBaselineGrid(doc, leading) {
    // Use half the leading for finer grid control
    var baselineGrid = leading / 2;

    doc.gridPreferences.baselineStart = 0;
    doc.gridPreferences.baselineDivision = baselineGrid;
    doc.gridPreferences.baselineGridShown = true;
}

/**
 * Create paragraph styles based on grid system
 */
function createParagraphStyles(doc, pageWidth, gridDivisions, leading, ratio, marginSetup) {
    var gridWidth = pageWidth / gridDivisions;
    var vertLeading = leading / ratio;
    var vertLeadingUnit = vertLeading / gridDivisions;

    // Calculate margins based on setup
    var leftMargin, rightMargin;

    if (marginSetup === "Van de Graaf canon") {
        leftMargin = gridWidth + vertLeadingUnit;
        rightMargin = (gridWidth + vertLeadingUnit) * 2;
    } else {
        // One grid unit
        leftMargin = gridWidth + vertLeadingUnit;
        rightMargin = gridWidth + vertLeadingUnit;
    }

    // Calculate text width
    var textWidth = pageWidth - leftMargin - rightMargin;

    // Calculate body text size: textWidth / 30, rounded to whole number
    var bodySize = Math.round(textWidth / 30);

    // Calculate other sizes based on ratio, rounded to whole numbers
    var subheadSize = Math.round(bodySize * ratio);
    var headerSize = Math.round(subheadSize * ratio);
    var captionSize = Math.round(bodySize / ratio);
    var noteSize = Math.round(bodySize / ratio);  // Same as caption
    var folioSize = Math.round(noteSize / ratio);

    // Baseline grid is half the leading for finer control
    var baselineGrid = leading / 2;

    // Helper function to find appropriate leading (multiple of half baseline grid)
    function calculateLeading(textSize, baseGrid) {
        // Leading must be larger than text size
        // Find smallest multiple of base grid that's larger than text size
        var multiplier = Math.ceil(textSize / baseGrid);

        // Make sure it's at least 1
        if (multiplier < 1) multiplier = 1;

        return baseGrid * multiplier;
    }

    // Calculate leading for each style
    var bodyLeading = calculateLeading(bodySize, baselineGrid);
    var subheadLeading = calculateLeading(subheadSize, baselineGrid);
    var headerLeading = calculateLeading(headerSize, baselineGrid);
    var captionLeading = calculateLeading(captionSize, baselineGrid);
    var noteLeading = calculateLeading(noteSize, baselineGrid);
    var folioLeading = calculateLeading(folioSize, baselineGrid);

    // Get or create all styles
    var styles = {
        "Body": { size: bodySize, leading: bodyLeading },
        "Subhead": { size: subheadSize, leading: subheadLeading },
        "Header": { size: headerSize, leading: headerLeading },
        "Caption": { size: captionSize, leading: captionLeading },
        "Notes": { size: noteSize, leading: noteLeading },
        "Folio": { size: folioSize, leading: folioLeading }
    };

    // Create or update each style
    for (var styleName in styles) {
        if (styles.hasOwnProperty(styleName)) {
            var styleConfig = styles[styleName];
            var style = getOrCreateStyle(doc, styleName);

            // Set size and leading
            style.pointSize = styleConfig.size;
            style.leading = styleConfig.leading;

            // Align to baseline grid
            style.alignToBaseline = true;

            // Try to set font with fallback
            setStyleFont(style);

            // Body-specific settings
            if (styleName === "Body") {
                style.justification = Justification.LEFT_ALIGN;
                style.hyphenation = false;
                style.spaceAfter = leading;
            }
        }
    }
}

/**
 * Get existing style or create new one
 */
function getOrCreateStyle(doc, styleName) {
    var style;
    var styleExists = false;

    // Check if style already exists
    for (var i = 0; i < doc.paragraphStyles.length; i++) {
        if (doc.paragraphStyles.item(i).name === styleName) {
            style = doc.paragraphStyles.item(i);
            styleExists = true;
            break;
        }
    }

    // If doesn't exist, create it
    if (!styleExists) {
        style = doc.paragraphStyles.add();
        style.name = styleName;
    }

    return style;
}

/**
 * Set font for style with fallback
 */
function setStyleFont(style) {
    try {
        var minionPro = app.fonts.item("Minion Pro\tRegular");
        if (minionPro.isValid) {
            style.appliedFont = minionPro;
        } else {
            // Use first available font as fallback
            style.appliedFont = app.fonts.item(0);
        }
    } catch (e) {
        // If all else fails, use first available font
        style.appliedFont = app.fonts.item(0);
    }
}

/**
 * Set document bleed (optional)
 */
function setBleed(doc, bleedSize) {
    doc.documentPreferences.documentBleedBottomOffset = bleedSize;
    doc.documentPreferences.documentBleedTopOffset = bleedSize;
    doc.documentPreferences.documentBleedInsideOrLeftOffset = bleedSize;
    doc.documentPreferences.documentBleedOutsideOrRightOffset = bleedSize;
}
