import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function CardBlock() {
  const [productList, setProductList] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 10;

  const query = useQuery();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('http://187.124.157.146:5001/api/products?limit=5000')
      .then((res) => {
        const products = res.data?.products || [];
        setProductList(products);
        setFilteredProducts(products);
      })
      .catch((err) => console.error('Error fetching products:', err));
  }, []);

  // Load query params on first mount
  useEffect(() => {
    const pageFromUrl = parseInt(query.get('page')) || 1;
    const searchFromUrl = query.get('search') || '';
    setCurrentPage(pageFromUrl);
    setSearchTerm(searchFromUrl);
  }, []);

  useEffect(() => {
    const filtered = productList.filter(
      (p) =>
        p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, productList]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setCurrentPage(1);
    navigate(`?search=${value}&page=1`);
  };

  const goToPage = (p) => {
    if (p >= 1 && p <= totalPages) {
      setCurrentPage(p);
      navigate(`?search=${searchTerm}&page=${p}`);
    }
  };

  const handleDelete = (id) => {
    const token = sessionStorage.getItem('authToken');
    if (!token) return alert('No auth token. Please log in.');

    if (window.confirm('Delete this product?')) {
      axios
        .delete(`http://187.124.157.146:5001/api/products/delete/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() =>
          setProductList((prev) => prev.filter((item) => item.id !== id))
        )
        .catch((err) => {
          console.error('Delete error:', err);
          alert('Failed to delete.');
        });
    }
  };

  const markPopular = async (id) => {
    const token = sessionStorage.getItem('authToken');
    if (!token) return alert('No auth token. Please log in.');

    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
    const url = `http://187.124.157.146:5001/api/products/${id}/popular`;

    try {
      await axios.patch(url, { isPopular: 1 }, { headers });
    } catch (err) {
      if (
        err?.message === 'Network Error' ||
        (err?.response?.status === 405 &&
          err?.response?.data?.includes?.('PATCH'))
      ) {
        try {
          await axios.post(
            url,
            { _method: 'PATCH', isPopular: 1 },
            { headers }
          );
        } catch (e) {
          console.error('Fallback POST failed:', e);
          return alert(
            'Server blocked PATCH method. Ask backend to allow PATCH or enable method override.'
          );
        }
      } else {
        console.error('PATCH error:', err);
        return alert('Failed to mark as popular.');
      }
    }

    alert('Product marked as Popular!');
    setProductList((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isPopular: 1 } : p))
    );
  };

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentItems = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const exportToExcel = () => {
    const exportData = productList.map((p) => ({
      ID: p.id,
      Name: p.name,
      SKU: p.sku,
      Price: p.price,
      'Sale Price': p.sale_price,
      Stock: p.stock,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');

    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, 'products_export.xlsx');
  };

  return (
    <div className="card mb-3 bg-transparent p-2">
      <div className="mb-3 d-flex justify-content-between align-items-center">
        <input
          type="text"
          className="form-control w-50"
          placeholder="Search by name or SKU"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <button onClick={exportToExcel} className="btn btn-success btn-primary">
          Export to Excel
        </button>
      </div>

      {currentItems.map((d) => (
        <div key={d.id} className="card border-0 mb-1">
          <div className="card-body d-flex align-items-center flex-column flex-md-row">
            <Link>
              <img
                className="w120 rounded img-fluid"
                src={`http://187.124.157.146:5001/${d.main_image}`}
                alt=""
              />
            </Link>

            <div className="ms-md-4 mt-4 mt-md-0 text-md-start text-center w-100">
              <Link to={`/product-edit?id=${d.id}`}>
                <h6 className="mb-3 fw-bold">
                  {d.name}
                  <span className="d-block text-muted small fw-light">
                    {d.sku}
                  </span>
                </h6>
              </Link>

              <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-start">
                <div className="mb-2" style={{ paddingLeft: '0px' }}>
                  <div className="text-muted small">Price</div>
                  <strong style={{ color: 'red' }}>${d.price}</strong>
                </div>
              </div>
            </div>

            <div
              className="d-flex flex-column flex-sm-row"
              style={{ gap: '8px' }}
            >
              <Link
                to={`/product-edit?id=${d.id}`}
                className="btn btn-outline-secondary"
              >
                <i className="icofont-edit text-success" />
              </Link>

              <button
                onClick={() => handleDelete(d.id)}
                className="btn btn-outline-secondary"
              >
                <i className="icofont-ui-delete text-danger" />
              </button>

              <button
                onClick={() => markPopular(d.id)}
                className="btn btn-outline-warning"
                title="Mark as Popular"
              >
                <i
                  className={`icofont-star ${
                    d.isPopular === 1 ? 'text-warning' : ''
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      ))}

      {totalPages > 1 && (
        <div className="d-flex justify-content-center align-items-center mt-4">
          <button
            className="btn btn-outline-primary btn-sm me-2"
            disabled={currentPage === 1}
            onClick={() => goToPage(currentPage - 1)}
          >
            &lt;
          </button>
          <span className="px-3">
            Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
          </span>
          <button
            className="btn btn-outline-primary btn-sm ms-2"
            disabled={currentPage === totalPages}
            onClick={() => goToPage(currentPage + 1)}
          >
            &gt;
          </button>
        </div>
      )}
    </div>
  );
}

export default CardBlock;
