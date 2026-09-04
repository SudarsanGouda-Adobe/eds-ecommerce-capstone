import { createProductTeaser } from "../product-teaser/product-teaser.js";

async function fetchProductlist(jsonUrl){
    try{
        const response = await fetch(jsonUrl);
        if(!response.ok){
            throw new Error('Unable to fetch products')
        }
        const data = await response.json();
        return Array.isArray(data.data)?data.data:[];

    }catch(err){
        console.log(err.message)
        alert(err.message)
        return [];
    }

}

function getBlockConfig(block){
  const row=block.querySelector(':scope > div');
  const jsonUrl = row?.children[0]?.textContent.trim()|| '';
  if(!jsonUrl){
    alert('JSON URL is missing')
  }
  return {jsonUrl}
}

export default async function decorate(block){
    const {jsonUrl} =getBlockConfig(block);
    const products = await fetchProductlist(jsonUrl);

    block.innerHTML='';

    const grid = document.createElement('div');
    grid.classList.add('best-seller-products')
    products.forEach((product)=>{
        grid.append(createProductTeaser(product),);
    })
    block.append(grid)

}