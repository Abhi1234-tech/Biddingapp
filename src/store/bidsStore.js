
import { atom } from 'jotai';
import axios from 'axios';

// Atom to store all bids fetched from backend
export const bidsAtom = atom([]);

export const fetchBids = async (setBids) => {
  try {
    const response = await axios.get('http://localhost:5000/api/bids');
    setBids(response.data);
  } catch (error) {
    console.error('Error fetching bids:', error);
    setBids([]);
  }
};


export const userBidsAtom = atom([]);


export const userAddedBidsAtom = atom([]);
