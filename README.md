# Modular grid maker script for InDesign

### This tool generates modular and baseline grids for InDesign documents based on page size and a few parameters.

### Installation
1. Download the “Modular-grid-maker-working.js” script
2. Open your Scripts panel in InDesign (Windows > utilities > scripts)
3. Right click on “User” and click “Reveal in Finder.”
4. Add “Modular-grid-maker-working.js” to the folder
5. InDesign should now display the script in the panel

### Use
1. Start a new, or open an existing, InDesign file (works best for facing pages currently)
2. Double click the Modular-grid-maker-working.js script
3. You will be prompted with a user input window asking for a grid number and leading size. This number is used to create both horizontal and vertical guides as well as the gutters (vertical and horizontal)
4. The script resizes your document to create a page size that holds both your modular grid and your baseline grid together and create the modular grid, baseline grid, gutters, and margins. (Note if your Grid number is 4 or fewer gutters are set to zero as the Van der Graff margins do not work.)

###  Results
You should get a page ratio based modular grid with horizontal gutters set to your leading and vertical gutters in proportion to your page shape. The margins should be set up with a Van der Graff cannon structure.
![Screen Shot 2019-06-27 at 10 41 45 AM](https://user-images.githubusercontent.com/6069803/60275735-5d6fcd00-98c8-11e9-8965-7fcf0bbff8ac.png)

View > Grids & Guides > Show Baseline Grid
The document now also has a matching baseline grid that fits your page height and is in rhythm with your modular grid system.
![Screen Shot 2019-06-27 at 10 41 55 AM](https://user-images.githubusercontent.com/6069803/60276528-cc99f100-98c9-11e9-8a34-a749eef157a3.png)


### Known Issues
1. If prompts are left blank the script crashes
2. The user needs to know the leading they want before they run the script
3. Currently only uses Van der Graff cannon margins
4. Works, but gives an error if using non-facing pages

### Roadmap
1. Paragraph styles with type sizes based on page shape ratio
2. The new document starts with a ratio input (or a range of common shape suggestions), then askes for height or width maximum to create a full page layout
3. Have a more robust inputs panel with all of the inputs in one place, be able to preview the results
