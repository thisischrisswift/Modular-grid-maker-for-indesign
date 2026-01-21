# Modular Grid Maker for InDesign

An InDesign script that generates mathematically precise modular and baseline grids based on proportional ratios, ensuring alignment between typographic leading and spatial divisions.

## Overview

This script automates the creation of modular grid systems in Adobe InDesign, calculating page dimensions and guide placements that maintain both proportional relationships and baseline grid alignment. Unlike manual grid construction, this approach ensures that horizontal leading units align precisely with vertical spatial divisions, creating a unified system for both typography and layout.

## Features

- **Proportional Ratio System**: Choose from six classic ratios (Golden Section, Root 2, Root 3, 4:3, 3:2, 16:9) or define custom proportions
- **Grid Division Control**: Specify any number of divisions to create modular units across the page
- **Baseline Grid Integration**: Automatically calculates page height to ensure baseline grid aligns with modular divisions
- **Dual Margin Systems**: 
  - Van de Graaf canon (classical book proportions)
  - Single grid unit (contemporary symmetric margins)
- **Paragraph Style Generation**: Optional creation of six hierarchical text styles sized proportionally to grid width
- **Master Spread Setup**: Generates reusable master pages with complete guide systems

## Installation

1. Download `ModularGridMaker-Complete_3.jsx`
2. Place the file in your InDesign Scripts folder:
   - **macOS**: `~/Library/Preferences/Adobe InDesign/[Version]/[Language]/Scripts/Scripts Panel/`
   - **Windows**: `C:\Users\[Username]\AppData\Roaming\Adobe\InDesign\[Version]\[Language]\Scripts\Scripts Panel\`
3. Restart InDesign or refresh the Scripts panel

## Usage

1. Open InDesign (or have a document open)
2. Open the Scripts panel (Window > Utilities > Scripts)
3. Double-click `ModularGridMaker-Complete_3.jsx`
4. Configure the dialog options:
   - **Ratio**: Select preset or enter custom value
   - **Max Height**: Maximum page height in points (script will find largest aligned dimension below this)
   - **Grid Divisions**: Number of horizontal and vertical modules
   - **Baseline Leading**: Leading value in points for baseline grid
   - **Margin Setup**: Choose Van de Graaf canon or single grid unit
   - **Create Paragraph Styles**: Optional generation of six text styles
5. Click OK

The script will:
- Calculate optimal page dimensions
- Create a named master spread
- Generate horizontal and vertical guides
- Set up baseline grid at half the leading value
- Apply margins according to selected system
- Create paragraph styles (if selected)

## How It Works

### Mathematical Foundation

The script solves a common problem in modular grid design: aligning typographic baseline grids with spatial divisions. Traditional modular grids often create tension between horizontal leading units and vertical spatial rhythms.

This script calculates page height by:
1. Determining space needed for gutters (leading × grid divisions - 1)
2. Finding available space for modules (max height - gutter space)
3. Calculating how many complete leading units fit per module
4. Setting final height to maintain alignment

This ensures that every horizontal guide position corresponds to a multiple of the baseline leading, creating a unified system where typography and spatial layout share the same underlying rhythm.

### Grid Construction

Guides are placed using a symmetric offset system:
- For each division line, guides are placed above and below
- Offset distances increase proportionally from center
- This creates nested spatial relationships within each module

Vertical guides follow the same logic, using leading scaled by the proportional ratio to maintain consistent spatial relationships in both dimensions.

### Paragraph Styles

When paragraph style generation is enabled, the script creates six styles based on the grid system:

1. **Header**: Two ratio steps above body (e.g., body × 1.618²)
2. **Subhead**: One ratio step above body (e.g., body × 1.618)
3. **Body**: Calculated as text width ÷ 30
4. **Caption**: One ratio step below body (e.g., body ÷ 1.618)
5. **Notes**: Same as caption
6. **Folio**: One ratio step below notes

All sizes are rounded to whole point values, and leading is calculated as the smallest multiple of half the baseline grid that exceeds the text size. This maintains baseline grid alignment while providing appropriate spacing for each size.

## Margin Systems

### Van de Graaf Canon
Classical book proportion system based on ninefold division:
- Inner margin: 1 unit
- Top margin: 1 unit  
- Outer margin: 2 units
- Bottom margin: 2 units

For grids with 4 or fewer divisions, margins are set to zero to maximize usable space.

### One Grid Unit
Contemporary symmetric system:
- All margins: 1 grid module + 1 leading unit

## Technical Notes

- Measurement units are set to points for precision
- Ruler origin is set to page origin for consistent measurements
- Baseline grid is set to half the leading value for finer typographic control
- The script works with existing documents or creates new ones
- Master spreads are automatically applied to all pages

## Example Configurations

**Standard Book Layout**
- Ratio: Golden Section (1.618)
- Max Height: 792 pts (11 inches)
- Grid: 9 divisions
- Leading: 12 pts
- Margins: Van de Graaf canon

**Poster Grid**
- Ratio: Root 2 (1.414)
- Max Height: 1008 pts (14 inches)
- Grid: 6 divisions
- Leading: 18 pts
- Margins: One grid unit

**Custom Academic Paper**
- Ratio: Custom (1.5)
- Max Height: 660 pts
- Grid: 12 divisions
- Leading: 11 pts
- Margins: One grid unit

## Requirements

- Adobe InDesign CS6 or later
- Basic understanding of modular grid systems
- Recommended: familiarity with master pages and paragraph styles

## Author

Christopher Swift  
Assistant Professor, Department of Art & Design  
Binghamton University (SUNY)

## License

MIT License - feel free to use, modify, and distribute as needed.

## Acknowledgments

This script emerged from research into systematic approaches to page design and the relationship between mathematical proportions and typographic rhythm. The alignment algorithm addresses a practical challenge in implementing Josef Müller-Brockmann's modular grid principles while maintaining Jan Tschichold's attention to baseline grid consistency.
