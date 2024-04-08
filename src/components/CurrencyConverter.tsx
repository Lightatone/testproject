// CurrencyConverter.tsx
import React, { useState, useEffect, ChangeEvent } from 'react';
import './CurrencyConverter.css';
import axios from 'axios';
import { IoMdRefresh } from "react-icons/io";
import { MdOutlineCancel } from "react-icons/md";
import { FaLongArrowAltDown } from "react-icons/fa";

interface ICurrencyRates {
  [key: string]: number;
}

interface IComparison {
  id: number;
  sourceCurrency: string;
  targetCurrency: string;
  sourceAmount: string;
  lastUpdated: Date;
}

const CurrencyConverter: React.FC = () => {
    const [rates, setRates] = useState<ICurrencyRates>({});
    const [comparisons, setComparisons] = useState<IComparison[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [sourceCurrency, setSourceCurrency] = useState<string>('USD');
    const [targetCurrency, setTargetCurrency] = useState<string>('INR');

  useEffect(() => {
    const fetchRates = async () => {
      const url = 'https://open.er-api.com/v6/latest';
      try {
        const { data } = await axios.get(url);
        setRates(data.rates);
      } catch (error) {
        console.error('Error fetching currency rates:', error);
      }
    };
    fetchRates();
  }, []);

  const fetchRates = async (currency: string = 'USD', comparisonId?: number) => {
    try {
      const response = await axios.get(`https://open.er-api.com/v6/latest/${currency}`);
      setRates(response.data.rates);
      if (comparisonId) {
        setComparisons(comparisons.map(comp => {
          if (comp.id === comparisonId) {
            return { ...comp, lastUpdated: new Date() };
          }
          return comp;
        }));
      }
    } catch (error) {
      console.error('Error fetching currency rates:', error);
    }
  };
  const addComparison = () => {
    setIsModalOpen(false);
    const newComparison: IComparison = {
      id: comparisons.length + 1,
      sourceCurrency,
      targetCurrency,
      sourceAmount: '1',
      lastUpdated: new Date(),
    };
    setComparisons([...comparisons, newComparison]);
  };


  const handleSourceAmountChange = (id: number, amount: string) => {
    const updatedComparisons = comparisons.map(comp => {
      if (comp.id === id) {
        return { ...comp, sourceAmount: amount };
      }
      return comp;
    });
    setComparisons(updatedComparisons);
  };


  const calculateTargetAmount = (sourceAmount: string, sourceCurrency: string, targetCurrency: string): string => {
    const amount = parseFloat(sourceAmount);
    const rate = rates[targetCurrency] / rates[sourceCurrency];
    return isNaN(amount * rate) ? '' : (amount * rate).toFixed(2);
  };

  const refreshComparison = async (comparisonId: number) => {
    try {
      const comparison = comparisons.find(comp => comp.id === comparisonId);
      if (!comparison) return;
  
      const response = await axios.get(`https://open.er-api.com/v6/latest/${comparison.sourceCurrency}`);
      const rates = response.data.rates;
      
      const rate = rates[comparison.targetCurrency];
  
      setComparisons(comparisons.map(comp => {
        if (comp.id === comparisonId) {
          return { ...comp, lastUpdated: new Date() };
        }
        return comp;
      }));
  
      setRates({ ...rates, [comparison.targetCurrency]: rate });
  
    } catch (error) {
      console.error('Error refreshing comparison:', error);
    }
  };
  
  const closeComparison = (comparisonId : number) => {
    
    const updatedComparisons = comparisons.filter(comp => comp.id !== comparisonId);

    setComparisons(updatedComparisons);
  };
  
  

  return (
    <div>
      <h2 className='header' >Currency Converter</h2>
      {/*car container */}
      <div className="comparison-container">
        {comparisons.map((comp) => (
            <div key={comp.id} className="comparison-card">
                <div className="card-content">
                    <div className="comparison-detail">
                        <div className="comparison-detail-left">
                            <div>{comp.sourceCurrency}</div>
                            <div><FaLongArrowAltDown className='image-style' /></div>
                            <div>{comp.targetCurrency}</div>
                        </div>
                        <div className="comparison-detail-right">
                            <div className="rate">
                                <div>Rate:</div>
                                <div>{rates[comp.targetCurrency] ? (rates[comp.targetCurrency] / rates[comp.sourceCurrency]).toFixed(4) : 'Loading...'}</div>
                            </div>
                        </div>
                    </div>
                    <div className="comparison-inputs">
                            <div className="input-group">
                                <input
                                type="number"
                                value={comp.sourceAmount}
                                onChange={(e) => handleSourceAmountChange(comp.id, e.target.value)}
                                />
                            </div>
                            <div className="input-group">
                                <input
                                type="text"
                                value={calculateTargetAmount(comp.sourceAmount, comp.sourceCurrency, comp.targetCurrency)}
                                readOnly
                                />
                            </div>
                    </div>
                    <div className="footer">
                        <div className="last-updated">Last update: {comp.lastUpdated.toLocaleDateString()} {comp.lastUpdated.toLocaleTimeString()}</div>
                        <div className="actions">
                            <button className="refresh-btn" onClick={() => refreshComparison(comp.id)}><IoMdRefresh className="refresh-icon"/></button>
                            <button className="close-btn" onClick={() => closeComparison(comp.id)}><MdOutlineCancel /></button>
                        </div>
                    </div>
                </div>
            </div>
        ))}
        </div>

      <button className="add-comparison-button" onClick={() => setIsModalOpen(true)}>+</button>
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setIsModalOpen(false)}>&times;</span>
            <select value={sourceCurrency} onChange={(e) => setSourceCurrency(e.target.value)}>
              {Object.keys(rates).map((currency) => (
                <option key={currency} value={currency}>{currency}</option>
              ))}
            </select>
            <select value={targetCurrency} onChange={(e) => setTargetCurrency(e.target.value)}>
              {Object.keys(rates).map((currency) => (
                <option key={currency} value={currency}>{currency}</option>
              ))}
            </select>
            <button onClick={addComparison}>Add Comparison</button>
          </div>
        </div>
      )}
    </div>
  );
  
};

export default CurrencyConverter;
