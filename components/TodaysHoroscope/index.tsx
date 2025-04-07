import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { twMerge } from 'tailwind-merge';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiLoader, FiStar } from 'react-icons/fi';

interface HoroscopeFormInputs {
  astrology: 'vedic' | 'western';
  sign: string;
  timezone: string;
}

const signs = [
  { name: 'aries', icon: '♈' },
  { name: 'taurus', icon: '♉' },
  { name: 'gemini', icon: '♊' },
  { name: 'cancer', icon: '♋' },
  { name: 'leo', icon: '♌' },
  { name: 'virgo', icon: '♍' },
  { name: 'libra', icon: '♎' },
  { name: 'scorpio', icon: '♏' },
  { name: 'sagittarius', icon: '♐' },
  { name: 'capricorn', icon: '♑' },
  { name: 'aquarius', icon: '♒' },
  { name: 'pisces', icon: '♓' },
];

const timezones = [
  { value: '5.5', label: 'IST (UTC +5:30)' },
  { value: '0', label: 'GMT (UTC 0)' },
  { value: '-5', label: 'EST (UTC -5)' },
  { value: '-8', label: 'PST (UTC -8)' },
  { value: '1', label: 'CET (UTC +1)' },
  { value: '8', label: 'CST (UTC +8)' },
];

const TodayHoroscope: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [horoscopeData, setHoroscopeData] = useState<{
    sign: string;
    date: string;
    prediction: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<HoroscopeFormInputs>({
    defaultValues: {
      astrology: 'vedic',
      timezone: '5.5'
    }
  });

  const selectedSign = watch('sign');

  const onSubmit = async (data: HoroscopeFormInputs) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      
      const response = await axios.get(
        `${process.env.BACKEND_URL}/horoscope/${data.astrology}/${data.sign}`,
        {
          params: {
            tz: data.timezone
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await new Promise(resolve => setTimeout(resolve, 500));
      setHoroscopeData(response.data.data);
    } catch (error) {
      console.error('Error fetching horoscope:', error);
      toast.error('Failed to fetch horoscope. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center p-12 lg:p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl bg-white dark:bg-n-7 rounded-xl shadow-lg overflow-hidden"
      >
        <div className="max-h-[80vh] overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            {!horoscopeData ? (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit(onSubmit)} 
                className="space-y-6"
              >
                <motion.div 
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-center"
                >
                  <h2 className="h2 mb-3 text-transparent bg-clip-text bg-gradient-to-r from-primary-1 to-purple-500">
                    Today's Horoscope
                  </h2>
                  <p className="body1 text-n-4">Discover what the stars have in store for you</p>
                </motion.div>
                
                {/* Astrology Type */}
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="bg-n-2 dark:bg-n-6 p-4 rounded-lg"
                >
                  <label className="block mb-3 base1 font-semibold">Astrology System</label>
                  <div className="grid grid-cols-2 gap-3">
                    {['vedic', 'western'].map((type) => (
                      <motion.label 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        key={type}
                        className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                          watch('astrology') === type 
                            ? 'bg-primary-1/10 border-primary-1 border-2' 
                            : 'bg-n-1 dark:bg-n-5 border-2 border-transparent'
                        }`}
                      >
                        <input
                          type="radio"
                          value={type}
                          {...register('astrology', { required: true })}
                          className="form-radio h-4 w-4 text-primary-1"
                        />
                        <div>
                          <div className="base2 font-semibold">
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </div>
                        </div>
                      </motion.label>
                    ))}
                  </div>
                  {errors.astrology && (
                    <motion.small 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-red-500 mt-2 block"
                    >
                      Please select an astrology type
                    </motion.small>
                  )}
                </motion.div>

                {/* Zodiac Sign */}
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <label className="block mb-3 base1 font-semibold">Your Zodiac Sign</label>
                  <div className="grid grid-cols-3 gap-3">
                    {signs.map((sign) => (
                      <motion.label
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        key={sign.name}
                        className={`flex flex-col items-center p-3 rounded-lg cursor-pointer transition-all ${
                          selectedSign === sign.name
                            ? 'bg-primary-1/20 border-2 border-primary-1 shadow-md'
                            : 'bg-n-1 dark:bg-n-5 border-2 border-transparent hover:bg-n-3/20'
                        }`}
                      >
                        <input
                          type="radio"
                          value={sign.name}
                          {...register('sign', { required: true })}
                          className="hidden"
                        />
                        <span className="text-2xl mb-1">{sign.icon}</span>
                        <span className="base2">
                          {sign.name.charAt(0).toUpperCase() + sign.name.slice(1)}
                        </span>
                      </motion.label>
                    ))}
                  </div>
                  {errors.sign && (
                    <motion.small 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-red-500 mt-2 block"
                    >
                      Please select your zodiac sign
                    </motion.small>
                  )}
                </motion.div>

                {/* Timezone */}
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <label className="block mb-2 base1 font-semibold">Timezone</label>
                  <div className="relative">
                    <select
                      className={twMerge(
                        "w-full h-13 px-4 bg-n-1 dark:bg-n-5 border-2 border-n-3 dark:border-n-5 rounded-xl base2 text-n-7 dark:text-n-1 outline-none appearance-none",
                        errors.timezone && "border-red-500"
                      )}
                      {...register('timezone', { required: true })}
                    >
                      {timezones.map((tz) => (
                        <option key={tz.value} value={tz.value}>
                          {tz.label}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <FiChevronDown className="text-n-4" />
                    </div>
                  </div>
                  {errors.timezone && (
                    <motion.small 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-red-500 mt-2 block"
                    >
                      Please select a timezone
                    </motion.small>
                  )}
                </motion.div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="btn-blue w-full h-14 text-lg font-medium relative overflow-hidden"
                  disabled={loading}
                >
                  {loading ? (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center justify-center"
                    >
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        className="mr-2"
                      >
                        <FiLoader />
                      </motion.span>
                      Fetching your horoscope...
                    </motion.span>
                  ) : (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center justify-center"
                    >
                      <FiStar className="mr-2" />
                      Get Today's Horoscope
                    </motion.span>
                  )}
                </motion.button>
              </motion.form>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-n-2 dark:bg-n-6 rounded-xl">
                  <div className="flex items-center gap-3">
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-3xl"
                    >
                      {signs.find(s => s.name === horoscopeData.sign)?.icon}
                    </motion.div>
                    <div>
                      <h2 className="h3">
                        {horoscopeData.sign.charAt(0).toUpperCase() + horoscopeData.sign.slice(1)}
                      </h2>
                      <p className="caption1 text-n-4">
                        {horoscopeData.date}
                      </p>
                    </div>
                  </div>
                  <span className="caption1 px-3 py-1 bg-n-3 dark:bg-n-5 rounded-full">
                    {watch('astrology') === 'vedic' ? 'Vedic' : 'Western'} Astrology
                  </span>
                </div>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="p-5 bg-n-1 dark:bg-n-6 rounded-xl border border-n-3 dark:border-n-5"
                >
                  <p className="whitespace-pre-line body1 text-sm">
                    {horoscopeData.prediction}
                  </p>
                </motion.div>

                <div className="grid grid-cols-2 gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setHoroscopeData(null)}
                    className="btn-stroke-light w-full"
                  >
                    Check Another
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => window.location.reload()}
                    className="btn-blue w-full"
                  >
                    Refresh
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default TodayHoroscope;