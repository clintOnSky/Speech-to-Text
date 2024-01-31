export const getDuration = (timer: number) => {
  // Convert seconds to hours
  const hours = timer / 1000 / 60 / 60;

  const floorHours = Math.floor(hours);
  const displayHours = hours < 10 ? `0${floorHours}` : floorHours;

  // Get minutes from the difference between floored hours and hours with decimal
  const minutes = (hours - floorHours) * 60;

  const floorMinutes = Math.floor(minutes);
  const displayMinutes = minutes < 10 ? `0${floorMinutes}` : floorMinutes;

  // Get seconds from the difference between floored minutes and minutes with decimal
  const seconds = Math.round((minutes - floorMinutes) * 60);

  const displaySeconds = seconds < 10 ? `0${seconds}` : seconds;

  return floorHours
    ? `${displayHours}:${displayMinutes}:${displaySeconds}`
    : `${displayMinutes}:${displaySeconds}`;
};

export function getDateTime(createdAt: string) {
  const dt = new Date(createdAt);
  const day = String(dt.getDate()).padStart(2, "0");
  const month = String(dt.getMonth() + 1).padStart(2, "0");
  const year = String(dt.getFullYear());

  const hour = String(dt.getHours()).padStart(2, "0");
  const minute = String(dt.getMinutes()).padStart(2, "0");

  return {
    date: `${day}-${month}-${year}`,
    time: `${hour}:${minute}`,
  };
}
