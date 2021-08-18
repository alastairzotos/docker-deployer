const addZero = (value: number) => value < 10 ? `0${value}` : `${value}`;

export const formatDate = (date: Date) =>
  `${date.getFullYear()}-${addZero(date.getMonth() + 1)}-${addZero(date.getDate())}`;

export const formatTime = (date: Date) =>
  `${addZero(date.getHours())}:${addZero(date.getMinutes())}:${addZero(date.getSeconds())}`;

export const formatDateTime = (date: Date) => 
  `${formatDate(date)} ${formatTime(date)}`;

export const capitalise = (str: string) => str[0].toLocaleUpperCase() + str.substr(1).toLocaleLowerCase();
