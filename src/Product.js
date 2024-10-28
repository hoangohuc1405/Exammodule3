import React, { useState } from 'react';
import './ProductManager.css'; 

export function ProductManager() {
    const [products, setProducts] = useState([]);
    const [formData, setFormData] = useState({
        maSanPham: '',
        tenSanPham: '',
        theLoai: 'Dược phẩm',
        soLuong: '',
        gia: '',
        ngayNhap: ''
    });
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false); 

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const createProduct = (e) => {
        e.preventDefault();
        setError('');

        const { maSanPham, tenSanPham, theLoai, soLuong, gia, ngayNhap } = formData;

        const productCodeRegex = /^PROD-\d{4}$/;
        if (!productCodeRegex.test(maSanPham)) {
            setError('Mã sản phẩm không đúng định dạng (PROD-XXXX).');
            return;
        }

        const today = new Date();
        const enteredDate = new Date(ngayNhap);
        if (enteredDate > today) {
            setError('Ngày nhập không được lớn hơn ngày hiện tại.');
            return;
        }

        const quantity = parseInt(soLuong);
        if (isNaN(quantity) || quantity <= 0) {
            setError('Số lượng phải là số nguyên lớn hơn 0.');
            return;
        }

        const formattedDate = `${String(enteredDate.getDate()).padStart(2, '0')}/${String(enteredDate.getMonth() + 1).padStart(2, '0')}/${enteredDate.getFullYear()}`;

        const newProduct = {
            stt: products.length + 1,
            maSanPham,
            tenSanPham,
            theLoai,
            soLuong: quantity,
            gia: parseFloat(gia),
            ngayNhap: formattedDate
        };

        setProducts((prevProducts) => [...prevProducts, newProduct]);
        setFormData({
            maSanPham: '',
            tenSanPham: '',
            theLoai: 'Dược phẩm',
            soLuong: '',
            gia: '',
            ngayNhap: ''
        });
        setIsModalOpen(false); 
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const filteredProducts = products.filter(product => {
        const matchesSearchTerm = product.maSanPham.includes(searchTerm) || product.tenSanPham.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory ? product.theLoai === selectedCategory : true;
        return matchesSearchTerm && matchesCategory;
    });

    return (
        <div className="container">
            <h1>Quản lý sản phẩm</h1>
            <button onClick={openModal}>Thêm sản phẩm</button>

            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={closeModal}>&times;</span>
                        <h2>Thêm sản phẩm mới</h2>
                        <form onSubmit={createProduct}>
                            {error && <p className="message">{error}</p>}
                            <input type="text" name="maSanPham" placeholder="Mã sản phẩm" value={formData.maSanPham} onChange={handleChange} required />
                            <input type="text" name="tenSanPham" placeholder="Tên sản phẩm" value={formData.tenSanPham} onChange={handleChange} required />
                            <select name="theLoai" value={formData.theLoai} onChange={handleChange} required>
                                <option value="Dược phẩm">Dược phẩm</option>
                                <option value="Thiết bị y tế">Thiết bị y tế</option>
                                <option value="Thực phẩm chức năng">Thực phẩm chức năng</option>
                            </select>
                            <input type="number" name="soLuong" placeholder="Số lượng" value={formData.soLuong} onChange={handleChange} required />
                            <input type="number" name="gia" placeholder="Giá" value={formData.gia} onChange={handleChange} required />
                            <input type="date" name="ngayNhap" value={formData.ngayNhap} onChange={handleChange} required />
                            <button type="submit">Thêm sản phẩm</button>
                        </form>
                    </div>
                </div>
            )}

            <h2>Danh sách sản phẩm</h2>
            <div>
                <input
                    placeholder='Nhập sản phẩm'
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
                <select onChange={handleCategoryChange} value={selectedCategory}>
                    <option value="">Tất cả thể loại</option>
                    <option value="Dược phẩm">Dược phẩm</option>
                    <option value="Thiết bị y tế">Thiết bị y tế</option>
                    <option value="Thực phẩm chức năng">Thực phẩm chức năng</option>
                </select>
            </div>

            {filteredProducts.length === 0 ? (
                <p className="message">Không có kết quả</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Mã sản phẩm</th>
                            <th>Tên sản phẩm</th>
                            <th>Thể loại</th>
                            <th>Số lượng</th>
                            <th>Giá</th>
                            <th>Ngày nhập</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map((product, index) => (
                            <tr key={index}>
                                <td>{product.stt}</td>
                                <td>{product.maSanPham}</td>
                                <td>{product.tenSanPham}</td>
                                <td>{product.theLoai}</td>
                                <td>{product.soLuong}</td>
                                <td>{product.gia}</td>
                                <td>{product.ngayNhap}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default ProductManager;
