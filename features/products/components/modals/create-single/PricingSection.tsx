
import React from 'react';

interface PricingSectionProps {
    price: string;
    setPrice: (val: string) => void;
    oldPrice: string;
    setOldPrice: (val: string) => void;
    sku: string;
    setSku: (val: string) => void;
    priceError?: boolean;
}

export const PricingSection: React.FC<PricingSectionProps> = ({
    price, setPrice, oldPrice, setOldPrice, sku, setSku, priceError
}) => {
    return (
        <div className="grid grid-cols-3 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Цена, ₽ <span className="text-red-500">*</span></label>
                <input 
                    type="number" 
                    value={price} 
                    onChange={e => setPrice(e.target.value)} 
                    className={`w-full mt-1 p-2 border rounded-md no-spinners focus:outline-none focus:ring-2 ${
                        priceError 
                            ? 'border-red-500 focus:ring-red-500' 
                            : 'focus:ring-indigo-500'
                    }`}
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Старая цена</label>
                <input type="number" value={oldPrice} onChange={e => setOldPrice(e.target.value)} className="w-full mt-1 p-2 border rounded-md no-spinners focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Необяз." />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Артикул</label>
                <input type="text" value={sku} onChange={e => setSku(e.target.value)} className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Необяз." />
            </div>
        </div>
    );
};
