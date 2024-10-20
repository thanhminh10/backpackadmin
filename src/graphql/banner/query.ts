import { gql } from "@apollo/client";

export const QUERY_BANNERS = gql(`
   query Banners($bannerTitle: String, $active: Boolean) {
  banners(bannerTitle: $bannerTitle, active: $active) {
    _id
    cateId
    category {
      _id
      isActive
      icon
      logo
      name
    }
    isActive
    title
    url
    imageUrl
  }
}
`);

export const QUERY_BANNER = gql(`
    query Query($bannerId: String!) {
        banner(bannerId: $bannerId) {
            _id
            title
            url
            imageUrl
            isActive
            cateId
            category {
                _id
                name
                isActive
                logo
            }
        }
    }
`);
