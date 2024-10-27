import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../styles/Reports.css'; // Add your CSS file for styling the reports page

const Reports = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchReports = async () => {
        try {
            const token = sessionStorage.getItem('token'); // Assuming the token is stored in sessionStorage
            const response = await axios.get(`${process.env.REACT_APP_FLASK_API_URL}/api/admin/reports`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setReports(response.data);
        } catch (err) {
            setError(err.response ? err.response.data.error : 'Error fetching reports');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const handleTemporaryBan = async (reportId) => {
        if (window.confirm(`Are you sure you want to temporarily ban the user associated with report ${reportId}?`)) {
            try {
                const token = sessionStorage.getItem('token');
                await axios.post(`${process.env.REACT_APP_FLASK_API_URL}/api/admin/ban`, { reportId }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                alert(`User associated with report ${reportId} has been temporarily banned.`);
                fetchReports();
            } catch (err) {
                console.error(err);
                alert('Error temporarily banning user');
            }
        }
    };

    const handlePermanentBan = async (reportId) => {
        if (window.confirm(`Are you sure you want to permanently ban the user associated with report ${reportId}?`)) {
            try {
                const token = sessionStorage.getItem('token');
                await axios.post(`${process.env.REACT_APP_FLASK_API_URL}/api/admin/permanent_ban`, { reportId }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                alert(`User associated with report ${reportId} has been permanently banned.`);
                fetchReports();
            } catch (err) {
                console.error(err);
                alert('Error permanently banning user');
            }
        }
    };

    const handleUnban = async (reportId) => {
        if (window.confirm(`Are you sure you want to unban the user associated with report ${reportId}?`)) {
            try {
                const token = sessionStorage.getItem('token');
                await axios.post(`${process.env.REACT_APP_FLASK_API_URL}/api/admin/unban`, { reportId }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                alert(`User associated with report ${reportId} has been unbanned.`);
                fetchReports();
            } catch (err) {
                console.error(err);
                alert('Error unbanning user');
            }
        }
    };

    const handleIgnore = async (reportId) => {
        if (window.confirm(`Are you sure you want to ignore report ${reportId}?`)) {
            try {
                const token = sessionStorage.getItem('token');
                await axios.post(`${process.env.REACT_APP_FLASK_API_URL}/api/admin/ignore`, { reportId }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                alert(`Report ${reportId} has been ignored.`);
                fetchReports();
            } catch (err) {
                console.error(err);
                alert('Error ignoring report');
            }
        }
    };

    if (loading) {
        return <div>Loading reports...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="dashboard-container">
            <nav className="navbar">
                <div className="logo">TheraConnect</div>
                <ul className="nav-links">
                    <li><Link to="/admin">Dashboard</Link></li>
                    <li><Link to="/client-list">Clients</Link></li>
                    <li><Link to="/therapist-list">Therapists</Link></li>
                    <li><Link to="/conversations">Messages</Link></li>
                    <li><Link to="/reports">Reports</Link></li>
                </ul>
                <div className="logout-button">
                    <button onClick={() => alert('Logout action')}>Logout</button>
                </div>
            </nav>

            <div className="content-wrapper">
                <h1>Reports</h1>
                {reports.length === 0 ? (
                    <p>No reports available.</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Report ID</th>
                                <th>Reporter Name</th>
                                <th>Reported User Name</th>
                                <th>Message ID</th>
                                <th>Reason</th>
                                <th>Message Content</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reports.map(report => (
                                <tr key={report.report_id}>
                                    <td>{report.report_id}</td>
                                    <td>{report.reporter_name}</td>
                                    <td>{report.reported_user_name}</td>
                                    <td>{report.message_id || 'N/A'}</td>
                                    <td>{report.reason}</td>
                                    <td>
                                        {report.message ? (
                                            <div>
                                                <p>{report.message.content}</p>
                                                <small>
                                                    Sent by: {report.reported_user_name} on {new Date(report.message.timestamp).toLocaleString()}
                                                </small>
                                            </div>
                                        ) : (
                                            'No associated message'
                                        )}
                                    </td>
                                    <td>
                                        {report.reported_user_status === 'terminated' ? (
                                            <>
                                                <button className="button button-unban" onClick={() => handleUnban(report.report_id)}>Unban</button>
                                                <button className="button button-ignore" onClick={() => handleIgnore(report.report_id)}>Ignore</button>
                                            </>
                                        ) : report.reported_user_status === 'banned' ? (
                                            <>
                                                <button className="button button-unban" onClick={() => handleUnban(report.report_id)}>Unban</button>
                                                <button className="button button-permanent-ban" onClick={() => handlePermanentBan(report.report_id)}>Permanently Ban</button>
                                            </>
                                        ) : (
                                            <>
                                                <button className="button button-ban" onClick={() => handleTemporaryBan(report.report_id)}>Ban</button>
                                                <button className="button button-ignore" onClick={() => handleIgnore(report.report_id)}>Ignore</button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default Reports;
