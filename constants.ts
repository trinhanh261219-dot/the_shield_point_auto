
import { Product } from './types';

/**
 * HƯỚNG DẪN THAY ẢNH:
 * 1. Tải ảnh của bạn lên một trang web lưu trữ ảnh (ví dụ: postimages.org).
 * 2. Lấy "Direct Link" (Link trực tiếp, ví dụ: https://i.postimg.cc/abc/image.png).
 * 3. Thay đường link đó vào phần 'image' dưới đây.
 */

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Durex Invisible Ultra Thin',
    brand: 'Durex',
    price: 155000,
    description: 'Sản phẩm mỏng nhất của Durex, cảm giác như không đeo gì.',
    category: 'Siêu mỏng',
    image: 'https://production-cdn.pharmacity.io/digital/1080x1080/plain/e-com/images/ecommerce/20241231034740-1-P09315_1.jpg?versionId=mhbhYiNNDwegEr8HBRhLyPXvqHI7NXVz', // Thay link ảnh của bạn vào đây
    features: ['Siêu mỏng 0.04mm', 'Truyền nhiệt nhanh', 'Bôi trơn cao cấp']
  },
  {
    id: '2',
    name: 'Sagami Original 0.01',
    brand: 'Sagami',
    price: 245000,
    description: 'Đỉnh cao công nghệ Nhật Bản, mỏng đến mức khó tin.',
    category: 'Siêu mỏng',
    image: 'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lmy5nkjjuqqn82', // Thay link ảnh của bạn vào đây
    features: ['Polyurethane 0.01mm', 'Không mùi cao su', 'Chịu lực cực tốt']
  },
  {
    id: '3',
    name: 'Durex Performa Longer',
    brand: 'Durex',
    price: 185000,
    description: 'Chứa 5% Benzocain giúp kéo dài thời gian yêu, bền bỉ hơn.',
    category: 'Kéo dài',
    image: 'https://production-cdn.pharmacity.io/digital/828x828/plain/e-com/images/ecommerce/20241231034741-1-P00101_1.jpg?versionId=W7FTCaKfHJkyIsGqIeITD9WJiuOow_Nu',
    features: ['Chứa Benzocain', 'Kiểm soát tốt hơn', 'An toàn tuyệt đối']
  },
  {
    id: '4',
    name: 'Durex Pleasuremax Ribbed',
    brand: 'Durex',
    price: 170000,
    description: 'Thiết kế gân và hạt nổi kích thích tối đa cho cả hai.',
    category: 'Gân gai',
    image: 'https://product.hstatic.net/200000713511/product/bao-cao-su-durex-pleasuremax-co-gan-gai-hop-3-cai_0d53f47cb2d04957b818b7d64d1f05b5_1024x1024.jpeg',
    features: ['Gân nổi', 'Hạt massage', 'Thiết kế ôm sát']
  },
  {
    id: '5',
    name: 'OK Strawberry Flavour',
    brand: 'OK',
    price: 45000,
    description: 'Hương dâu ngọt ngào, tạo cảm giác mới lạ và thư giãn.',
    category: 'Hương thơm',
    image: 'https://dktmekong.org/wp-content/uploads/2025/02/OK-Strawberry-Pack-3.jpg',
    features: ['Hương dâu', 'Màu hồng', 'Giá tiết kiệm']
  },
  {
    id: '6',
    name: 'Durex Jeans Comfort',
    brand: 'Durex',
    price: 120000,
    description: 'Thiết kế Easy-on dễ đeo, tạo sự thoải mái tối đa.',
    category: 'Phổ thông',
    image: 'https://trungsoncare.com/images/detailed/10/1_2c7h-o5.png',
    features: ['Dễ đeo', 'Dẻo dai', 'Tin cậy']
  },
  {
    id: '7',
    name: 'Okamoto 0.01 Zero One',
    brand: 'Okamoto',
    price: 260000,
    description: 'Đối thủ xứng tầm của Sagami, mỏng tuyệt đối từ Nhật Bản.',
    category: 'Siêu mỏng',
    image: 'https://wafuu.com/cdn/shop/files/okamoto-condoms-okamoto-zero-one-001mm-3pcs-159197_540x.jpg?v=1714005461',
    features: ['Cảm giác chạm', 'Mềm mại', 'Trong suốt']
  },
  {
    id: '8',
    name: 'Durex Kingtex Size Nhỏ',
    brand: 'Durex',
    price: 95000,
    description: 'Kích thước 49mm dành cho người châu Á, ôm khít an toàn.',
    category: 'Kích cỡ',
    image: 'https://salt.tikicdn.com/cache/w300/ts/product/60/66/89/69df1a3ab1860a2291898d60ad9ee671.png',
    features: ['Size 49mm', 'Ôm sát', 'Không lo tuột']
  }
];
