# Modular grid maker script for InDesign

### This tool generates modular and baseline grids for InDesign documents based on page size and a few parameters.

### Installation
1. Download the “Modular-grid-maker-working.js” script
2. Open your Scripts panel (Windows > utilities > scripts)
3. Right click on “User” and click “Reveal in Finder”
4. Add “Modular-grid-maker-working.js” to the folder
5. InDesign should now display the script in the panel

### Use
1. Start a new (or open an existing) InDesign file with whatever height and width you want (margins and bleeds will be generated in the script)
2. Double click the Modular-grid-maker-working.js script
3. You will be prompted with a user input window asking for a grid number and Leading size. This number will be used to create both horizontal and vertical guides as well as the gutters (vertical and horizontal)
4. The script will then resize your document to create a page size that holds both your modular grid and your baseline grid together and create the modular grid, baseline grid, gutters, and margins.(Note if your Grid number is 4 or less gutters are set to zero as the Van der Graff margins will not work.)

### Known Issues
1. If prompts are left blank the script crashes
2. The user needs to know the leading they want before they run the script
3. Currently only uses Van der Graff cannon page shapes

### Roadmap
1. Paragraph styles with type sizes based on page shape ratio
2. New document starts with a ratio input (or a range of common shape suggestions), then askes for height or width maximum to create a full page layout
3. Have a more robust inputs panel with all of the inputs in one place, be able to preview the results
