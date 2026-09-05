import React, { useState } from "react";

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: string;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({ isOpen, onClose, category = "clothing" }) => {
  const [activeTab, setActiveTab] = useState<"men" | "women" | "footwear">(() => {
    if (category === "footwear") return "footwear";
    if (category === "women") return "women";
    return "men";
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-[#fdfcf9] border border-[#ded8cb] shadow-2xl rounded-[2px] p-6 sm:p-8 z-10 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-[#ece7db] mb-6">
          <div>
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#887f70] font-sans">
              STUDIO SPECIFICATIONS
            </span>
            <h3 className="font-serif text-2xl font-light text-[#22201d]">Size & Fit Guide</h3>
          </div>
          <button onClick={onClose} className="p-2 text-[#6e6456] hover:text-black">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex border-b border-[#ded8cc] mb-6">
          <button
            onClick={() => setActiveTab("men")}
            className={`pb-3 px-4 text-xs font-sans tracking-[0.18em] uppercase font-medium border-b-2 transition-colors ${
              activeTab === "men"
                ? "border-[#1b1916] text-[#1b1916]"
                : "border-transparent text-[#7e7465] hover:text-black"
            }`}
          >
            Men's Garments
          </button>
          <button
            onClick={() => setActiveTab("women")}
            className={`pb-3 px-4 text-xs font-sans tracking-[0.18em] uppercase font-medium border-b-2 transition-colors ${
              activeTab === "women"
                ? "border-[#1b1916] text-[#1b1916]"
                : "border-transparent text-[#7e7465] hover:text-black"
            }`}
          >
            Women's Garments
          </button>
          <button
            onClick={() => setActiveTab("footwear")}
            className={`pb-3 px-4 text-xs font-sans tracking-[0.18em] uppercase font-medium border-b-2 transition-colors ${
              activeTab === "footwear"
                ? "border-[#1b1916] text-[#1b1916]"
                : "border-transparent text-[#7e7465] hover:text-black"
            }`}
          >
            Footwear
          </button>
        </div>

        {/* Tab Content Table */}
        <div className="overflow-x-auto text-xs font-sans">
          {activeTab === "men" && (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#ded8cb] text-[#6d6353] font-medium tracking-wider uppercase text-[10px]">
                  <th className="py-2.5 px-3">Size</th>
                  <th className="py-2.5 px-3">Chest (in)</th>
                  <th className="py-2.5 px-3">Waist (in)</th>
                  <th className="py-2.5 px-3">Shoulder (in)</th>
                  <th className="py-2.5 px-3">Length (in)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ece7dc] text-[#332f29]">
                <tr>
                  <td className="py-2.5 px-3 font-medium">XS</td>
                  <td className="py-2.5 px-3">36</td>
                  <td className="py-2.5 px-3">28 - 29</td>
                  <td className="py-2.5 px-3">16.5</td>
                  <td className="py-2.5 px-3">28</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-medium">S</td>
                  <td className="py-2.5 px-3">38</td>
                  <td className="py-2.5 px-3">30 - 31</td>
                  <td className="py-2.5 px-3">17.25</td>
                  <td className="py-2.5 px-3">28.5</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-medium">M</td>
                  <td className="py-2.5 px-3">40</td>
                  <td className="py-2.5 px-3">32 - 33</td>
                  <td className="py-2.5 px-3">18</td>
                  <td className="py-2.5 px-3">29</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-medium">L</td>
                  <td className="py-2.5 px-3">42</td>
                  <td className="py-2.5 px-3">34 - 35</td>
                  <td className="py-2.5 px-3">18.75</td>
                  <td className="py-2.5 px-3">29.5</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-medium">XL</td>
                  <td className="py-2.5 px-3">44</td>
                  <td className="py-2.5 px-3">36 - 37</td>
                  <td className="py-2.5 px-3">19.5</td>
                  <td className="py-2.5 px-3">30</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-medium">XXL</td>
                  <td className="py-2.5 px-3">46</td>
                  <td className="py-2.5 px-3">38 - 40</td>
                  <td className="py-2.5 px-3">20.25</td>
                  <td className="py-2.5 px-3">30.5</td>
                </tr>
              </tbody>
            </table>
          )}

          {activeTab === "women" && (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#ded8cb] text-[#6d6353] font-medium tracking-wider uppercase text-[10px]">
                  <th className="py-2.5 px-3">Size</th>
                  <th className="py-2.5 px-3">Bust (in)</th>
                  <th className="py-2.5 px-3">Waist (in)</th>
                  <th className="py-2.5 px-3">Hips (in)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ece7dc] text-[#332f29]">
                <tr>
                  <td className="py-2.5 px-3 font-medium">XS (UK 6)</td>
                  <td className="py-2.5 px-3">32</td>
                  <td className="py-2.5 px-3">24 - 25</td>
                  <td className="py-2.5 px-3">35</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-medium">S (UK 8)</td>
                  <td className="py-2.5 px-3">34</td>
                  <td className="py-2.5 px-3">26 - 27</td>
                  <td className="py-2.5 px-3">37</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-medium">M (UK 10)</td>
                  <td className="py-2.5 px-3">36</td>
                  <td className="py-2.5 px-3">28 - 29</td>
                  <td className="py-2.5 px-3">39</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-medium">L (UK 12)</td>
                  <td className="py-2.5 px-3">38</td>
                  <td className="py-2.5 px-3">30 - 31</td>
                  <td className="py-2.5 px-3">41</td>
                </tr>
              </tbody>
            </table>
          )}

          {activeTab === "footwear" && (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#ded8cb] text-[#6d6353] font-medium tracking-wider uppercase text-[10px]">
                  <th className="py-2.5 px-3">UK / India</th>
                  <th className="py-2.5 px-3">EU</th>
                  <th className="py-2.5 px-3">US</th>
                  <th className="py-2.5 px-3">Foot Length (cm)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ece7dc] text-[#332f29]">
                <tr>
                  <td className="py-2.5 px-3 font-medium">UK 6</td>
                  <td className="py-2.5 px-3">40</td>
                  <td className="py-2.5 px-3">7</td>
                  <td className="py-2.5 px-3">25.0</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-medium">UK 7</td>
                  <td className="py-2.5 px-3">41</td>
                  <td className="py-2.5 px-3">8</td>
                  <td className="py-2.5 px-3">25.8</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-medium">UK 8</td>
                  <td className="py-2.5 px-3">42</td>
                  <td className="py-2.5 px-3">9</td>
                  <td className="py-2.5 px-3">26.7</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-medium">UK 9</td>
                  <td className="py-2.5 px-3">43</td>
                  <td className="py-2.5 px-3">10</td>
                  <td className="py-2.5 px-3">27.5</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-medium">UK 10</td>
                  <td className="py-2.5 px-3">44</td>
                  <td className="py-2.5 px-3">11</td>
                  <td className="py-2.5 px-3">28.3</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-medium">UK 11</td>
                  <td className="py-2.5 px-3">45</td>
                  <td className="py-2.5 px-3">12</td>
                  <td className="py-2.5 px-3">29.1</td>
                </tr>
              </tbody>
            </table>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-[#ece7dc] flex items-center justify-between text-[11px] text-[#786e5e]">
          <span>Need personalized fitting advice? Contact our studio concierges.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#1f1d1a] text-[#f7f5f0] uppercase tracking-wider text-[10px] font-medium"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
