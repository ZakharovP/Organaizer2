import React, { useState } from 'react';

import './Calendar.css';


const monthMap = ["Январь", "Февраль", "Март",
  "Апрель", "Май", "Июнь", "Июль", "Август",
  "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];

const weekDays = ["пн", "вт", "ср", "чт", "пт", "сб", "вс"]


function Calendar() {
  const [date, setDate] = useState(new Date());
  const [tasks, setTasks] = useState({});
  const [selectedTaskDate, setSelectedTaskDate] = useState();
  const [selectedNumber, setSelectedNumber] = useState();
  const [inputText, setInputText] = useState("");

  const rows = Array(6).fill(0);
  rows.forEach((day, index) => {
    rows[index] = Array(7).fill(0);
  });

  const showDate = () => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const result = monthMap[month] + ", " + year;
    return result;
  }

  const moveMonth = (shift) => {
    setDate(new Date(date.setMonth(date.getMonth() + shift)));
    setSelectedTaskDate(null);
    setSelectedNumber(null);
    setInputText("");
  }

  const previousMonth = () => {
    moveMonth(-1);
  }

  const nextMonth = () => {
      moveMonth(1);
  }

  const getNumber = (row, day) => {
    let number = row*7 + day;

    const d = new Date(date.getFullYear(), date.getMonth(), 1);
    let offset = d.getDay();
    offset = offset === 0 ? 7 : offset;
    offset = offset - 1

    let result = -1;

    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

    if (number >= offset && number - offset < lastDay) {
      result = number - offset + 1;
    }

    return result;
  }

  const openTasks = (num) => {
    if (num === null) return;

    const year = date.getFullYear().toString();
    let month = (date.getMonth() + 1).toString();
    let day = num.toString();
    month = month.length === 1 ? '0' + month : month;
    day = day.length === 1 ? '0' + day : day;

    if (selectedNumber !== num) {
      const taskDate = year + "." + month + "." + day;
      setSelectedTaskDate(taskDate);
      if (!tasks[taskDate]) {
        setTasks({...tasks, [taskDate]: []});
      }
      setSelectedNumber(num);
    } else {
      setSelectedTaskDate(null);
      setSelectedNumber(null);
    }
  }

  const addTask = () => {
    if (!inputText) return;
    const arr = tasks[selectedTaskDate];
    arr.push({
      id: parseInt(Math.random() * 10**14),
      text: inputText,
      editing: false,
      done: false
    });
    setTasks({...tasks});
    setInputText('');
  }


  const actionTask = (taskId, action) => {
    const arr = tasks[selectedTaskDate];
    let index = -1;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].id === taskId) {
        index = i;
        break;
      }
    }
    if (index > -1) {
      if (action === "do") {
        arr[index].done = true;
      } else if (action === "editing") {
        arr[index].editing = !arr[index].editing;
      } else if (action === "remove") {
        arr.splice(index, 1);
      }

    }
    setTasks({...tasks});
  }

  const doTask = (taskId) => {
    actionTask(taskId, "do");
  }

  const toggleEditingTask = (taskId) => {
    actionTask(taskId, "editing");
  }

  const removeTask = (taskId) => {
    actionTask(taskId, "remove");
  }

  const changeTask = (taskId, event) => {
    const val = event.target.value;
    const arr = tasks[selectedTaskDate];
    let index = -1;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].id === taskId) {
        index = i;
        break;
      }
    }
    if (index > -1) {
      arr[index].text = val;
    }
    setTasks({...tasks});
  }

  const handleInputChange = (evt) => {
    const val = evt.target.value;
    setInputText(val);
  }

  const defineDayClassName = (num) => {
    let className = "";

    if (!num) {
      return "";
    }

    let day = num.toString();
    let month = (date.getMonth() + 1).toString();
    const year = date.getFullYear().toString();

    month = month.length === 1 ? '0' + month : month;
    day = day.length === 1 ? '0' + day : day;

    const taskDate = year + "." + month + "." + day;
    const taskList = tasks[taskDate];

    if (taskList && taskList.length) {
      let allDone = true;
      for (let i = 0; i < taskList.length; i++) {
        if (!taskList[i].done) {
          allDone = false;
          break;
        }
      }
      if (allDone) {
        className += " done";
      } else {
        className += " not-done";
      }
    }

    if (selectedNumber === num) {
      className += " selected";
    }

    return className;
  }

  return (
    <div className="calendar">
      <div className="header">
        <button onClick={previousMonth} className="left">&lt;</button>
        <span className="title">{showDate()}</span>
        <button onClick={nextMonth} className="right">&gt;</button>
      </div>
      <div className="body">
        {
          weekDays.map(day => {
            return (
              <span key={day} className="weekday">
                { day }
              </span>
            );
          })
        }
        {
          rows.map((row, rowIndex) => {
            return (
              <div key={rowIndex} className="row">
                {
                  row.map((day, dayIndex) => {
                    let num = getNumber(rowIndex, dayIndex);
                    num = num >=0 ? num : null;
                    return (
                      <div
                        key={dayIndex}
                        className={"cell" + defineDayClassName(num)}
                        //className={"cell" + (selectedNumber === num ? " selected" : "")}
                        onClick={openTasks.bind(null, num)}
                      >
                        {
                          num &&
                          <span>
                            { num }
                          </span>
                        }
                      </div>
                    );
                  })
                }
              </div>
            );
          })
        }
      </div>
      <div className="tasks">
        {
          selectedTaskDate && tasks[selectedTaskDate] &&
          <div>
            <div className="control">
              <input
                type="text"
                placeholder="Новое задание"
                onChange={handleInputChange}
                value={inputText}
              />
              <button onClick={addTask}>Добавить</button>
            </div>
            <div>
              {
                tasks[selectedTaskDate].map(task => {
                  return (
                    <div key={task.id} className="task">
                      {
                        task.editing ?
                        <input className="task-text" type="text" value={task.text} onChange={changeTask.bind(null, task.id)} /> :
                        <span className="task-text">
                          { task.text }
                        </span>
                      }
                      <button onClick={toggleEditingTask.bind(null, task.id)}>Изменить</button>
                      {
                        !task.done ?
                        <button onClick={doTask.bind(null, task.id)}>Сделать</button> :
                        <span className="done">Сделано</span>
                      }

                      <button onClick={removeTask.bind(null, task.id)}>Удалить</button>
                    </div>
                  );
                })
              }
            </div>
          </div>
        }
      </div>
    </div>
  )
}

export default Calendar;
