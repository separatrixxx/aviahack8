export const getDateKey = (timestamp: string) => {
    const [date, time] = timestamp.split(' ');
    const [day, month, year] = date.split('-');

    return `${year}-${month}-${day} ${time.slice(0, 5)}`;
};
