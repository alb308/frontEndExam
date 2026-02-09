import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Prodotti.css';
import db from '../data/db.json';

function Prodotti() {
  const [allCans, setAllCans] = useState([]);

  const [localFilters, setLocalFilters] = useState({
    category: '',
    year: '',
    country: '',
    search: ''
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    setAllCans(db.cans);
  }, []);

  const categories = [...new Set(allCans.map(can => can.category))].filter(Boolean);
  const years = [...new Set(allCans.map(can => can.year))].filter(Boolean).sort((a, b) => b - a);
  const countries = [...new Set(allCans.map(can => can.country))].filter(Boolean);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setCurrentPage(1);
  };

  const applyFilters = () => {
    setCurrentPage(1);
  };

  const resetFilters = () => {
    const emptyFilters = {
      category: '',
      year: '',
      country: '',
      search: ''
    };
    setLocalFilters(emptyFilters);
    setCurrentPage(1);
  };

  const filteredCans = allCans.filter(can => {
    const matchCategory = !localFilters.category || can.category === localFilters.category;
    const matchYear = !localFilters.year || can.year?.toString() === localFilters.year;
    const matchCountry = !localFilters.country || can.country === localFilters.country;
    const matchSearch = !localFilters.search ||
      can.nome?.toLowerCase().includes(localFilters.search.toLowerCase());

    return matchCategory && matchYear && matchCountry && matchSearch;
  });


  const totalPages = Math.ceil(filteredCans.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCans = filteredCans.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo(0, 0);
  };

  return (
    <div className="prodotti-container">
      <h1>Collezione Completa</h1>

      <div className="filters-section">
        <h3>Filtra la collezione</h3>
        <div className="filters-grid">
          <div className="filter-group">
            <label>Cerca per nome</label>
            <input
              type="text"
              name="search"
              value={localFilters.search}
              onChange={handleFilterChange}
              placeholder="Es. Ultra, Juice..."
            />
          </div>

          <div className="filter-group">
            <label>Categoria</label>
            <select
              name="category"
              value={localFilters.category}
              onChange={handleFilterChange}
            >
              <option value="">Tutte le categorie</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Anno</label>
            <select
              name="year"
              value={localFilters.year}
              onChange={handleFilterChange}
            >
              <option value="">Tutti gli anni</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Paese</label>
            <select
              name="country"
              value={localFilters.country}
              onChange={handleFilterChange}
            >
              <option value="">Tutti i paesi</option>
              {countries.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="filter-actions">
          <button onClick={applyFilters} className="apply-btn">
            Applica Filtri
          </button>
          <button onClick={resetFilters} className="reset-btn">
            Reset Filtri
          </button>
        </div>
      </div>

      <div className="results-info">
        <p>
          Trovate {filteredCans.length} lattine
          {allCans.length > 0 && ` (totale collezione: ${allCans.length})`}
        </p>
      </div>

      <div className="prodotti-grid">
        {paginatedCans.map(can => (
          <Link to={`/cans/${can.id}`} key={can.id} className="prodotto-card">
            <div className="prodotto-image">
              <img src={can.img} alt={can.nome} />
              {can.limited && <span className="limited-badge">Limited Edition</span>}
            </div>
            <div className="prodotto-info">
              <h3>{can.nome}</h3>
              <p className="prodotto-category">{can.category}</p>
              <p className="prodotto-details">
                {can.size} • {can.country} • {can.year}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="page-btn"
          >
            ← Precedente
          </button>

          <div className="page-numbers">
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={`page-number ${currentPage === index + 1 ? 'active' : ''}`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="page-btn"
          >
            Successiva →
          </button>
        </div>
      )}
    </div>
  );
}

export default Prodotti;