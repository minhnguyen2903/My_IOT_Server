export const getDateTime = () => {
  const today = new Date();
  const date = today.getMonth() + 1 + "-" + today.getDate();
  const time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  const dateTime = date + " " + time;
  return dateTime;
};
