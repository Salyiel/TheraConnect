import React from 'react';

const TherapyOption = ({ title, description, bgColor }) => {
  return (
    <div className={`flex flex-col px-20 py-3.5 mt-11 max-w-full ${bgColor} rounded-3xl text-neutral-900 w-[516px] max-md:px-5 max-md:mt-10`}>
      <h3 className="self-start text-2xl font-medium leading-none">{title}</h3>
      <p className="text-xl font-light leading-none">{description}</p>
    </div>
  );
};

export default TherapyOption;