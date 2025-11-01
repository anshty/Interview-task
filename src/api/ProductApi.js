import axios from "axios";
const apibase_url='https://dummyjson.com'

const all_product_endpoint=(limit = 10, skip = 0)=>`${apibase_url}/products?limit=${limit}&skip=${skip}`
const productDetails_endpoint=id=>`${apibase_url}/products/${id}`
const productSearch_endpoint=params=>`${apibase_url}/products/search?q=${params}`
const productCategories_endpoint=`${apibase_url}/products/categories`

const apiCall=async(endpoint)=>{
    const options={
        method:'GET',
        url:endpoint
    }
    try {
        const response= await axios.request(options)
        return response.data
    } catch (error) {
        console.log('ERROR:',error)
        return {}
    }
}


export const fetchAllProduct=(limit = 10, skip = 0)=>{
    return apiCall(all_product_endpoint(limit, skip))
}
export const fetchProductDetail=(id)=>{
    return apiCall(productDetails_endpoint(id))
}
export const fetchProductSearch=(params)=>{
    return apiCall(productSearch_endpoint(params))
}
export const fetchProductCategories=()=>{
    return apiCall(productCategories_endpoint)
}