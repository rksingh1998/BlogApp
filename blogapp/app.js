var express=require("express");
var mongoose=require("mongoose");
var app=express();
var bodyparser=require("body-parser");
var methodoverride=require("method-override");

//create the database for blog app
mongoose.connect("mongodb://localhost/blog");

app.use(methodoverride("_method"));

app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended:true}));

//create the database mongodb schema and model for the database
var blogschema=new mongoose.Schema({
   title:String,
   image:String,
   body:String,
   created:{type:Date,default:Date.now}
    
});


var Blog=mongoose.model("Blog",blogschema);

//to add the blog into database for testing purpose
/*Blog.create({
   title:"this is test blog",
   image:"https://www.askideas.com/media/27/English-Mastiff-Dog-Face-Closeup.jpeg",
   body:"this is blog related to the dog",
  
});*/

app.get("/",function(req,res){
   res.redirect("/blogs");
});

//blogs routes 

//index route for showing all the blogs of different users
app.get("/blogs",function(req,res){
   Blog.find({},function(err,blogs){
       if(err)
       {
           console.log("error in finding the blogs in database");
       }
       else
       {
           res.render("index",{blogs:blogs});
       }
   }) 
});
//create the route for the new blog form to be show
app.get("/blogs/new",function(req,res){
   res.render("new");
});

//create the post route for the new blog form when submitted to it
app.post("/blogs",function(req,res){
   //create the new blog from the from and redirect to the main blog form
   Blog.create(req.body.blog,function(err,newblog){
      if(err)
      {
          console.log("error in creating the new blog");
      }
      else
      {
          res.redirect("/blogs");
      }
   });
});


//the show route for the blog app
app.get("/blogs/:id",function(req,res){
  //find the blog by id and render the show template 
 Blog.findById(req.params.id,function(err,blog){
     if(err)
     {
         res.redirect("/blogs");
     }
     else{
         res.render("show",{blog:blog});
     }
 });
});

//update the show page form
app.get("/blogs/:id/edit",function(req,res){
    //find the blog by id
    Blog.findById(req.params.id,function(err,blog){
       if(err)
       {
           res.redirect("/blogs");
       }
       else
       {
             res.render("edit",{blog:blog}); 
       }
    });
 
});

//update route to handle the edit form
app.put("/blogs/:id",function(req,res){
   //find the blog by id and update it
   Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,blog){
       if(err)
       {
           res.redirect("/blogs");
       }
       else
       {
           res.redirect("/blogs/"+req.params.id);
       }
   })
});

//delete a blog from the home page using show page route
app.delete("/blogs/:id",function(req,res){
   //find the blog by id and remove it and redirect to home page of blogs
   Blog.findByIdAndRemove(req.params.id,function(err){
      if(err)
      {
          console.log("that blog in not in database");
          res.redirect("/blogs");
      }
      else
      {
          res.redirect("/blogs");
      }
   });
   
});
app.listen(process.env.PORT,process.env.IP,function(req,res){
   console.log("server is started"); 
});