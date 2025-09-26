/*import { Truck, Wallet, LockKeyhole, Phone } from 'lucide-react';

const Icons = () => {
  const features = [
    {
      icon: <Truck className="w-10 h-10 sm:w-12 sm:h-12" strokeWidth={1.5} />,
      title: "Fast Delivery",
      description: "Reliable and timely shipping"
    },
    {
      icon: <Wallet className="w-10 h-10 sm:w-12 sm:h-12" strokeWidth={1.5} />,
      title: "Easy Returns",
      description: "Hassle-free return process"
    },
    {
      icon: <LockKeyhole className="w-10 h-10 sm:w-12 sm:h-12" strokeWidth={1.5} />,
      title: "Secure Payments",
      description: "Your transactions are protected"
    },
    {
      icon: <Phone className="w-10 h-10 sm:w-12 sm:h-12" strokeWidth={1.5} />,
      title: "Support Anytime",
      description: "We're here whenever you need us"
    }
  ];

  return (
    <div className="mx-auto px-0 sm:px-6 lg:px-0 py-4">
      <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4 lg:gap-8">
        {features.map((feature, index) => (
          <div 
            key={index}
            className="group relative bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-md hover:shadow-lg sm:hover:shadow-xl transition-all duration-300 ease-in-out hover:-translate-y-1 border border-gray-100 dark:border-gray-700"
          >
            <div className="flex flex-col items-center text-center">
              <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-primary-50 dark:bg-primary-900/20 rounded-full text-primary-600 dark:text-primary-300 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30 transition-colors duration-300">
                {feature.icon}
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2">
                {feature.title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Icons;*/

import { Truck, Wallet, LockKeyhole, Phone } from 'lucide-react';

const Icons = () => {
  const features = [
    {
      icon: <Truck className="w-10 h-10 sm:w-12 sm:h-12" strokeWidth={1.5} />,
      title: "Fast Delivery",
      description: "Reliable and timely shipping"
    },
    {
      icon: <Wallet className="w-10 h-10 sm:w-12 sm:h-12" strokeWidth={1.5} />,
      title: "Easy Returns",
      description: "Hassle-free return process"
    },
    {
      icon: <LockKeyhole className="w-10 h-10 sm:w-12 sm:h-12" strokeWidth={1.5} />,
      title: "Secure Payments",
      description: "Your transactions are protected"
    },
    {
      icon: <Phone className="w-10 h-10 sm:w-12 sm:h-12" strokeWidth={1.5} />,
      title: "Support Anytime",
      description: "We're here whenever you need us"
    }
  ];

  return (
    <div className="mx-auto px-0 sm:px-6 lg:px-0 py-4">
      <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4 lg:gap-8">
        {features.map((feature, index) => (
          <div 
            key={index}
            className="group relative bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-md hover:shadow-lg sm:hover:shadow-xl transition-all duration-300 ease-in-out hover:-translate-y-1 border border-gray-100"
          >
            <div className="flex flex-col items-center text-center">
              <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-primary-50 rounded-full text-primary-600  group-hover:bg-primary-100 transition-colors duration-300">
                {feature.icon}
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900  mb-1 sm:mb-2">
                {feature.title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Icons;