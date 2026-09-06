import { createProductTeaser } from "../product-teaser/product-teaser.js";

function getBlockConfig(block){
  const row=block.querySelector(':scope > div');
  const jsonUrl = row?.children[0]?.textContent.trim()|| '';
  if(!jsonUrl){
    alert('JSON URL is missing')
  }
  return {jsonUrl}
}
async function getProducts(jsonUrl){
    const response = await fetch(jsonUrl);
    if(!response.ok){
        throw new Error('Unable to fetch products');
    }
    const data = await response.json();   

    return data.data || data;
}
 

export default async function decorate(block){
    const { jsonUrl }=getBlockConfig(block);
    const products=await getProducts(jsonUrl);
    const category =new URLSearchParams(window.location.search).get('category');

    block.innerHTML='';
    const heading = document.querySelector('h1');
    if(heading && category){
        heading.textContent = category;
    }else{
heading.textContent = category || 'All Products';
    }
    
   const grid = document.createElement('div');
    grid.classList.add('best-seller-products');

     let categoryData=products.filter((item)=>item.category===category)

     categoryData.forEach((product)=>{
            grid.append(createProductTeaser(product),);
        })

        block.append(grid)

}