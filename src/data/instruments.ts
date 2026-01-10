export interface Instrument {
  id: string;
  name: string;
  type: string;
  image: string;
  isCheckedOut: boolean;
  checkedOutBy: string | null;
  checkedOutAt: string | null;
}

export const instruments: Instrument[] = [
  {
    id: '1',
    name: 'Irumbu Parai',
    type: 'Parai',
    image: process.env.NODE_ENV === 'production' ? './images/IrumbuParai.jpeg' : '/images/IrumbuParai.jpeg',
    isCheckedOut: false,
    checkedOutBy: null,
    checkedOutAt: null
  },
  {
    id: '2',
    name: 'Kombu Back',
    type: 'Kombu',
    image: process.env.NODE_ENV === 'production' ? './images/KombuBack-1.jpeg' : '/images/KombuBack-1.jpeg',
    isCheckedOut: false,
    checkedOutBy: null,
    checkedOutAt: null
  },
  {
    id: '3',
    name: 'Kombu Front',
    type: 'Kombu',
    image: process.env.NODE_ENV === 'production' ? './images/KombuFront-1.jpeg' : '/images/KombuFront-1.jpeg',
    isCheckedOut: false,
    checkedOutBy: null,
    checkedOutAt: null
  },
  {
    id: '4',
    name: 'Melam',
    type: 'Melam',
    image: process.env.NODE_ENV === 'production' ? './images/Melam.jpeg' : '/images/Melam.jpeg',
    isCheckedOut: false,
    checkedOutBy: null,
    checkedOutAt: null
  },
  {
    id: '5',
    name: 'Chinna Melam',
    type: 'Melam',
    image: process.env.NODE_ENV === 'production' ? './images/Chinna Melam.jpeg' : '/images/Chinna Melam.jpeg',
    isCheckedOut: false,
    checkedOutBy: null,
    checkedOutAt: null
  },
  {
    id: '6',
    name: 'Pambai',
    type: 'Pambai',
    image: process.env.NODE_ENV === 'production' ? './images/Pambai.jpeg' : '/images/Pambai.jpeg',
    isCheckedOut: false,
    checkedOutBy: null,
    checkedOutAt: null
  },
  {
    id: '7',
    name: 'Sangu 1',
    type: 'Sangu',
    image: process.env.NODE_ENV === 'production' ? './images/Sangu-1.jpeg' : '/images/Sangu-1.jpeg',
    isCheckedOut: false,
    checkedOutBy: null,
    checkedOutAt: null
  },
  {
    id: '8',
    name: 'Sangu 2',
    type: 'Sangu',
    image: process.env.NODE_ENV === 'production' ? './images/Sangu-2.jpeg' : '/images/Sangu-2.jpeg',
    isCheckedOut: false,
    checkedOutBy: null,
    checkedOutAt: null
  },
  {
    id: '9',
    name: 'Sivan Kombu',
    type: 'Kombu',
    image: process.env.NODE_ENV === 'production' ? './images/SivanKombu.jpeg' : '/images/SivanKombu.jpeg',
    isCheckedOut: false,
    checkedOutBy: null,
    checkedOutAt: null
  },
  {
    id: '10',
    name: 'Thudumbu Blue',
    type: 'Thudumbu',
    image: process.env.NODE_ENV === 'production' ? './images/Thudumbu(Blue).jpeg' : '/images/Thudumbu(Blue).jpeg',
    isCheckedOut: false,
    checkedOutBy: null,
    checkedOutAt: null
  },
  {
    id: '11',
    name: 'Thudumbu Red',
    type: 'Thudumbu',
    image: process.env.NODE_ENV === 'production' ? './images/Thudumbu(Red).jpeg' : '/images/Thudumbu(Red).jpeg',
    isCheckedOut: false,
    checkedOutBy: null,
    checkedOutAt: null
  },
  {
    id: '12',
    name: 'Udukkai',
    type: 'Udukkai',
    image: process.env.NODE_ENV === 'production' ? './images/Udukkai.jpeg' : '/images/Udukkai.jpeg',
    isCheckedOut: false,
    checkedOutBy: null,
    checkedOutAt: null
  },
  {
    id: '13',
    name: 'Urumi',
    type: 'Urumi',
    image: process.env.NODE_ENV === 'production' ? './images/Urumi.jpeg' : '/images/Urumi.jpeg',
    isCheckedOut: false,
    checkedOutBy: null,
    checkedOutAt: null
  },
  {
    id: '14',
    name: 'Uruttu Satti',
    type: 'Uruttu Satti',
    image: process.env.NODE_ENV === 'production' ? './images/Uruttu Satti.jpeg' : '/images/Uruttu Satti.jpeg',
    isCheckedOut: false,
    checkedOutBy: null,
    checkedOutAt: null
  },
  {
    id: '15',
    name: 'Jaalra',
    type: 'Jaalra',
    image: process.env.NODE_ENV === 'production' ? './images/Jaalra.jpeg' : '/images/Jaalra.jpeg',
    isCheckedOut: false,
    checkedOutBy: null,
    checkedOutAt: null
  },
  {
    id: '16',
    name: 'Valli Kummi Chaplangattai',
    type: 'Valli Kummi',
    image: process.env.NODE_ENV === 'production' ? './images/ValliKummi-Chaplangattai.jpeg' : '/images/ValliKummi-Chaplangattai.jpeg',
    isCheckedOut: false,
    checkedOutBy: null,
    checkedOutAt: null
  }
];