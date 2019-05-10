//set document unit to points
var myDocument = app.activeDocument;
with (myDocument.viewPreferences) {
 horizontalMeasurementUnits = MeasurementUnits.points;
 verticalMeasurementUnits = MeasurementUnits.points;
}

//apply to open doc or start new one
 var doc;
  if(app.documents.length > 0){
      doc = app.activeDocument;
      }else{
      doc = app.documents.add();
  }

  //get user inputs for grid and leading
  var grid=prompt("grid unit","","add number here");
  var leading=prompt("baseline grid leading", "", "leading goes here")

  //set vars for measuring the page and resizing
  var ph = myDocument.documentPreferences.pageHeight;
  var pw = myDocument.documentPreferences.pageWidth;
  var ratio = ph/pw;
  var rh1 = myDocument.documentPreferences.pageHeight/grid;
  var rw1 = myDocument.documentPreferences.pageWidth/grid;
  var leadingunit = leading/grid;
  var vertLeading = leading/ratio;
  var vertLeadingUnit = vertLeading/grid;

  //get first location of grid unit location
  var gridArray = []



     //THIS IS ALL FOR SETTING UP THE PAGE
     //
     //
     //
      // This is for a grid system with gutters
      // first run Y
      for (var i = 1; i < grid; i++) {
        var gridline1 = i * rh1;
        var down1 = leadingunit * i;
        var up1 = leadingunit * (grid - i);
        var guide1 = gridline1 - up1;
        var md1 = gridline1 + down1;
        gridArray.push(guide1)
      }


      // This is all of the stuff you need to figure out the corrected page size for a baseline
      // alert ("First grid line goes here " + gridArray[0])
      var totalModualHeight = gridArray[0] * grid
      // alert ("Total modular height is " + totalModualHeight)
      var leadingintoModualHeight = gridArray[0] / leading
      // alert ("this the modula height divided by leading " + leadingintoModualHeight)
      var lmhRounded = Math.round(leadingintoModualHeight)
      // alert ("This is the new rounded number of times leading needs to fit: " + lmhRounded)

     var newLeadingSpace = leading * (grid - 1)
     var newModalSpace = (lmhRounded * leading) * grid
     alert ("This is the ideal new page height " + (newModalSpace + newLeadingSpace))
     var newPH = newModalSpace + newLeadingSpace
     var newPW = newPH / ratio

       // change page size to fit leading
       // This is not working properly. I need to think harder about that
       myDocument.documentPreferences.pageWidth = newPW
       myDocument.documentPreferences.pageHeight = newPH

      alert("This is the current page height = " + myDocument.documentPreferences.pageHeight)


      //
      //
      //
      //


      //part 2
      var ph = myDocument.documentPreferences.pageHeight;
      var pw = myDocument.documentPreferences.pageWidth;
      var ratio = ph/pw;
      var rh = myDocument.documentPreferences.pageHeight/grid;
      var rw = myDocument.documentPreferences.pageWidth/grid;
      var leadingunit = leading/grid;
      var vertLeading = leading/ratio;
      var vertLeadingUnit = vertLeading/grid;
      // // first run Y
      for (var i = 1; i < grid; i++) {
        var gridline = i * rh;
        var down = leadingunit * i;
        var up = leadingunit * (grid - i);
        var mu = gridline - up;
        var md = gridline + down;
        gridArray.push(mu)

        with(myDocument.pages.item(0)){
        guides.add(undefined, {orientation:HorizontalOrVertical.horizontal,
        location:(mu)});

        guides.add(undefined, {orientation:HorizontalOrVertical.horizontal,
        location:(md)});
        }
      }
      //
      // // Then run x
      for (var i = 1; i < grid; i++) {
        var gridline = i * rw;
        var down = vertLeadingUnit * i;
        var up = vertLeadingUnit * (grid - i);
        var mu = gridline - up;
        var md = gridline + down;

        with(myDocument.pages.item(0)){
        guides.add(undefined, {orientation:HorizontalOrVertical.vertical,
        location:(mu)});

        guides.add(undefined, {orientation:HorizontalOrVertical.vertical,
        location:(md)});
        }
      }

      // set the page size and bleed box
          doc.documentPreferences.properties = {
              documentBleedBottomOffset : 3,
              documentBleedTopOffset : 3,
              documentBleedInsideOrLeftOffset : 3,
              documentBleedOutsideOrRightOffset : 3
          };

          // set margins
          var page = doc.pages.item(0);
          page.marginPreferences.properties = {
              top : rh + leadingunit,
              left: rw + vertLeadingUnit,
              right:(rw + vertLeadingUnit) * 2,
              bottom: (rh + leadingunit) * 2
            };

          // baseline grid settings
          // This is working, but need to develop the page resize to fit leading steps
           with(myDocument.gridPreferences){
           baselineStart = 0;
           baselineDivision = leading;
           baselineShown = true;
           }
