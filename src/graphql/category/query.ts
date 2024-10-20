import { gql } from "@apollo/client";

export const QUERY_CATEGORIES = gql(`
    query Query($pageSize: Int, $pageIndex: Int, $cateName: String, $active: Boolean, $sort: Int) {
        categories(pageSize: $pageSize, pageIndex: $pageIndex, cateName: $cateName, active: $active, sort: $sort) {
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
                icon
                products {
                    _id
                    name
                }
            }
        }
    }
`);

export const QUERY_CATEGORY = gql(`
    query Query($cateId: ID!) {
        category(cateId: $cateId) {
            _id
            name
            isActive
            logo
            icon
        }
    }  
`);
