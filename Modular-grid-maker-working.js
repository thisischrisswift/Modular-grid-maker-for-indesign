var myDocument = app.activeDocument;
with (myDocument.viewPreferences) {
  horizontalMeasurementUnits = MeasurementUnits.points;
  verticalMeasurementUnits = MeasurementUnits.points;
}
myDocument.viewPreferences.rulerOrigin = RulerOrigin.pageOrigin;


//apply to open doc or start new one
var doc;
if(app.documents.length > 0){
  doc = app.activeDocument;
}else{
  doc = app.documents.add();
}
//get user inputs for grid and leading
// var grid=prompt("grid unit","","add number here");
// var leading=prompt("baseline grid leading", "", "leading goes here")
var myDialog = app.dialogs.add({name:"Modular and baseline grid generator",
canCancel:true});
with(myDialog){
  //Add a dialog column.
  with(dialogColumns.add()){
    //Grid number
    //Create another border panel.
    with(borderPanels.add()){
      with(dialogColumns.add()){
        staticTexts.add({staticLabel:"Modular grid divisions:"});
      }
      with(dialogColumns.add()){
        //Create a number entry field. Note that this field uses editValue
        //rather than editText (as a textEditBox would).
        var myGridSizeField = integerEditboxes.add({editValue:9});
      }
    }
    //Leading
    //Create another border panel.
    with(borderPanels.add()){
      with(dialogColumns.add()){
        staticTexts.add({staticLabel:"Baseline grid leading:"});
      }
      with(dialogColumns.add()){
        //Create a number entry field. Note that this field uses editValue
        //rather than editText (as a textEditBox would).
        var myLeadingSizeField = measurementEditboxes.add({editValue:12});
      }
    }
  }
}
//Display the dialog box.
if(myDialog.show() == true){
  var grid, leading;
  //If the user didn't click the Cancel button,
  //then get the values back from the dialog box.
  //Get the point size from the Grid and Leading size field.
  grid = myGridSizeField.editValue;
  leading = myLeadingSizeField.editValue;
  myDialog.destroy();
  //myMakeDocument(myString, myPointSize, myParagraphAlignment,
  //  myVerticalJustification);
  }
  else{
    myDialog.destroy()
  }


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
var newPH = newModalSpace + newLeadingSpace
var newPW = newPH / ratio

// change page size to fit leading
// This is not working properly. I need to think harder about that
myDocument.documentPreferences.pageWidth = newPW
myDocument.documentPreferences.pageHeight = newPH

alert("the page size has been changed to align the modular and baseline grid values ")


//
//
//
//

var master_spread1_pg1 = doc.masterSpreads.item(0).pages.item(0);// RECTO
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

  with(myDocument.masterSpreads.item(0)){
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

      with(myDocument.masterSpreads.item(1)){
        with(master_spread1_pg1){
          guides.add(undefined, {orientation:HorizontalOrVertical.vertical,
            location:(mu)});

            guides.add(undefined, {orientation:HorizontalOrVertical.vertical,
              location:(md)});
            }
          }
        }
        if (grid <= 4) {
          alert("Your gutter are set to zero")
          master_spread1_pg1.marginPreferences.properties = {
            top : 0,
            left: 0,
            right: 0,
            bottom: 0
          };
        } else {
          master_spread1_pg1.marginPreferences.properties = {
            top : rh + leadingunit,
            left: rw + vertLeadingUnit,
            right:(rw + vertLeadingUnit) * 2,
            bottom: (rh + leadingunit) * 2
          };
        }

        var master_spread1_pg2 = doc.masterSpreads.item(0).pages.item(1);// VERSO
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

          with(myDocument.masterSpreads.item(0)){
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

              with(myDocument.masterSpreads.item(1)){
                with(master_spread1_pg2){
                  guides.add(undefined, {orientation:HorizontalOrVertical.vertical,
                    location:(mu)});

                    guides.add(undefined, {orientation:HorizontalOrVertical.vertical,
                      location:(md)});
                    }
                  }
                }
                if (grid <= 4) {
                  alert("Your gutter are set to zero")
                  master_spread1_pg2.marginPreferences.properties = {
                    top : 0,
                    left: 0,
                    right: 0,
                    bottom: 0
                  };
                } else {
                  master_spread1_pg2.marginPreferences.properties = {
                    top : rh + leadingunit,
                    left: rw + vertLeadingUnit,
                    right:(rw + vertLeadingUnit) * 2,
                    bottom: (rh + leadingunit) * 2
                  };
                }

                // master_spread1_pg2.marginPreferences.properties = {
                //   top : rh + leadingunit,
                //   left: rw + vertLeadingUnit,
                //   right:(rw + vertLeadingUnit) * 2,
                //   bottom: (rh + leadingunit) * 2
                // };


                // baseline grid settings
                // This is working, but need to develop the page resize to fit leading steps
                with(myDocument.gridPreferences){
                  baselineStart = 0;
                  baselineDivision = leading;
                  baselineShown = true;
                }


                // set the page size and bleed box
                doc.documentPreferences.properties = {
                  documentBleedBottomOffset : 3,
                  documentBleedTopOffset : 3,
                  documentBleedInsideOrLeftOffset : 3,
                  documentBleedOutsideOrRightOffset : 3
                };
