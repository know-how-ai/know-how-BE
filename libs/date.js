const getTodayDate = () => {
  const today = new Date();
  const todayObject = {
    todayYear: String(today.getFullYear()),
    todayMonth: String(today.getMonth() + 1),
    todayDate: String(today.getDate()),
  };

  if (todayObject.todayDate.length === 1) {
    todayObject.todayDate = "0" + todayObject.todayDate;
  }

  if (todayObject.todayMonth.length === 1) {
    todayObject.todayMonth = "0" + todayObject.todayMonth;
  }

  return `${todayObject.todayYear}-${todayObject.todayMonth}-${todayObject.todayDate}`;
};

module.exports = {
  getTodayDate,
};
