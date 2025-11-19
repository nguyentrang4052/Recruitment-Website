export const NAVIGATE_MAP = {
  'Tất cả việc làm': '/dashboard',
  'Công ty': '/companies',

  // 'Tất cả việc làm-Theo kỹ năng': '/jobs/skills',
  // 'Tất cả việc làm-Theo cấp bậc': '/jobs/level',
  // 'Tất cả việc làm-Theo địa điểm': '/jobs/location',
  // 'Tất cả việc làm-Theo vị trí': '/jobs/position',

  'Công ty-Giới thiệu công ty': '/companies',
  'Công ty-Đánh giá công ty': '/companies/reviews',
};

export const goOrReload = (path, navigate) => {
  if (window.location.pathname === path) {
    window.location.reload();   // reload thật
  } else {
    navigate(path);             // điều hướng SPA
  }
};