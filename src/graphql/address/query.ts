import { gql } from "@apollo/client";

export const QUERY_PROVINCE = gql(`
    query Provinces {
  provinces {
    _id
    code
    name
  }
}
`);

export const QUERY_DISTRICT = gql(`
    query Districts($provinceCode: String) {
  districts(provinceCode: $provinceCode) {
    _id
    code
    name
    provinceCode
  }
}
`);


export const QUERY_WARD = gql(`
  query Wards($districtCode: String) {
  wards(districtCode: $districtCode) {
    _id
    districtCode
    code
    name
  }
}
`);