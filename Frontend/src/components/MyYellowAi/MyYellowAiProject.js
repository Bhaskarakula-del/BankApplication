import React, { useState, useEffect } from "react";
import axios from "axios";
import "./index.css";

export default function AccountManager() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    balance: "",
    email: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const API_URL = "http://localhost:5000/api";

  // Fetch all accounts on component mount
  useEffect(() => {
    fetchAccounts();
  }, []);

  // Fetch all accounts
  const fetchAccounts = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(`${API_URL}/accounts`);
      setAccounts(response.data.data);
      console.log("GET /api/accounts:", response.data);
    } catch (err) {
      setError("Failed to fetch accounts: " + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Create new account
  const handleCreateAccount = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.balance || !formData.email) {
      setError("All fields are required");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await axios.post(`${API_URL}/accounts`, {
        name: formData.name,
        balance: parseFloat(formData.balance),
        email: formData.email,
      });
      setAccounts([...accounts, response.data.data]);
      setFormData({ name: "", balance: "", email: "" });
      setSuccess("Account created successfully!");
      console.log("POST /api/accounts:", response.data);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to create account: " + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Update account
  const handleUpdateAccount = async (e) => {
    e.preventDefault();
    if (!editingId) return;

    setLoading(true);
    setError("");
    try {
      const response = await axios.put(`${API_URL}/accounts/${editingId}`, {
        name: formData.name,
        balance: formData.balance ? parseFloat(formData.balance) : undefined,
        email: formData.email,
      });
      setAccounts(
        accounts.map((acc) => (acc.id === editingId ? response.data.data : acc))
      );
      setFormData({ name: "", balance: "", email: "" });
      setEditingId(null);
      setSuccess("Account updated successfully!");
      console.log("PUT /api/accounts/" + editingId, response.data);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to update account: " + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Delete account
  const handleDeleteAccount = async (id) => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.delete(`${API_URL}/accounts/${id}`);
      setAccounts(accounts.filter((acc) => acc.id !== id));
      setDeleteConfirm(null);
      setSuccess("Account deleted successfully!");
      console.log("DELETE /api/accounts/" + id, response.data);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to delete account: " + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Edit button handler
  const handleEditClick = (account) => {
    setEditingId(account.id);
    setFormData({
      name: account.name,
      balance: account.balance,
      email: account.email,
    });
  };

  // Cancel edit
  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ name: "", balance: "", email: "" });
  };

  return (
    <div className="account-manager">
      <div className="container">
        <h1>💰 Bank Account Manager</h1>
        {/* Messages */}
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {/* Form Section */}
        <div className="form-section">
          <h2>{editingId ? "✏️ Update Account" : "➕ Create New Account"}</h2>
          <form onSubmit={editingId ? handleUpdateAccount : handleCreateAccount}>
            <div className="form-group">
              <label>Account Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter account name"
                required
              />
            </div>

            <div className="form-group">
              <label>Balance ($) *</label>
              <input
                type="number"
                step="0.01"
                value={formData.balance}
                onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
                placeholder="Enter balance"
                required={!editingId}
              />
            </div>

            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter email"
                required
              />
            </div>

            <div className="form-buttons">
              <button type="submit" disabled={loading} className="btn btn-primary">
                {loading ? "Processing..." : editingId ? "Update Account" : "Create Account"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  disabled={loading}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Accounts List Section */}
        <div className="accounts-section">
          <h2>📋 All Accounts</h2>
          {loading && !editingId ? (
            <p className="loading">Loading accounts...</p>
          ) : accounts.length === 0 ? (
            <p className="no-accounts">No accounts found. Create one to get started!</p>
          ) : (
            <div className="accounts-grid">
              {accounts.map((account) => (
                <div key={account.id} className="account-card">
                  <div className="account-header">
                    <h3>{account.name}</h3>
                    <span className="account-id">ID: {account.id}</span>
                  </div>
                  <div className="account-details">
                    <p>
                      <strong>Balance:</strong> ${account.balance.toFixed(2)}
                    </p>
                    <p>
                      <strong>Email:</strong> {account.email}
                    </p>
                  </div>
                  <div className="account-actions">
                    <button
                      onClick={() => handleEditClick(account)}
                      disabled={loading}
                      className="btn btn-edit"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(account.id)}
                      disabled={loading}
                      className="btn btn-delete"
                    >
                      Delete
                    </button>
                  </div>

                  {/* Delete Confirmation */}
                  {deleteConfirm === account.id && (
                    <div className="delete-confirm">
                      <p>Are you sure?</p>
                      <button
                        onClick={() => handleDeleteAccount(account.id)}
                        disabled={loading}
                        className="btn btn-confirm"
                      >
                        Confirm Delete
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        disabled={loading}
                        className="btn btn-cancel"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}