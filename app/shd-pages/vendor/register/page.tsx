// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';

// export default function VendorRegister() {
//   const [formData, setFormData] = useState({
//     businessName: '',
//     ownerName: '',
//     nationalId: '',
//     kraPin: '',
//     phoneNumber: '',
//     businessLocation: '',
//     payoutMethod: 'MPESA',
//     mpesaNumber: '',
//     pochiNumber: '',
//     tillNumber: '',
//     paybillNumber: '',
//     paybillAccount: ''
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const router = useRouter();

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     const payload = {
//       businessName: formData.businessName,
//       ownerName: formData.ownerName,
//       nationalId: formData.nationalId,
//       kraPin: formData.kraPin,
//       phoneNumber: formData.phoneNumber,
//       businessLocation: formData.businessLocation,
//       payoutMethod: formData.payoutMethod,
//       payoutDetails: {
//         mpesaNumber: formData.mpesaNumber || formData.phoneNumber,
//         pochiNumber: formData.pochiNumber,
//         tillNumber: formData.tillNumber,
//         paybillNumber: formData.paybillNumber,
//         paybillAccount: formData.paybillAccount
//       }
//     };

//     try {
//       const response = await fetch('/api/vendors/register', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         },
//         body: JSON.stringify(payload)
//       });

//       const data = await response.json();

//       if (response.ok) {
//         alert('Vendor registration successful!');
//         router.push('/vendor/dashboard');
//       } else {
//         setError(data.error || 'Vendor registration failed');
//       }
//     } catch (error) {
//       setError('An error occurred. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
//         <h1 className="text-3xl font-bold mb-6">Register as Vendor</h1>

//         {error && (
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Business Name</label>
//             <input
//               type="text"
//               name="businessName"
//               value={formData.businessName}
//               onChange={handleChange}
//               required
//               className="mt-1 block w-full border border-gray-300 rounded-md p-2"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">Owner Name</label>
//             <input
//               type="text"
//               name="ownerName"
//               value={formData.ownerName}
//               onChange={handleChange}
//               required
//               className="mt-1 block w-full border border-gray-300 rounded-md p-2"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">National ID</label>
//             <input
//               type="text"
//               name="nationalId"
//               value={formData.nationalId}
//               onChange={handleChange}
//               required
//               className="mt-1 block w-full border border-gray-300 rounded-md p-2"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">KRA PIN (Optional)</label>
//             <input
//               type="text"
//               name="kraPin"
//               value={formData.kraPin}
//               onChange={handleChange}
//               className="mt-1 block w-full border border-gray-300 rounded-md p-2"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">Phone Number</label>
//             <input
//               type="text"
//               name="phoneNumber"
//               value={formData.phoneNumber}
//               onChange={handleChange}
//               required
//               className="mt-1 block w-full border border-gray-300 rounded-md p-2"
//               placeholder="254712345678"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">Business Location</label>
//             <input
//               type="text"
//               name="businessLocation"
//               value={formData.businessLocation}
//               onChange={handleChange}
//               required
//               className="mt-1 block w-full border border-gray-300 rounded-md p-2"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">Payout Method</label>
//             <select
//               name="payoutMethod"
//               value={formData.payoutMethod}
//               onChange={handleChange}
//               className="mt-1 block w-full border border-gray-300 rounded-md p-2"
//             >
//               <option value="MPESA">M-Pesa</option>
//               <option value="POCHI">Pochi</option>
//               <option value="TILL">Till Number</option>
//               <option value="PAYBILL">PayBill</option>
//             </select>
//           </div>

//           {formData.payoutMethod === 'MPESA' && (
//             <div>
//               <label className="block text-sm font-medium text-gray-700">M-Pesa Number</label>
//               <input
//                 type="text"
//                 name="mpesaNumber"
//                 value={formData.mpesaNumber}
//                 onChange={handleChange}
//                 className="mt-1 block w-full border border-gray-300 rounded-md p-2"
//                 placeholder="254712345678"
//               />
//             </div>
//           )}

//           {formData.payoutMethod === 'POCHI' && (
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Pochi Number</label>
//               <input
//                 type="text"
//                 name="pochiNumber"
//                 value={formData.pochiNumber}
//                 onChange={handleChange}
//                 className="mt-1 block w-full border border-gray-300 rounded-md p-2"
//               />
//             </div>
//           )}

//           {formData.payoutMethod === 'TILL' && (
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Till Number</label>
//               <input
//                 type="text"
//                 name="tillNumber"
//                 value={formData.tillNumber}
//                 onChange={handleChange}
//                 className="mt-1 block w-full border border-gray-300 rounded-md p-2"
//               />
//             </div>
//           )}

//           {formData.payoutMethod === 'PAYBILL' && (
//             <>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">PayBill Number</label>
//                 <input
//                   type="text"
//                   name="paybillNumber"
//                   value={formData.paybillNumber}
//                   onChange={handleChange}
//                   className="mt-1 block w-full border border-gray-300 rounded-md p-2"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Account Number</label>
//                 <input
//                   type="text"
//                   name="paybillAccount"
//                   value={formData.paybillAccount}
//                   onChange={handleChange}
//                   className="mt-1 block w-full border border-gray-300 rounded-md p-2"
//                 />
//               </div>
//             </>
//           )}

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
//           >
//             {loading ? 'Registering...' : 'Register as Vendor'}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

/*'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function VendorRegister() {

  const router = useRouter();


  const [formData, setFormData] = useState({

    // User information
    name: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    referralCode: '' ,


    // Vendor information
    businessName: '',
    ownerName: '',
    nationalId: '',
    kraPin: '',
    businessLocation: '',


    // Payout
    payoutMethod: 'MPESA',
    mpesaNumber: '',
    pochiNumber: '',
    tillNumber: '',
    paybillNumber: '',
    paybillAccount: ''

  });



  const [loading,setLoading] = useState(false);
  const [error,setError] = useState('');





  const handleChange = (
    e:React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  )=>{

    setFormData({

      ...formData,

      [e.target.name]:e.target.value

    });

  };







  const handleSubmit = async(
    e:React.FormEvent
  )=>{


    e.preventDefault();

    setError('');



    if(formData.password !== formData.confirmPassword){

      setError(
        "Passwords do not match"
      );

      return;

    }




    setLoading(true);



    const payload = {


      // USER

      name:formData.name,

      email:formData.email,

      vendorPhoneNumber:formData.phoneNumber,

      password:formData.password,


      referralCode: formData.referralCode || undefined,



      // VENDOR

      businessName:formData.businessName,

      ownerName:formData.ownerName,

      nationalId:formData.nationalId,

      kraPin:formData.kraPin,

      phoneNumber:formData.phoneNumber,

      businessLocation:
      formData.businessLocation,



      payoutMethod:
      formData.payoutMethod,


      payoutDetails:{


        mpesaNumber:
        formData.mpesaNumber || formData.phoneNumber,


        pochiNumber:
        formData.pochiNumber,


        tillNumber:
        formData.tillNumber,


        paybillNumber:
        formData.paybillNumber,


        paybillAccount:
        formData.paybillAccount

      }


    };







    try{


      const response = await fetch(
        '/api/vendors/register',
        {

          method:'POST',

          headers:{
            "Content-Type":"application/json"
          },


          body:JSON.stringify(payload)

        }
      );



      const data = await response.json();





      if(response.ok){


        localStorage.setItem(
          "token",
          data.token
        );



        alert(
          "Vendor registration successful!"
        );


        router.push(
          "/vendor/dashboard"
        );



      }else{


        setError(
          data.error || 
          "Vendor registration failed"
        );


      }





    }catch(error){


      setError(
        "Something went wrong. Try again."
      );


    }finally{


      setLoading(false);


    }



  };








return (

<div className="
min-h-screen
bg-gray-50
py-10
">


<div className="
max-w-3xl
mx-auto
bg-white
p-8
rounded-xl
shadow
">


<h1 className="
text-3xl
font-bold
mb-2
">

🏪 Register Your Shop

</h1>


<p className="
text-gray-600
mb-8
">

Create your account and start selling on Shaddyna

</p>





{
error &&

<div className="
bg-red-100
border
border-red-400
text-red-700
px-4
py-3
rounded
mb-5
">

{error}

</div>

}






<form
onSubmit={handleSubmit}
className="space-y-6"
>






{/* ACCOUNT DETAILS *

<div>


<h2 className="
text-xl
font-bold
mb-4
">

Account Information

</h2>



<div className="space-y-3">


<input

type="text"

name="name"

placeholder="Full Name"

required

value={formData.name}

onChange={handleChange}

className="
w-full
border
p-3
rounded
"

/>



<input

type="email"

name="email"

placeholder="Email Address"

required

value={formData.email}

onChange={handleChange}

className="
w-full
border
p-3
rounded
"

/>



<input

type="text"

name="phoneNumber"

placeholder="Phone Number"

required

value={formData.phoneNumber}

onChange={handleChange}

className="
w-full
border
p-3
rounded
"

/>



<input

type="password"

name="password"

placeholder="Password"

required

value={formData.password}

onChange={handleChange}

className="
w-full
border
p-3
rounded
"

/>



<input

type="password"

name="confirmPassword"

placeholder="Confirm Password"

required

value={formData.confirmPassword}

onChange={handleChange}

className="
w-full
border
p-3
rounded
"

/>

<input
  name="referralCode"
  placeholder="Referral Code (Optional)"
  value={formData.referralCode}
  onChange={handleChange}
  className="w-full border p-3 rounded bg-gray-50"
/>


</div>


</div>









{/* SHOP DETAILS *


<div>


<h2 className="
text-xl
font-bold
mb-4
">

Business Information

</h2>



<div className="space-y-3">


<input

name="businessName"

placeholder="Business Name"

required

value={formData.businessName}

onChange={handleChange}

className="
w-full
border
p-3
rounded
"

/>



<input

name="ownerName"

placeholder="Owner Name"

required

value={formData.ownerName}

onChange={handleChange}

className="
w-full
border
p-3
rounded
"

/>



<input

name="nationalId"

placeholder="National ID"

required

value={formData.nationalId}

onChange={handleChange}

className="
w-full
border
p-3
rounded
"

/>



<input

name="kraPin"

placeholder="KRA PIN (Optional)"

value={formData.kraPin}

onChange={handleChange}

className="
w-full
border
p-3
rounded
"

/>



<input

name="businessLocation"

placeholder="Business Location"

required

value={formData.businessLocation}

onChange={handleChange}

className="
w-full
border
p-3
rounded
"

/>



</div>


</div>










{/* PAYOUT *


<div>


<h2 className="
text-xl
font-bold
mb-4
">

Payment Details

</h2>




<select

name="payoutMethod"

value={formData.payoutMethod}

onChange={handleChange}

className="
w-full
border
p-3
rounded
"

>

<option value="MPESA">
M-Pesa
</option>

<option value="POCHI">
Pochi
</option>

<option value="TILL">
Till Number
</option>

<option value="PAYBILL">
PayBill
</option>


</select>





{
formData.payoutMethod==="MPESA" &&

<input

name="mpesaNumber"

placeholder="M-Pesa Number"

value={formData.mpesaNumber}

onChange={handleChange}

className="
w-full
border
p-3
rounded
mt-3
"

/>


}






{
formData.payoutMethod==="POCHI" &&

<input

name="pochiNumber"

placeholder="Pochi Number"

value={formData.pochiNumber}

onChange={handleChange}

className="
w-full
border
p-3
rounded
mt-3
"

/>

}






{
formData.payoutMethod==="TILL" &&

<input

name="tillNumber"

placeholder="Till Number"

value={formData.tillNumber}

onChange={handleChange}

className="
w-full
border
p-3
rounded
mt-3
"

/>

}







{
formData.payoutMethod==="PAYBILL" &&

<div className="space-y-3 mt-3">


<input

name="paybillNumber"

placeholder="PayBill Number"

value={formData.paybillNumber}

onChange={handleChange}

className="
w-full
border
p-3
rounded
"

/>



<input

name="paybillAccount"

placeholder="Account Number"

value={formData.paybillAccount}

onChange={handleChange}

className="
w-full
border
p-3
rounded
"

/>


</div>


}



</div>








<button

disabled={loading}

className="
w-full
bg-blue-600
text-white
py-3
rounded-lg
font-bold
hover:bg-blue-700
disabled:bg-gray-400
"

>


{
loading
?
"Creating Shop..."
:
"Register Shop"
}


</button>





</form>


</div>


</div>


);


}*/


'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function VendorRegister() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    // User information
    name: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    referralCode: '',

    // Vendor information
    businessName: '',
    ownerName: '',
    nationalId: '',
    kraPin: '',
    businessLocation: '',

    // Payout
    payoutMethod: 'MPESA',
    mpesaNumber: '',
    pochiNumber: '',
    tillNumber: '',
    paybillNumber: '',
    paybillAccount: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    const payload = {
      // USER
      name: formData.name,
      email: formData.email,
      vendorPhoneNumber: formData.phoneNumber,
      password: formData.password,
      referralCode: formData.referralCode || undefined,

      // VENDOR
      businessName: formData.businessName,
      ownerName: formData.ownerName,
      nationalId: formData.nationalId,
      kraPin: formData.kraPin,
      phoneNumber: formData.phoneNumber,
      businessLocation: formData.businessLocation,

      payoutMethod: formData.payoutMethod,

      payoutDetails: {
        mpesaNumber: formData.mpesaNumber || formData.phoneNumber,
        pochiNumber: formData.pochiNumber,
        tillNumber: formData.tillNumber,
        paybillNumber: formData.paybillNumber,
        paybillAccount: formData.paybillAccount
      }
    };

    try {
      const response = await fetch('/api/vendors/register', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        alert("Vendor registration successful!");
        router.push("/vendor/dashboard");
      } else {
        setError(data.error || "Vendor registration failed");
      }
    } catch (error) {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-8 sm:py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 sm:p-8 border border-surface">
          {/* Header */}
          <div className="mb-8">
            <Link 
              href="/register" 
              className="text-primary hover:text-accent-dark transition-colors duration-200 font-medium inline-flex items-center gap-2 mb-4"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Registration
            </Link>
            <h1 className="text-2xl sm:text-3xl font-black text-secondary">
              🏪 Register Your Shop
            </h1>
            <p className="mt-2 text-muted">
              Create your account and start selling on Shaddyna
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700">
              <div className="flex items-center gap-2">
                <span>❌</span>
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Account Details */}
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-secondary mb-4">
                Account Information
              </h2>
              <div className="space-y-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
                />
                <input
                  type="text"
                  name="phoneNumber"
                  placeholder="Phone Number"
                  required
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
                />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
                />
                <input
                  name="referralCode"
                  placeholder="Referral Code (Optional)"
                  value={formData.referralCode}
                  onChange={handleChange}
                  className="w-full border-2 border-surface bg-background/50 rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
                />
              </div>
            </div>

            {/* Business Details */}
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-secondary mb-4">
                Business Information
              </h2>
              <div className="space-y-4">
                <input
                  name="businessName"
                  placeholder="Business Name"
                  required
                  value={formData.businessName}
                  onChange={handleChange}
                  className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
                />
                <input
                  name="ownerName"
                  placeholder="Owner Name"
                  required
                  value={formData.ownerName}
                  onChange={handleChange}
                  className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
                />
                <input
                  name="nationalId"
                  placeholder="National ID"
                  required
                  value={formData.nationalId}
                  onChange={handleChange}
                  className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
                />
                <input
                  name="kraPin"
                  placeholder="KRA PIN (Optional)"
                  value={formData.kraPin}
                  onChange={handleChange}
                  className="w-full border-2 border-surface bg-background/50 rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
                />
                <input
                  name="businessLocation"
                  placeholder="Business Location"
                  required
                  value={formData.businessLocation}
                  onChange={handleChange}
                  className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
                />
              </div>
            </div>

            {/* Payout Details */}
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-secondary mb-4">
                Payment Details
              </h2>

              <select
                name="payoutMethod"
                value={formData.payoutMethod}
                onChange={handleChange}
                className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary appearance-none"
              >
                <option value="MPESA">M-Pesa</option>
                <option value="POCHI">Pochi</option>
                <option value="TILL">Till Number</option>
                <option value="PAYBILL">PayBill</option>
              </select>

              {formData.payoutMethod === "MPESA" && (
                <input
                  name="mpesaNumber"
                  placeholder="M-Pesa Number"
                  value={formData.mpesaNumber}
                  onChange={handleChange}
                  className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted mt-3"
                />
              )}

              {formData.payoutMethod === "POCHI" && (
                <input
                  name="pochiNumber"
                  placeholder="Pochi Number"
                  value={formData.pochiNumber}
                  onChange={handleChange}
                  className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted mt-3"
                />
              )}

              {formData.payoutMethod === "TILL" && (
                <input
                  name="tillNumber"
                  placeholder="Till Number"
                  value={formData.tillNumber}
                  onChange={handleChange}
                  className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted mt-3"
                />
              )}

              {formData.payoutMethod === "PAYBILL" && (
                <div className="space-y-3 mt-3">
                  <input
                    name="paybillNumber"
                    placeholder="PayBill Number"
                    value={formData.paybillNumber}
                    onChange={handleChange}
                    className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
                  />
                  <input
                    name="paybillAccount"
                    placeholder="Account Number"
                    value={formData.paybillAccount}
                    onChange={handleChange}
                    className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
                  />
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              disabled={loading}
              className="w-full bg-primary hover:bg-accent-dark disabled:bg-muted disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98]"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Shop...
                </span>
              ) : (
                'Register Shop'
              )}
            </button>

            {/* Login Link */}
            <div className="text-center pt-4 border-t border-surface">
              <p className="text-muted text-sm">
                Already have a vendor account?{' '}
                <Link 
                  href="/login" 
                  className="text-primary hover:text-accent-dark font-medium transition-colors duration-200"
                >
                  Login →
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}