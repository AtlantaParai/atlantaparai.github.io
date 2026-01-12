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
    image: '/images/IrumbuParai.jpeg',
    isCheckedOut: false,
    checkedOutBy: null,
    checkedOutAt: null
  },
  {
    id: '2',
    name: 'Kombu Back',
    type: 'Kombu',
    image: '/images/KombuBack-1.jpeg',
    isCheckedOut: false,
    checkedOutBy: null,
    checkedOutAt: null
  },
  {
    id: '3',
    name: 'Kombu Front',
    type: 'Kombu',
    image: '/images/KombuFront-1.jpeg',
    isCheckedOut: false,
    checkedOutBy: null,
    checkedOutAt: null
  },
  {
    id: '4',
    name: 'Melam',
    type: 'Melam',
    image: '/images/Melam.jpeg',
    isCheckedOut: false,
    checkedOutBy: null,
    checkedOutAt: null
  },
  {
    id: '5',
    name: 'Chinna Melam',
    type: 'Melam',
    image: '/images/Chinna Melam.jpeg',
    isCheckedOut: false,
    checkedOutBy: null,
    checkedOutAt: null
  },
  {
    id: '6',
    name: 'Pambai',
    type: 'Pambai',
    image: '/images/Pambai.jpeg',
    isCheckedOut: false,
    checkedOutBy: null,
    checkedOutAt: null
  },
  {
    id: '7',
    name: 'Sangu 1',
    type: 'Sangu',
    image: '/images/Sangu-1.jpeg',
    isCheckedOut: false,
    checkedOutBy: null,
    checkedOutAt: null
  },
  {
    id: '8',
    name: 'Sangu 2',
    type: 'Sangu',
    image: '/images/Sangu-2.jpeg',
    isCheckedOut: false,
    checkedOutBy: null,
    checkedOutAt: null
  },
  {
    id: '9',
    name: 'Sivan Kombu',
    type: 'Kombu',
    image: '/images/SivanKombu.jpeg',
    isCheckedOut: false,
    checkedOutBy: null,
    checkedOutAt: null
  },
  {
    id: '10',
    name: 'Thudumbu Blue',
    type: 'Thudumbu',
    image: '/images/Thudumbu(Blue).jpeg',
    isCheckedOut: false,
    checkedOutBy: null,
    checkedOutAt: null
  },
  {
    id: '11',
    name: 'Thudumbu Red',
    type: 'Thudumbu',
    image: '/images/Thudumbu(Red).jpeg',
    isCheckedOut: false,
    checkedOutBy: null,
    checkedOutAt: null
  },
  {
    id: '12',
    name: 'Udukkai',
    type: 'Udukkai',
    image: '/images/Udukkai.jpeg',
    isCheckedOut: false,
    checkedOutBy: null,
    checkedOutAt: null
  },
  {
    id: '13',
    name: 'Urumi',
    type: 'Urumi',
    image: '/images/Urumi.jpeg',
    isCheckedOut: false,
    checkedOutBy: null,
    checkedOutAt: null
  },
  {
    id: '14',
    name: 'Uruttu Satti',
    type: 'Uruttu Satti',
    image: '/images/Uruttu Satti.jpeg',
    isCheckedOut: false,
    checkedOutBy: null,
    checkedOutAt: null
  },
  {
    id: '15',
    name: 'Jaalra',
    type: 'Jaalra',
    image: '/images/Jaalra.jpeg',
    isCheckedOut: false,
    checkedOutBy: null,
    checkedOutAt: null
  },
  {
    id: '16',
    name: 'Valli Kummi Chaplangattai',
    type: 'Valli Kummi',
    image: '/images/ValliKummi-Chaplangattai.jpeg',
    isCheckedOut: false,
    checkedOutBy: null,
    checkedOutAt: null
  }
];