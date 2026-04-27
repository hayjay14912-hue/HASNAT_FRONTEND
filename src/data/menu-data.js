import home_1 from '@assets/img/menu/menu-home-1.jpg';
import home_3 from '@assets/img/menu/menu-home-3.jpg';
import home_4 from '@assets/img/menu/menu-home-4.jpg';
import { CLINICAL_CATEGORY_MENU } from '@/config/clinical-categories';

const menu_data = [
  {
    id: 1,
    homes: true,
    title: 'Home',
    link: '/',
    home_pages: [
      {
        img: home_3,
        title: 'Skincare',
        link: '/'
      },
      {
        img: home_1,
        title: 'Storefront',
        link: '/home-3'
      },
      {
        img: home_4,
        title: 'Collections',
        link: '/home-4'
      }
    ]
  },
  {
    id: 2,
    single_link: true,
    title: 'Shop',
    link: '/shop',
  },
  {
    id: 4,
    single_link: true,
    title: 'Machines',
    link: '/medical-devices',
  },
  {
    id: 5,
    sub_menu: true,
    title: 'For Clinics',
    link: '/professional',
    sub_menus: CLINICAL_CATEGORY_MENU,
  },
  {
    id: 6,
    sub_menu: true,
    title: 'Support',
    link: '/contact',
    sub_menus: [
      { title: 'Contact Us', link: '/contact' },
      { title: 'Coupons', link: '/coupon' },
    ],
  },
]

export default menu_data;

// mobile_menu
export const mobile_menu = [
  {
    id: 1,
    homes: true,
    title: 'Home',
    link: '/',
    home_pages: [
      {
        img: home_3,
        title: 'Skincare',
        link: '/'
      },
      {
        img: home_1,
        title: 'Storefront',
        link: '/home-3'
      },
      {
        img: home_4,
        title: 'Collections',
        link: '/home-4'
      }
    ]
  },
  {
    id: 2,
    sub_menu: true,
    title: 'Shop',
    link: '/shop',
    sub_menus: [
      { title: 'All Skincare', link: '/shop' },
      { title: 'Glutanex Eye Cream', link: '/glutanex-retinol-eye-cream' },
      { title: 'Visvisal (Viviscal)', link: '/visvisal' },
      { title: 'Discover Skincare', link: '/shop' },
      { title: 'Lip Care', link: '/shop?category=awesome-lip-care' },
      { title: 'On Sale', link: '/shop?status=on-sale' },
    ],
  },
  {
    id: 3,
    single_link: true,
    title: 'Machines',
    link: '/medical-devices',
  },
  {
    id: 4,
    sub_menu: true,
    title: 'For Clinics',
    link: '/professional',
    sub_menus: CLINICAL_CATEGORY_MENU,
  },
  {
    id: 5,
    sub_menu: true,
    title: 'Support',
    link: '/contact',
    sub_menus: [
      { title: 'Contact Us', link: '/contact' },
      { title: 'Coupons', link: '/coupon' },
    ],
  },
]
