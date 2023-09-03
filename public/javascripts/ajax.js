function addtoCart(ProId){
    // Get the selected size and color values
  const selectedSize = document.querySelector('select[name="size"]').value;
  const selectedColor = document.querySelector('select[name="color"]').value;
  
  // Get the quantity input value
  const quantity = document.querySelector('input[name="quantity"]').value;

    $.ajax({
        url:'/add-to-cart/'+ProId,
        method:'POST',
        data:{
            size:selectedSize,
            color:selectedColor,
            quantity:quantity
        },
        success:(response)=>{
            if(response.status){
                let count = parseInt($('#cart-badge').data('notify'));
                console.log(count);
                // Increment the count
                count = count + 1;
        
                // Update the cart badge count
                $('#cart-badge').data('notify', count);
        
                // Update the text inside the badge with the new count
                $('#cart-badge').text(count);
        
                console.log('Cart count:', count);


            }
        }
    })
}