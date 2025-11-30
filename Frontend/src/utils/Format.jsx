const formatDate = (iso) => {
    if (!iso) return "";
    const [y, m, d] = iso.split("-");
    return `${d}-${m}-${y}`;
};

const formatDateTime = (date) => {
  const validDate = new Date(date);

  if (isNaN(validDate.getTime())) {
    console.error("Đối tượng Date không hợp lệ:", date);
    return "";
  }

  const day = String(validDate.getDate()).padStart(2, "0");
  const month = String(validDate.getMonth() + 1).padStart(2, "0");
  const year = validDate.getFullYear();

  const hours = String(validDate.getHours()).padStart(2, "0");
  const minutes = String(validDate.getMinutes()).padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes}`;
};




export { formatDate, formatDateTime};


