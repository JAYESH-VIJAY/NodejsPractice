// this is a higher order function, because here a function is returning another function 
module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
