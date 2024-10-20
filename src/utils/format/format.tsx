export const formatPrice = (num: number) =>
  num.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

export function removeAccents(str: string): string {
  if (!str) {
    return ""; // Trả về chuỗi rỗng nếu `str` là `undefined` hoặc `null`
  }

  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}


export function formatDate(timestamp: number): string {
  const date = new Date(timestamp);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Ensure two digits
  const day = String(date.getDate()).padStart(2, '0');

  return `${day}-${month}-${year}`;
}



export const convertDateFormat = (dateString: string) => {
  let day, month, year;

  // Check for both '-' and '/' as delimiters
  if (dateString.includes('-')) {
    [day, month, year] = dateString.split('-');
  } else if (dateString.includes('/')) {
    [day, month, year] = dateString.split('/');
  } else {
    return ''; // Return empty if the format is unknown
  }

  // Ensure the format is correct
  if (day && month && year) {
    return `${year}-${month}-${day}`; // Returns YYYY-MM-DD
  }

  return ''; // Return empty if conversion fails
};
