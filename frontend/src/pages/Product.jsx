import React, { useContext, useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { TbRulerMeasure } from "react-icons/tb";
import RelatedProducts from '../components/RelatedProducts';
import axios from 'axios';

const COLOR_HEX_MAP = {
  "Navy": "#001F3F",
  "Grey": "#808080",
  "Black": "#000000",
  "Olive Green": "#556B2F",
  "White": "#FFFFFF",
  "Light Pink": "#FFB6C1",
  "Lavender": "#E6E6FA",
  "Mint": "#98FF98",
  "Baby Blue": "#ADD8E6",
  "Beige": "#F5F5DC",
  "Brick Red": "#8B0000",
  "Coffee Brown": "#4B3621",
  "Copper": "#B87333",
  "Flag Green": "#006400",
  "Flamingo": "#FC8EAC",
  "Golden Yellow": "#FFD700",
  "Jade": "#00A86B",
  "Mushroom": "#BEBEBE",
  "New Yellow": "#FFFF00",
  "Off White": "#FAF9F6",
  "Orange": "#FFA500",
  "Peach": "#FFE5B4",
  "Petrol Blue": "#004B6B",
  "Purple": "#800080",
  "Steel Grey": "#71797E",
  "Yellow": "#FFFF00",
  "Coral": "#FF7F50",
  "Mustard Yellow": "#FFDB58",
  "Maroon": "#800000",
  "Royal Blue": "#4169E1",
  "Green": "#008000",
  "Red": "#FF0000",
  "Charcoal Melange": "#36454F",
  "Grey Melange": "#A9A9A9",
  "Sky Blue": "#87CEEB",
  "Orchid Blue": "#7B68EE",
  "Multi": "#36454F"
};

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart, cartItems, backendUrl } = useContext(ShopContext);
  const navigate = useNavigate();

  const [productData, setProductData] = useState(false);
  const [mainImage, setMainImage] = useState('');
  const [size, setSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [colorImages, setColorImages] = useState({});
  const [stockInfo, setStockInfo] = useState({});
  const [displayedStock, setDisplayedStock] = useState({});
  const [isCurrentSizeOutOfStock, setIsCurrentSizeOutOfStock] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showSizeChart, setShowSizeChart] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const fetchProductData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${backendUrl}/api/product/single`, { productId });
      if (response.data.success) {
        const product = response.data.product;
        setProductData(product);

        if (product.colors?.[0]?.images?.length > 0) {
          setMainImage(product.colors[0].images[0]);
          setSelectedColor(product.colors[0].name);
        } else if (product.image?.length > 0) {
          setMainImage(product.image[0]);
        }

        const imagesByColor = {};
        const baseStockByColor = {};
        product.colors?.forEach(color => {
          imagesByColor[color.name] = color.images;
          baseStockByColor[color.name] = color.stock instanceof Map
            ? Object.fromEntries(color.stock)
            : color.stock;
        });

        setColorImages(imagesByColor);
        setStockInfo(baseStockByColor);
      }
    } catch (error) {
      console.error('Error fetching product data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [backendUrl, productId]);

  useEffect(() => {
    fetchProductData();
  }, [fetchProductData]);

  useEffect(() => {
    const handleOrderPlaced = async () => {
      try {
        const response = await axios.post(`${backendUrl}/api/product/single`, { productId });
        if (response.data.success) {
          const product = response.data.product;
          setProductData(product);

          if (product.colors?.[0]?.images?.length > 0) {
            setMainImage(product.colors[0].images[0]);
            setSelectedColor(product.colors[0].name);
          } else if (product.image?.length > 0) {
            setMainImage(product.image[0]);
          }

          const baseStockByColor = {};
          product.colors?.forEach(color => {
            baseStockByColor[color.name] = color.stock instanceof Map
              ? Object.fromEntries(color.stock)
              : color.stock;
          });
          setStockInfo(baseStockByColor);
        }
      } catch (error) {
        console.error('Error refreshing product data after order:', error);
      }
    };

    window.addEventListener('orderPlaced', handleOrderPlaced);
    return () => window.removeEventListener('orderPlaced', handleOrderPlaced);
  }, [backendUrl, productId]);

  useEffect(() => {
    if (productData && cartItems && Object.keys(stockInfo).length > 0) {
      const displayStockInfo = structuredClone(stockInfo);
      const productCartItems = cartItems[productData._id];

      if (productCartItems) {
        for (const key in productCartItems) {
          const [itemSize, itemColor] = key.split('-');
          const quantityInCart = productCartItems[key];
          if (displayStockInfo[itemColor]?.[itemSize] !== undefined) {
            displayStockInfo[itemColor][itemSize] = Math.max(0, displayStockInfo[itemColor][itemSize] - quantityInCart);
          }
        }
      }
      setDisplayedStock(displayStockInfo);
    }
  }, [cartItems, productData, stockInfo]);

  useEffect(() => {
    const currentSizeStock = getStockQuantity(size);
    setIsCurrentSizeOutOfStock(currentSizeStock === 0);
  }, [size, selectedColor, stockInfo, cartItems]);

  const handleColorClick = (colorName) => {
    setSelectedColor(colorName);
    if (colorImages[colorName]?.length > 0) {
      setMainImage(colorImages[colorName][0]);
    } else if (productData.image?.length > 0) {
      setMainImage(productData.image[0]);
    }
    setSize('');
  };

  const getStockQuantity = (sizeOption) => {
    return displayedStock[selectedColor]?.[sizeOption] || 0;
  };

  const isSizeAvailable = (sizeOption) => {
    return getStockQuantity(sizeOption) > 0;
  };

  const getStockStatus = (quantity) => {
    if (quantity === 0) return { text: 'Out of Stock', class: 'text-red-500' };
    if (quantity <= 5) return { text: `Only ${quantity} left`, class: 'text-yellow-500' };
    return { text: `${quantity} in stock`, class: 'text-green-500' };
  };

  // Automatically select first color for Combo products
  useEffect(() => {
    if (productData && productData.category && productData.category.toLowerCase() === 'combo' && productData.colors && productData.colors.length > 0) {
      setSelectedColor(productData.colors[0].name);
      if (productData.colors[0].images?.length > 0) {
        setMainImage(productData.colors[0].images[0]);
      } else if (productData.image?.length > 0) {
        setMainImage(productData.image[0]);
      }
    }
  }, [productData]);

  // Add a helper to check if product is Combo7
  const isCombo7 = productData && productData.category && productData.category === 'Combo7';
  // State for Combo7 selections - separate size selection
  const [combo7Selections, setCombo7Selections] = useState([
    { color: '' },
    { color: '' },
    { color: '' },
    { color: '' },
  ]);
  const [combo7Size, setCombo7Size] = useState('');
  
  // Helper to get available colors for Combo7
  const availableCombo7Colors = productData && productData.colors ? productData.colors : [];
  
  // Helper to get available sizes for Combo7 (common sizes across all selected colors)
  const getCombo7Sizes = () => {
    const selectedColors = combo7Selections.filter(sel => sel.color);
    if (selectedColors.length === 0) return [];
    
    // Get all sizes from selected colors
    const allSizes = new Set();
    selectedColors.forEach(sel => {
      const colorObj = availableCombo7Colors.find(c => c.name === sel.color);
      if (colorObj && colorObj.stock) {
        Object.keys(colorObj.stock).forEach(size => allSizes.add(size));
      }
    });
    
    // Only return sizes that are available in ALL selected colors
    const commonSizes = Array.from(allSizes).filter(size => {
      return selectedColors.every(sel => {
        const colorObj = availableCombo7Colors.find(c => c.name === sel.color);
        return colorObj && colorObj.stock && colorObj.stock[size] > 0;
      });
    });
    
    return commonSizes.sort();
  };
  
  // Helper to get stock for a color/size
  const getCombo7Stock = (colorName, size) => {
    const colorObj = availableCombo7Colors.find(c => c.name === colorName);
    return colorObj && colorObj.stock ? colorObj.stock[size] || 0 : 0;
  };
  
  // Handler for Combo7 color selection change
  const handleCombo7ColorChange = (idx, colorName) => {
    setCombo7Selections(prev => {
      const updated = [...prev];
      updated[idx] = { color: colorName };
      return updated;
    });
    // Reset size when colors change
    setCombo7Size('');
  };
  
  // Helper to check if all 4 selections are valid
  const isCombo7Valid = combo7Selections.every(sel => sel.color) && combo7Size;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Only show size chart for topwear
  const isTopwear = productData && (
    (productData.category && productData.category.toLowerCase().includes('topwear')) ||
    (productData.subCategory && productData.subCategory.toLowerCase().includes('topwear'))
  );

  // Add a helper to check if product is Combo
  const isCombo = productData && productData.category && productData.category.toLowerCase() === 'combo';

  return productData ? (
    <div className='border-t-2 pt-10 mt-20'>
      <div className='flex gap-12 flex-col sm:flex-row'>
        {/* Images */}
        <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row'>
          <div className='flex sm:flex-col overflow-x-auto sm:overflow-y-scroll gap-1 sm:w-[18.7%] w-full'>
            {(selectedColor !== '' && colorImages[selectedColor] ? colorImages[selectedColor] : productData.image).map((item, index) => (
              <img onClick={() => setMainImage(item)} src={item} key={index} className='w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer' alt="" />
            ))}
          </div>
          <div className='w-full sm:w-[80%]'>
            <img className='w-full h-auto' src={mainImage} alt="" />
          </div>
        </div>

        {/* Info */}
        <div className='flex-1'>
          <h1 className='font-medium text-2xl mt-2'>{productData.name}</h1>
          <p className='text-gray-700 mt-3 mb-2'>{productData.description}</p>
          <div className='flex items-center gap-2 mb-1'>
            <p className='text-lg font-semibold'>₹{productData.price}</p>
          </div>

          {isCombo7 ? (
            <div className="mt-4 border p-4 rounded bg-orange-50">
              <h3 className="font-semibold text-lg mb-2">Pick Any 4 T-shirts (Combo7)</h3>
              <p className="text-sm mb-4">Select 4 different colors and one common size for all T-shirts.</p>
              
              {/* Color selections */}
              <div className="mb-4">
                <h4 className="font-medium mb-2">Select 4 Colors:</h4>
                {combo7Selections.map((sel, idx) => (
                  <div key={idx} className="flex items-center gap-4 mb-2">
                    <span className="font-medium">T-shirt {idx + 1}:</span>
                    <select
                      className="border rounded px-2 py-1"
                      value={sel.color}
                      onChange={e => handleCombo7ColorChange(idx, e.target.value)}
                    >
                      <option value="">Select Color</option>
                      {availableCombo7Colors.map(color => (
                        <option
                          key={color.name}
                          value={color.name}
                          disabled={combo7Selections.some((s, i) => i !== idx && s.color === color.name)}
                        >
                          {color.name}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
              
              {/* Size selection */}
              <div className="mb-4">
                <h4 className="font-medium mb-2">Select Size (for all T-shirts):</h4>
                <select
                  className="border rounded px-2 py-1"
                  value={combo7Size}
                  onChange={e => setCombo7Size(e.target.value)}
                  disabled={combo7Selections.filter(sel => sel.color).length === 0}
                >
                  <option value="">Select Size</option>
                  {getCombo7Sizes().map(sizeOption => (
                    <option key={sizeOption} value={sizeOption}>
                      {sizeOption}
                    </option>
                  ))}
                </select>
                {combo7Selections.filter(sel => sel.color).length > 0 && getCombo7Sizes().length === 0 && (
                  <p className="text-red-500 text-xs mt-1">No common sizes available for selected colors</p>
                )}
              </div>
              
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Your Selection:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {combo7Selections.map((sel, idx) => (
                    <div key={idx} className="text-sm bg-white rounded p-2 border">
                      Color {idx + 1}: <span className="font-medium">{sel.color || '-'}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-2 text-sm bg-white rounded p-2 border">
                  Size: <span className="font-medium">{combo7Size || '-'}</span>
                </div>
              </div>
              
              <button
                onClick={() => {
                  // Add Combo7 selections to cart - transform data to match expected format
                  const combo7Data = combo7Selections.map(sel => ({
                    color: sel.color,
                    size: combo7Size
                  }));
                  addToCart(productData._id, combo7Data, 'Combo7');
                  navigate('/cart');
                }}
                disabled={!isCombo7Valid}
                className="mt-6 px-5 py-2 bg-black text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors duration-300"
              >
                Add to Cart
              </button>
            </div>
          ) : (
            <>
              {isCombo ? (
                <div className='mt-4'>
                  <h4 className='text-sm mb-2 font-medium'>Color: {productData.colors[0].name}</h4>
                </div>
              ) : (
                <div className='mt-4'>
                  <h4 className='text-sm mb-2 font-medium'>Available Colors</h4>
                  <div className='grid grid-cols-8 gap-3 max-w-[320px]'>
                    {productData.colors.map(color => (
                      <button
                        key={color.name}
                        onClick={() => handleColorClick(color.name)}
                        aria-label={color.name}
                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center relative transition-all duration-150 ${selectedColor === color.name ? 'border-black' : 'border-gray-300'}`}
                        style={{ backgroundColor: color.value || COLOR_HEX_MAP[color.name] || '#eee' }}
                      >
                        {selectedColor === color.name && (
                          <span
                            style={{
                              color: 'white',
                              fontWeight: 'bold',
                              fontSize: '1.2rem',
                              textShadow: '0 0 4px #000',
                              position: 'absolute',
                              top: '50%',
                              left: '50%',
                              transform: 'translate(-50%, -50%)',
                              pointerEvents: 'none',
                            }}
                          >&#10003;</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* For Combo, show sizes directly for the first color */}
              {isCombo ? (
                <div className='mt-4'>
                  <h4 className='text-sm mb-2 font-medium'>Select Size:</h4>
                  <div className='flex gap-2 flex-wrap'>
                    {Object.keys(stockInfo[productData.colors[0].name] || {}).map((sizeOption, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSelectedColor(productData.colors[0].name);
                          setSize(sizeOption);
                        }}
                        disabled={!isSizeAvailable(sizeOption)}
                        className={`px-3 py-1 border rounded 
                          ${size === sizeOption ? 'border-black' : 'border-gray-300'} 
                          ${!isSizeAvailable(sizeOption) ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        {sizeOption}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                selectedColor && (
                  <div className='mt-4'>
                    <h4 className='text-sm mb-2 font-medium'>Select Size:</h4>
                    <div className='flex gap-2 flex-wrap'>
                      {Object.keys(stockInfo[selectedColor] || {}).map((sizeOption, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSize(sizeOption)}
                          disabled={!isSizeAvailable(sizeOption)}
                          className={`px-3 py-1 border rounded 
                            ${size === sizeOption ? 'border-black' : 'border-gray-300'} 
                            ${!isSizeAvailable(sizeOption) ? 'opacity-50 cursor-not-allowed' : ''}`}>
                          {sizeOption}
                        </button>
                      ))}
                    </div>
                  </div>
                )
              )}

              {isTopwear && (
                <button
                  onClick={() => setShowSizeChart(true)}
                  className='mt-4 text-xs underline flex items-center hover:text-gray-700'>
                  <TbRulerMeasure className='text-2xl mr-2' />
                  Size Chart
                </button>
              )}

              {selectedColor && (
                <p className="mt-4 text-sm font-medium">
                  Color: <span className="text-gray-700">{selectedColor}</span>
                </p>
              )}

              {size && (
                <div className={`mt-2 text-sm ${getStockStatus(getStockQuantity(size)).class}`}>
                  {getStockStatus(getStockQuantity(size)).text}
                </div>
              )}

              <button
                onClick={() => {
                  addToCart(productData._id, size, selectedColor);
                  navigate('/cart');
                }}
                disabled={!size || isCurrentSizeOutOfStock}
                className='mt-4 px-5 py-2 bg-black text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors duration-300'>
                Add to Cart
              </button>
            </>
          )}
        </div>
      </div>

      {/* Size Chart Modal */}
      {isTopwear && showSizeChart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-2">
          <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setShowSizeChart(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl font-bold"
            >
              &times;
            </button>
            {/* Size Guide Tabs */}
            <SizeGuideTabs />
          </div>
        </div>
      )}

      <RelatedProducts category={productData.category} currentProductId={productData._id} />
    </div>
  ) : (
    <div className='text-center py-20 text-lg font-medium'>Product not found</div>
  );
};

const UnisexTShirtSizeGuide = () => (
  <div className="p-2 bg-white rounded shadow-md">
    <h3 className="text-lg font-semibold mb-4 text-center sm:text-left">Unisex T-Shirt Size Guide</h3>
    <div className="overflow-x-auto border rounded-lg shadow-sm">
      <table className="min-w-full bg-white border border-gray-200 text-sm sm:text-base">
        <thead className="bg-gray-100 sticky top-0 z-10">
          <tr>
            {['Unisex T-Shirt', 'XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL', '6XL', '7XL'].map((size, idx) => (
              <th key={size} className={`py-2 px-4 border-b whitespace-nowrap ${idx === 0 ? 'text-left' : 'text-center'}`}>{size}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="bg-orange-50">
            <td className="py-2 px-4 border-b text-left">Chest (Inch)</td>
            {[36, 38, 40, 42, 44, 46, 48, 50, 52, 56, 60].map((val, i) => (
              <td key={i} className="py-2 px-4 border-b text-center">{val}</td>
            ))}
          </tr>
          <tr className="bg-blue-50">
            <td className="py-2 px-4 text-left">Length (Inch)</td>
            {[25, 26, 27, 28, 29, 30, 31, 32, 32, 33, 33].map((val, i) => (
              <td key={i} className="py-2 px-4 text-center">{val}</td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);

const OversizedTShirtSizeGuide = () => (
  <div>
    <h3 className="text-lg font-semibold mb-4 text-center sm:text-left">Oversized T-Shirt Size Guide</h3>
    <div className="overflow-x-auto border rounded-lg shadow-sm">
      <table className="min-w-full bg-white border border-gray-200 text-sm sm:text-base">
        <thead className="bg-gray-100 sticky top-0 z-10">
          <tr>
            {['Oversized T-Shirt', 'XS', 'S', 'M', 'L', 'XL', '2XL'].map((size, idx) => (
              <th key={size} className={`py-2 px-4 border-b whitespace-nowrap ${idx === 0 ? 'text-left' : 'text-center'}`}>{size}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="bg-orange-50">
            <td className="py-2 px-4 border-b text-left">Length (Inch)</td>
            {[27, 28, 29, 30, 31, 32].map((val, i) => (
              <td key={i} className="py-2 px-4 border-b text-center">{val}</td>
            ))}
          </tr>
          <tr className="bg-blue-50">
            <td className="py-2 px-4 text-left">Chest (Inch)</td>
            {[39, 41, 43, 45, 47, 49].map((val, i) => (
              <td key={i} className="py-2 px-4 text-center">{val}</td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);

// SizeGuideTabs component manages which guide is shown
const SizeGuideTabs = () => {
  const [selectedGuide, setSelectedGuide] = useState('unisex');
  return (
    <div className="mt-4">
      <div className="flex gap-4 mb-6 justify-center">
        <button
          className={`text-lg font-semibold px-4 py-2 rounded-t border-b-2 transition-colors duration-200 ${selectedGuide === 'unisex' ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-black'}`}
          onClick={() => setSelectedGuide('unisex')}
        >
          T-Shirts
        </button>
        <button
          className={`text-lg font-semibold px-4 py-2 rounded-t border-b-2 transition-colors duration-200 ${selectedGuide === 'oversized' ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-black'}`}
          onClick={() => setSelectedGuide('oversized')}
        >
          Oversized T-Shirts
        </button>
      </div>
      <div className="space-y-8">
        {selectedGuide === 'unisex' && <UnisexTShirtSizeGuide />}
        {selectedGuide === 'oversized' && <OversizedTShirtSizeGuide />}
      </div>
    </div>
  );
};

export default Product;



