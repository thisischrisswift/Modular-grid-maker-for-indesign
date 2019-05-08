This is a first attempt at making a set of tools for indesign that use ratios as a base for starting all page layout project (or at least a lot of them).

Currently indesign asks what size object you want then adds a series of default (and therefore arbitrary) settings to page. The margins are 0.5” all around, type size is 12/14.4, baseline grid is based on something (I am not sure what actually). These defaults seem like a bad place to start (especially if you are new to design).

This script creates margins, a modular grid, in ratio margins, and a baseline grid based on the shape of the page and user inputs for grid and leading. Currently it is only building a van der graff based layout (which is old, and maybe boring, and historically silly?) and is best suited to specific uses like maybe a long form essay or book.


Current version
Sets document to points
Creates a new doc if not being applied to an open file
Prompts user for a grid number to create a modular grid (eg 8x8, 12x12 etc…)
Prompts the user for a leading number (to create the baseline grid)
…
