
//BUDGET CONTROLLER
var budgetController = (function() {



})();



//UI CONTROLLER
var UIController = (function() {

    var DOMstrings = {
      inputType: '.add__type',
      inputDescription: '.add__description',
      inputValue: '.add__value',
      inputBtn: '.add__btn'
    };

  //Method for returning all the 3 inputs for the UI
    return {
        getInput: function() {
           return {
               type: document.querySelector(DOMstrings.inputType).value, //will be either inc or exp
               description: document.querySelector(DOMstrings.inputDescription).value,
               value: document.querySelector(DOMstrings.inputValue).value
            };
        },

        getDOMstrings: function() {
          return DOMstrings;
        }
    };

})();

//GLOBAL APP CONTROLLER
                          //We write it in a different way because we want to assign the main modules to
                          //the controller module, make a reference, show it that they exist
                          //We could also use the original names, but that's not a good practice. It would make
                          //a module less independent then
var controller = (function(budgetCtrl, UICtrl) {

    var setupEventListeners = function() {
        var DOM = UICtrl.getDOMstrings();

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);//a call back
        //We need to add it to a global, that's why there's no querySelector or else
        document.addEventListener('keypress', function(event) {
          if (event.keyCode === 13 || event.which === 13 ) {
          //a call
              ctrlAddItem();
          }
      });
    };



    var ctrlAddItem = function () {

      // 1. Get the field input data
      var input = UICtrl.getInput();
      console.log(input);

      // 2. Add the item to the budget controller

      // 3. Add the item to the UI

      // 4. Calculate the budget__title

      // 5. Display the budget

  };

  return {
    init: function () {
        setupEventListeners();
    }
  }


})(budgetController, UIController);
