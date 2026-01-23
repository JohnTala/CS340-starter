const invModel=require("../models/inventory-model");
const utilities=require("../utilities");

const invCont={};

/*
  Build inventory by classification view
  */
 invCont.buildByClassificationId= async function(res,req,next){
    const classification_id=req.params.classificationId
    const data=await invModel.getClassifications(classification_id)
    const grid= await utilities.buildByClassificationId(data)
    let nav=await utilities.getNav()
    const className=data[0].classification_name
    res.render("./inventory/classification",{
        title:className + "vehicles",
        nav,
        grid,
    })

 }

 module.exports=invCont;