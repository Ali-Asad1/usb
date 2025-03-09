import { Card, CardContent, CardHeader, CardTitle } from "@renderer/components/ui/card";
import { Input } from "@renderer/components/ui/input";
import { Slider } from "@renderer/components/ui/slider";
import { decimalToBinaryArray } from "@renderer/helper/decimal";
import { useDeviceSettings } from "@renderer/hooks/state/use-device-settings";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";


const Frequency = (): JSX.Element => {
  const { data, onChange } = useDeviceSettings();
  const location = useLocation();

  const [sliderValue, setSliderValue] = useState<number>(0);

  // تابع برای شمارش تعداد تون‌های انتخاب‌شده
  const countSelectedTones = (mSelect: number): number => {
    return decimalToBinaryArray(mSelect).filter((bit) => bit === 1).length;
  };

  // تابع برای تعیین حداقل فرکانس
  const getMinFrequency = (): number => {
    if (location.pathname === "/multi-tone") {
      const selectedTones = countSelectedTones(data.MULTON.MSELECT);
      switch (selectedTones) {
        case 1:
          return 15;
        case 2:
          return 18;
        case 3:
          return 20;
        case 4:
          return 21;
        case 5:
          return 22;
      }
    }

    if (location.pathname === "/barrage") {
      switch (data.BARAGE.BNUMBER) {
        case 128:
          return 15;
        case 64:
          return 12;
        case 32:
          return 9;
        case 16:
          return 6;
        case 8:
          return 3;
      }
    }

    if (location.pathname === "/filtered-noise") {
      switch (data.FNOISE.NOISEBW) {
        case 56000000:
          return 11;
        case 20000000:
          return 16;
        case 8000000:
          return 14;
        case 5000000:
          return 12;
        case 2000000:
          return 8;
      }
    }

    if (location.pathname === "/single-tone") {
      return 15;
    }

    if (location.pathname === "/sweep") {
      return 33;
    }

    if (location.pathname === "/delay-doppler") {
      return 8;
    }

    return 50;
  };

  const minFrequency = getMinFrequency(); 

  // تابع برای تبدیل مقدار اسلایدر به مقدار معکوس
  const reverseValue = (value: number, minValue: number, maxValue: number): number => {
    return maxValue - (value - minValue);
  };

  // محاسبه درصد پر شدن اسلایدر
  const calculateFillPercentage = (value: number, minValue: number, maxValue: number): string => {
    const percentage = ((value - minValue) / (maxValue - minValue)) * 100;
    return `${percentage}%`;
  };

  // به‌روزرسانی مقدار اسلایدر و TXATTEN وقتی minFrequency تغییر می‌کند
  useEffect(() => {
    const newMinFrequency = getMinFrequency();
    const newTXATTEN = Math.max(newMinFrequency, Math.min(data.LOFATT.TXATTEN, 65)); // محدود کردن TXATTEN به محدوده جدید
    onChange({ ...data, LOFATT: { ...data.LOFATT, TXATTEN: newTXATTEN } });
    const reversedValue = reverseValue(newTXATTEN, newMinFrequency, 65);
    setSliderValue(reversedValue);
  }, [minFrequency]);

  // به‌روزرسانی مقدار اسلایدر وقتی data.LOFATT.TXATTEN تغییر می‌کند
  useEffect(() => {
    const reversedValue = reverseValue(data.LOFATT.TXATTEN, minFrequency, 65);
    setSliderValue(reversedValue);
  }, [data.LOFATT.TXATTEN, minFrequency]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>RF Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Power Level
        </label>
        <div className="relative w-full">
          {/* اسلایدر */}
          <Slider
            value={[reverseValue(data.LOFATT.TXATTEN, minFrequency, 65)]} // مقدار معکوس شده
            onValueChange={(values) => {
              const reversedValue = reverseValue(values[0], minFrequency, 65); // معکوس کردن مقدار جدید
              onChange({ ...data, LOFATT: { ...data.LOFATT, TXATTEN: reversedValue } });
            }}
            min={minFrequency} // مقدار کوچکتر
            max={65} // مقدار بزرگتر
            step={1}
            className="w-full"
          />
          {/* نمایش مسیر پر شدن اسلایدر */}
          <div
            className="absolute top-0 left-0 h-2 bg-blue-500 rounded-full"
            style={{
              width: calculateFillPercentage(
                reverseValue(data.LOFATT.TXATTEN, minFrequency, 65),
                minFrequency,
                65
              ),
            }}
          ></div>
        </div>
        <div className="mt-5">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Frequency (Hz)
          </label>
          <Input
            type="number"
            placeholder="frequency (Hz)"
            min={150000000}
            max={5500000000}
            value={data.LOFATT.LOFRQCY}
            onChange={(e) => {
              let value = Number(e.target.value);

              // Validate the input value for the new range
              if (value < 150000000) {
                value = 150000000;
              } else if (value > 5500000000) {
                value = 5500000000;
              }

              onChange({ ...data, LOFATT: { ...data.LOFATT, LOFRQCY: value } });
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default Frequency;
