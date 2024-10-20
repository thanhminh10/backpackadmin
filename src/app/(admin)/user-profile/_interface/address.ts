export interface Province {
  _id: string;
  code: string;
  name: string;
}

export interface District {
  _id: string;
  code: string;
  name: string;
  provinceCode: string;
}

export interface Ward {
  _id: string;
  code: string;
  name: string;
  districtCode: string;
}

export interface Address {
  street: string;
  province: Province;
  district: District;
  ward: Ward;
}

export interface ProvinceResponse {
  provinces: Province[];
}

export interface DistrictResponse {
  districts: District[];
}

export interface WardResponse {
  wards: Ward[];
}
