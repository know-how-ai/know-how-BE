const getToday = () => {
  const today = new Date();
  const todayObject = {
    todayYear: string(today.getFullYear)(),
    todayMonth: string(today.getMonth)(),
    todayDate: string(today.getDate)(),
  };

  if (todayObject.todayDate.length === 1) {
    todayObject.todayDate = "0" + todayObject.todayDate;
  }

  if (todayObject.todayMonth.length === 1) {
    todayObject.todayMonth = "0" + todayObject.todayMonth;
  }

  return todayObject.todayYear + todayObject.todayMonth + todayObject.todayDate;
};

module.exports = {
  getToday,
};
