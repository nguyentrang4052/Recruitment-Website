const formatDate = (iso) => {
    if (!iso) return "";
    const [y, m, d] = iso.split("-");
    return `${d}-${m}-${y}`;
};

const formatDateTime = (date) => {
 
  const validDate = new Date(date);
  if (isNaN(validDate)) {
    console.error("Đối tượng Date không hợp lệ.");
  }

  return validDate.toLocaleDateString('vi-VN');
};



export { formatDate, formatDateTime};


