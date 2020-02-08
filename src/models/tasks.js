const initialData = [
  {
    id: "0001",
    title: "Сделать React To Do",
    description: "Использовать redux, rxjs",
    createdBy: Date.now()
  },
  {
    id: "0002",
    title: "Посмотреть лекцию 2 по Angular 8",
    description: "Написать что-нибудь на основе полученных знаний из лекции",
    createdBy: Date.now()
  }
];

const TaskList = function() {
  this.data = initialData;

  this.addTask = function(taskData) {
    this.data.push(taskData);
  };
};

module.exports = TaskList;
