const Order = require('../models/order')
const Product = require('../models/product');


const ErroHandler = require('../utils/errorHandler')
const catchAsyncErrors = require('../middlewares/catchAsyncErrors')

// Create a new order => api/v1/order 
exports.newOrder =catchAsyncErrors ( async (req,res, next) => {
    const { 
        orderItems, 
        shippingInfo, 
        itemsPrice, 
        taxPrice, 
        shippingPrice, 
        totalPrice, 
        paymentInfo
      } = req.body;


      const order = await Order.create({ 
        orderItems, 
        shippingInfo, 
        itemsPrice, 
        taxPrice, 
        shippingPrice, 
        totalPrice, 
        paymentInfo, 
        paidAt: Date.now(), 
        user: req.user._id
      })
      res.status(200).json({ 
        success: true, 
        order
      })
})


// Get single Order => /api/v1/order/:id 
exports.getSingleOrder = catchAsyncErrors ( async (req,res, next) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email')


    if(!order){
        return next(new ErrorHandler("No order found with this ID"), 404)
    }
    res.status(200).json({ 
        success: true, 
        order
    })

})


// Get Login User Order => /api/v1/orders/me 
exports.myOrders = catchAsyncErrors ( async (req,res, next) => {
    const orders = await Order.find({user: req.user.id})

    res.status(200).json({ 
        success: true, 
        orders
    })

})




// Get all Order => /api/v1/admin/orders
exports.allOrders = catchAsyncErrors ( async (req,res, next) => {
    const orders = await Order.find()

    let totalAmount = 0;

    orders.forEach(order=>{
        totalAmount +=order.totalPrice
    })

    res.status(200).json({ 
        success: true, 
        totalAmount,
        orders
    })

})