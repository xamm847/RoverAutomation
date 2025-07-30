import "@applitools/eyes-cypress"
import './commands'

  module.exports = (on, config) => {
    require('@applitools/eyes-cypress')(on);
  };
  