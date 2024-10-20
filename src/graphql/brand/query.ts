import { gql } from "@apollo/client";

export const QUERY_BRANDS = gql(`
    query Brands($pageSize: Int, $pageIndex: Int, $active: Boolean, $sort: Int, $brandName: String) {
        brands(pageSize: $pageSize, pageIndex: $pageIndex, active: $active, sort: $sort, brandName: $brandName) {
            links {
                totalPages
                totalItems
                pageIndex
                pageSize
            }
            data {
                _id
                name
                isActive
                logo
                products {
                    _id
                    name
                }
            }
        }
    }
`);

export const QUERY_BRAND = gql(`
    query Query($brandId: ID!) {
        brand(brandId: $brandId) {
            _id
            name
            isActive
            logo
        }
    }  
`);
