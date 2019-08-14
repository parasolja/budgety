
//BUDGET CONTROLLER
var budgetController = (function() {

    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };


    var data = {
      allItems: {
          exp: [],
          inc: []
      },
      totals: {
        exp: 0,
        inc: 0
      }

  };

  return {                  //description and value
    addItem: function(type, des, val) {
        var newItem, ID;

        //Create new id
        if(data.allItems[type].lenght > 0) {
            ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
        } else {
            ID = 0;
        }

        //create a new item based on 'inc' or 'exp' type
        if (type === 'exp') {
            newItem = new Expense(ID, des, val);
        }  else if (type === 'inc') {
            newItem = new Income(ID, des, val);
        }

        //push it intp the data structure
        data.allItems[type].push(newItem);

        //return new element
        return newItem;

    }
  };


})();



//UI CONTROLLER
var UIController = (function() {

    var DOMstrings = {
      inputType: '.add__type',
      inputDescription: '.add__description',
      inputValue: '.add__value',
      inputBtn: '.add__btn',
      incomeContainer: '.income__list',
      expensesContainer: '.expenses__list'
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

        addListItem: function(obj, type) {
            var html, newHTML, element;
            //Crete HTML string wirh splace holder txt

            if (type === 'inc') {
                element = DOMstrings.incomeContainer;

                html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
                element = DOMstrings.expensesContainer;

                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            //Replace the placeholder text with some actual data
            newHTML = html.replace('%id%', obj.id);
            newHTML = newHTML.replace('%description%', obj.description);
            newHTML = newHTML.replace('%value%', obj.value);

            //Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHTML);


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
      var input, newItem;

      // 1. Get the field input data
      input = UICtrl.getInput();

      // 2. Add the item to the budget controller
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);

      // 3. Add the item to the UI
      UICtrl.addListItem(newItem, input.type);

      // 4. Calculate the budget__title

      // 5. Display the budget

  };

  return {
    init: function () {
        setupEventListeners();
    }
  };


})(budgetController, UIController);


controller.init();
