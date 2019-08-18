
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

  return {                    //description and value
      addItem: function(type, des, val) {
          var newItem, ID;

          //[1 2 3 4 5], next ID = 6
          //[1 2 4 6 8], next ID = 9
          // ID = last ID + 1

          // Create new ID
          if (data.allItems[type].length > 0) {
              ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
          } else {
              ID = 0;
          }

          // Create new item based on 'inc' or 'exp' type
          if (type === 'exp') {
              newItem = new Expense(ID, des, val);
          } else if (type === 'inc') {
              newItem = new Income(ID, des, val);
          }

          // Push it into our data structure
          data.allItems[type].push(newItem);

          // Return the new element
          return newItem;
      },

      calculateBudget: function() {

          // calculate total income and expenses
          calculateTotal('exp');
          calculateTotal('inc');

          // Calculate the budget: income - expenses
          data.budget = data.totals.inc - data.totals.exp;

          // calculate the percentage of income that we spent
          if (data.totals.inc > 0) {
              data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
          } else {
              data.percentage = -1;
          }

          // Expense = 100 and income 300, spent 33.333% = 100/300 = 0.3333 * 100
      },

      calculatePercentages: function() {

          /*
          a=20
          b=10
          c=40
          income = 100
          a=20/100=20%
          b=10/100=10%
          c=40/100=40%
          */

          data.allItems.exp.forEach(function(cur) {
             cur.calcPercentage(data.totals.inc);
          });
      },

      getBudget: function() {
          return {
              budget: data.budget,
              totalInc: data.totals.inc,
              totalExp: data.totals.exp,
              percentage: data.percentage
          };
      },

      testing: function() {
          console.log(data);
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
      expensesContainer: '.expenses__list',
      budgetLabel: '.budget__value',
      incomeLabel: '.budget__income--value',
      expensesLabel: '.budget__expenses--value',
      persentageLabel: '.budget__expenses--percentage'
    };

  //Method for returning all the 3 inputs for the UI
    return {
        getInput: function() {
           return {
               type: document.querySelector(DOMstrings.inputType).value, //will be either inc or exp
               description: document.querySelector(DOMstrings.inputDescription).value,
               value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
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

        clearFields: function() {
            var fields, fieldsArr;

            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);

            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(function(current, index, array) {
                current.value = "";
            });

            fieldsArr[0].focus();
        },

        displayBudget: function(obj) {

            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExp;

            if(obj.percentage > 0) {
              document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
              document.querySelector(DOMstrings.persentageLabel).textContent = '---';
            }

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

    var updateBudget = function() {

      // 1. Calculate the budget
        budgetCtrl.calculateBudget();
      // 2. Return the budget
        var budget = budgetCtrl.getBudget();
      // 3. Display the budget on the UI controller
        UICtrl.display(budget);
    };




    var ctrlAddItem = function () {
      var input, newItem;

      // 1. Get the field input data
      input = UICtrl.getInput();

      if (input.description !== "" && ! isNaN(input.value) && input.value > 0 ) {
          // 2. Add the item to the budget controller
          newItem = budgetCtrl.addItem(input.type, input.description, input.value);

          // 3. Add the item to the UI
          UICtrl.addListItem(newItem, input.type);

          // 4. Clear the fields
          UICtrl.clearFields();

          // 5. Calculate and update budget
          updateBudget();
        }
  };


  return {
    init: function () {
        UICtrl.displayBudget({
            budget: 0,
            totalInc: 0,
            totalExp: 0,
            percentage: -1
        });
        setupEventListeners();

    }
  };


})(budgetController, UIController);


controller.init();
