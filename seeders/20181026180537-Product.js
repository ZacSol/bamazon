'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('Person', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
   return queryInterface.bulkInsert("Products",[
     {
       name:"Duct tape",
       price:3.49,
       availQty:10,
       imageUrl:"https://target.scene7.com/is/image/Target/GUEST_9f16f32e-5d46-43c2-896c-bbca449cc023?wid=488&hei=488&fmt=webp",
       department:"Hardware"
     },
     {
       name:"Nintendo Switch",
       price:299.99,
       availQty:3,
       imageUrl:"http://i66.tinypic.com/11rw3ki.jpg",
       department:"Electronics"
     },
     {
      name:"Super Mario Party - Nintendo Switch",
      price:59.99,
      availQty:5,
      department:"Electronics",
      imageUrl:"https://images-na.ssl-images-amazon.com/images/I/51g6xNskAVL._AC_US327_QL65_.jpg"
    },
    {
      name:"God of War - PS4",
      price:59.99,
      availQty:5,
      department:"Electronics",
      imageUrl:"https://images-na.ssl-images-amazon.com/images/I/51po2bu7VnL._AC_US327_FMwebp_QL65_.jpg"
    },
    {
      name:"60 Watt Equivalent, Soft White, Non-Dimmable, A19 LED Light Bulb | 6-Pack",
      price:14.99,
      availQty:10,
      department:"Hardware",
      imageUrl:"https://images-na.ssl-images-amazon.com/images/I/41LROohmJ8L._AC_US327_QL65_.jpg"
    },
    {
      name:"Mountain Dew Kickstart, 16 oz Cans (Pack of 12)",
      price:10.99,
      availQty:8,
      department:"Pantry",
      imageUrl:"https://images-na.ssl-images-amazon.com/images/I/415SUp39IvL._AC_US240_QL65_.jpg"
    },
    {
      name:"Dr Pepper, 12 fl oz cans, 12 count",
      price:4.99,
      availQty:7,
      department:"Pantry",
      imageUrl:"https://images-na.ssl-images-amazon.com/images/I/41z3Pfdht9L._AC_US327_QL65_.jpg"
    },
    {
      name:"Tactical Fingerless/Half Finger Gloves Shooting Military Combat Gloves with Hard Knuckle Fit",
      price:9.99,
      availQty:6,
      department:"Clothing",
      imageUrl:"https://images-na.ssl-images-amazon.com/images/I/51Ib2whmMeL._AC_US327_QL65_.jpg"
    },
    {
      name:"Top Level Baseball Cap Men Women - Classic Adjustable Plain Hat",
      price:6.99,
      availQty:4,
      department:"Clothing",
      imageUrl:"https://images-na.ssl-images-amazon.com/images/I/41ootrIJgTL._AC_US300_QL65_.jpg"
    },
    {
      name:"VBIGER Beard Hat Beanie Hat Knit Hat Winter Warm Octopus Hat Windproof Funny Men & Women",
      price:10.99,
      availQty:5,
      department:"Clothing",
      imageUrl:"https://images-na.ssl-images-amazon.com/images/I/519YpXKqjTL._AC_UL390_SR300,390_FMwebp_QL65_.jpg"
    },    
   ])
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
   return queryInterface.bulkDelete('Products', null, {});
  }
};
