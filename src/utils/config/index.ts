export let appConfig = {
  uri: process.env.NEXT_PUBLIC_URI ?? "",
  urlImg: process.env.NEXT_PUBLIC_URL_IMG ?? "",
  authToken: process.env.NEXT_PUBLIC_AUTH_TOKEN ?? "",
};



export function configImg(url: string | undefined, appConfig: { urlImg: string }): string {
  if (!url) return appConfig.urlImg; // Nếu không có URL, trả về giá trị mặc định


  // Loại bỏ tên miền cũ và chỉ giữ phần từ '/uploads' trở đi
  const cleanedUrl = url.replace(/^.*\/uploads/, '/uploads');


  // Kiểm tra xem URL có bắt đầu với appConfig.urlImg hay không
  if (cleanedUrl.startsWith(appConfig.urlImg)) {
    return cleanedUrl;
  }

  // Nếu URL không chứa appConfig.urlImg, thêm vào đầu URL
  return `${appConfig.urlImg}${cleanedUrl}`;
}

