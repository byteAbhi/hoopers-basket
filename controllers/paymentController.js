const Razorpay = require("razorpay");

const { RAZORPAY_ID_KEY, RAZORPAY_SECRET_KEY } = process.env;

const razorpayInstance = new Razorpay({
  key_id: RAZORPAY_ID_KEY,
  key_secret: RAZORPAY_SECRET_KEY,
});

const renderProductPage = async (req, res) => {
  try {
    res.render("store"); //render the buy page
  } catch (error) {
    console.log(error.message);
  }
};

const createOrder = async (req, res) => {
  try {
    const amount = req.body.amount * 100; // Convert amount to paise
    const options = {
      amount: amount,
      currency: "INR",
      receipt: "",
    };

    razorpayInstance.orders.create(options, (err, order) => {
      if (!err) {
        res.status(200).send({
          success: true,
          msg: "Order Created",
          order_id: order.id,
          amount: amount,
          key_id: RAZORPAY_ID_KEY,
          product_name: req.body.name, // change it to take from buy page
          description: req.body.description,
          contact: "",
          name: "SneakUp",
          email: "abhishekmukhiya56321@gmail.com",
        });
      } else {
        res.status(400).send({
          success: false,
          message: "Something went wrong",
        });
      }
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
};
