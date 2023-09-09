const OrderModel = require('../models/OrderModel');
const mongoose = require('mongoose');
const UserModel = require('../models/UserModel');
const LoadDashboard = async(req,res,next)=>{
    try {
        const OrderDetails = await OrderModel.find({})
        // for total Order  in OrderModel
        const CountOrder = await OrderModel.find({}).count()
        // For Checking PreviousMonthOrder
          // Assuming you have the total orders for the previous month
 
          const currentTime = new Date();

          // Calculate the start time for the previous day
          const oneDayAgo = new Date(currentTime.getTime() - 24 * 60 * 60 * 1000); // 1 day ago
          console.log(oneDayAgo);
          
          const lastOneDayAgo = new Date(oneDayAgo.getTime() - 24 * 60 * 60 * 1000); // 2 days ago
          console.log(lastOneDayAgo);
          // Use MongoDB aggregation to count orders within the last day and the day before that
            const PreviousDay = await OrderModel.aggregate([
                {
                  $match: {
                    dateCreated: {
                      $gte: lastOneDayAgo, // Start time for the day before last
                      $lt: oneDayAgo,     // Start time for the previous day
                    }
                  }
                },
                {
                  $group: {
                    _id: null,
                    lastDayCount: {
                      $sum: 1
                    }
                  }
                }
              ])
              
          console.log(PreviousDay.lastDayCount);
        // for Date to  month letter type
        function getMonthName(month) {
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            return monthNames[month];
        }
        // for session details
       const isadmin =  req.session.admin_id;
       // for total revenue 
       const totalrevenue = await  OrderModel.aggregate([{
        $match:{
            Status:"Shipped"
        },
    },{
        $group:{
            _id:null,
            TotalAmount:{ $sum:'$TotalAmount'}
        }
    }         
       ]);
       // The totalrevenue variable will now contain the total revenue
const totalRevenueAmount = totalrevenue.length > 0 ? totalrevenue[0].TotalAmount : 0;

 console.log(' this is the totalrevenue',totalRevenueAmount);
 // for vistors Calculating
 const vistors =  await UserModel.find({}).count()
 // for fetch the Admin Details 
 const Data = await UserModel.findOne({_id:isadmin});
 console.log(Data);

         res.render('admin/DashBoard',{
            title:'Dashboard',
            getMonthName:getMonthName,
            data:OrderDetails,
            totalorder:CountOrder,
            Isadmin:isadmin,
            totalRevenueAmount:totalRevenueAmount,
            Vistors:vistors,
            Data


        });
        
    } catch (error) {
       console.log(error.message); 
    }
}
// for admin Shipped the Product then Status will be Updated
const UpdateOrderShipped =async(req,res,next)=>{
   try {
    const OrderId = req.params.id
    console.log(OrderId);
    const StatusUpdated = await OrderModel.updateOne({_id: new mongoose.Types.ObjectId(OrderId)},{
        $set:{Status:'Shipped'}
    })
    if(StatusUpdated){
        console.log('Status Updated');
        res.redirect('/admin/')
    }else{
        console.log('Status  Updated Failed');
    }
   } catch (error) {
    console.log(error.message);
   }
}
const getOrderProducts =async(req,res,next)=>{
    try {
        const OrderId =req.params.id
        let FindProduct = await OrderModel.findOne({_id:OrderId})
    console.log(FindProduct);
  
        const OrderItem = await OrderModel.aggregate([
            {
                $match:{_id: new mongoose.Types.ObjectId(OrderId)}
            },
            {
                $unwind : '$products'
            }
            ,{
                $project:{
                    item:"$products.item",
                    Size:"$products.Size",
                    color:"$products.color",
                    quantity:"$products.quantity"
                }
            },{
                $lookup :{
                    from :'productmodels',
                    localField:'item',
                    foreignField:'_id',
                    as: 'product'

                }
            },
            {
                $project:{
                    item:1,quantity:1,Size:1,color:1,product:{$arrayElemAt:['$product',0]}
                }
            }
            
        ])
        console.log(OrderItem);
        res.render('admin/Order_products_page',{
            title:"Order_productS_list",
            OrderedProducts:OrderItem
        })
  

    } catch (error) {
        console.log(error.message);
    }
}
// for Calender 
const LoadCalendar = async(req,res,next)=>{
    try {
        const isadmin =  req.session.admin_id;
        // for fetch the Admin Details 
 const Data = await UserModel.findOne({_id:isadmin});
        res.render('admin/calendar',{
            title:'calendar',
            Isadmin:isadmin,
            Data

        })
    } catch (error) {
        console.log(error.message);
    }
}
module.exports={
    LoadDashboard,
    UpdateOrderShipped,
    getOrderProducts,
    LoadCalendar
   
}