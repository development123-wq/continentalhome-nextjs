// src/components/Users/Messages.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Messages = () => {
  const navigate = useNavigate();

  /* --- state --- */
  const [message, setMessage]       = useState('');
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');
  const [messages, setMessages]     = useState([]);
  const [msgLoading, setMsgLoading] = useState(false);
  const [msgError, setMsgError]     = useState('');

  /* --- auth check + load previous messages --- */
  useEffect(() => {
    const token      = sessionStorage.getItem('authToken');
    const customerId = sessionStorage.getItem('customerId');

    if (!token || !customerId) {
      navigate('/sign-in');
      return;
    }

    const loadMessages = async () => {
      setMsgLoading(true);
      setMsgError('');
      try {
        const { data } = await axios.get(
          `http://187.124.157.146:5001/api/supports/messages?isAdmin=1&customerId=${customerId}&page=1&limit=20`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        /* backend expected to return { messages: [...] } */
        setMessages(Array.isArray(data.messages) ? data.messages : []);
      } catch (err) {
        setMsgError('Unable to load messages.');
      } finally {
        setMsgLoading(false);
      }
    };

    loadMessages();
  }, [navigate]);

  /* --- helper --- */
  const renderId = (id) => `#${String(id).padStart(5, '0')}`;

  /* --- submit new message --- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      setError('Message cannot be empty');
      return;
    }

    setLoading(true);
    setError('');

    const token = sessionStorage.getItem('authToken');

    try {
      const { data } = await axios.post(
        'http://187.124.157.146:5001/api/supports/customer/send',
        {
          message,
          isAdmin: 1,
          senderType: 'customer',
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      /* Push new message into list for instant UI feedback */
      setMessages((prev) => [
        ...prev,
        {
          message,
          senderType: 'customer',
          created_at: new Date().toISOString(),
          id: data.complaint_id || data.id || Date.now(),
        },
      ]);

      setMessage('');
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Messages</h2>
      <p>Your messages with support.</p>

      {/* --- previous messages --- */}
      <h6 className="mb-2">Previous Messages</h6>
      {msgLoading ? (
        <div>Loading messages…</div>
      ) : msgError ? (
        <div className="text-danger">{msgError}</div>
      ) : messages.length === 0 ? (
        <div className="text-muted">No previous messages.</div>
      ) : (
        <div
          style={{
            maxHeight: '250px',
            overflowY: 'auto',
            border: '1px solid #ddd',
            padding: '10px',
            borderRadius: '4px',
            marginBottom: '1rem',
          }}
        >
          {messages.map((m) => (
            <div key={m.id} className="mb-2">
              <strong>{m.senderType === 'admin' ? 'Admin' : 'You'}:</strong>{' '}
              {m.message}
              <div className="text-muted" style={{ fontSize: '12px' }}>
                {new Date(m.created_at).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- error banner --- */}
      {error && (
        <div
          style={{
            background: '#f8d7da',
            border: '1px solid #f5c2c7',
            padding: '10px',
            borderRadius: '4px',
            marginBottom: '1rem',
            color: '#842029',
          }}
        >
          {error}
        </div>
      )}

      {/* --- new message form --- */}
      <form onSubmit={handleSubmit}>
        <label>
          New Message:
          <br />
          <textarea
            name="message"
            rows="4"
            cols="40"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={{ width: '100%', marginTop: '6px' }}
          />
        </label>

        <br />

        <button
          type="submit"
          disabled={loading}
          style={{
            marginTop: '10px',
            padding: '6px 16px',
            fontWeight: 'bold',
            background:'#63a682',
            border:'1px solid #63a682',
            color:'#ffffff',
            padding:'10px 40px'
          }}
          
        >
          {loading ? 'Sending…' : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default Messages;
