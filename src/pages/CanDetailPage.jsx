import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCanDetail } from '../redux/actions/cansActions';
import './CanDetailPage.css';

function CanDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentCan: can } = useSelector(state => state.cans);

  useEffect(() => {
    dispatch(fetchCanDetail(id));
  }, [dispatch, id]);



  if (!can) return null;

  return (
    <div className="fullscreen-detail">
      <button className="back-button" onClick={() => navigate(-1)}>
        &larr; Indietro
      </button>

      <div className="can-content">
        <div className="can-image-container">
          <img
            src={can.img}
            alt={can.nome}
            className="can-image"
          />
        </div>

        <div className="can-info">
          <h1 className="can-title">{can.nome}</h1>


        </div>
      </div>
    </div>
  );
}

export default CanDetailPage;