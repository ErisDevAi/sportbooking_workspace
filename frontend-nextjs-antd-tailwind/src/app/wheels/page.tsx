'use client';

import { useState } from 'react';
import { Wheel } from 'react-custom-roulette';

export default function WheelPage() {
  const data = [
    { option: 'Phở 🍜' },
    { option: 'Pizza 🍕' },
    { option: 'Bún chả 🥩' },
    { option: 'Trà sữa 🧋' },
  ];

  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);

  const handleSpinClick = () => {
    const random = Math.floor(Math.random() * data.length);

    setPrizeNumber(random);
    setMustSpin(true);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6">
      <h1 className="text-4xl font-bold">
        Vòng quay hôm nay ăn gì 🎯
      </h1>

      <Wheel
        mustStartSpinning={mustSpin}
        prizeNumber={prizeNumber}
        data={data}
        backgroundColors={[
          '#FF6B6B',
          '#4ECDC4',
          '#45B7D1',
          '#FFA502',
        ]}
        textColors={['#ffffff']}
        onStopSpinning={() => {
          setMustSpin(false);
        }}
      />

      <button
        onClick={handleSpinClick}
        className="rounded-xl bg-black px-6 py-3 text-white hover:scale-105 transition"
      >
        Quay ngay 🎰
      </button>
    </div>
  );
}