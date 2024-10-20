export enum AccountLevelType {
  DEV= 1,
  DEV_SELLER = 2,
  SELLER = 3,
  SALE_MAN = 4,
  USER = 5,
}

// Bản đồ các giá trị Enum sang tên tiếng Việt
export const AccountLevelLabels = {
  DEV: 'Developer',
  DEV_SELLER: 'Developer & SELLER',
  SELLER: 'Người bán',
  SALE_MAN: 'Nhân viên bán hàng',
  USER: 'Khách hàng',
};

// Chuyển đổi Enum sang key-value có tên tiếng Việt
export const mapAccountType = Object.keys(AccountLevelType)
  .filter((key) => isNaN(+key))
  .map((key) => ({
    key: AccountLevelLabels[key as keyof typeof AccountLevelLabels], // Lấy tên tiếng Việt
    value: AccountLevelType[key as keyof typeof AccountLevelType], // Giữ lại giá trị
  }));

