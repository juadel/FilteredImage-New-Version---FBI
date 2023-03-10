import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/utils.js';



  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

    /**************************************************************************** */

  //! END @TODO1
  app.get("/filteredimage", async (req, res) => {
    let {image_url} = req.query;
    // Validating Img URL query.
    console.log(image_url)
   if (!image_url){
     return res.status(400).send('Image URL is required');
   }
   console.log("URL is Valid")
    let filteredImage;
   //trying to handle Errors using and Try/Catch
    try{      
      filteredImage = await filterImageFromURL(image_url); // to filter the image
      console.log(filteredImage);
      if (filteredImage==="error"){ //checking if there is an error in filterImageFromURL
        res.status(415).send('URL is not an Image');
      }
      else{
      res.status(200).sendFile(filteredImage, () =>{deleteLocalFiles([filteredImage])}); // returning the filtered image and to delete old files on server
      }
    }catch(e){
      console.error(e.message);
      return res.status(415); // to control errors - 
    }
    console.log('Process completed');
});
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
