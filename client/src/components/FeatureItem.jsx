import React from 'react';

const FeatureItem = ({ icon, text }) => {
  return (
    <div className="flex self-stretch">
      <div className="flex flex-col justify-center items-center px-1 py-2.5 min-h-[59px]">
        <div className="flex justify-center items-center px-2 w-10 h-10 bg-emerald-300 bg-opacity-10 rounded-[100px]">
          <img loading="lazy" src={icon} className="object-contain self-stretch my-auto w-6 h-6 bg-teal-700 aspect-square" alt="" />
        </div>
      </div>
      <div className="self-start mt-5 text-2xl leading-none basis-auto text-neutral-900">{text}</div>
    </div>
  );
};

export default FeatureItem;