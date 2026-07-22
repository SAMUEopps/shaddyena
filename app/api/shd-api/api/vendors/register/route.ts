// // // import { NextRequest, NextResponse } from 'next/server';
// // // import { connectToDatabase } from '@/lib/mongodb';
// // // import Vendor from '@/models/Vendor';
// // // import User from '@/models/User';
// // // import { verifyToken } from '@/lib/auth';


// // // export async function POST(req: NextRequest) {
// // //   try {
// // //     await connectToDatabase();
// // //     const token = req.headers.get('authorization')?.split(' ')[1];
// // //     const decoded = verifyToken(token);
    
// // //     if (!decoded) {
// // //       return NextResponse.json(
// // //         { error: 'Unauthorized' },
// // //         { status: 401 }
// // //       );
// // //     }

// // //     const body = await req.json();
// // //     const {
// // //       businessName,
// // //       ownerName,
// // //       nationalId,
// // //       kraPin,
// // //       phoneNumber,
// // //       businessLocation,
// // //       payoutMethod,
// // //       payoutDetails
// // //     } = body;

// // //     // Update user role to vendor
// // //     await User.findByIdAndUpdate(decoded.userId, { role: 'vendor' });

// // //     // Create vendor profile
// // //     const vendor = await Vendor.create({
// // //       userId: decoded.userId,
// // //       businessName,
// // //       ownerName,
// // //       nationalId,
// // //       kraPin,
// // //       phoneNumber,
// // //       businessLocation,
// // //       payoutMethod,
// // //       payoutDetails,
// // //       isActive: true
// // //     });

// // //     return NextResponse.json({
// // //       message: 'Vendor registered successfully',
// // //       vendor
// // //     }, { status: 201 });

// // //   } catch (error) {
// // //     console.error('Vendor registration error:', error);
// // //     return NextResponse.json(
// // //       { error: 'Vendor registration failed' },
// // //       { status: 500 }
// // //     );
// // //   }
// // // }

// // import { NextRequest, NextResponse } from "next/server";
// // import { connectToDatabase } from "@/lib/mongodb";
// // import Vendor from "@/models/Vendor";
// // import User from "@/models/User";
// // import bcrypt from "bcryptjs";
// // import jwt from "jsonwebtoken";


// // export async function POST(req:NextRequest){

// // try{


// // await connectToDatabase();



// // const body = await req.json();


// // const {


// // // USER DATA

// // name,
// // email,
// // password,
// // phoneNumber,


// // // SHOP DATA

// // businessName,
// // ownerName,
// // nationalId,
// // kraPin,
// // businessLocation,

// // payoutMethod,
// // payoutDetails


// // }=body;





// // // Check existing user

// // const existingUser = await User.findOne({

// // $or:[
// // {email},
// // {phoneNumber}
// // ]

// // });



// // if(existingUser){

// // return NextResponse.json(

// // {
// // error:"User already exists"
// // },

// // {
// // status:400
// // }

// // );

// // }






// // // Hash password


// // const hashedPassword =
// // await bcrypt.hash(password,10);







// // // Create vendor user


// // const user =
// // await User.create({

// // name,

// // email,

// // phoneNumber,

// // password:hashedPassword,

// // role:"vendor",

// // isVerified:true

// // });









// // // Create vendor profile


// // const vendor =
// // await Vendor.create({

// // userId:user._id,

// // businessName,

// // ownerName,

// // nationalId,

// // kraPin,

// // phoneNumber,

// // businessLocation,

// // payoutMethod,

// // payoutDetails,

// // isActive:true


// // });







// // // Generate token


// // const token =
// // jwt.sign(

// // {
// // userId:user._id,
// // role:"vendor"

// // },

// // process.env.JWT_SECRET || "secret",

// // {
// // expiresIn:"7d"
// // }

// // );







// // return NextResponse.json(

// // {

// // message:"Vendor registration successful",

// // token,

// // user:{

// // id:user._id,

// // name:user.name,

// // email:user.email,

// // phoneNumber:user.phoneNumber,

// // role:user.role

// // },

// // vendor


// // },

// // {
// // status:201
// // }


// // );





// // }catch(error){


// // console.error(
// // "Vendor registration error",
// // error
// // );



// // return NextResponse.json(

// // {
// // error:"Vendor registration failed"
// // },

// // {
// // status:500
// // }

// // );


// // }



// // }

// // C:\Users\USER\Desktop\Projects\my-app\app\api\vendors\register\route.ts
// import { NextRequest, NextResponse } from "next/server";
// import { connectToDatabase } from "@/lib/mongodb";
// import Vendor from "@/models/Vendor";
// import User from "@/models/User";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";

// function generateReferralCode() {
//   const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
//   let code = '';
//   for (let i = 0; i < 10; i++) {
//     code += characters.charAt(Math.floor(Math.random() * characters.length));
//   }
//   return code;
// }

// export async function POST(req:NextRequest){
//   try {
//     await connectToDatabase();

//     const body = await req.json();
//     const {
//       name,
//       email,
//       password,
//       phoneNumber,
//       businessName,
//       ownerName,
//       nationalId,
//       kraPin,
//       businessLocation,
//       payoutMethod,
//       payoutDetails,
//       referralCode // Add this field
//     } = body;

//     // Check existing user
//     const existingUser = await User.findOne({
//       $or: [{ email }, { phoneNumber }]
//     });

//     if (existingUser) {
//       return NextResponse.json(
//         { error: "User already exists" },
//         { status: 400 }
//       );
//     }

//     // Validate referral code if provided
//     let referrer = null;
//     if (referralCode) {
//       referrer = await User.findOne({ referralCode });
//       if (!referrer) {
//         return NextResponse.json(
//           { error: 'Invalid referral code' },
//           { status: 400 }
//         );
//       }
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Generate unique referral code for new vendor
//     let newReferralCode = generateReferralCode();
//     let isUnique = false;
//     let attempts = 0;
    
//     while (!isUnique && attempts < 10) {
//       const existingUser = await User.findOne({ referralCode: newReferralCode });
//       if (!existingUser) {
//         isUnique = true;
//       } else {
//         newReferralCode = generateReferralCode();
//         attempts++;
//       }
//     }

//     // Create vendor user
//     const user = await User.create({
//       name,
//       email,
//       phoneNumber,
//       password: hashedPassword,
//       role: "vendor",
//       isVerified: true,
//       referralCode: newReferralCode,
//       referredBy: referralCode || null,
//       referrals: [],
//       referralEarnings: 0
//     });

//     // Create vendor profile
//     const vendor = await Vendor.create({
//       userId: user._id,
//       businessName,
//       ownerName,
//       nationalId,
//       kraPin,
//       phoneNumber,
//       businessLocation,
//       payoutMethod,
//       payoutDetails,
//       isActive: true
//     });

//     // Add user to referrer's referrals list and give commission
//     if (referrer) {
//       await User.findByIdAndUpdate(
//         referrer._id,
//         { 
//           $push: { referrals: user._id },
//           $inc: { referralEarnings: 500 } // Commission for referring a vendor
//         }
//       );
//     }

//     // Generate token
//     const token = jwt.sign(
//       { userId: user._id, role: "vendor" },
//       process.env.JWT_SECRET || "secret",
//       { expiresIn: "7d" }
//     );

//     return NextResponse.json(
//       {
//         message: "Vendor registration successful",
//         token,
//         user: {
//           id: user._id,
//           name: user.name,
//           email: user.email,
//           phoneNumber: user.phoneNumber,
//           role: user.role,
//           referralCode: user.referralCode,
//           referredBy: user.referredBy
//         },
//         vendor
//       },
//       { status: 201 }
//     );

//   } catch (error) {
//     console.error("Vendor registration error", error);
//     return NextResponse.json(
//       { error: "Vendor registration failed" },
//       { status: 500 }
//     );
//   }
// }

// app/api/vendors/register/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Vendor from "@/models/Vendor";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

function generateReferralCode() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";

  for (let i = 0; i < 10; i++) {
    code += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }

  return code;
}

async function createUniqueReferralCode() {
  let referralCode = "";
  let exists = true;

  while (exists) {
    referralCode = generateReferralCode();

    const user = await User.findOne({ referralCode });

    if (!user) {
      exists = false;
    }
  }

  return referralCode;
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const body = await req.json();

    const {
      name,
      email,
      password,
      phoneNumber,
      businessName,
      ownerName,
      nationalId,
      kraPin,
      businessLocation,
      payoutMethod,
      payoutDetails,
      referralCode
    } = body;


    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [
        { email },
        { phoneNumber }
      ]
    });

    if (existingUser) {
      return NextResponse.json(
        {
          error: "User already exists"
        },
        {
          status: 400
        }
      );
    }


    // Validate referral code
    let referrer = null;

    if (referralCode) {
      referrer = await User.findOne({
        referralCode
      });

      if (!referrer) {
        return NextResponse.json(
          {
            error: "Invalid referral code"
          },
          {
            status: 400
          }
        );
      }
    }


    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);


    // Generate new vendor referral code
    const newReferralCode = await createUniqueReferralCode();


    // Create user account
    const user = await User.create({

      name,

      email,

      phoneNumber,

      password: hashedPassword,

      role: "vendor",

      isVerified: true,

      referralCode: newReferralCode,

      referredBy: referralCode || null,

      referrals: [],

      referralEarnings: 0,

      referralCommissionEarnings: 0,

      referralSubscriptionEarnings: 0,

      isMember: false,

      totalSavings: 0,

      totalInvestments: 0,

      availableBalance: 0

    });



    // Create vendor profile
    const vendor = await Vendor.create({

      userId: user._id,

      businessName,

      ownerName,

      nationalId,

      kraPin,

      phoneNumber,

      businessLocation,

      payoutMethod,

      payoutDetails,

      isActive: true

    });



    // Track referral
    // Store the new user's referralCode in referrer's referrals array
    if (referrer) {

      await User.findByIdAndUpdate(

        referrer._id,

        {
          $push: {
            referrals: user.referralCode
          }
        }

      );

    }



    // Generate JWT token
    const token = jwt.sign(

      {
        userId: user._id,
        role: "vendor"
      },

      process.env.JWT_SECRET || "secret",

      {
        expiresIn: "7d"
      }

    );



    return NextResponse.json(

      {

        message: "Vendor registration successful",

        token,

        user: {

          id: user._id,

          name: user.name,

          email: user.email,

          phoneNumber: user.phoneNumber,

          role: user.role,

          referralCode: user.referralCode,

          referredBy: user.referredBy

        },

        vendor

      },

      {
        status: 201
      }

    );


  } catch (error) {

    console.error(
      "Vendor registration error:",
      error
    );


    return NextResponse.json(

      {
        error: "Vendor registration failed"
      },

      {
        status: 500
      }

    );

  }
}