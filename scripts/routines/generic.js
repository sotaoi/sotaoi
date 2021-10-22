const getTimestamp = () => {
  return new Date().toISOString().substr(0, 19).replace('T', ' ');
};

module.exports = { getTimestamp };
