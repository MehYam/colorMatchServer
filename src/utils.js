class Utils {
   static get gameTemplate() {
      return {
         seed: 'a seed',
         width: 3,
         height: 3,
         players: [
            {id: 0, palette: []},
            {id: 1, palette: []}
         ],
         moves: []
      };
   }
}

module.exports = Utils;