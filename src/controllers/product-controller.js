function pageinatedResults(model) {
    return async(req,res,next) =>{
     const {page, limit} = req.query;
   try {
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const results = {}
    const count = await model.countDocuments();
    const countPage = Math.ceil(count/limit);
    results.countPage = countPage;
    results.count = count;
    if(endIndex < count) {
      results.next = {
        page: page + 1,
        limit: limit
      }
    }
    if(startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit: limit
      }
    }
    results.results = await model.find().limit(parseInt(limit)).skip(startIndex).exec();
    res.pageinatedResults = results;
    return res.status(200).json({
     results
     });

   } catch(eroor) {
    return next(error);
   }  
    }
  }
  
module.exports = {
    pageinatedResults
};
